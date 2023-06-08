import fieldMapping from './fieldToConceptIdMapping.js';
import { render, renderParticipantDetails } from './participantDetails.js';
import { findParticipant, renderLookupResultsTable } from './participantLookup.js';
import { renderParticipantSummary } from './participantSummary.js';
import { appState } from './stateManager.js';
import { baseAPI, getDataAttributes, getIdToken, hideAnimation, showAnimation } from './utils.js';

export const allStates = {
    "Alabama":1,
    "Alaska":2,
    "Arizona":3,
    "Arkansas":4,
    "California":5,
    "Colorado":6,
    "Connecticut":7,
    "Delaware":8,
    "District of Columbia": 9,
    "Florida":10,
    "Georgia":11,
    "Hawaii":12,
    "Idaho":13,
    "Illinois":14,
    "Indiana":15,
    "Iowa":16,
    "Kansas":17,
    "Kentucky":18,
    "Louisiana":19,
    "Maine":20,
    "Maryland":21,
    "Massachusetts":22,
    "Michigan":23,
    "Minnesota":24,
    "Mississippi":25,
    "Missouri":26,
    "Montana":27,
    "Nebraska":28,
    "Nevada":29,
    "New Hampshire":30,
    "New Jersey":31,
    "New Mexico":32,
    "New York":33,
    "North Carolina":34,
    "North Dakota":35,
    "Ohio":36,
    "Oklahoma":37,
    "Oregon":38,
    "Pennsylvania":39,
    "Rhode Island":40,
    "South Carolina":41,
    "South Dakota":42,
    "Tennessee":43,
    "Texas":44,
    "Utah":45,
    "Vermont":46,
    "Virginia":47,
    "Washington":48,
    "West Virginia":49,
    "Wisconsin":50,
    "Wyoming":51,
    "NA": 52
}

const testAndVoicemailPermissionIds = [fieldMapping.canWeText, fieldMapping.voicemailMobile, fieldMapping.voicemailHome, fieldMapping.voicemailOther];

export const closeModal = () => {
    const modalClose = document.getElementById('modalShowMoreData');
    modalClose.querySelector('#closeModal').click();
};

const fieldValues = {     
    [fieldMapping.yes]: 'Yes',
    [fieldMapping.no]: 'No',
    [fieldMapping.jr]: 'Jr.',
    [fieldMapping.sr]: 'Sr.',
    [fieldMapping.one]: 'I',
    [fieldMapping.two]: 'II',
    [fieldMapping.three]: 'III',
    [fieldMapping.second]: '2nd',
    [fieldMapping.third]: '3rd',
    [fieldMapping.prefPhone]: 'Phone',
    [fieldMapping.email]: 'Email',
}

export const getFieldValues = (variableValue, conceptId) => {
    const phoneFieldValues = {
        [fieldMapping.cellPhone]: variableValue ? formatPhoneNumber(variableValue.toString()) : '',
        [fieldMapping.homePhone]: variableValue ? formatPhoneNumber(variableValue.toString()) : '',
        [fieldMapping.otherPhone]: variableValue ? formatPhoneNumber(variableValue.toString()) : '',
        'Change Login Phone': variableValue ? formatPhoneNumber(variableValue.toString()) : ''
    }

    if (variableValue in fieldValues){
        return fieldValues[variableValue];
    } else if (conceptId in phoneFieldValues){
        return phoneFieldValues[conceptId];
    } else {
        return variableValue ?? '';
    }
}

export const formatInputResponse = (participantValue) => {
    let ptValue = '';
    if (participantValue !== undefined) {
        ptValue  = participantValue.toString().replace(/\s+/g, "")
    }
    return ptValue;
};

export const formatPhoneNumber = (phoneNumber) => {
    if (/^\+1/.test(phoneNumber)) phoneNumber = phoneNumber.substring(2);
    return phoneNumber ? `${phoneNumber.substring(0,3)}-${phoneNumber.substring(3,6)}-${phoneNumber.substring(6,10)}` : '';
};
// export const formatPhoneNumber = (phoneNumber) => {
//     if (phoneNumber.startsWith('+1')) phoneNumber = phoneNumber.substring(2);
//     return phoneNumber ? `${phoneNumber.substring(0,3)}-${phoneNumber.substring(3,6)}-${phoneNumber.substring(6,10)}` : '';
// };

const isPhoneNumberInForm = (participant, changedOption, fieldMappingKey) => {
    return !!participant?.[fieldMappingKey] || !!changedOption?.[fieldMappingKey];
};

export const getImportantRows = (participant, changedOption) => {
    const isParticipantVerified = participant[fieldMapping.verifiedFlag] === fieldMapping.verified;
    const isCellPhonePresent = isPhoneNumberInForm(participant, changedOption, fieldMapping.cellPhone);
    const isHomePhonePresent = isPhoneNumberInForm(participant, changedOption, fieldMapping.homePhone);
    const isOtherPhonePresent = isPhoneNumberInForm(participant, changedOption, fieldMapping.otherPhone);
    const importantRowsArray = [ 
        { field: fieldMapping.lName,
            label: 'Last Name',
            editable: true,
            display: true,
            validationType: 'text',
            isRequired: true
        },
        { field: fieldMapping.fName,
            label: 'First Name',
            editable: true,
            display: true,
            validationType: 'text',
            isRequired: true
        },
        { field: fieldMapping.prefName,
            label: 'Preferred Name',
            editable: true,
            display: true,
            validationType: 'text',
            isRequired: false
        },
        { field: fieldMapping.mName,
            label: 'Middle Name',
            editable: true,
            display: true,
            validationType: 'text',
            isRequired: false
        },
        { field: fieldMapping.suffix,
            label: 'Suffix',
            editable: true,
            display: true,
            validationType: 'suffix',
            isRequired: false
        },
        { field: fieldMapping.cellPhone,
            label: 'Cell Phone',
            editable: true,
            display: true,
            validationType: 'phoneNumber',
            isRequired: false
        },
        { field: fieldMapping.canWeText,
            label: 'Can we text your mobile phone?',
            editable: isCellPhonePresent,
            display: true,
            validationType: 'permissionSelector',
            isRequired: false
        },
        { field: fieldMapping.voicemailMobile,
            label: 'Can we leave a voicemail at your mobile phone number?',
            editable: isCellPhonePresent,
            display: true,
            validationType: 'permissionSelector',
            isRequired: false
        },
        { field: fieldMapping.homePhone,
            label: 'Home Phone',
            editable: true,
            display: true,
            validationType: 'phoneNumber',
            isRequired: false
        },
        { field: fieldMapping.voicemailHome,
            label: 'Can we leave a voicemail at your home phone number?',
            editable: isHomePhonePresent,
            display: true,
            validationType: 'permissionSelector',
            isRequired: false
        },
        { field: fieldMapping.otherPhone,
            label: 'Other Phone',
            editable: true,
            display: true,
            validationType: 'phoneNumber',
            isRequired: false
        },
        { field: fieldMapping.voicemailOther,
            label: '   Can we leave a voicemail at your other phone number?',
            editable: isOtherPhonePresent,
            display: true,
            validationType: 'permissionSelector',
            isRequired: false
        },
        { field: fieldMapping.email,
            label: 'Preferred Email',
            editable: true,
            display: true,
            validationType: 'email',
            isRequired: true
        },
        { field: fieldMapping.email1,
            label: 'Additional Email 1',
            editable: true,
            display: true,
            validationType: 'email',
            isRequired: false
        },
        { field: fieldMapping.email2,
            label: 'Additional Email 2',
            editable: true,
            display: true,
            validationType: 'email',
            isRequired: false
        },
        { field: fieldMapping.address1,
            label: 'Address Line 1',
            editable: true,
            display: true,
            validationType: 'address',
            isRequired: true
        },
        { field: fieldMapping.address2,
            label: 'Address Line 2',
            editable: true,
            display: true,
            validationType: 'address',
            isRequired: false
        },
        { field: fieldMapping.city,
            label: 'City',
            editable: true,
            display: true,
            validationType: 'text',
            isRequired: true
        },
        { field: fieldMapping.state,
            label: 'State',
            editable: true,
            display: true,
            validationType: 'state',
            isRequired: true
        },
        { field: fieldMapping.zip,
            label: 'Zip',
            editable: true,
            display: true,
            validationType: 'zip',
            isRequired: true
        },
        { field: fieldMapping.birthMonth,
            label: 'Birth Month',
            editable: !isParticipantVerified,
            display: !isParticipantVerified,
            validationType: 'month',
            isRequired: true
        },
        { field: fieldMapping.birthDay,
            label: 'Birth Day',
            editable: !isParticipantVerified,
            display: !isParticipantVerified,
            validationType: 'day',
            isRequired: true
        },
        { field: fieldMapping.birthYear,
            label: 'Birth Year',
            editable: !isParticipantVerified,
            display: !isParticipantVerified,
            validationType: 'year',
            isRequired: true
        } ,
        { field: 'Connect_ID',
            label: 'Connect ID',
            editable: false,
            display: true,
            validationType: 'none',
            isRequired: true
        },
    ];

    const loginChangeInfoArray = [
        // { field: `Change Login Mode`,
        //     label: 'Change Login Mode',
        //     editable: true,
        //     display: true,
        //     validationType: 'none'
        // },
        { field: `Change Login Email`,
            label: 'Change Login Email',
            editable: true,
            display: appState.getState().loginMechanism.email,
            validationType: 'none'
        },
        { field: `Change Login Phone`,
            label: 'Change Login Phone',
            editable: true,
            display:  appState.getState().loginMechanism.phone,
            validationType: 'none'
        }
    ];

    const userLoginEmail = appState.getState().userSession?.email ?? '';
    const permDomains = /(nih.gov|norc.org)$/i;
    permDomains.test(userLoginEmail.split('@')[1]) &&
    importantRowsArray.push(...loginChangeInfoArray);

    return importantRowsArray; 
};

/**
 * Determine whether a phone number is present in the form or in the changed options.
 * A phone number is present if:
 *  - it is present in the participant object or the changedOption object
 *  - AND it is not an empty string in the changedOption object (empty string in changedOption means the user is trying to delete the phone number)
 *  - AND the conceptId is not the same as the phoneType (conceptId is the field name being changed, phoneType is the field being checked see: getRequiredField())
 * This is used for validating phone number updates:
 * If no number is present, require a phone number before allowing user to submit the update
 * If a number is present, allow user to submit the update
 */
function isPhoneNumberPresent(participant, changedOption, conceptId, phoneType) {
    return (participant[phoneType] || changedOption[phoneType]) && changedOption[phoneType] !== '' && conceptId != phoneType;
}

export const getIsEmail = (participantSignInMechanism) => {
    return participantSignInMechanism === 'password' || participantSignInMechanism === fieldMapping.signInPassword || participantSignInMechanism === 'passwordAndPhone';
};

export const getIsPhone = (participantSignInMechanism) => {
    return participantSignInMechanism === 'phone' || participantSignInMechanism === fieldMapping.signInPhone || participantSignInMechanism === 'passwordAndPhone';
};

/**
 * Get whether a field is required or not
 * Automatically required fields: fName, lName, birthMonth, birthYear, birthDay, prefEmail, addressLine1, city, state, zip.
 * Make sure automatically required fields are present
 * Additional requirement: at least one phone number must be present.
 * If user is editing phone numbers, don't allow all of them to be empty (make at least one required)
 */
const getIsRequiredField = (participant, changedOption, newValueElement, conceptId) => {
    const isRequiredFieldArray = getImportantRows(participant, changedOption)
        .filter(row => row.isRequired === true)
        .map(row => row.field);

    if (isRequiredFieldArray.includes(parseInt(conceptId))) {
        return true;
    };

    if (!newValueElement.value && (conceptId == fieldMapping.cellPhone || conceptId == fieldMapping.homePhone || conceptId == fieldMapping.otherPhone)) {
        const isCellPhonePresent = isPhoneNumberPresent(participant, changedOption, conceptId, fieldMapping.cellPhone);
        const isHomePhonePresent = isPhoneNumberPresent(participant, changedOption, conceptId, fieldMapping.homePhone);
        const isOtherPhonePresent = isPhoneNumberPresent(participant, changedOption, conceptId, fieldMapping.otherPhone);
        return !(isCellPhonePresent || isHomePhonePresent || isOtherPhonePresent);
    }
};

/**
 * get a user-friendly label for the modal
 * @param {string} participantKey - the participant key (existing data structure) from the participant form 
 * @returns - user-friendly label for the modal
 */
export const getModalLabel = (participantKey) => {
    const labels = {
        LastName: 'Last Name',
        FirstName: 'First Name',
        MiddleName: 'Middle Name',
        PreferredName: 'Preferred Name',
        BirthMonth: 'Birth Month',
        BirthDay: 'Birth Day',
        BirthYear: 'Birth Year',
        Mobilephone: 'Mobile Phone',
        Text: 'Do we have permission to text this number',
        Mobilevoicemail: 'Do we have permission to leave a voicemail at this number',
        Homephone: 'Home Phone',
        Homevoicemail: 'Do we have permission to leave a voicemail at this number',
        Otherphone: 'Other Phone',
        Othervoicemail: 'Do we have permission to leave a voicemail at this number',
        Preferredemail: 'Preferred Email',
        Additionalemail1: 'Additional Email 1',
        Additionalemail2: 'Additional Email 2',
        Addressline1: 'Address Line 1',
        Addressline2: 'Address Line 2',
    };

    return labels[participantKey] || participantKey;
};

export const hideUneditableButtons = (participant, changedOption) => {
    const importantRows = getImportantRows(participant, changedOption);
    importantRows.forEach(row => {
        if (!row.editable) {
            const element = document.getElementById(`${row.field}button`);
            if (element) {
                element.style.display = 'none';
            }
        };
    })
};

export const reloadParticipantData = async (token, bearerToken) => {
    showAnimation();
    const query = `token=${token}`
    const reloadedParticpant = await findParticipant(query);
    mainContent.innerHTML = render(reloadedParticpant.data[0]);
    renderParticipantDetails(reloadedParticpant.data[0], {}, bearerToken);
    hideAnimation();
}

export const removeCamelCase = (participantKey) => {
    let s = participantKey
    s = s.replace(/([A-Z])/g, ' $1').trim()
    return s;
};

export const renderReturnSearchResults = () => {
    const searchResultsButton = document.getElementById('displaySearchResultsBtn');
    if (searchResultsButton) {
        searchResultsButton.addEventListener('click', () => {
            //renderParticipantLookup()
            renderLookupResultsTable();
        })
}};

export const resetChanges = (participant, originalHTML, bearerToken) => {
    const a = document.getElementById("cancelChanges");
    let template = '';
    a.addEventListener("click", () => {
        if ( appState.getState().unsavedChangesTrack.saveFlag === false ) {
            mainContent.innerHTML = originalHTML;
            renderParticipantDetails(participant, {}, bearerToken);
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

export const refreshParticipantAfterUpdate = async (participant, bearerToken) => {
    showAnimation();
    localStorage.setItem('participant', JSON.stringify(participant));
    renderParticipantDetails(participant, {}, bearerToken);
    appState.setState({unsavedChangesTrack:{saveFlag: false, counter: 0}})
    let alertList = document.getElementById('alert_placeholder');
    let template = '';
    template += `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                    Success! Changes Saved.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>`
    hideAnimation();
    alertList.innerHTML = template;
}

/**
 * Creates payload to be sent to backend and update the UI. Maps the field name back to concept id along with new responses.
 * Updates the UI with the new responses.
 * @param {object} participant - the participant being updated 
 * @param {object} changedOption - object containing the participant's updated data points
 * @param {HTMLElement} editedElement - the currently edited HTML element
 */
export const saveResponses = (participant, changedOption, editedElement, conceptId) => {
    let conceptIdArray = [];
    const a = document.getElementById('formResponse')
    a.addEventListener('submit', e => {
        e.preventDefault()
        const modifiedData = getDataAttributes(document.getElementById(`fieldModified${conceptId}`));
        conceptIdArray.push(modifiedData.fieldconceptid);

        const newValueElement = document.getElementById(`newValue${conceptId}`);     
        const dataValidationType = getImportantRows(participant, changedOption).find(row => row.field == modifiedData.fieldconceptid).validationType;
        const currentConceptId = conceptIdArray[conceptIdArray.length - 1];
        const isRequired = getIsRequiredField(participant, changedOption, newValueElement, currentConceptId);
        
        if (newValueElement.value != participant[currentConceptId] || testAndVoicemailPermissionIds.includes(parseInt(currentConceptId))) {
            const newValueIsValid = validateNewValue(newValueElement, dataValidationType, isRequired);

            if (newValueIsValid) {
                changedOption[currentConceptId] = newValueElement.value;
                // if a changed field is a date of birth field then we need to update full date of birth  
                if (fieldMapping.birthDay in changedOption || fieldMapping.birthMonth in changedOption || fieldMapping.birthYear in changedOption) {
                    const day =  changedOption[fieldMapping.birthDay] || participant[fieldMapping.birthDay];
                    const month = changedOption[fieldMapping.birthMonth] || participant[fieldMapping.birthMonth];
                    const year = changedOption[fieldMapping.birthYear] || participant[fieldMapping.birthYear];
                    const dateOfBirthComplete = fieldMapping.dateOfBirthComplete;
                    conceptIdArray.push(dateOfBirthComplete);
                    changedOption[currentConceptId] =  year + month.padStart(2, '0')+ day.padStart(2, '0') ;
                }

                updateUIValues(editedElement, newValueElement.value, conceptIdArray);
                closeModal();
            };
        } else {
            showAlreadyExistsNoteInModal();
        }    
    });
};

/**
 * update the UI after user edits a field
 * @param {HTMLElement} editedElement - the element that was edited
 * @param {string} newValue - the new value of the element
 * @param {string[]} conceptIdArray - the concept id of the element, used for checking how to format the user's input
 * update UI with a reminder to save changes, check for existing reminder so the message doesn't duplicate in a field
 * toggle phone permission buttons if the user edits a phone number
 */
const updateUIValues = (editedElement, newValue, conceptIdArray) => {
    const updatedEditValue = editedElement.querySelectorAll("td")[0];
    updatedEditValue.textContent = getUITextForUpdatedValue(newValue, conceptIdArray);
    const nextSiblingButton = updatedEditValue.nextElementSibling;
    if (!nextSiblingButton.innerHTML.includes("Please save changes")) {
        nextSiblingButton.innerHTML = `${nextSiblingButton.innerHTML}<br><br><i>Please save changes<br>before exiting the page</i>`;
    }
    updatedEditValue.parentNode.style.backgroundColor = "#FFFACA";
    if (conceptIdArray.some(id => [fieldMapping.cellPhone.toString(), fieldMapping.homePhone.toString(), fieldMapping.otherPhone.toString()].includes(id.toString()))) {
        togglePhonePermissionButtonsAndText(newValue, conceptIdArray);
    }
};

/**
 * Handle suffix text and phone permission text -> convert concept id to text
 */
const getUITextForUpdatedValue = (newValue, conceptIdArray) => {
    if (conceptIdArray.toString().includes(fieldMapping.suffix.toString())) {
        return suffixToTextMap.get(parseInt(newValue));
    } else if (conceptIdArray.some(id => [fieldMapping.canWeText.toString(), fieldMapping.voicemailMobile.toString(), fieldMapping.voicemailHome.toString(), fieldMapping.voicemailOther.toString()].includes(id.toString()))) {
        if (newValue == fieldMapping.yes) {
            return 'Yes';
        } else if (newValue == fieldMapping.no) {
            return 'No';
        } else {
            return '';
        }
    } else {
        return newValue;
    }
};

const phoneTypeToPermissionsMapping = {
    [fieldMapping.cellPhone]: [fieldMapping.voicemailMobile, fieldMapping.canWeText],
    [fieldMapping.homePhone]: [fieldMapping.voicemailHome],
    [fieldMapping.otherPhone]: [fieldMapping.voicemailOther]
};

/**
 * Toggle the phone permission edit buttons based on whether the phone number exists
 * if phone number exists, show the permission button(s) and prompt user to enter permissions
 * permission buttons: voicemailMobile, canWeText (mobile only), voicemailHome, voicemailOther
 * if phone number does not exist and this function triggers, this means user just deleted the phone number. Hide the relevant permission button(s)
 * @param {string} newValue - the new value entered by the user 
 * @param {Array<string>} conceptIdArray - the concept id of the element 
 */
const togglePhonePermissionButtonsAndText = (newValue, conceptIdArray) => {
    const displayStatus = validPhoneNumberFormat.test(newValue) ? 'block' : 'none';
    for (const phoneType in phoneTypeToPermissionsMapping) {
        if (conceptIdArray.includes(phoneType.toString())) {
            phoneTypeToPermissionsMapping[phoneType].forEach(valueType => {
                const button = document.getElementById(`${valueType}button`);
                if (button) {
                    button.style.display = displayStatus;
                    if (displayStatus === 'block') {
                        const noteField = document.getElementById(`${valueType}note`);
                        if (noteField) {
                            noteField.parentNode.parentNode.style.backgroundColor = "yellow";
                            noteField.style.display = "block";
                            noteField.innerHTML = `<i style="color:red;"><u>IMPORTANT:</u><br>*Please confirm member's contact permission*</i>`;
                        }
                    } else {
                        const valueField = document.getElementById(`${valueType}value`);
                        if (valueField) {
                            valueField.textContent = '';
                        }
                    }
                };
            }); 
            break;
        }
    }
};

export const showSaveNoteInModal = (conceptId) => {
    const a = document.getElementById(`newValue${conceptId}`);
    if (a) {
        a.addEventListener('click', () => {
            const b = document.getElementById('showNote');
            b.innerHTML = `After 'Submit' you must scroll down and click 'Save Changes' at bottom of screen for your changes to be saved.`
        });
    }
};

export const showAlreadyExistsNoteInModal = () => {
    document.getElementById('showNote').innerHTML = `This value already exists. Please enter a different value or choose 'cancel'.<br>`;
};

export const suffixList = { 612166858: 0, 255907182: 1, 226924545: 2, 270793412: 3, 959021713: 4, 643664527: 5, 537892528: 6 };

export const suffixToTextMap = new Map([
    [612166858, 'Jr.'],
    [255907182, 'Sr.'],
    [226924545, 'I'],
    [270793412, 'II'],
    [959021713, 'III'],
    [643664527, '2nd'],
    [537892528, '3rd'],
  ]);

export const removeAllErrors = () => {
    document.getElementById('showError').style.display = 'none';
}

export const errorMessage = (msg, editedElement) => {
    const showError = document.getElementById('showError');
    showError.innerHTML = `<p style="color: red; font-style: bold; font-size: 16px;">${msg}</p>`;
    showError.style.display = 'block';
    if(focus) editedElement.focus();
}

/**
 * Route new value to the correct validation function based on the value type
 * @param {HTMLElement} newValueElement - the element that was edited
 * @param {string} newValueType - the type of value that was edited
 * @param {boolean} isRequired - whether the value is required or optional
 */
const validateNewValue = (newValueElement, newValueType, isRequired) => {
    let isValid = false;
    switch (newValueType) {
        case 'address':
            isValid = validateAddress(newValueElement, isRequired);
            break;
        case 'day':
            isValid = validateDay(newValueElement, isRequired);
            break;
        case 'email':
            isValid = validateEmail(newValueElement, isRequired);
            break;
        case 'month':
            isValid = validateMonth(newValueElement, isRequired);
            break;
        case 'phoneNumber':
            isValid = validatePhoneNumber(newValueElement, isRequired);
            break;
        case 'text':
            isValid = validateText(newValueElement, isRequired);
            break;    
        case 'year':
            isValid = validateYear(newValueElement, isRequired);
            break;
        case 'zip':
            isValid = validateZip(newValueElement, isRequired);
            break;
        case 'none':
        case 'permissionSelector':  
        case 'state':
        case 'suffix':
            isValid = true;
            break;
        default:
            console.error('Error: Invalid value type in validateNewValue function.');
            break;
    }
    return isValid;
};

export const validateAddress = (addressLineElement, isRequired) => {
    removeAllErrors();

    if (isRequired && !addressLineElement.value) {
        errorMessage('Error: Please enter a value.', addressLineElement);
        return false;
    }
    
    return true;
};

export const validateDay = (dayElement) => {
    removeAllErrors();
    const day = dayElement.value;
    if (!day || day < 1 || day > 31) {
        errorMessage('Error: Must be a valid day 01-31. Please try again.', dayElement);
        return false;
    }
    return true;
};

export const validateEmail = (emailElement, isRequired) => {
    removeAllErrors();
    if (isRequired && !emailElement.value) {
        errorMessage('Error: This field is required. Please enter a value.', emailElement);
        return false;
    }
    
    if (emailElement.value && !validEmailFormat.test(emailElement.value)) {
        errorMessage('Error: The email address format is not valid. Please enter an email address in this format: name@example.com.', emailElement);
        return false;
    }
    return true;
};

export const validateMonth = (monthElement) => {
    removeAllErrors();
    const month = monthElement.value;
    if (!month || month < 1 || month > 12) {
        errorMessage('Error: Must be a valid month 01-12. Please try again.', monthElement);
        return false;
    }
    return true;
};

export const validateText = (textElement, isRequired) => {
    removeAllErrors();

    if (isRequired && !textElement.value) {
        errorMessage('Error: This field is required. Please enter a value.', textElement);
        return false;
    }

    if (textElement.value) {
        if (!validNameFormat.test(textElement.value)) {
            errorMessage('Error: Only Letters dashes, parenthesis, and some special characters are allowed. Please try again.', textElement);
            return false;
        }
    }
    return true;
};

export const validatePhoneNumber = (phoneNumberElement, isRequired) => {
    removeAllErrors();
    if (isRequired && !phoneNumberElement.value) {
        errorMessage('At least one phone number is required. Please enter a 10-digit phone number. Example: 9999999999.', phoneNumberElement);
        return false;
    }

    if (phoneNumberElement.value) {
        if (!validPhoneNumberFormat.test(phoneNumberElement.value)) {
            errorMessage('Please enter a 10-digit phone number with no punctuation. Example: 9999999999.', phoneNumberElement);
            return false;
        }
    }
    return true;
}

export const validateYear = (yearElement) => {
    removeAllErrors();
    const year = yearElement.value;
    const currentYear = new Date().getFullYear();
    if (!year || year < 1900 || year > currentYear) {
        errorMessage(`Error: Must be a valid year 1900-${currentYear}. Please try again.`, yearElement);
        return false;
    }
    return true;
};

export const validateZip = (zipElement) => {
    removeAllErrors();
    const zip = zipElement.value;
    const zipRegExp = /[0-9]{5}/;
    if (!zip || !zipRegExp.test(zip)) {
        errorMessage('Error: Must be 5 digits. Please try again.', zipElement);
        return false;
    }
    return true;
};

// These match validations RegExps in connectApp -> shared.js
export const validEmailFormat = /^[a-zA-Z0-9.!#$%&'*+"\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,63}$/;
export const validNameFormat = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-.]+$/i;
export const validPhoneNumberFormat =
  /^[\+]?(?:1|1-|1\.|1\s+)?[(]?[0-9]{3}[)]?(?:-|\s+|\.)?[0-9]{3}(?:-|\s+|\.)?[0-9]{4}$/;

export const viewParticipantSummary = (participant) => {
    const a = document.getElementById('viewSummary');
    if (a) {
        a.addEventListener('click',  () => {  
            renderParticipantSummary(participant);
        })
    }
}

const cleanPhoneNumber = (changedOption) => {
    const phoneNumbers = [fieldMapping.cellPhone, fieldMapping.homePhone, fieldMapping.otherPhone];
    phoneNumbers.forEach(phoneNumber => {
        if (phoneNumber in changedOption) {
            changedOption[phoneNumber] = changedOption[phoneNumber].replace(/\D/g, '');
        }
    });
    return changedOption;

};

/**
 * Process the user's update and submit the new user data to the database.
 * if participant is verified, fetch logged in admin's email (the person processing the edit) to attach to the user's history update
 * If successful, update the participant object in local storage.
 * Else, alert the user that the update was unsuccessful.
 * @param {object} participant - the existing participant object 
 * @param {object} changedOption - the changed user data
 * @param {string} bearerToken - the site key to pass to the POST request 
 */
export const submitClickHandler = async (participant, changedOption, bearerToken) => {
    const isParticipantVerified = participant[fieldMapping.verifiedFlag] == fieldMapping.verified;
    const adminEmail = appState.getState().userSession?.email ?? '';
    const submitButtons = document.getElementsByClassName('updateMemberData');
    for (const button of submitButtons) {
        button.addEventListener('click', async (e) => {
            if (Object.keys(changedOption).length === 0) {
                alert('No changes to submit. No changes have been made. Please update the form and try again if changes are needed.');
            } else {
                const { changedUserDataForProfile, changedUserDataForHistory } = findChangedUserDataValues(changedOption, participant);
                const isSuccess = processUserDataUpdate(changedUserDataForProfile, changedUserDataForHistory, participant[fieldMapping.userProfileHistory], participant.state.uid, adminEmail, isParticipantVerified);
                if (isSuccess) {
                    const updatedParticipant = { ...participant, ...changedUserDataForProfile};
                    await refreshParticipantAfterUpdate(updatedParticipant, bearerToken);
                } else {
                    alert('Error: There was an error processing your changes. Please try again.');
                }
            }
        });
    }
};

  /**
 * Iterate the new values, compare them to existing values, and return the changed values.
 * write an empty string to firestore if the history value is null/undefined/empty --per spec on 05-09-2023
 * write an empty string to firestore if the profile value is null/undefined/empty --per spec on 05-09-2023
 * @param {object} newUserData - the newly entered form fields
 * @param {object} existingUserData - the existing user profile data
 * @returns {changedUserDataForProfile, changedUserDataForHistory} - parallel objects containing the changed values
 * Contact information requires special handling because of the preference selectors
 *   if the user is changing their cell phone number, we need to update the canWeVoicemailMobile and canWeText values
 *   the same is true for homePhone and otherPhone (canWeVoicemailHome and canWeVoicemailOther)
 *   if user deletes a number, set canWeVoicemail and canWeText to '' (empty string) --per spec on 05-09-2023
 *   if user updates a number, ensure the canWeVoicemail and canWeText values are set. Use previous values as fallback.
 *   Update: 05-26-2023 do not include email addresses in user profile archiving. Exclude those keys from the history object
*/
const findChangedUserDataValues = (newUserData, existingUserData) => {
    const changedUserDataForProfile = {};
    const changedUserDataForHistory = {};
    const excludeHistoryKeys = [fieldMapping.email, fieldMapping.email1, fieldMapping.email2];

    newUserData = cleanPhoneNumber(newUserData);
    Object.keys(newUserData).forEach(key => {
      if (newUserData[key] !== existingUserData[key]) {
        changedUserDataForProfile[key] = newUserData[key] ?? '';
        if (!excludeHistoryKeys.includes(key)) {
            changedUserDataForHistory[key] = existingUserData[key] ?? '';
        }
      }
    });
  
    if (fieldMapping.cellPhone in changedUserDataForProfile) {
        if (!newUserData[fieldMapping.cellPhone]) {
            changedUserDataForProfile[fieldMapping.voicemailMobile] = '';
            changedUserDataForProfile[fieldMapping.canWeText] = '';
        } else {
            changedUserDataForProfile[fieldMapping.voicemailMobile] = newUserData[fieldMapping.voicemailMobile] ?? existingUserData[fieldMapping.voicemailMobile] ?? fieldMapping.no;
            changedUserDataForProfile[fieldMapping.canWeText] = newUserData[fieldMapping.canWeText] ?? existingUserData[fieldMapping.canWeText] ?? fieldMapping.no;
        }
        changedUserDataForHistory[fieldMapping.voicemailMobile] = existingUserData[fieldMapping.voicemailMobile] ?? fieldMapping.no;
        changedUserDataForHistory[fieldMapping.canWeText] = existingUserData[fieldMapping.canWeText] ?? fieldMapping.no;
    }

    if (fieldMapping.homePhone in changedUserDataForProfile) {
        if (!newUserData[fieldMapping.homePhone]) {
            changedUserDataForProfile[fieldMapping.voicemailHome] = '';
        } else {
            changedUserDataForProfile[fieldMapping.voicemailHome] = newUserData[fieldMapping.voicemailHome] ?? existingUserData[fieldMapping.voicemailHome] ?? fieldMapping.no;
        }
        changedUserDataForHistory[fieldMapping.voicemailHome] = existingUserData[fieldMapping.voicemailHome] ?? fieldMapping.no;
    }

    if (fieldMapping.otherPhone in changedUserDataForProfile) {
        if (!newUserData[fieldMapping.otherPhone]) {
            changedUserDataForProfile[fieldMapping.voicemailOther] = '';
        } else {
            changedUserDataForProfile[fieldMapping.voicemailOther] = newUserData[fieldMapping.voicemailOther] ?? existingUserData[fieldMapping.voicemailOther] ?? fieldMapping.no;
        }
        changedUserDataForHistory[fieldMapping.voicemailOther] = existingUserData[fieldMapping.voicemailOther] ?? fieldMapping.no;
    }

return { changedUserDataForProfile, changedUserDataForHistory };
};

/**
 * Check whether changes were made to the user profile. If so, update the user profile and history.
 * Only write the history portion if the user is verified. Do not write history if the user is not verified.
 * Specifically, don't write history if the submittedFlag is true but participant[fieldMapping.verifiedFlag] !== fieldMapping.verified.
 * Updated requirement 05/25/2023: do not write emails (prefEmail, additionalEmail1, additionalEmail2) to user history
 * @param {object} changedUserDataForProfile - the changed values to be written to the user profile
 * @param {object} changedUserDataForHistory  - the previous values to be written to history.
 * @param {object} userHistory - the user's existing history
 * @param {string} type - the type of data being changed (e.g. name, contact info, mailing address, log-in email)
 * @returns {boolean} - whether the write operation was successful to control the UI messaging
 */
const processUserDataUpdate = async (changedUserDataForProfile, changedUserDataForHistory, userHistory, participantUID, adminEmail, isParticipantVerified) => {
        if (isParticipantVerified) {
            changedUserDataForProfile[fieldMapping.userProfileHistory] = updateUserHistory(changedUserDataForHistory, userHistory, adminEmail);
        }
        changedUserDataForProfile['uid'] = participantUID;
        await postUserDataUpdate(changedUserDataForProfile)
        .catch(function (error) {
            console.error('Error writing document (postUserDataUpdate) ', error);
            return false;
        });
        return true;
};
  
/**
 * Update the user's history based on new data entered by the user. This only triggers if the user's profile is verified.
 * Prepare it for POST to user's proifle in firestore
 * This routine runs once per form submission.
 * First, check for user history and add it to the userProfileHistoryArray.
 * Next, create a new map of the user's changes and add it to the userProfileHistoryArray with a timestamp
 * @param {array of objects} existingDataToUpdate - the existingData to write to history (parallel data structure to newDataToWrite)
 * @param {array of objects} userHistory - the user's existing history
 * @returns {userProfileHistoryArray} -the array of objects to write to user profile history, with the new data added to the end of the array
 */
const updateUserHistory = (existingDataToUpdate, userHistory, adminEmail) => {
    const userProfileHistoryArray = [];
    if (userHistory && Object.keys(userHistory).length > 0) userProfileHistoryArray.push(...userHistory);

    const newUserHistoryMap = populateUserHistoryMap(existingDataToUpdate, adminEmail);
    if (newUserHistoryMap && Object.keys(newUserHistoryMap).length > 0) {
        userProfileHistoryArray.push(newUserHistoryMap);
    }

    return userProfileHistoryArray;
};

const populateUserHistoryMap = (existingData, adminEmail) => {
    const userHistoryMap = {};
    const keys = [
        fieldMapping.fName,
        fieldMapping.mName,
        fieldMapping.lName,
        fieldMapping.suffix,
        fieldMapping.prefName,
        fieldMapping.birthDay,
        fieldMapping.birthMonth,
        fieldMapping.birthYear,
        fieldMapping.dateOfBirthComplete,
        fieldMapping.cellPhone,
        fieldMapping.voicemailMobile,
        fieldMapping.canWeText,
        fieldMapping.homePhone,
        fieldMapping.voicemailHome,
        fieldMapping.otherPhone,
        fieldMapping.voicemailOther,
        fieldMapping.address1,
        fieldMapping.address2,
        fieldMapping.city,
        fieldMapping.state,
        fieldMapping.zip,
    ];

    keys.forEach((key) => {
        existingData[key] != null && (userHistoryMap[key] = existingData[key]);
    });

    if (existingData[fieldMapping.cellPhone] != null) {
        userHistoryMap[fieldMapping.voicemailMobile] = existingData[fieldMapping.voicemailMobile];
        userHistoryMap[fieldMapping.canWeText] = existingData[fieldMapping.canWeText];
    }

    if (existingData[fieldMapping.homePhone] != null) {
        userHistoryMap[fieldMapping.voicemailHome] = existingData[fieldMapping.voicemailHome];
    }

    if (existingData[fieldMapping.otherPhone] != null) {
        userHistoryMap[fieldMapping.voicemailOther] = existingData[fieldMapping.voicemailOther];
    }

    if (Object.keys(userHistoryMap).length > 0) {
        userHistoryMap[fieldMapping.userProfileUpdateTimestamp] = new Date().toISOString();
        userHistoryMap[fieldMapping.profileChangeRequestedBy] = adminEmail;
        return userHistoryMap;
    } else {
        return null;
    }
};

export const postUserDataUpdate = async (changedUserData) => {
    try {
        const idToken = await getIdToken();
        const response = await fetch(`${baseAPI}/dashboard?api=updateParticipantDataNotSite`, {
            method: "POST",
            headers:{
                Authorization: "Bearer " + idToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(changedUserData)
        });

        if (!response.ok) { 
            const error = (response.status + ": " + (await response.json()).message);
            throw new Error(error);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error in postUserDataUpdate:', error);
        throw error;
    }
}
