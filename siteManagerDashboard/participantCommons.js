import { renderParticipantDetails } from './participantDetails.js';
import { animation, participantVerification } from './index.js'
import fieldMapping from './fieldToConceptIdMapping.js'; 
import { keyToNameObj } from './siteKeysToName.js';
export const importantColumns = [fieldMapping.fName, fieldMapping.mName, fieldMapping.lName, fieldMapping.birthMonth, fieldMapping.birthDay, fieldMapping.birthYear, fieldMapping.email, 'Connect_ID', fieldMapping.healthcareProvider];
import { getIdToken, humanReadableMDYwithTime } from './utils.js';

export const renderTable = (data, source) => {
    let template = '';
    if(data.length === 0) return `No data found!`;
    let array = [];
    data.forEach(dt => {
        array = array.concat(Object.keys(dt))
    });
    array = array.filter((item, index) => array.indexOf(item) === index);
    array = array.filter( i => 
        ( i === 'Connect_ID' || i === 'pin' || i === 'token' || i == fieldMapping.recruitmentType || i == fieldMapping.recruitmentDate ||
          i == fieldMapping.signedInFlag || i == fieldMapping.signinDate || i == fieldMapping.pinEntered || i == fieldMapping.noPin ||
          i == fieldMapping.consentFlag || i == fieldMapping.consentDate || i == fieldMapping.consentVersion || i == fieldMapping.hippaFlag ||
          i == fieldMapping.hippaDate || i == fieldMapping.hippaVersion || i == fieldMapping.userProfileFlag  || i == fieldMapping.userProfileDateTime ||
          i == fieldMapping.verifiedFlag || i == fieldMapping.verficationDate || i == fieldMapping.signInMechansim || i == fieldMapping.accountName ||
          i ==  fieldMapping.accountPhone || i == fieldMapping.accountEmail || i == fieldMapping.prefName || i == fieldMapping.address1 ||
          i == fieldMapping.address2 || i == fieldMapping.city || i == fieldMapping.state || i == fieldMapping.zip || i == fieldMapping.prefEmail ||
          i == fieldMapping.email || i == fieldMapping.email1 || i == fieldMapping.email2 || i == fieldMapping.cellPhone || i == fieldMapping.homePhone ||
          i == fieldMapping.otherPhone || i == fieldMapping.refusedAllFutureActivities || i == fieldMapping.revokeHIPAA || i == fieldMapping.withdrawConsent || 
          i == fieldMapping.revokeHIPAA || i == fieldMapping.destroyData || i == fieldMapping.participantDeceased ||  
          i == fieldMapping.dateOfDeath || i == fieldMapping.suspendContact || i == fieldMapping.boh
    ))


    localStorage.removeItem("participant");
    let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
    
    if(array.length > 0) {
        template += `<div class="row">
            <div class="col" id="columnFilter">
                ${array.map(x => `<button name="column-filter" class="filter-btn sub-div-shadow" data-column="${x}">${conceptIdMapping[x] && conceptIdMapping[x] ? conceptIdMapping[x]['Variable Label'] || conceptIdMapping[x]['Variable Name']: x}</button>`)}
            </div>
        </div>`
    }

    let backToSearch = (source === 'participantLookup')? `<button class="btn btn-primary" id="back-to-search">Back to Search</button>`: "";
    template += `
                <div class="row">
                    <div class="col">
                        <div class="float-left">
                            ${backToSearch}
                        </div>
                        <div class="float-right">
                            <input id="filterData" class="form-control sub-div-shadow" type="text" placeholder="Min. 3 characters"><span data-toggle="tooltip" title='Search by first name, last name or connect id' class="fas fa-search search-icon"></span></div>
                        </div>
                    </div>
                <div class="row allow-overflow">
                    <div class="col sticky-header">
                        <table id="dataTable" class="table table-hover table-bordered table-borderless sub-div-shadow no-wrap"></table>
                        <div id="paginationContainer"></div>
                    </div>
                    <div class="modal fade" id="modalShowMoreData" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content sub-div-shadow">
                                <div class="modal-header" id="modalHeader"></div>
                                <div class="modal-body" id="modalBody"></div>
                            </div>
                        </div>
                    </div>
                </div>`
    return template;
}


export  const renderData = (data, showButtons) => {
    if(data.length === 0) {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = renderTable(data);
        animation(false);
        return;
    }
    const pageSize = 10;
    const dataLength = data.length;
    const pages = Math.ceil(dataLength/pageSize);
    const array = [];

    for(let i = 0; i< pages; i++){
        array.push(i+1);
    }
    document.getElementById('paginationContainer').innerHTML = paginationTemplate(array);
    addEventPageBtns(pageSize, data, showButtons);
    document.getElementById('dataTable').innerHTML = tableTemplate(dataPagination(0, pageSize, data), showButtons);
    addEventShowMoreInfo(data);
}

const addEventPageBtns = (pageSize, data, showButtons) => {
    const elements = document.getElementsByClassName('page-link');
    Array.from(elements).forEach(element => {
        element.addEventListener('click', async () => {
            const previous = element.dataset.previous;
            const next = element.dataset.next;
            const pageNumber = previous ? parseInt(previous) - 1 : next ? parseInt(next) + 1 : element.dataset.page;
            
            if(pageNumber < 1 || pageNumber > Math.ceil(data.length/pageSize)) return;
            
            if(!element.classList.contains('active-page')){
                let start = (pageNumber - 1) * pageSize;
                let end = pageNumber * pageSize;
                document.getElementById('previousPage').dataset.previous = pageNumber;
                document.getElementById('nextPage').dataset.next = pageNumber;
                document.getElementById('dataTable').innerHTML = tableTemplate(dataPagination(start, end, data), showButtons);
                addEventShowMoreInfo(data);
                const access_token = await getIdToken();
                const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
                const siteKey = access_token ? access_token : localStr.siteKey;
                eventVerifiedButton(siteKey);
                Array.from(elements).forEach(ele => ele.classList.remove('active-page'));
                document.querySelector(`a[data-page="${pageNumber}"]`).classList.add('active-page');
            }
        })
    });
}



const dataPagination = (start, end, data) => {
    const paginatedData = [];
    for(let i=start; i<end; i++){
        if(data[i]) paginatedData.push(data[i]);
    }
    return paginatedData;
}

const paginationTemplate = (array) => {
    let template = `
        <nav aria-label="Page navigation example">
            <ul class="pagination">`
    
    array.forEach((a,i) => {
        if(i === 0){
            template += `<li class="page-item">
                            <a class="page-link" id="previousPage" data-previous="1" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                            </a>
                        </li>`
        }
        template += `<li class="page-item"><a class="page-link ${i === 0 ? 'active-page':''}" data-page=${a}>${a}</a></li>`;

        if(i === (array.length - 1)){
            template += `
            <li class="page-item">
                <a class="page-link" id="nextPage" data-next="1" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
                </a>
            </li>`
        }
    });
    template += `
            </ul>
        </nav>
    `;
    return template;
}

const tableTemplate = (data, showButtons) => {
    let template = '';
    let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
    template += `<thead class="thead-dark sticky-row"><tr><th class="sticky-row">Select</th>`
    importantColumns.forEach(x => template += `<th class="sticky-row">${conceptIdMapping[x] && conceptIdMapping[x] ? conceptIdMapping[x]['Variable Label'] || conceptIdMapping[x]['Variable Name']: x}</th>`)
    template += `<th class="no-wrap sticky-row">Show all info</th>
            ${showButtons ? `<th class="sticky-row">Verify / Not Verify</th>`: ``}
        </tr>
    </thead>`;
    data.forEach(participant => {
        // mapping from concept id to variable name
        template += `<tbody><tr><td><button class="btn btn-primary select-participant" data-token="${participant.token}">Select</button></td>`
        importantColumns.forEach(x => {
            (participant[x] && typeof participant[x] === 'object') ?
                (template += `<td><pre>${JSON.stringify(participant[x], undefined, 4)}</pre></td>`)
            : 
            ( keyToNameObj[participant[x]] && keyToNameObj[participant[x]] !== undefined && x === fieldMapping.healthcareProvider ) ? 
               ( template += `<td>${keyToNameObj[participant[x]] ? keyToNameObj[participant[x]] : ''}</td>`)
            : (participant[x] && participant[x] === fieldMapping.no) ?
               ( template += `<td>${participant[x] ? 'No' : ''}</td>` )
            : (participant[x] && participant[x] === fieldMapping.yes) ?
               ( template += `<td>${participant[x] ? 'Yes' : ''}</td>` )
            : (participant[x] && participant[x] === fieldMapping.active) ?
               ( template += `<td>${participant[x] ? 'Active' : ''}</td>` )
            : (participant[x] && participant[x] === fieldMapping.passive) ?
                ( template += `<td>${participant[x] ? 'Passive' : ''}</td>`)
            : (participant[x] && participant[x] === fieldMapping.prefPhone) ?
               ( template += `<td>${participant[x] ? 'Text Message' : ''}</td>` )
            : (participant[x] && participant[x] === fieldMapping.prefEmail) ?
               ( template += `<td>${participant[x] ? 'Email' : ''}</td>` )
            : ((x === (fieldMapping.signinDate).toString()) || (x === (fieldMapping.userProfileDateTime).toString()) || (x === (fieldMapping.consentDate).toString())
             || (x === (fieldMapping.recruitmentDate).toString()) || (x === (fieldMapping.verficationDate).toString())) ? 
               ( template += `<td>${participant[x] ? new Date(participant[x]).toLocaleString() : ''}</td>`) // human readable time date
            : (x === (fieldMapping.verifiedFlag).toString()) ?
            (
                (participant[x] === fieldMapping.notYetVerified) ?
                    template += `<td>${participant[x] ? 'Not Yet Verified'  : ''}</td>`
                : (participant[x] === fieldMapping.outreachTimedout) ?
                    template += `<td>${participant[x] ? 'Out Reach Timed Out'  : ''}</td>`
                : (participant[x] === fieldMapping.verified) ?
                    template += `<td>${participant[x] ? 'Verified'  : ''}</td>`
                : (participant[x] === fieldMapping.cannotBeVerified) ?
                    template += `<td>${participant[x] ? 'Can Not Be Verified '  : ''}</td>`
                : (
                    template += `<td>${participant[x] ? 'Duplicate'  : ''}</td>` )
            )
            : (template += `<td>${participant[x] ? participant[x] : ''}</td>`)
        })
        template += `<td><a data-toggle="modal" data-target="#modalShowMoreData" name="modalParticipantData" class="change-pointer showMoreInfo" data-token="${participant.token}"><i class="fas fa-info-circle"></i></a></td>
        ${showButtons ? `<td class="no-wrap"><button class="btn btn-primary participantVerified" data-token="${participant.token}"><i class="fas fa-user-check"></i> Verify</button> / <button class="btn btn-primary participantNotVerified" data-token="${participant.token}"><i class="fas fa-user-times"></i> Can't Verify</button></td>`: ``}
    </tr>
        `; 
    });
    template += '</tbody>';
    return template;
}

const addEventShowMoreInfo = data => {
    const elements = document.getElementsByClassName('showMoreInfo');
    Array.from(elements).forEach(element => {
        element.addEventListener('click', () => {
            const filteredData = data.filter(dt => dt.token === element.dataset.token);
            const header = document.getElementById('modalHeader');
            const body = document.getElementById('modalBody');
            const user = filteredData[0];
            header.innerHTML = `<h4>${user[fieldMapping.fName]} ${user[fieldMapping.lName]}</h4><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
            let template = '<div>';
            for(let key in user){
                if(typeof user[key] === 'object') {
                    template += `<span><strong>${key}</strong></span> - <ul class="user-data-ul">`
                    for(let nestedKey in user[key]){
                        template += `<li><span><strong>${nestedKey}</strong></span> - <span>${user[key][nestedKey]}</span></li>`
                    }
                    template += `</ul>`
                }
                else {
                    template += `<span><strong>${key}</strong></span> - <span>${user[key]}</span></br>`
                }
            }
            body.innerHTML = template;
        })
    })

    const selectElements = document.getElementsByClassName('select-participant');
    Array.from(selectElements).forEach(element => {
        element.addEventListener('click', async () => {
            const filteredData = data.filter(dt => dt.token === element.dataset.token);
            let adminSubjectAudit = [];
            let changedOption = {};
            const loadDetailsPage = '#participantDetails'
            location.replace(window.location.origin + window.location.pathname + loadDetailsPage); // updates url to participantDetails upon screen update
            const access_token = await getIdToken();
            const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
            const siteKey = access_token ? access_token : localStr.siteKey;
            renderParticipantDetails(filteredData[0], adminSubjectAudit, changedOption, siteKey);
        });
    });

}
export const addEventFilterData = (data, showButtons) => {
    const btn = document.getElementById('filterData');
    if(!btn) return;
    btn.addEventListener('keyup', async () => {
        const value = document.getElementById('filterData').value.trim();
        if(value.length < 3) {
            renderData(data, showButtons);
            const access_token = await getIdToken();
            const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
            const siteKey = access_token ? access_token : localStr.siteKey;
            eventVerifiedButton(siteKey);
            return;
        };
        renderData(searchBy(data, value), showButtons);
        const access_token = await getIdToken();
        const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
        const siteKey = access_token ? access_token : localStr.siteKey;
        eventVerifiedButton(siteKey);
    });
}
export const filterdata = (data) => {
    return data.filter(participant => participant['699625233'] !== undefined);
}

export const filterBySiteKey = (data, sitePref) => {
    let filteredData = [];
    data.filter(participant => 
        {
            if (participant['827220437'] === sitePref) {
                filteredData.push(participant);
            }
        })
    return filteredData;
}

export const activeColumns = (data, showButtons) => {
    const btns = document.getElementsByName('column-filter');
    Array.from(btns).forEach(btn => {
        const value = btn.dataset.column;
        if(importantColumns.indexOf(value) !== -1) {
            btn.classList.add('filter-active');
        }
        btn.addEventListener('click', async () => {
            if(!btn.classList.contains('filter-active')){
                btn.classList.add('filter-active');
                importantColumns.push(value);
                if(document.getElementById('filterData').value.trim().length >= 3) {
                    renderData(searchBy(data, document.getElementById('filterData').value.trim()), showButtons);
                    const access_token = await getIdToken();
                    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
                    const siteKey = access_token ? access_token : localStr.siteKey;
                    eventVerifiedButton(siteKey);
                }
                else {
                    renderData(data, showButtons);
                    const access_token = await getIdToken();
                    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
                    const siteKey = access_token ? access_token : localStr.siteKey;
                    eventVerifiedButton(siteKey);
                }
            }
            else{
                btn.classList.remove('filter-active');
                importantColumns.splice(importantColumns.indexOf(value), 1);
                if(document.getElementById('filterData').value.trim().length >= 3) {
                    renderData(searchBy(data, document.getElementById('filterData').value.trim()), showButtons);
                    const access_token = await getIdToken();
                    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
                    const siteKey = access_token ? access_token : localStr.siteKey;
                    eventVerifiedButton(siteKey);
                }
                else {
                    renderData(data, showButtons);
                    const access_token = await getIdToken();
                    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
                    const siteKey = access_token ? access_token : localStr.siteKey;
                    eventVerifiedButton(siteKey);
                }
            }
        })
    });
}


export const eventVerifiedButton = (siteKey) => {
    const verifiedBtns = document.getElementsByClassName('participantVerified');
    Array.from(verifiedBtns).forEach(elem => {
        elem.addEventListener('click', async () => {
            animation(true);
            const token = elem.dataset.token;
            const response = await participantVerification(token, true, siteKey);
            if(response.code === 200){
                // animation(false);
                // const dataTable = document.getElementById('dataTable');
                // const elements = dataTable.querySelectorAll(`[data-token="${token}"]`);
                // elements[0].parentNode.parentNode.parentNode.removeChild(elements[0].parentNode.parentNode);
                location.reload();
            }
        });
    });
}




export const searchBy = (data, value) => {
    return data.filter(dt => {
        const fn = dt[conceptIdMapping.fName];
        const ln = dt['996038075'];
        
        if((new RegExp(value, 'i')).test(fn)) {
            // dt.RcrtUP_Fname_v1r0 = fn.replace((new RegExp(value, 'ig')), "<b>$&</b>");
            return dt
        }
        if((new RegExp(value, 'i')).test(ln)) {
            // dt.RcrtUP_Lname_v1r0 = ln.replace((new RegExp(value, 'ig')), "<b>$&</b>");
            return dt
        }
        if((new RegExp(value, 'i')).test(dt.Connect_ID)) {
            // const ID = dt.Connect_ID.toString();
            // dt.Connect_ID = ID.replace((new RegExp(value, 'ig')), "<b>$&</b>");
            return dt
        }
    });
}
