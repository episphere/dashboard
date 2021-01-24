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


let saveFlag = false

window.addEventListener('beforeunload',  
        function (e) { 
            // Check if any of the input 
            // fields are filled 
            if (saveFlag === false) { 
            // Cancel the event and 
            // show alert that the unsaved 
            // changes would be lost 
                console.log("hellooo123")
                e.preventDefault(); 
                e.returnValue = ''; 
            } 
})

export function renderParticipantDetails(participant, adminSubjectAudit){

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantDetailsBtn').classList.add('active');
    mainContent.innerHTML = render(participant);
    let originalHTML =  mainContent.innerHTML
    changeParticipantDetail(participant, adminSubjectAudit, originalHTML)
    editAltContact(participant, adminSubjectAudit)
  
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
        
        template += `</div><table class="table detailsTable"> <h4 style="text-align: center;"> Participant Details </h4><tbody class="participantDetailTable">`
       
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

    template += ` <div class="modal fade" id="modalShowAltContact"  data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content sub-div-shadow">
            <div class="modal-header" id="modalHeaderAltContact"></div>
            <div class="modal-body" id="modalBodyAltContact"></div>
        </div>
    </div>
</div>`


        importantColumns.forEach(x => template += `<tr class="detailedRow"><th scope="row"><div class="mb-3"><label class="form-label">
            ${conceptIdMapping[x.field] && conceptIdMapping[x.field] ? conceptIdMapping[x.field]['Variable Label'] || conceptIdMapping[x.field]['Variable Name'] : x.field}</label></div></th>
            <td>${participant[x.field] !== undefined ?  participant[x.field] : ""}</td> <td> 
            <a class="showMore" data-toggle="modal" data-target="#modalShowMoreData" 
                data-participantkey=${conceptIdMapping[x.field] && conceptIdMapping[x.field] ? conceptIdMapping[x.field]['Variable Label'].replace(/\s/g, "") || conceptIdMapping[x.field]['Variable Name'].replace(/\s/g, "") : ""}
                data-participantValue=${participant[x.field]} name="modalParticipantData" >
                ${x.editable ? `<button type="button" class="btn btn-primary">Edit</button>`
                 : `<button type="button" class="btn btn-primary" disabled>Edit</button>`
                }
            </a></td></tr>&nbsp;`) 
        

            template += `</tbody></table>
                    <table class="table">
                                <h4 style="text-align: center;"> Alternate Contact Details &nbsp;</h4>
                                    <thead>
                                        <tr>
                                        <th scope="col">Contact Name</th>
                                        <th scope="col">Relationship</th>
                                        <th scope="col">Home Number</th>
                                        <th scope="col">Mobile Number</th>
                                        <th scope="col">Email</th>
                                        <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="detaileAltRow">
                                        <td>${participant.Module1.ALTCONTACT1 !== undefined ? participant.Module1.ALTCONTACT1.ALTCONTACT1_FNAME : ""} `+` ${participant.Module1.ALTCONTACT1 !== undefined ? participant.Module1.ALTCONTACT1.ALTCONTACT1_LNAME : ""} </td>
                                        <td></td>
                                        <td>${participant.Module1.ALTCONTACT2 !== undefined ? participant.Module1.ALTCONTACT2.ALTCONTACT2_HOME : ""}</td>
                                        <td>${participant.Module1.ALTCONTACT2 !== undefined ? participant.Module1.ALTCONTACT2.ALTCONTACT2_MOBILE : ""}</td>
                                        <td>${participant.Module1.ALTCONTACT2 !== undefined ? participant.Module1.ALTCONTACT2.ALTCONTACT2_EMAIL : ""}</td>
                                        <td> <button type="button" id="altContact" data-toggle="modal" data-target="#modalShowAltContact"  
                                            data-altParticipantKey=${['Contact Name', 'Relationship', 'Home Number', 'Mobile Number', 'Email']}
                                            data-altParticipantValue=${participant.Module1}
                                            class="btn btn-primary">Edit</button> </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                    <div style="display:inline-block;">
                                        <button type="submit" id="sendResponse" class="btn btn-primary" >Save Changes</button>
                                            &nbsp;
                                        <button type="button" id="adminAudit" data-toggle="modal" data-target="#modalShowAuditData" class="btn btn-success">Audit History</button>
                                            &nbsp;
                                        <button type="button" id="cancelChanges" class="btn btn-danger">Cancel Changes</button>
                                        &nbsp;
                                        <b>Last Modified by: <span id="modifiedId"></span></b>
                                    </div>
                            </div>
                        </div>
        `;
     
    }
    return template;
}


function changeParticipantDetail(participant, adminSubjectAudit, originalHTML){

    const a = Array.from(document.getElementsByClassName('detailedRow'))
    if (a) {
        a.forEach(element => {
            let editRow = element.getElementsByClassName('showMore')[0]
            const values = editRow
            let data = getDataAttributes(values)
            editRow.addEventListener('click', () => {
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
                        <br >
                        <span><strong>Comment</strong></span> :  <textarea required type="text" name="comment" id="comment" style="height: 100px; width: 400px;"> </textarea></li>
                        <br >

                    <div style="display:inline-block;">
                        <button type="submit" class="btn btn-primary" id="disableEditModal">Submit</button>
                        <button type="submit" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
                    </div>
                </form>
               </div>`
                body.innerHTML = template;
                saveResponses(participant, adminSubjectAudit, element)
                console.log('eleee', element)
                postEditedResponse(adminSubjectAudit)
                viewAuditHandler(adminSubjectAudit)
                showSaveAlert()
                resetChanges(participant, originalHTML)  
            //    lastModified(adminSubjectAudit)
          
            });

        })
    }
    else {

    }
}

function saveResponses(participant, adminSubjectAudit, editedElement) {
    let changedOption = {}
    const a = document.getElementById('formResponse')
    a.addEventListener('submit', e => {
        e.preventDefault()
        // participant token
        changedOption.token = participant.token
        // fieldModifiedData
        let fieldModifiedData = getDataAttributes(document.getElementById('fieldModified'))
        changedOption.fieldModified = fieldModifiedData.fieldmodified
        // currentValue
        let currentValueData = getDataAttributes(document.getElementById('currentValue'))
        changedOption.currentvalue = currentValueData.currentvalue
        // newValue
        changedOption.newValue = document.getElementById('newValue').value
        // timeStamp
        let timeStampData =  getCurrentTimeStamp()
        changedOption.timeStamp = timeStampData
        // comment
        changedOption.comment = document.getElementById('comment').value
        // userID
        let userIdData = getCurrentTimeStamp()
        changedOption.userId = userIdData
        // Source
        let source = "Site Manager Dashboard"
        changedOption.source = source
        adminSubjectAudit.push(changedOption)

        // updates edited field

        let updatedEditedValue = editedElement.querySelectorAll("td")[0]
        console.log("updatedEditedValue", updatedEditedValue)
        updatedEditedValue.innerHTML = changedOption.newValue

    })

}

function editAltContact(participant, adminSubjectAudit) {
    const a = document.getElementById('altContact')
    a.addEventListener('click',  () => {
       altContactHandler(participant, adminSubjectAudit)
   })
}

function altContactHandler(participant, adminSubjectAudit) {
    const header = document.getElementById('modalHeaderAltContact');
    const body = document.getElementById('modalBodyAltContact');
    header.innerHTML = `<h5>Alternate Contact Details</h5><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
    let template = '<div>'
    template += `
            <br />
            <span id='fieldName' data-fieldName='name'><strong>Name</strong></span> : <span id='currentName' data-currrentName=${participant.Module1.ALTCONTACT1.ALTCONTACT1_FNAME}>${participant.Module1.ALTCONTACT1.ALTCONTACT1_FNAME}</span> 
                : <input type="text" name="newName" id="newName" />
            <br />
            <span id='fieldRelationship' data-fieldRelationship='relationship'><strong>Relationship</strong></span> : <span id='currentRelationship'></span> : <input type="text" name="newRelationship" id="newRelationship" />
            <br />
            <span id='fieldHome' data-fieldHome='home'><strong>Home Number</strong></span> : <span id='currentHome' data-currentHome=${participant.Module1.ALTCONTACT2.ALTCONTACT2_HOME}>${participant.Module1.ALTCONTACT2.ALTCONTACT2_HOME}</span> 
                : <input type="text" name="newHome" id="newHome" />
            <br />
            <span id='fieldMobile' data-fieldMobile='mobile'><strong>Mobile Number</strong></span> : <span id='currentMobile' data-currentMobile=${participant.Module1.ALTCONTACT2.ALTCONTACT2_MOBILE}>${participant.Module1.ALTCONTACT2.ALTCONTACT2_MOBILE}</span> 
                : <input type="text" name="newMobile" id="newMobile" />
            <br />
            <span id='fieldEmail' data-fieldEmail='email'><strong>Email</strong></span> : <span id='currentEmail' data-currentEmail=${participant.Module1.ALTCONTACT2.ALTCONTACT2_EMAIL}>${participant.Module1.ALTCONTACT2.ALTCONTACT2_EMAIL}</span> 
                : <input type="text" name="newEmail" id="newEmail" />
            <br />

            <div style="display:inline-block;">
                <button type="button" class="btn btn-primary" id="altDetailsSubmit">Submit</button>
                <button type="submit" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
            </div>

   </div>`
    body.innerHTML = template;
    saveAltResponse(adminSubjectAudit, participant)
} 

function saveAltResponse(adminSubjectAudit, participant) {
    const a = document.getElementById('altDetailsSubmit')
    a.addEventListener('click', (e) => {
        e.preventDefault()
        let changedModuleOption = {}
        let altNewName = document.getElementById('newName').value
        // let altFieldName = getDataAttributes(document.getElementById('fieldName'))
        let altCurrentName = getDataAttributes(document.getElementById('currentName'))
        console.log('texttt', altCurrentName)
        changedModuleOption['Name'] = altNewName

        let newRelationship = document.getElementById('newRelationship').value
        // let altFieldRelationship = getDataAttributes(document.getElementById('fieldRelationship'))
        // let altCurrentRelationship = getDataAttributes(document.getElementById('currentRelationship'))
        changedModuleOption['Relationship'] = newRelationship

        
        // let altFieldHome = getDataAttributes(document.getElementById('fieldHome'))
        let altCurrentHome = getDataAttributes(document.getElementById('currentHome'))
        let newHome = document.getElementById('newHome').value
        changedModuleOption['Home'] = newHome

        
        // let altFieldMobile= getDataAttributes(document.getElementById('fieldMobile'))
        let altCurrentMobile = getDataAttributes(document.getElementById('currentMobile'))
        console.log('altCurrentMobile',altCurrentMobile)
        let newMobile = document.getElementById('newMobile').value
        changedModuleOption['Mobile'] = newMobile

        let newEmail = document.getElementById('newEmail').value
        // let altFieldEmail = getDataAttributes(document.getElementById('fieldEmail'))
        let altCurrentEmail = getDataAttributes(document.getElementById('currentEmail'))
        changedModuleOption['Email'] = newEmail 
        for (let key in changedModuleOption) {
            changedModuleOption[key] === '' ?
                delete changedModuleOption[key] : ''
        }

        // timeStamp
        let timeStampData =  getCurrentTimeStamp()
        // userID
        let userIdData = getCurrentTimeStamp()

        const module1 = {'token': participant.token, 'Module': changedModuleOption, 'timeStamp': timeStampData, 'userId': userIdData}
        adminSubjectAudit.push(module1)
        console.log('adminSubjectAudit', adminSubjectAudit)
        alert('Changes Submitted')
        let editedElement
        const a = Array.from(document.getElementsByClassName('detaileAltRow'))
        a.forEach(element =>
            editedElement = element
        )

        let updatedEditedValue = editedElement.querySelectorAll("td")[0]
        console.log("updatedEditedValue", updatedEditedValue)
        updatedEditedValue.innerHTML = altNewName !== '' ? altNewName : altCurrentName.currrentname

        updatedEditedValue = editedElement.querySelectorAll("td")[1]
        console.log("updatedEditedValue", updatedEditedValue)
        updatedEditedValue.innerHTML = newRelationship !== '' ? newRelationship : null

        updatedEditedValue = editedElement.querySelectorAll("td")[2]
        console.log("updatedEditedValue", updatedEditedValue)
        updatedEditedValue.innerHTML = newHome !== '' ? newHome : altCurrentHome.currenthome

        updatedEditedValue = editedElement.querySelectorAll("td")[3]
        console.log("updatedEditedValue", updatedEditedValue)
        updatedEditedValue.innerHTML = newMobile !== '' ? newMobile : altCurrentMobile.currentmobile

        updatedEditedValue = editedElement.querySelectorAll("td")[4]
        console.log("updatedEditedValue", updatedEditedValue)
        updatedEditedValue.innerHTML = newEmail !== '' ? newEmail : altCurrentEmail.currentemail
      
    })
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

function showSaveAlert() {
    const a = document.getElementById('disableEditModal')
    a.addEventListener('click', e => {
        alert('Changes Submitted')
    })
   
}

function resetChanges(participant, originalHTML) {
    const a = document.getElementById("cancelChanges")
    a.addEventListener("click", () => {

        if (saveFlag === false) {
            alert('Changes cancelled')
            mainContent.innerHTML = originalHTML;
            renderParticipantDetails(participant, [])
        }
        else {
            alert('No changes to save or cancel')
        }
    })
    
}


function postEditedResponse(adminSubjectAudit) {
    const a = document.getElementById('sendResponse')
    a.addEventListener('click', () => {
        clickHandler(adminSubjectAudit);
    })
}

async function clickHandler(adminSubjectAudit)  {
   const idToken = ''
   console.log('Button Clicked');

    const para1 = {
        "data": adminSubjectAudit
    }

    const response = await (await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/submitParticipantsData`,{
        method:'POST',
        body: JSON.stringify(para1),
        headers:{
            Authorization:"Bearer "+idToken,
            "Content-Type": "application/json"
            }
        }))
    console.log('response', response)
        if (response.status === 200) {
            saveFlag = true
            console.log('save post', saveFlag)
            let lastModifiedHolder;
            adminSubjectAudit.length === 0 ? "" : lastModifiedHolder = adminSubjectAudit[adminSubjectAudit.length - 1]
            console.log('admin', lastModifiedHolder.userId)
            let a = document.getElementById('modifiedId')
            a.innerHTML = lastModifiedHolder.userId + ' @ ' + lastModifiedHolder.timeStamp;
         }
           else { 
               (alert('Error'))
        }
      //  return response.json();
 }


 function viewAuditHandler(adminSubjectAudit) {
    const a = document.getElementById('adminAudit')
    a.addEventListener('click',  () => {
        buttonAuditHandler(adminSubjectAudit)
    })
}

 function buttonAuditHandler(adminSubjectAudit) {
        const header = document.getElementById('modalHeaderAudit');
        const body = document.getElementById('modalBodyAudit');
        header.innerHTML = `<h5>Audit History</h5><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
        let template = '<div>'
        console.log('admin', adminSubjectAudit)
        adminSubjectAudit.map(element => {
            let JSONresponse = JSON.stringify(element)
            template += `<span>
               ${JSONresponse}
            </span>
        </div>`
        })
       
        body.innerHTML = template;
        console.log('Button Clicked2');
    } 

