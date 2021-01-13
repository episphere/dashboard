import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import fieldMapping from './fieldToConceptIdMapping.js'; 

export const headerImportantColumns = ['Connect_ID', fieldMapping.fName, fieldMapping.birthYear, fieldMapping.consentDate, 'Years in Connect']

export const importantColumns = [ 
    { field: fieldMapping.lName,
        editable: true,
        display: true } ,
    { field: fieldMapping.fName,
        editable: true,
        display: true } ,
     { field: fieldMapping.prefName,
    editable: true,
    display: true } ,
     { field: fieldMapping.mName,
    editable: true,
    display: true } ,
     { field: fieldMapping.suffix,
    editable: true,
    display: true } ,
     { field: fieldMapping.birthMonth,
    editable: false,
    display: true } ,
     { field: fieldMapping.birthDay,
    editable: false,
    display: true } ,
     { field: fieldMapping.birthYear,
    editable: false,
    display: true } ,
     { field: fieldMapping.homePhone,
    editable: true,
    display: true } ,
    { field: fieldMapping.cellPhone,
    editable: true,
    display: true },
    { field: fieldMapping.otherPhone,
    editable: true,
    display: true },
    { field: fieldMapping.prefEmail,
    editable: true,
    display: true },
    { field: fieldMapping.prefContact,
    editable: true,
    display: true },
    { field: fieldMapping.canWeText,
    editable: true,
    display: true },
    { field: fieldMapping.ssnOnFile,
    editable: true,
    display: true },
    { field: fieldMapping.address1,
    editable: true,
    display: true },
    { field: fieldMapping.city,
    editable: true,
    display: true },
    { field: fieldMapping.state,
    editable: true,
    display: true },
    { field: 'Connect_ID',
    editable: false,
    display: true }
]



export function renderParticipantDetails(participant, adminSubjectAudit){

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantDetailsBtn').classList.add('active');
    mainContent.innerHTML = render(participant);

    changeParticipantDetail(adminSubjectAudit)

}
export function render(participant) {
    console.log("participant", participant)
    let template;
    if (!participant) {
        template=` 
        <div class="container">
            <div id="root">
            Please select a participant first!
            </div>
        </div>
         `
    } else {
        let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
        console.log("conceptIdMapping", conceptIdMapping)
        template += `
            <div class="container">
                <div id="root">
                    <div class="alert alert-light" role="alert">`
        headerImportantColumns.forEach(x => template += `<span><b>
                ${conceptIdMapping[x] && conceptIdMapping[x] != 'Years in Connect' ? 
                conceptIdMapping[x]['Variable Label'] || conceptIdMapping[x]['Variable Name'] 
                : 
                getYearsInConnect(participant)}
                </b></span> : ${participant[x] !== undefined ?  participant[x] : ""} &nbsp;`)
        
        template += `</div><table class="table"> <h4 style="text-align: center;"> Participant Details </h4><tbody>`
       
        template += ` <div class="modal fade" id="modalShowMoreData" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content sub-div-shadow">
                    <div class="modal-header" id="modalHeader"></div>
                    <div class="modal-body" id="modalBody"></div>
                </div>
            </div>
        </div>`

        template += ` <div class="modal fade" id="modalShowAuditData"  data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content sub-div-shadow">
                <div class="modal-header" id="modalHeaderAudit"></div>
                <div class="modal-body" id="modalBodyAudit"></div>
            </div>
        </div>
    </div>`


        importantColumns.forEach(x => template += `<tr ><th scope="row"><div class="mb-3"><label class="form-label">
            ${conceptIdMapping[x.field] && conceptIdMapping[x.field] ? conceptIdMapping[x.field]['Variable Label'] || conceptIdMapping[x.field]['Variable Name'] : x.field}</label></div></th>
            <td>${participant[x.field] !== undefined ?  participant[x.field] : ""}</td> <td> 
            <a class="showMore" data-toggle="modal" data-target="#modalShowMoreData" 
                data-participantkey=${conceptIdMapping[x.field] && conceptIdMapping[x.field] ? conceptIdMapping[x.field]['Variable Label'] || conceptIdMapping[x.field]['Variable Name'] : x.field}
                data-participantValue=${participant[x.field]} name="modalParticipantData" >
                ${x.editable ? `<button type="button" class="btn btn-primary">Edit</button>`
                 : `<button type="button" class="btn btn-primary" disabled>Edit</button>`
                }
            </a></td></tr>&nbsp;`) 
        

            template += `</tbody></table>
                    <table class="table">
                                <h4 style="text-align: center;"> Alternate Contact Details &nbsp; <button type="button" class="btn btn-primary">Edit</button> </h4>
                                    <thead>
                                        <tr>
                                        <th scope="col">Contact Name</th>
                                        <th scope="col">Relationship</th>
                                        <th scope="col">Phone Number</th>
                                        <th scope="col">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <th scope="row">1</th>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        </tr>
                                        <tr>
                                        <th scope="row">2</th>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        </tr>
                                        <tr>
                                        <th scope="row">3</th>
                                        <td colspan="2"></td>
                                        <td></td>
                                        </tr>
                                    </tbody>
                                    </table>
                                    <div style="display:inline-block;">
                                        <button type="submit" id="sendResponse" class="btn btn-primary" >Save</button>
                                            &nbsp;
                                        <button type="button" id="adminAudit" data-toggle="modal" data-target="#modalShowAuditData" class="btn btn-success">Audit History</button>
                                            &nbsp;
                                        <button type="button" class="btn btn-danger">Cancel</button>
                                    </div>
                            </div>
                        </div>
        `;

        
    }
    return template;
}


function changeParticipantDetail(adminSubjectAudit){
    const timeStamp = getCurrentTimeStamp()
    const a = Array.from(document.getElementsByClassName('showMore'))
    if (a) {
        a.forEach(element => {
            const values = element
            let data = getDataAttributes(values)
            element.addEventListener('click', () => {
                const header = document.getElementById('modalHeader');
                const body = document.getElementById('modalBody');
                header.innerHTML = `<h5>${data.participantkey}</h5><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
                let template = '<div>'
                template += `
                <form id="formResponse" method="post">
                        <span><strong>Field Modified</strong></span> :  <span id="fieldModified" data-fieldModified=${data.participantkey}>${data.participantkey}</span>
                        <br >
                        <span><strong>Current value</strong></span> :  <span id="currentValue" data-currentValue=${data.participantvalue}>${data.participantvalue}</span>
                        <br >
                        <span><strong>New value</strong></span> :  <input required type="text" name="newValue" id="newValue">
                        <br >
                        <span><strong>Time stamp</strong></span> :  <span id="timeStamp" data-timeStamp=${timeStamp}>${timeStamp}</span>
                        <br >
                        <span><strong>Comment</strong></span> :  <input required type="text" name="comment" id="comment"></li>
                        <br >
                        <span><strong>User ID</strong></span> :  <span  id="userId" data-userId=${timeStamp}>${timeStamp}</span></li>
                        <br >

                    <div style="display:inline-block;">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
               </div>`
                body.innerHTML = template;
                saveResponses(adminSubjectAudit)
                postEditedResponse(adminSubjectAudit)
                viewAuditHandler(adminSubjectAudit)
          
            });


        })
    }
    else {

    }
}

function saveResponses(adminSubjectAudit) {
    let changedOption = {}
    const a = document.getElementById('formResponse')
    a.addEventListener('submit', e => {
        e.preventDefault()
        // fieldModifiedData
        let fieldModifiedData = getDataAttributes1(document.getElementById('fieldModified'))
        changedOption.fieldModified = fieldModifiedData.fieldmodified
        // currentValue
        let currentValueData = getDataAttributes1(document.getElementById('currentValue'))
        changedOption.currentvalue = currentValueData.currentvalue
        // newValue
        changedOption.newValue = document.getElementById('newValue').value
        // timeStamp
        let timeStampData = getDataAttributes1(document.getElementById('timeStamp'))
        changedOption.timeStamp = timeStampData.timestamp
        // comment
        changedOption.comment = document.getElementById('comment').value
        // userID
        let userIdData = getDataAttributes1(document.getElementById('userId'))
        changedOption.userId = userIdData.userid
        adminSubjectAudit.push(changedOption)
    })
}
    


    // if (a) {
    //     a.addEventListener('click', () => {
    //                 console.log("text", text)
    //                 // let temp = document.createElement("div")
    //                 // temp.innerHTML = text
    //                 // console.log("conceptId", temp)
    //                 const header = document.getElementById('modalHeader');
    //                 const body = document.getElementById('modalBody');
    //                 header.innerHTML = `<h5>Test</h5><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
    //                 let template = '<div>'
    //                 template += `
    //                     <ul>
    //                         <li><span><strong>Current value</span></strong> :  <span>${text}</span></li>
    //                         <li><span><strong>New value</span></strong> :  <input required type="text" name="newValue" id="newValue"></li>
    //                         <li><span><strong>Time stamp</span></strong> :  <span>${currentDate.getTime()}</span></li>
    //                         <li><span><strong>Comment</span></strong> :  <input required type="text" name="comment" id="comment"></li>
    //                         <li><span><strong>User ID</span></strong> :  <span>${currentDate.getTime()}</span></li>
    //                     </ul>
    //                     </div>`
    //                 body.innerHTML = template;
             
    //     });
    // }
    // else {
    //     console.log("test123", a)
    // }


function getDataAttributes1(el) {
    let data = {};
    
    [].forEach.call(el.attributes, function(attr) {
        
        if (/^data-/.test(attr.name)) {
            var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
            data[camelCaseName] = attr.value;
        }
    });
    return data;
}


function getDataAttributes(el) {
    let data = {};
    [].forEach.call(el.attributes, function(attr) {
   
        if (/^data-/.test(attr.name)) {
            var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
            data[camelCaseName] = attr.value;
        }
    });
    return data;
}

function getCurrentTimeStamp() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDayOfMonth = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    const currentMillisecond = currentDate.getMilliseconds();
    const timeStamp = currentYear + "-" + (currentMonth + 1)  + "-" + currentDayOfMonth + "T" 
                        + currentHour + ":" + currentMinute + ":" + currentSecond + ":" + currentMillisecond;
    
    return timeStamp;
}

function getYearsInConnect(participant) {
    let timeProfileSubmitted = participant[fieldMapping.timeProfileSubmitted]
    let submittedYear = String(timeProfileSubmitted)
    submittedYear = submittedYear.split("-")
    submittedYear = parseInt(submittedYear[0])
    const currentTime = getCurrentTimeStamp()
    let currentYear = currentTime.split("-")
    currentYear = parseInt(currentYear[0])
    let totalYears =  currentYear - submittedYear
    totalYears === 0 ? totalYears = '< 1' : totalYears
    let yearsInConnect = `Year(s) in connect: ${totalYears}`
    return yearsInConnect;
}

function postEditedResponse(adminSubjectAudit) {
    const a = document.getElementById('sendResponse')
    a.addEventListener('click', () => {
        clickHandler(adminSubjectAudit);
    })
}

async function clickHandler (adminSubjectAudit)  {
    const idToken = ''
   console.log('Button Clicked');
    let requestObj = {
        method: "POST",
        headers:{
        Authorization:"Bearer "+ idToken,
        "Content-Type": "application/json"
        },
        body: JSON.stringify(adminSubjectAudit)
    }
        const response = await (await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/app?api=submit`, requestObj));
        return response.json();
 }


 function viewAuditHandler(adminSubjectAudit) {
    const a = document.getElementById('adminAudit')
    a.addEventListener('click',  buttonAuditHandler(adminSubjectAudit))
}

 function buttonAuditHandler (adminSubjectAudit) {

        const header = document.getElementById('modalHeaderAudit');
        const body = document.getElementById('modalBodyAudit');
        header.innerHTML = `<h5>Audit History</h5><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
        let template = '<div>'
        for (let i = 0; i <= adminSubjectAudit.length; i++) {
            console.log('dd', i)
            console.log('zzzzzz', adminSubjectAudit)
            let JSONresponse = JSON.stringify(adminSubjectAudit[i])
            template += `<span>
               ${JSONresponse}
            </span>
        </div>`
        }
        // for (let i of adminSubjectAudit) {
        //     let JSONresponse = JSON.stringify(i)
        //     template += `<span>
        //        ${JSONresponse}
        //     </span>
        // </div>`
        // }
        // adminSubjectAudit.map(element => {
        //     let JSONresponse = JSON.stringify(element)
        //     template += `<span>
        //        ${JSONresponse}
        //     </span>
        // </div>`
        // })
       
        body.innerHTML = template;
        console.log('Button Clicked2');
    } 

