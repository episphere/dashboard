import {renderParticipantDetails} from './participantDetails.js';
import { animation, participantVerification } from './index.js'
import fieldMapping from './fieldToConceptIdMapping.js'; 
import { siteKeyToName } from './utils.js';
import { keyToNameObj } from './siteKeysToName.js';
export const importantColumns = [fieldMapping.fName, fieldMapping.mName, fieldMapping.lName, fieldMapping.birthMonth, fieldMapping.birthDay, fieldMapping.birthYear, fieldMapping.prefEmail, 'Connect_ID', fieldMapping.healthcareProvider];

export const renderTable = (data, source) => {
    let template = '';
    if(data.length === 0) return `No data found!`;
    let array = [];
    data.forEach(dt => {
        array = array.concat(Object.keys(dt))
    });
    array = array.filter((item, index) => array.indexOf(item) === index);
    localStorage.removeItem("participant");
    let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
    
    if(array.length > 0) {
        console.log('array', array)
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
        element.addEventListener('click', () => {
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
                if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
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
        template += `<tbody><tr><td><button class="btn btn-primary select-participant" data-token="${participant.token}">Select</button></td>`
        importantColumns.forEach(x => {
            if(participant[x] && typeof participant[x] === 'object'){
                template += `<td><pre>${JSON.stringify(participant[x], undefined, 4)}</pre></td>`
            }
            else if ( keyToNameObj[participant[x]] && keyToNameObj[participant[x]] !== undefined ) {
                template += `<td>${keyToNameObj[participant[x]] ? keyToNameObj[participant[x]] : ''}</td>`
            }
            else {
                template += `<td>${participant[x] ? participant[x] : ''}</td>`
            }
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
        element.addEventListener('click', () => {
            const filteredData = data.filter(dt => dt.token === element.dataset.token);
            console.log("select clicked", filteredData );
            let adminSubjectAudit = []
            let changedOption = {}
            renderParticipantDetails(filteredData[0], adminSubjectAudit, changedOption, JSON.parse(localStorage.dashboard).siteKey);
           // renderParticipantSummary(filteredData[0])
            
        });
    });

}
export const addEventFilterData = (data, showButtons) => {
    const btn = document.getElementById('filterData');
    if(!btn) return;
    btn.addEventListener('keyup', () => {
        const value = document.getElementById('filterData').value.trim();
        if(value.length < 3) {
            renderData(data, showButtons);
            if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
            return;
        };
        renderData(searchBy(data, value), showButtons);
        if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
    });
}
export const filterdata = (data) => {
    return data.filter(participant => participant['699625233'] !== undefined);
}
export const activeColumns = (data, showButtons) => {
    const btns = document.getElementsByName('column-filter');
    Array.from(btns).forEach(btn => {
        const value = btn.dataset.column;
        if(importantColumns.indexOf(value) !== -1) {
            btn.classList.add('filter-active');
        }
        btn.addEventListener('click', () => {
            if(!btn.classList.contains('filter-active')){
                btn.classList.add('filter-active');
                importantColumns.push(value);
                if(document.getElementById('filterData').value.trim().length >= 3) {
                    renderData(searchBy(data, document.getElementById('filterData').value.trim()), showButtons);
                    if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
                }
                else {
                    renderData(data, showButtons);
                    if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
                }
            }
            else{
                btn.classList.remove('filter-active');
                importantColumns.splice(importantColumns.indexOf(value), 1);
                if(document.getElementById('filterData').value.trim().length >= 3) {
                    renderData(searchBy(data, document.getElementById('filterData').value.trim()), showButtons);
                    if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
                }
                else {
                    renderData(data, showButtons);
                    if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
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
