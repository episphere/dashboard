import { dashboardNavBarLinks, removeActiveClass } from './navigationBar.js';
import { allStates, closeModal, formatInputResponse, getFieldValues, getImportantRows, getModalLabel, hideUneditableButtons, reloadParticipantData, renderReturnSearchResults, resetChanges, saveResponses, showSaveNoteInModal, submitClickHandler, suffixList, viewParticipantSummary, } from './participantDetailsHelpers.js';
import fieldMapping from './fieldToConceptIdMapping.js'; 
import { renderParticipantHeader } from './participantHeader.js';
import { getDataAttributes, showAnimation, hideAnimation, baseAPI } from './utils.js';
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
    const isPhoneLogin = participant?.[fieldMapping.signInMechansim] === `phone`;
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

export const renderParticipantDetails = (participant, changedOption, siteKey) => {
    checkForLoginMechanism(participant);
    const isParent = localStorage.getItem('isParent');
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantDetailsBtn').classList.add('active');
    mainContent.innerHTML = render(participant, changedOption);
    let originalHTML =  mainContent.innerHTML;
    hideUneditableButtons(participant, changedOption);
    localStorage.setItem("participant", JSON.stringify(participant));
    changeParticipantDetail(participant,  changedOption, originalHTML, siteKey);
    editAltContact(participant);
    viewParticipantSummary(participant);
    renderReturnSearchResults();
    updateUserSigninMechanism(participant, siteKey);
    updateUserLogin(participant, siteKey);
    submitClickHandler(participant, changedOption, siteKey);
}

export const render = (participant, changedOption) => {
    const importantRows = getImportantRows(participant, changedOption);

    let template = `<div class="container">`
    if (!participant) {
        template +=` 
            <div id="root">
                Please select a participant first!
            </div>
        </div>
        `
    } else {
        const filteredImportantRows = importantRows.filter(row => row.display === true);
        template += `<div id="root" > 
                    <div id="alert_placeholder"></div>`
        template += renderParticipantHeader(participant);
        template += `      
            ${renderBackToSearchDivAndButton()}
            ${renderCancelChangesAndSaveChangesButtons()}
            ${renderDetailsTableHeader()}
        `;
        filteredImportantRows.forEach(row => {
            const cId = row.field;
            const variableLabel = row.label;
            const variableValue = participant[cId];
            const valueToRender = getFieldValues(variableValue, cId);
            const participantValue = formatInputResponse(participant[cId]);
            const participantSignInMechanism = participant[fieldMapping.signInMechansim];
            const buttonToRender = getButtonToRender(row, participantSignInMechanism, variableLabel, cId, participantValue);
            template += `
                <tr class="detailedRow" style="text-align: left;" id="${cId}row"}>
                    <th scope="row">
                        <div class="mb-3">
                            <label class="form-label">
                                ${variableLabel}
                            </label>
                        </div>
                    </th>
                    <td style="text-align: left;" id="${cId}value">
                        ${valueToRender}
                        <br>
                        <br>
                        <div id="${cId}note" style="display:none"></div>
                    </td> 
                    <td style="text-align: left;">
                        ${buttonToRender}
                    </td>
                </tr>
            `
        });
        template += `
                    </tbody>
                </table>
                ${renderCancelChangesAndSaveChangesButtons()}
            </div>
        </div>
        `;
        template += `${renderShowMoreDataModal()}`
    }
    return template;
}

const changeParticipantDetail = (participant, changedOption, originalHTML, siteKey) => {
    const detailedRow = Array.from(document.getElementsByClassName('detailedRow'));
    if (detailedRow) {
        detailedRow.forEach(element => {
            let editRow = element.getElementsByClassName('showMore')[0];
            const values = editRow;
            let data = getDataAttributes(values);
            editRow && editRow.addEventListener('click', () => {
                const header = document.getElementById('modalHeader');
                const body = document.getElementById('modalBody');
                const cId = data.participantconceptid;
                const participantKey = data.participantkey;
                const modalLabel = getModalLabel(participantKey);
                const participantValue = data.participantvalue;
                header.innerHTML = `
                    <h5>Edit ${modalLabel}</h5>
                    <button type="button" class="modal-close-btn" id="closeModal" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
                let template = `
                    <div>
                        ${renderFormInModal(participant, changedOption, cId, participantKey, modalLabel, participantValue)}
                    </div>`
                body.innerHTML = template;
                showSaveNoteInModal(cId);
                saveResponses(participant, changedOption, element, cId);
                resetChanges(participant, originalHTML, siteKey);   
            });
        })
    }
}

const getButtonToRender = (row, participantSignInMechanism, variableLabel, cId, participantValue) => {
    const editButton = `
        <a class="showMore" 
            data-toggle="modal" 
            data-target="#modalShowMoreData"
            data-participantkey="${variableLabel}"
            data-participantconceptid="${cId}" 
            data-participantValue="${participantValue}" 
            name="modalParticipantData"
            id="${cId}button">
            <button type="button" class="btn btn-primary btn-custom">Edit</button>
        </a>
        `;
    const changeLoginModeButton = `<button type="button" class="btn btn-primary btn-custom" data-toggle="modal" data-target="#modalShowMoreData" id="switchSiginMechanism">Change</button>`;
    const updateLoginEmailButton = `<button type="button" class="btn btn-primary btn-custom" data-toggle="modal" data-target="#modalShowMoreData" data-participantLoginUpdate='email' id="updateUserLogin">Update</button>`;
    const updateLoginPhoneButton = `<button type="button" class="btn btn-primary btn-custom" data-toggle="modal" data-target="#modalShowMoreData" data-participantLoginUpdate='phone' id="updateUserLogin">Update</button>`;

    if (row.editable && cId === 'Change Login Mode') {
        return changeLoginModeButton;
    } else if (participantSignInMechanism === 'password' && cId === 'Change Login Email') {
        return updateLoginEmailButton;
    } else if (participantSignInMechanism === 'phone' && cId === 'Change Login Phone') {
        return updateLoginPhoneButton;
    } else {
        return editButton;
    }
};

// For alternate contact details. Would be updates once concept ids for alt details are ready
const editAltContact = (participant) => {
    const a = document.getElementById('altContact');
    if (a) {
        a.addEventListener('click',  () => {
        altContactHandler(participant);
        })
    }   
}

const altContactHandler = (participant) => {
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
                <button type="submit" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
                <button type="button" class="btn btn-primary" id="altDetailsSubmit">Submit</button>
            </div>
        </div>`
    body.innerHTML = template;
    saveAltResponse( participant);
    viewParticipantSummary(participant)
}

const saveAltResponse = (participant) => {
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
        
        closeModal();
      
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

// async-await function to make HTTP POST request
async function signInMechanismClickHandler(updatedOptions, siteKey)  {
    showAnimation();
   
    const updateParticpantPayload = {
        "data": [updatedOptions]
    }

    const response = await fetch(`${baseAPI}/dashboard?api=updateParticipantData`,{
        method:'POST',
        body: JSON.stringify(updateParticpantPayload),
        headers:{
            Authorization:"Bearer "+siteKey,
            "Content-Type": "application/json"
            }
    });
    hideAnimation();
    if (response.status === 200) {
        document.getElementById('loadingAnimation').style.display = 'none';
        appState.setState({unsavedChangesTrack:{saveFlag: true, counter: 0}})
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
    } else { 
        alert('Error');
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
            signInMechanismClickHandler({}, changedOption, siteKey);
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
            
            closeModal();
            
            const changeLoginModeText = document.getElementById('Change Login Moderow').children[1];
            const changeLoginEmailRow = document.getElementById('Change Login Emailrow');
            const changeLoginPhoneRow = document.getElementById('Change Login Phonerow');

            if (switchPackage.flag === "updatePhone" || switchPackage.flag === "updateEmail" || switchPackage.flag === "replaceSignin") {
                changeLoginModeText.innerHTML = 'Updating login';
                if (changeLoginPhoneRow) changeLoginPhoneRow.children[1].innerHTML = 'Updating phone number';
                if (changeLoginEmailRow) changeLoginEmailRow.children[1].innerHTML = 'Updating email';
            }
            await reloadParticipantData(changedOption.token, siteKey);
         }

        else if (response.status === 409) {
            const body = document.getElementById('modalBody');
            let template = ``
            if (switchPackage.phone) template += '<div>Phone Number already in use!</div>'
            else template += '<div>Email already in use!</div>'
            body.innerHTML = template;
            return false;
        }

        else if (response.status === 403) {
            const body = document.getElementById('modalBody');
            let template = ``
            if (switchPackage.phone) template += '<div>Invalid Phone Number!</div>' 
            else template += '<div>Invalid Email!</div>'
            body.innerHTML = template;
            return false;
         }

        else { 
            const body = document.getElementById('modalBody');
            body.innerHTML = `Operation Unsuccessful!`;
            return false;
        }
}

const renderBackToSearchDivAndButton = () => {
    return `
        <div class="float-left">
            <button type="button" class="btn btn-primary" id="displaySearchResultsBtn">Back to Search</button>    
        </div>
        
    `;
};

const renderDetailsTableHeader = () => {
    return `
        <table class="table detailsTable"> <h4 style="text-align: center;"> Participant Details </h4>
            <thead style="position: sticky;" class="thead-dark"> 
                <tr>
                    <th style="text-align: left; scope="col">Field</th>
                    <th style="text-align: left; scope="col">Value</th>
                    <th style="text-align: left; scope="col"></th>
                </tr>
            </thead>
        <tbody class="participantDetailTable">
    `;
};

const renderFormInModal = (participant, changedOption, cId, participantKey, modalLabel, participantValue) => {
    const textFieldMappingsArray = getImportantRows(participant, changedOption)
        .filter(row => row.editable && (row.validationType == 'text' || row.validationType == 'email' || row.validationType == 'address' || row.validationType == 'year' || row.validationType == 'zip'))
        .map(row => row.field);

    const phoneFieldMappingsArray = getImportantRows(participant, changedOption)
        .filter(row => row.editable && row.validationType == 'phoneNumber')
        .map(row => row.field);

    const permissionSelector = getImportantRows(participant, changedOption)
        .filter(row => row.editable && (row.validationType == 'permissionSelector'))
        .map(row => row.field);

    const renderPermissionSelector = permissionSelector.includes(parseInt(cId));
    const renderPhone = phoneFieldMappingsArray.includes(parseInt(cId));
    const renderText = textFieldMappingsArray.includes(parseInt(cId));
    const renderDay = cId == fieldMapping.birthDay;
    const renderMonth = cId == fieldMapping.birthMonth;
    const renderState = cId == fieldMapping.state;
    const renderSuffix = cId == fieldMapping.suffix;
    const elementId = `fieldModified${cId}`;

    return `
        <form id="formResponse" method="post">
            <span id="${elementId}" data-fieldconceptid=${cId} data-fieldModified=${participantKey}>
                ${modalLabel}:
            </span>
            ${renderDay ? renderDaySelector(participantValue, cId) : ''}
            ${renderMonth ? renderMonthSelector(participantValue, cId) : ''}
            ${renderPermissionSelector ? renderTextVoicemailPermissionSelector(participantValue, cId) : ''}
            ${renderState ? renderStateSelector(participantValue, cId) : ''}
            ${renderSuffix ? renderSuffixSelector(participant, participantValue, cId) : ''}
            ${renderText ? renderTextInputBox(participantValue, cId) : ''}
            ${renderPhone ? renderPhoneInputBox(participantValue, cId) : ''}
            <br/>
            <span id="showError"></span>
            <span style="font-size: 12px;" id="showNote"><i></i></span>
            <br/>
            <div style="display:inline-block;">
                <button type="submit" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
                &nbsp;
                <button type="submit" class="btn btn-primary" id="editModal" data-toggle="modal">Submit</button>
            </div>
        </form>
    `;
};

const renderShowMoreDataModal = () => {
    return `
        <div class="modal fade" id="modalShowMoreData" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content sub-div-shadow">
                    <div class="modal-header" id="modalHeader"></div>
                    <div class="modal-body" id="modalBody"></div>
                </div>
            </div>
        </div>
    `;
};

const renderCancelChangesAndSaveChangesButtons = () => {
    return `
        <div class="float-right" style="display:inline-block;">
            <button type="button" id="cancelChanges" class="btn btn-danger">Cancel Changes</button>
            &nbsp;
            <button type="submit" id="updateMemberData" class="updateMemberData btn btn-primary">Save Changes</button>
        </div>
        </br>
        </br>
    `;
};

const renderDaySelector = (participantValue, cId) => {
    let options = '';
    for(let i = 1; i <= 31; i++){
        options += `<option class="option-dark-mode" value="${i.toString().padStart(2, '0')}">${i.toString().padStart(2, '0')}</option>`
    }
    return `
        <select name="newValue${cId}" id="newValue${cId}" data-currentValue=${participantValue}>
            ${options}
        </select>
    `;
};

const renderMonthSelector = (participantValue, cId) => {
    let options = '';
    for(let i = 1; i <= 12; i++){
        options += `<option class="option-dark-mode" value="${i.toString().padStart(2, '0')}">${i.toString().padStart(2, '0')}</option>`
    }
    return `
        <select name="newValue${cId}" id="newValue${cId}" data-currentValue=${participantValue}>
            ${options}
        </select>
    `;
};

const renderTextVoicemailPermissionSelector = (participantValue, cId) => {
    return `
        <select name="newValue${cId}" id="newValue${cId}" data-currentValue=${participantValue}>
            <option class="option-dark-mode" value="">-- Select --</option>
            <option class="option-dark-mode" value="${fieldMapping.yes}">Yes</option>
            <option class="option-dark-mode" value="${fieldMapping.no}">No</option>
        </select>
    `;
};

const renderStateSelector = (participantValue, cId) => {
    let options = '';
    for(const state in allStates){
        options += `<option class="option-dark-mode" value="${state}">${state}</option>`
    }
    return `
        <select name="newValue${cId}" id="newValue${cId}" data-currentValue=${participantValue}>
            ${options}
        </select>
    `;
};

const renderTextInputBox = (participantValue, cId) => {
    return `
        <input type="text" name="newValue${cId}" id="newValue${cId}" data-currentValue=${participantValue}>
    `;
};

const renderPhoneInputBox = (participantValue, cId) => {
    return `
        <input type="tel" name="newValue${cId}" id="newValue${cId}" data-currentValue=${participantValue} placeholder="999-999-9999" pattern="([0-9]{3}-?[0-9]{3}-?[0-9]{4})?">
        <br>
        <small>Requested Format (no perenthesis): 123-456-7890</small><br>
    `;
};

const renderSuffixSelector = (participant, participantValue, cId) => {
    return `
        <select style="max-width:200px; margin-left:0px;" name="newValue${cId}" id="newValue${cId}" data-currentValue=${participantValue}>
            <option value="">-- Select --</option>
            <option value="612166858" ${participant[fieldMapping.suffix] ? (suffixList[participant[fieldMapping.suffix]] == 0 ? 'selected':'') : ''}>Jr.</option>
            <option value="255907182" ${participant[fieldMapping.suffix] ? (suffixList[participant[fieldMapping.suffix]] == 1 ? 'selected':'') : ''}>Sr.</option>
            <option value="226924545" ${participant[fieldMapping.suffix] ? (suffixList[participant[fieldMapping.suffix]] == 2 ? 'selected':'') : ''}>I</option>
            <option value="270793412" ${participant[fieldMapping.suffix] ? (suffixList[participant[fieldMapping.suffix]] == 3 ? 'selected':'') : ''}>II</option>
            <option value="959021713" ${participant[fieldMapping.suffix] ? (suffixList[participant[fieldMapping.suffix]] == 4 ? 'selected':'') : ''}>III</option>
            <option value="643664527" ${participant[fieldMapping.suffix] ? (suffixList[participant[fieldMapping.suffix]] == 5 ? 'selected':'') : ''}>2nd</option>
            <option value="537892528" ${participant[fieldMapping.suffix] ? (suffixList[participant[fieldMapping.suffix]] == 6 ? 'selected':'') : ''}>3rd</option>
        </select>
        `
};
  