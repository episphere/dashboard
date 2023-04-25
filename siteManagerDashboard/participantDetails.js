import { renderNavBarLinks, dashboardNavBarLinks, removeActiveClass } from './navigationBar.js';
import fieldMapping from './fieldToConceptIdMapping.js'; 
import { renderParticipantHeader } from './participantHeader.js';
import { getCurrentTimeStamp, getDataAttributes, showAnimation, hideAnimation, baseAPI } from './utils.js';
import { renderParticipantSummary } from './participantSummary.js';
import { renderLookupResultsTable, findParticipant } from './participantLookup.js';
import { appState } from './stateManager.js';

appState.setState({unsavedChangesTrack:{saveFlag: false, counter: 0}});

window.addEventListener('beforeunload',  (e) => {
    if (appState.getState().unsavedChangesTrack.saveFlag === false && appState.getState().unsavedChangesTrack.counter > 0) { 
    // Cancel the event and show alert that the unsaved changes would be lost 
        e.preventDefault(); 
        e.returnValue = ''; 
    } 
})

// Prevents from scrolling to bottom or middle of the page
window.addEventListener('onload', (e) => {
    setTimeout(function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }, 15);
})

const checkForLoginMechanism = (participant) => {
    const isPhoneLogin = participant[fieldMapping.signInMechansim] === `phone`
    if (isPhoneLogin) {
        appState.setState({loginMechanism:{phone: true, email: false}})
        participant['Change Login Mode'] = 'Phone ☎️'
        participant['Change Login Phone'] = participant[fieldMapping.accountPhone]
    }
    else { 
        appState.setState({loginMechanism:{phone: false, email: true}}) 
        participant['Change Login Mode'] = 'Email 📧'
        participant['Change Login Email'] = participant[fieldMapping.accountEmail]
    }

}


export const renderParticipantDetails = (participant, adminSubjectAudit, changedOption, siteKey) => {
    checkForLoginMechanism(participant);
    const isParent = localStorage.getItem('isParent')
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantDetailsBtn').classList.add('active');
    mainContent.innerHTML = render(participant);
    let originalHTML =  mainContent.innerHTML;
    localStorage.setItem("participant", JSON.stringify(participant));
    viewAuditHandler(adminSubjectAudit);
    changeParticipantDetail(participant, adminSubjectAudit, changedOption, originalHTML, siteKey);
    editAltContact(participant, adminSubjectAudit);
    viewParticipantSummary(participant);
    renderReturnSearchResults();
    updateUserSigninMechanism(participant, siteKey);
    updateUserLogin(participant, siteKey);
}


export const render = (participant) => {
    const fieldValues = 
        {       
            353358909: 'Yes',
            104430631: 'No',
            612166858: 'Jr.',
            255907182: 'Sr.',
            226924545: 'I',
            270793412: 'II',
            959021713: 'III',
            643664527: '2nd',
            537892528: '3rd',
            127547625: 'Phone',
            869588347: 'Email'
        }
    const importantColumns = [ 
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
        editable: true,
        display: true } ,
         { field: fieldMapping.birthDay,
        editable: true,
        display: true } ,
         { field: fieldMapping.birthYear,
        editable: true,
        display: true } ,
        { field: fieldMapping.cellPhone,
        editable: true,
        display: true },
        { field: fieldMapping.canWeText,
        editable: true,
        display: true },
        { field: fieldMapping.voicemailMobile,
        editable: true,
        display: true },
         { field: fieldMapping.homePhone,
        editable: true,
        display: true } ,
        { field: fieldMapping.voicemailHome,
        editable: true,
        display: true },
        { field: fieldMapping.otherPhone,
        editable: true,
        display: true },
        { field: fieldMapping.voicemailOther,
        editable: true,
        display: true },
        { field: fieldMapping.email,
        editable: true,
        display: true },
        { field: fieldMapping.email1,
        editable: true,
        display: true },
        { field: fieldMapping.email2,
        editable: true,
        display: true },
        { field: fieldMapping.address1,
        editable: true,
        display: true },
        { field: fieldMapping.address2,
        editable: true,
        display: true },
        { field: fieldMapping.city,
        editable: true,
        display: true },
        { field: fieldMapping.state,
        editable: true,
        display: true },
        { field: fieldMapping.zip,
        editable: true,
        display: true },
        { field: 'Connect_ID',
        editable: false,
        display: true },
        { field: `Change Login Mode`,
        editable: true,
        display: true },
        { field: `Change Login Email`,
        editable: true,
        display: appState.getState().loginMechanism.email },
        { field: `Change Login Phone`,
        editable: true,
        display:  appState.getState().loginMechanism.phone }
    ]
    let template = `<div class="container">`
    if (!participant) {
        template +=` 
            <div id="root">
            Please select a participant first!
            </div>
        </div>
        `
    } else {
        let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
        template += `<div id="root" > 
                    <div id="alert_placeholder"></div>`
        template += renderParticipantHeader(participant);
        template += `
                        <div class="float-left">
                            <button type="button" class="btn btn-primary" id="displaySearchResultsBtn">Back to Search</button>
                        </div>
                        
                        <table class="table detailsTable"> <h4 style="text-align: center;"> Participant Details </h4>
                            <thead style="position: sticky;" class="thead-dark"> 
                            <tr>
                                <th style="text-align: left; scope="col">Field</th>
                                <th style="text-align: left; scope="col">Value</th>
                                <th style="text-align: left; scope="col"></th>
                            </thead>
                        <tbody class="participantDetailTable">
`
                    const filteredImportantColumns = importantColumns.filter(x => x.display === true);
                    filteredImportantColumns.forEach(x => template += `<tr class="detailedRow" style="text-align: left;"><th scope="row"><div class="mb-3">
                    <label class="form-label">
                    ${conceptIdMapping[x.field] && conceptIdMapping[x.field] ? 
                        (   
                            ((conceptIdMapping[x.field]['Variable Label'] || conceptIdMapping[x.field]['Variable Name']) === 'Text') ? 
                                    'Do we have permission to text this number ?'
                            : conceptIdMapping[x.field]['Variable Label'] || conceptIdMapping[x.field]['Variable Name'])
                            : x.field}</label></div></th>
                    <td style="text-align: left;">${participant[x.field] = (participant[x.field]) === undefined ? `` :  fieldValues[participant[x.field]] || participant[x.field]}</td> 
                    <td style="text-align: left;">
                        ${ x.editable && (x.field == 'Change Login Mode') ? `<button type="button" class="btn btn-success btn-custom" data-toggle="modal" data-target="#modalShowMoreData" id="switchSiginMechanism">Change</button>` 
                        : 
                        (participant[fieldMapping.signInMechansim] === `password` && x.field == 'Change Login Email') ? `<button type="button" class="btn btn-success btn-custom" data-toggle="modal" data-target="#modalShowMoreData" data-participantLoginUpdate='email' id="updateUserLogin">Update</button>` 
                        : 
                        (participant[fieldMapping.signInMechansim] === `phone` && x.field == 'Change Login Phone') ? `<button type="button" class="btn btn-success btn-custom" data-toggle="modal" data-target="#modalShowMoreData" data-participantLoginUpdate='phone' id="updateUserLogin">Update</button>` 
                        :
                        (x.editable && (participant[fieldMapping.verifiedFlag] !== (fieldMapping.verified || fieldMapping.cannotBeVerified || fieldMapping.duplicate)) )? 
                        ` <a class="showMore" data-toggle="modal" data-target="#modalShowMoreData" 
                            data-participantkey=${conceptIdMapping[x.field] && (conceptIdMapping[x.field] && conceptIdMapping[x.field]['Variable Label'] !== undefined) ? conceptIdMapping[x.field]['Variable Label'].replace(/\s/g, "") || conceptIdMapping[x.field]['Variable Name'].replace(/\s/g, "") : ""}
                            data-participantconceptid=${x.field} data-participantValue=${formatInputResponse(participant[x.field])} name="modalParticipantData" 
                            id=${x.field}>
                            <button type="button" class="btn btn-primary btn-custom">Edit</button>`
                        : `<button type="button" class="btn btn-secondary btn-custom" disabled>Edit</button>`
                        }
                    </a></td></tr>&nbsp;`)
        

            template += `</tbody></table>
                    <br />
                            <div style="display:inline-block;">
                                <button type="button" id="cancelChanges" class="btn btn-danger">Cancel Changes</button>
                                &nbsp;
                                <button type="submit" id="sendResponse" class="btn btn-primary" >Save Changes</button>
                                &nbsp;
                                <br />
                            </div>
                            </div>
                        </div>
        `;


        template += ` <div class="modal fade" id="modalShowMoreData" data-keyboard="false" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content sub-div-shadow">
                    <div class="modal-header" id="modalHeader"></div>
                    <div class="modal-body" id="modalBody"></div>
                </div>
            </div>
        </div>`
     
    }
    return template;
}


const changeParticipantDetail = (participant, adminSubjectAudit, changedOption, originalHTML, siteKey) => {

    const a = Array.from(document.getElementsByClassName('detailedRow'));
    if (a) {
        a.forEach(element => {
            let editRow = element.getElementsByClassName('showMore')[0];
            const values = editRow;
            let data = getDataAttributes(values);
            editRow && editRow.addEventListener('click', () => {
                const header = document.getElementById('modalHeader');
                const body = document.getElementById('modalBody');
                header.innerHTML = `<h5>Edit</h5><button type="button" class="modal-close-btn" id="closeModal" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
                let template = '<div>'
                template += `
                <form id="formResponse" method="post">  
                        <span><span id="fieldModified" data-fieldconceptid=${data.participantconceptid} data-fieldModified=${data.participantkey}>${removeCamelCase(data.participantkey)}</span> 
                        : <input required type="text" name="newValue" id="newValue" data-currentValue=${data.participantvalue} 
                            value=${
                                    data.participantvalue === fieldMapping.yes ? `Yes`:
                                    data.participantvalue === fieldMapping.no ? `No`:
                                    data.participantvalue === `name="modalParticipantData"` ? `+` : ``} />
                        <br >
                        <span style="font-size: 12px;" id="showNote"><i></i></span>
                        <br >
                    <div style="display:inline-block;">
                        <button type="submit" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="editModal" data-toggle="modal">Submit</button>
                    </div>
                </form>
               </div>`
                body.innerHTML = template;
                saveResponses(participant, adminSubjectAudit, changedOption, element);
            //    postEditedResponse(participant, adminSubjectAudit, changedOption, siteKey);
                viewAuditHandler(adminSubjectAudit);
                showSaveAlert();
                resetChanges(participant, originalHTML, siteKey);  
                showSaveNote();
               // viewParticipantSummary(participant);          
            });

        })
    }
    else {

    }
}

const showSaveNote = () => {
    const a = document.getElementById('newValue');
    if (a) {
        a.addEventListener('click', () => {
            const b = document.getElementById('showNote');
            b.innerHTML = `After 'Submit' you must scroll down and click 'Save Changes' at bottom of screen for your changes to be saved.`
        })
    }
}

const removeCamelCase = (participantKey) => {
    let s = participantKey
    s = s.replace(/([A-Z])/g, ' $1').trim()
    return s;
}

const formatInputResponse = (participantValue) => {
    let ptValue = ``
    if (participantValue !== undefined) {
        ptValue  = participantValue.toString().replace(/\s/g, "")
    }
    return ptValue;
}

// creates payload to be sent to backend and update the UI. Remaps the field name back to concept id along with new responses.
const saveResponses = (participant, adminSubjectAudit, changedOption, editedElement) => {
    let displayAuditHistory = {};
    let conceptId = [];
    const a = document.getElementById('formResponse')
    a.addEventListener('submit', e => {
        e.preventDefault()
        // fieldModifiedData   
        let fieldModifiedData = getDataAttributes(document.getElementById('fieldModified'));
        conceptId.push(fieldModifiedData.fieldconceptid);
        // new value
        let newUpdatedValue = document.getElementById('newValue').value;
        if (newUpdatedValue.toString().toUpperCase() === 'NO') {newUpdatedValue = fieldMapping.no}
        if (newUpdatedValue.toString().toUpperCase() === 'YES') {newUpdatedValue = fieldMapping.yes}

        changedOption[conceptId[conceptId.length - 1]] = newUpdatedValue;

        // if a changed field is a date of birth field then we need to update full date of birth  
        if ("795827569" in changedOption || "564964481" in changedOption || "544150384" in changedOption) {
            let day = "795827569" in changedOption ?  changedOption["795827569"] : getDataAttributes(document.getElementById('795827569')).participantvalue;
            let month = "564964481" in changedOption ? changedOption["564964481"] : getDataAttributes(document.getElementById('564964481')).participantvalue;
            let year = "544150384" in changedOption ? changedOption["544150384"] : getDataAttributes(document.getElementById('544150384')).participantvalue;
            conceptId.push("371067537");
            changedOption[conceptId[conceptId.length - 1]] =  year.toString() + month.padStart(2, '0')+ day.padStart(2, '0') ;
        }

        // update changed field on UI
        let updatedEditValue = editedElement.querySelectorAll("td")[0];
        updatedEditValue.innerHTML = newUpdatedValue;
        
        ///////////////////////////////////////////////
        // participant token
        displayAuditHistory.token = participant.token;
        // fieldModifiedData
        let fieldChanged = getDataAttributes(document.getElementById('fieldModified'));
        displayAuditHistory.fieldModified = fieldChanged.fieldmodified;
        // currentValue
        let currentValueData = getDataAttributes(document.getElementById('newValue'));
        displayAuditHistory.currentvalue = currentValueData.currentvalue;
        // newValue
        displayAuditHistory.newValue = document.getElementById('newValue').value;
        // timeStamp
        let timeStampData =  getCurrentTimeStamp();
        displayAuditHistory.timeStamp = timeStampData;
        // comment
        //displayAuditHistory.comment = document.getElementById('comment').value;
        // userID
        let userIdData = getCurrentTimeStamp();
        displayAuditHistory.userId = userIdData;
        // Source
        let source = "Site Manager Dashboard";
        displayAuditHistory.source = source;
        adminSubjectAudit.push(displayAuditHistory);
      
    })

}

// For alternate contact details. Would be updates once concept ids for alt details are ready

const editAltContact = (participant, adminSubjectAudit) => {
    const a = document.getElementById('altContact');
    if (a) {
        a.addEventListener('click',  () => {
        altContactHandler(participant, adminSubjectAudit);
    })
}
}

const altContactHandler = (participant, adminSubjectAudit) => {
    const header = document.getElementById('modalHeader');
    const body = document.getElementById('modalBody');
    header.innerHTML = `<h5>Alternate Contact Details</h5><button type="button" id="closeModal" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
    let template = '<div>'
    template += `

            <br />
            <span id='fieldName' data-fieldName='First Name'><strong>Name</strong></span> : <input type="text" name="newName" id="newName" data-currrentFName=${participant.Module1 && participant.Module1.ALTCONTACT1.ALTCONTACT1_FNAME} value=${participant.Module1 && participant.Module1.ALTCONTACT1.ALTCONTACT1_FNAME} />
            <br />
            <span id='fieldLName' data-fieldLName='Last Name'><strong>Last Name</strong></span> : <input type="text" name="newLName" id="newLName" data-currrentLName=${participant.Module1 && participant.Module1.ALTCONTACT1.ALTCONTACT1_LNAME} value=${participant.Module1 && participant.Module1.ALTCONTACT1.ALTCONTACT1_LNAME} />
            <br />
            <span id='fieldRelationship' data-fieldRelationship='relationship'><strong>Relationship</strong></span> : <input type="text" name="newRelationship" id="newRelationship" />
            <br />
            <span id='fieldHome' data-fieldHome='home'><strong>Home Number</strong></span> : <input type="text" name="newHome" id="newHome" data-currentHome=${participant.Module1 && participant.Module1.ALTCONTACT2.ALTCONTACT2_HOME} value=${participant.Module1 && participant.Module1.ALTCONTACT2.ALTCONTACT2_HOME} />
            <br />
            <span id='fieldMobile' data-fieldMobile='mobile'><strong>Mobile Number</strong></span> : <input type="text" name="newMobile" id="newMobile" data-currentMobile=${participant.Module1 && participant.Module1.ALTCONTACT2.ALTCONTACT2_MOBILE} value=${participant.Module1 && participant.Module1.ALTCONTACT2.ALTCONTACT2_MOBILE} />
            <br />
            <span id='fieldEmail' data-fieldEmail='email'><strong>Email</strong></span> : <input type="text" name="newEmail" id="newEmail" data-currentEmail=${participant.Module1 && participant.Module1.ALTCONTACT2.ALTCONTACT2_EMAIL} value="${participant.Module1 && participant.Module1.ALTCONTACT2.ALTCONTACT2_EMAIL}" />
            <br />

            <div style="display:inline-block;">
                <button type="button" class="btn btn-primary" id="altDetailsSubmit">Submit</button>
                <button type="submit" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
            </div>

   </div>`
    body.innerHTML = template;
    saveAltResponse(adminSubjectAudit, participant);
    viewAuditHandler(adminSubjectAudit);
    viewParticipantSummary(participant)
} 

const saveAltResponse = (adminSubjectAudit, participant) => {
    const a = document.getElementById('altDetailsSubmit')
    a.addEventListener('click', (e) => {
        e.preventDefault()
        let changedModuleOption = {};
        let altNewName = document.getElementById('newName').value;
        let altCurrentName = getDataAttributes(document.getElementById('newName'));
        changedModuleOption['Name'] = altNewName;

        let altNewLName = document.getElementById('newLName').value;
        let altCurrentLName = getDataAttributes(document.getElementById('newLName'));
        changedModuleOption['Last Name'] = altNewLName;

        let newRelationship = document.getElementById('newRelationship').value;
        // let altFieldRelationship = getDataAttributes(document.getElementById('fieldRelationship'))
        // let altCurrentRelationship = getDataAttributes(document.getElementById('currentRelationship'))
        changedModuleOption['Relationship'] = newRelationship;


        let altCurrentHome = getDataAttributes(document.getElementById('newHome'));
        let newHome = document.getElementById('newHome').value;
        changedModuleOption['Home'] = newHome;

        let altCurrentMobile = getDataAttributes(document.getElementById('newMobile'));
        let newMobile = document.getElementById('newMobile').value;
        changedModuleOption['Mobile'] = newMobile;

        let newEmail = document.getElementById('newEmail').value;
        let altCurrentEmail = getDataAttributes(document.getElementById('newEmail'));
        changedModuleOption['Email'] = newEmail;

        for (let key in changedModuleOption) {
            changedModuleOption[key] === '' ?
                delete changedModuleOption[key] : ''
        }

        // timeStamp
        let timeStampData =  getCurrentTimeStamp();
        // userID
        let userIdData = getCurrentTimeStamp();

        const module1 = {'token': participant.token, 'Module': changedModuleOption, 'timeStamp': timeStampData, 'userId': userIdData};
        adminSubjectAudit.push(module1);
        const modalClose = document.getElementById('modalShowMoreData')
        const closeButton = modalClose.querySelector('#closeModal').click()
      
        let editedElement;
        const a = Array.from(document.getElementsByClassName('detaileAltRow'))
        a.forEach(element =>
            editedElement = element
        )

        let updatedEditedValue = editedElement.querySelectorAll("td")[0];
        if (altNewName !== '' && altNewLName !== '') {
            updatedEditedValue.innerHTML = altNewName +" "+ altNewLName;
        }
        else if (altNewName !== '') {
            updatedEditedValue.innerHTML = altNewName +" "+ altCurrentLName.currrentlname;
        }
        else if (altNewLName !== '') {
            updatedEditedValue.innerHTML = altCurrentName.currrentfname +" "+ altNewLName;
        }

        updatedEditedValue = editedElement.querySelectorAll("td")[1];
        updatedEditedValue.innerHTML = newRelationship !== '' ? newRelationship : null

        updatedEditedValue = editedElement.querySelectorAll("td")[2];
        updatedEditedValue.innerHTML = newHome !== '' ? newHome : altCurrentHome.currenthome

        updatedEditedValue = editedElement.querySelectorAll("td")[3];
        updatedEditedValue.innerHTML = newMobile !== '' ? newMobile : altCurrentMobile.currentmobile

        updatedEditedValue = editedElement.querySelectorAll("td")[4];
        updatedEditedValue.innerHTML = newEmail !== '' ? newEmail : altCurrentEmail.currentemail
      
    })
}

/////// Helper Functions /////////

const showSaveAlert = () => {
    const a = document.getElementById('editModal');
    a.addEventListener('click', e => {
        let prevCounter =  appState.getState().unsavedChangesTrack.counter
        appState.setState({unsavedChangesTrack:{saveFlag: false, counter: prevCounter+1}})
        
        const modalClose = document.getElementById('modalShowMoreData')
        const closeButton = modalClose.querySelector('#closeModal').click()
    })
   
}

const resetChanges = (participant, originalHTML, siteKey) => {
    const a = document.getElementById("cancelChanges");
    let template = '';
    a.addEventListener("click", () => {
        if ( appState.getState().unsavedChangesTrack.saveFlag === false ) {  
            mainContent.innerHTML = originalHTML;
            renderParticipantDetails(participant, [], {}, siteKey);
            appState.setState({unsavedChangesTrack:{saveFlag: false, counter: 0}})
            let alertList = document.getElementById('alert_placeholder');
            // throws an alert when canncel changes button is clicked
            template += `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                            Changes cancelled.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                         </div>`
            alertList.innerHTML = template;
        }
        else {  
            alert('No changes to save or cancel');
          
        }
    })
    
}


const postEditedResponse = (participant, adminSubjectAudit, changedOption, siteKey) => {
    const a = document.getElementById('sendResponse');
    a.addEventListener('click', () => {
        changedOption['token'] = participant.token;
        clickHandler(adminSubjectAudit, changedOption, siteKey);
    })
}



// async-await function to make HTTP POST request
async function clickHandler(adminSubjectAudit, updatedOptions, siteKey)  {
    showAnimation();   
    const updateParticpantPayload = {
        "data": [updatedOptions]
    }
    const response = await (await fetch(`${baseAPI}/dashboard?api=updateParticipantData`,{
        method:'POST',
        body: JSON.stringify(updateParticpantPayload),
        headers:{
            Authorization:"Bearer "+siteKey,
            "Content-Type": "application/json"
            }
        }))
        hideAnimation();
        if (response.status === 200) {
            document.getElementById('loadingAnimation').style.display = 'none';
            appState.setState({unsavedChangesTrack:{saveFlag: true, counter: 0}})
            let lastModifiedHolder;
            adminSubjectAudit.length === 0 ? "" : lastModifiedHolder = adminSubjectAudit[adminSubjectAudit.length - 1]
            let alertList = document.getElementById("alert_placeholder");
            let template = ``;
            template += `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                      Participant detail updated!
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>`;
            alertList.innerHTML = template;
            return true;
            // let a = document.getElementById('modifiedId')
            // a.innerHTML = 'Placeholder for User id' + ' @ ' + lastModifiedHolder.timeStamp;
         }
           else { 
               (alert('Error'))
        }
 }

// Admin audit displaying logs
 const viewAuditHandler = (adminSubjectAudit) => {
    const a = document.getElementById('adminAudit');
    if (a) {
        a.addEventListener('click',  () => {
            buttonAuditHandler(adminSubjectAudit);
    })
    }
}

const updateUserSigninMechanism = (participant, siteKey) => {
    const switchSiginButton = document.getElementById('switchSiginMechanism');
    let template = ``
    if (switchSiginButton) {
        switchSiginButton.addEventListener('click', () => {
            const header = document.getElementById('modalHeader');
            const body = document.getElementById('modalBody');
            header.innerHTML = `<h5>Change Login Mode</h5><button type="button" class="modal-close-btn" data-dismiss="modal" id="closeModal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
            template = `<div> <form id="formResponse2" method="post"> `
            if (participant[fieldMapping.signInMechansim] === 'phone') {
                template +=  `<div class="form-group">
                            <label class="col-form-label search-label">Current Login</label>
                            <input class="form-control" value=${participant[fieldMapping.accountPhone]} disabled/>
                            <label class="col-form-label search-label">Enter New Email Login</label>
                            <input class="form-control" type="email" id="newEmail" placeholder="Enter Email"/>
                            <label class="col-form-label search-label">Confirm New Email Login</label>
                            <input class="form-control" type="email" id="confirmEmail" placeholder="Confim Email"/>
                        </div>`
            }
            else if (participant[fieldMapping.signInMechansim] === 'password') {
                template +=  `<div class="form-group">
                            <label class="col-form-label search-label">Current Login</label>
                            <input class="form-control" value=${participant[fieldMapping.accountEmail]} disabled/>
                            <label class="col-form-label search-label">Enter New Phone Login</label>
                            <input class="form-control" id="newPhone" placeholder="Enter phone number without dashes & parenthesis"/>
                            <label class="col-form-label search-label">Confirm New Phone Login</label>
                            <input class="form-control" id="confirmPhone" placeholder="Confim phone number"/>
                        </div>`
            }
            template += `<div class="form-group">
                            <button type="submit" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
                            <button type="submit" class="btn btn-primary" data-toggle="modal">Submit</button>
                        </div>
                    </form>
                </div>`
            body.innerHTML = template;
            let prevCounter =  appState.getState().unsavedChangesTrack.counter
            appState.setState({unsavedChangesTrack:{saveFlag: false, counter: prevCounter+1}});
            processSwitchSigninMechanism(participant, siteKey, 'replaceSignin');
        })
    }
   }
// updates existing email or phone
   const updateUserLogin = (participant, siteKey) => {
    const switchSiginButton = document.getElementById('updateUserLogin');
    let updateFlag = ``
    let template = ``
    if (switchSiginButton) {
        switchSiginButton.addEventListener('click', () => {
            const header = document.getElementById('modalHeader');
            const body = document.getElementById('modalBody');
            header.innerHTML = `<h5>Change Login ${participant[fieldMapping.signInMechansim] === 'phone' ? `Phone` : `Email`}</h5><button type="button" class="modal-close-btn" data-dismiss="modal" id="closeModal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
            template = `<div> <form id="formResponse2" method="post"> `
            if (participant[fieldMapping.signInMechansim] === 'phone') {
                template +=  `<div class="form-group">
                            <label class="col-form-label search-label">Current Login</label>
                            <input class="form-control" value=${participant[fieldMapping.accountPhone]} disabled/>
                            <label class="col-form-label search-label">Enter New Phone Login</label>
                            <input class="form-control" id="newPhone" placeholder="Enter phone number without dashes & parenthesis"/>
                            <label class="col-form-label search-label">Confirm New Phone Login</label>
                            <input class="form-control" id="confirmPhone" placeholder="Confim phone number"/>
                        </div>`
                updateFlag = `updatePhone`
                
            }
            else if (participant[fieldMapping.signInMechansim] === 'password') {
                template +=  `<div class="form-group">
                            <label class="col-form-label search-label">Current Login</label>
                            <input class="form-control" value=${participant[fieldMapping.accountEmail]} disabled/>
                            <label class="col-form-label search-label">Enter New Email Login</label>
                            <input class="form-control" type="email" id="newEmail" placeholder="Enter Email"/>
                            <label class="col-form-label search-label">Confirm New Email Login</label>
                            <input class="form-control" type="email" id="confirmEmail" placeholder="Confim Email"/>
                        </div>`
                updateFlag = `updateEmail`
            }
            template += `<div class="form-group">
                            <button type="submit" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
                            <button type="submit" class="btn btn-primary" data-toggle="modal">Submit</button>
                        </div>
                    </form>
                </div>`
            body.innerHTML = template;
            let prevCounter =  appState.getState().unsavedChangesTrack.counter
            appState.setState({unsavedChangesTrack:{saveFlag: false, counter: prevCounter+1}});
            processSwitchSigninMechanism(participant, siteKey, updateFlag);
        })
    }
   }


const processSwitchSigninMechanism = (participant, siteKey, flag) => {
    document.getElementById('formResponse2') && document.getElementById('formResponse2').addEventListener('submit', e => {
        e.preventDefault();
        let switchPackage = {}
        let changedOption = {}
        let tweakedPhoneNumber = ``
        const confirmation = confirm('Are you sure want to continue with the operation?')
        if (confirmation) {
            const phoneField = document.getElementById('newPhone');
            const emailField = document.getElementById('newEmail');
            if(phoneField && phoneField.value === document.getElementById('confirmPhone').value) {

                (phoneField.value.toString().length) === 10 ? 
                tweakedPhoneNumber = phoneField.value.toString().trim()
                : tweakedPhoneNumber = phoneField.value.toString().slice(2).trim()

                switchPackage['phone'] = tweakedPhoneNumber
                changedOption[fieldMapping.signInMechansim] = 'phone'
                changedOption[fieldMapping.accountPhone] = `+1`+tweakedPhoneNumber
            }

            else if (emailField &&  emailField.value === document.getElementById('confirmEmail').value) {
                switchPackage['email'] = emailField.value 
                changedOption[fieldMapping.signInMechansim] = 'password'
                changedOption[fieldMapping.accountEmail] = emailField.value
            }

            else {
                alert(`Your entered inputs don't match`)
                return
            }

            changedOption['token'] = participant.token;
            switchPackage['uid'] = participant.state.uid;
            switchPackage['flag'] = flag
            switchSigninMechanismHandler(switchPackage, siteKey, changedOption);

        }
    })
};


// async-await function to make HTTP POST request
const switchSigninMechanismHandler = async (switchPackage, siteKey, changedOption) =>  {
    showAnimation();
   
    const signinMechanismPayload = {
        "data": switchPackage
    }

    const response = await (await fetch(`${baseAPI}/dashboard?api=updateUserAuthentication`,{
        method:'POST',
        body: JSON.stringify(signinMechanismPayload),
        headers:{
            Authorization:"Bearer "+siteKey,
            "Content-Type": "application/json"
            }
        }))
        hideAnimation();
        if (response.status === 200) {
            clickHandler({}, changedOption, siteKey);
            let alertList = document.getElementById("alert_placeholder");
            let template = ``;
            template += `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                      Operation successful!
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                    </div>`;
            alertList.innerHTML = template;
            const modalClose = document.getElementById('modalShowMoreData');
            const closeButton = modalClose.querySelector('#closeModal').click();
            const UpdateRowStatus = Array.from(document.getElementsByClassName('detailedRow'));
            if (switchPackage.flag === "updatePhone" || switchPackage.flag === "updateEmail") {
                let updateStatus = UpdateRowStatus[25].querySelectorAll("td")[0];
                updateStatus.innerHTML = 'Updating login mode';
            }
            if (switchPackage.flag === "replaceSignin") {
                let updateStatus = UpdateRowStatus[24].querySelectorAll("td")[0];
                updateStatus.innerHTML = 'Replacing login mode';
            }
            setTimeout(() => {
                alert(`If you don't see updated information in next couple of seconds. Try to reload your participant!`)
              }, "5000");
              
            reloadParticipantData(changedOption.token, siteKey);
         }

        else if (response.status === 409) {
            alert(`Phone Number/Email already exists!`)
            return false;
        }

        else if (response.status === 403) {
            alert(`Invalid Phone Number/Email!`)
            return false;
         }

        else { 
            alert(`Operation Unsuccessful!`)
        }
 }

 const reloadParticipantData = async (token, siteKey) => {
    showAnimation();
    const query = `token=${token}`
    const reloadedParticpant = await findParticipant(query);
    mainContent.innerHTML = render(reloadedParticpant.data[0]);
    renderParticipantDetails(reloadedParticpant.data[0], [],  {}, siteKey);
    hideAnimation();
    }


 const buttonAuditHandler = (adminSubjectAudit) => {
        const header = document.getElementById('modalHeader');
        const body = document.getElementById('modalBody');
        header.innerHTML = `<h5>Audit History</h5><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
        let template = '<div>'
        adminSubjectAudit.length === 0 ? (
            template+= `<span> No changes to show </span></div>`
        ) : (
        adminSubjectAudit.map(element => {
            let JSONresponse = JSON.stringify(element);
            template += `<span>
               ${JSONresponse};
            </span>
        </div>`
        }))
       
        body.innerHTML = template;
} 


const viewParticipantSummary = (participant) => {
    const a = document.getElementById('viewSummary');
    if (a) {
        a.addEventListener('click',  () => {  
            renderParticipantSummary(participant);
        })
    }
}

const renderReturnSearchResults = () => {
    const a = document.getElementById('displaySearchResultsBtn');
    if (a) {
        a.addEventListener('click', () => {
            renderLookupResultsTable();
        })
}}