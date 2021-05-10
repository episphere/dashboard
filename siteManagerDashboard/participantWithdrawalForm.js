import fieldMapping from './fieldToConceptIdMapping.js';
import { showAnimation, hideAnimation } from './utils.js';
import { getParticipationStatus } from './participantHeader.js';
import { renderParticipantSummary } from './participantSummary.js';
import { renderRefusalOptions, renderCauseOptions } from './participantWithdrawalRender.js';

export const renderParticipantWithdrawalLandingPage = () => {
    let template = ``;
    template = `        
                <div class="row">
                    <div class="col-lg">
                        <div class="row form-row">
                            <div>
                                <h4><b>Select all that apply</b></h4>
                        
                                <span><h6>Refusing specific activity or activities (limited participation)</h6></span>
                                <div style="position:relative; left:80px; top:2px;">
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="Baseline survey​" 
                                        data-optionKey=${fieldMapping.refusedSurvey} id="defaultCheck1">
                                        <label class="form-check-label" for="defaultCheck1">
                                            Baseline survey​
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="Baseline blood collection" 
                                        data-optionKey=${fieldMapping.refusedBlood} id="defaultCheck2">
                                        <label class="form-check-label" for="defaultCheck2">
                                            Baseline blood collection​
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="Baseline urine collection" 
                                        data-optionKey=${fieldMapping.refusedUrine} id="defaultCheck3">
                                        <label class="form-check-label" for="defaultCheck3">
                                            Baseline urine collection​
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="Baseline mouthwash collection​" 
                                        data-optionKey=${fieldMapping.refusedMouthwash} id="defaultCheck4">
                                        <label class="form-check-label" for="defaultCheck4">
                                            Baseline mouthwash collection​
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="Baseline specimen surveys" 
                                        data-optionKey=${fieldMapping.refusedSpecimenSurevys} id="defaultCheck5">
                                        <label class="form-check-label" for="defaultCheck5">
                                            Baseline specimen surveys
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="All future surveys (willing to do specimens)" 
                                        data-optionKey=${fieldMapping.refusedFutureSurveys} id="defaultCheck6">
                                        <label class="form-check-label" for="defaultCheck6">
                                            All future surveys (willing to do specimens)​
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="All future specimens (willing to do surveys)" 
                                        data-optionKey=${fieldMapping.refusedFutureSamples} id="defaultCheck7">
                                        <label class="form-check-label" for="defaultCheck7">
                                            All future specimens (willing to do surveys)
                                        </label>
                                    </div>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="options" type="checkbox" value="Refusing all future activities" 
                                    data-optionKey=${fieldMapping.refusedAllFutureActivities} id="defaultCheck8">
                                    <label class="form-check-label" for="defaultCheck8">
                                        Refusing all future activities​
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="options" type="checkbox" value="Revoke HIPAA authorization (no medical records)*​" 
                                    data-optionKey=${fieldMapping.revokeHIPAA} id="defaultCheck9">
                                    <label class="form-check-label" for="defaultCheck9">
                                        Revoke HIPAA authorization (no medical records)*​
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="options" type="checkbox" value="Withdraw consent*​" 
                                    data-optionKey=${fieldMapping.withdrawConsent} id="defaultCheck10">
                                    <label class="form-check-label" for="defaultCheck10">
                                        Withdraw consent*​
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="options" type="checkbox" value="Destroy data*​" 
                                    data-optionKey=${fieldMapping.destroyData} id="defaultCheck11">
                                    <label class="form-check-label" for="defaultCheck11">
                                            Destroy data*​
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="options" id = "messageCheckbox" type="checkbox" 
                                    data-optionKey=${fieldMapping.participantDeceased} value="Participant Deceased">
                                    <label class="form-check-label" for="defaultCheck12">
                                        Participant Deceased
                                    </label>
                                </div>
                                &nbsp;
                                <button type="button" data-toggle="modal" data-target="#modalShowSelectedData"
                                    class="btn btn-primary next-btn" id="nextFormPage" style="margin-top:40px;">Next</button>
 
                                </div>
                        </div>
                    </div>
                                <div class="col-lg">
                                    <div class="row form-row">
                                        <span> <b>
                                            SUPERVISOR USE ONLY​ <br />
                                            Suspend all contact on case until 
                                            DATE:​ MM/DD/YYYY </b> <br />
                                            <div class="form-group row">
                                            <label class="col-md-4 col-form-label">Month</label>
                                            <select id="UPMonth" class="form-control required-field col-md-4" data-error-required='Please select your month.'>
                                                <option class="option-dark-mode" value="">Select month</option>
                                                <option class="option-dark-mode" value="01">1 - January</option>
                                                <option class="option-dark-mode" value="02">2 - February</option>
                                                <option class="option-dark-mode" value="03">3 - March</option>
                                                <option class="option-dark-mode" value="04">4 - April</option>
                                                <option class="option-dark-mode" value="05">5 - May</option>
                                                <option class="option-dark-mode" value="06">6 - June</option>
                                                <option class="option-dark-mode" value="07">7 - July</option>
                                                <option class="option-dark-mode" value="08">8 - August</option>
                                                <option class="option-dark-mode" value="09">9 - September</option>
                                                <option class="option-dark-mode" value="10">10 - October</option>
                                                <option class="option-dark-mode" value="11">11 - November</option>
                                                <option class="option-dark-mode" value="12">12 - December</option>
                                            </select>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-md-4 col-form-label">Day</label>
                                            <select class="form-control required-field col-md-4" data-error-required='Please select your day.' id="UPDay"></select>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-md-4 col-form-label">Year</label>
                                            <input type="text" class="form-control required-field input-validation col-md-4" data-error-required='Please select your year.' data-validation-pattern="year" data-error-validation="Your year must contain four digits in the YYYY format." maxlength="4" id="UPYear" list="yearsOption" title="Birth year, must be in 1900s" Placeholder="Enter year">
                                            <datalist id="yearsOption"></datalist>
                                        </div>
                                        </span>
                                    </div>
                </div>`

        template += ` <div class="modal fade" id="modalShowSelectedData" data-keyboard="false" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content sub-div-shadow">
                <div class="modal-header" id="modalHeader"></div>
                <div class="modal-body" id="modalBody"></div>
            </div>
        </div>
    </div>`
    return template;

}


export const addEventMonthSelection = (month, day) => {
    const UPMonth = document.getElementById(month);
    UPMonth.addEventListener('change', () => {
        const value = UPMonth.value;

        let template = '<option class="option-dark-mode" value="">Select birth day</option>';

        if(value === '02'){
            for(let i = 1; i < 30; i++){
                template += `<option class="option-dark-mode" value=${i < 10 ? `0${i}`: `${i}`}>${i}</option>`
            }
        }
        if(value === '01' || value === '03' || value === '05' || value === '07' || value === '08' || value === '10' || value === '12'){
            for(let i = 1; i < 32; i++){
                template += `<option class="option-dark-mode" value=${i < 10 ? `0${i}`: `${i}`}>${i}</option>`
            }
        }
        if(value === '04' || value === '06' || value === '09' || value === '11'){
            for(let i = 1; i < 31; i++){
                template += `<option class="option-dark-mode" value=${i < 10 ? `0${i}`: `${i}`}>${i}</option>`
            }
        }

        document.getElementById(day).innerHTML = template;
    });
}

export const eventMonthSelection = () => {
    const UPMonth = document.getElementById('month');
    if (UPMonth) {
    UPMonth.addEventListener('change', () => {
        const value = UPMonth.value;
        let template = '<option class="option-dark-mode" value="">Select birth day</option>';

        if(value === '02'){
            for(let i = 1; i < 30; i++){
                template += `<option class="option-dark-mode" value=${i < 10 ? `0${i}`: `${i}`}>${i}</option>`
            }
        }
        if(value === '01' || value === '03' || value === '05' || value === '07' || value === '08' || value === '10' || value === '12'){
            for(let i = 1; i < 32; i++){
                template += `<option class="option-dark-mode" value=${i < 10 ? `0${i}`: `${i}`}>${i}</option>`
            }
        }
        if(value === '04' || value === '06' || value === '09' || value === '11'){
            for(let i = 1; i < 31; i++){
                template += `<option class="option-dark-mode" value=${i < 10 ? `0${i}`: `${i}`}>${i}</option>`
            }
        }

        document.getElementById('day').innerHTML = template;
    });
}
}

export const autoSelectOptions = () => {
    const a = document.getElementById('defaultCheck11');
    const b = document.getElementById('defaultCheck10');
    if (a) {
        a.addEventListener('change', function() {
            let checkedValue = document.getElementById('defaultCheck10');
            checkedValue.checked = true;
            let checkedValue1 = document.getElementById('defaultCheck9');
            checkedValue1.checked = true;
          });
    }
    if (b) {
        b.addEventListener('change', function() {
            let checkedValue1 = document.getElementById('defaultCheck9');
            checkedValue1.checked = true;
          });
    }
}

export const viewOptionsSelected = () => {
    const a = document.getElementById('nextFormPage');
        if (a) {
            a.addEventListener('click',  (  ) => { 
                const UPMonth = document.getElementById('UPMonth').value;
                const UPDay = document.getElementById('UPDay').value;
                const UPYear = document.getElementById('UPYear').value;
                let suspendDate = UPMonth +'/'+ UPDay +'/'+ UPYear
                optionsHandler(suspendDate);
            })
        }
}

const optionsHandler = (suspendDate) => {
    let retainOptions = []
    const header = document.getElementById('modalHeader');
    const body = document.getElementById('modalBody');
    let checkboxes = document.getElementsByName('options');
    header.innerHTML = `<h5>Options Selected</h5><button type="button" id="closeModal" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
    let template = '<div>'
    if (retainOptions.length === 0 && suspendDate === '//') {template += `<span><b>Select an option before proceeding!</b></span> <br />`}
    checkboxes.forEach(x => { 
        if (x.checked) {  
            retainOptions.push(x)
            template += `<span>${x.value}</span> <br />`}
    })
    if (suspendDate !== '//') template += `<span>Suspend all contact on case until ${suspendDate}</span> <br />`
    template += `
        <div style="display:inline-block; margin-top:20px;">
            ${(retainOptions.length === 0 && suspendDate === '//') ? 
                ` <button type="button" class="btn btn-primary" data-dismiss="modal" target="_blank" id="proceedFormPage" disabled>Confirm</button>`
            : ` <button type="button" class="btn btn-primary" data-dismiss="modal" target="_blank" id="proceedFormPage">Confirm</button>`
            }
            <button type="button" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
        </div>
    </div>`
    body.innerHTML = template;
    proceedToNextPage(retainOptions, suspendDate)
} 


export const proceedToNextPage = (retainOptions, suspendDate) => {
    const a = document.getElementById('proceedFormPage');
    if (a) {
        a.addEventListener('click',  () => { 
            let checkedValue = document.getElementById('messageCheckbox').checked
            ;
            checkedValue ? causeOfDeathPage(retainOptions) : reasonForRefusalPage(retainOptions, suspendDate);
        })
    }
}

const retainPreviouslySetOptions = (retainOptions) => {
   retainOptions &&  (
        retainOptions.forEach (x => { 
            let checkedValue = document.getElementById(x.id);
            checkedValue.checked = true;
        }))
}

export const reasonForRefusalPage = (retainOptions, suspendDate) => {
    let source = 'page1'
    let renderContent = document.getElementById('formMainPage');
    let template = ``;
    template += ` <div class="modal fade" id="modalShowFinalSelectedData" data-keyboard="false" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div class="modal-content sub-div-shadow">
                            <div class="modal-header" id="modalHeader"></div>
                            <div class="modal-body" id="modalBody"></div>
                        </div>
                    </div>
            </div>`

    template += renderRefusalOptions();
            

    renderContent.innerHTML =  template;
    document.getElementById('backToPrevPage').addEventListener('click', () => {
        renderContent.innerHTML = renderParticipantWithdrawalLandingPage();
        retainPreviouslySetOptions(retainOptions);
        addEventMonthSelection('UPMonth', 'UPDay');
        autoSelectOptions();
        viewOptionsSelected();
        proceedToNextPage();
    })
    document.getElementById('submit').addEventListener('click', () => {
        collectFinalResponse(retainOptions, source, suspendDate)
    })
 
}

export const causeOfDeathPage = (retainOptions) => {
    let source = 'page2'
    let renderContent = document.getElementById('formMainPage');
    let template = ``;
    template += ` <div class="modal fade" id="modalShowFinalSelectedData" data-keyboard="false" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div class="modal-content sub-div-shadow">
                            <div class="modal-header" id="modalHeader"></div>
                            <div class="modal-body" id="modalBody"></div>
                        </div>
                    </div>
            </div>`
    template += renderCauseOptions();
    renderContent.innerHTML =  template;
    addEventMonthSelection('page2Month', 'page2Day')
    document.getElementById('backToPrevPage').addEventListener('click', () => {
        renderContent.innerHTML = renderParticipantWithdrawalLandingPage(retainOptions);
        retainPreviouslySetOptions(retainOptions);
        autoSelectOptions();
        viewOptionsSelected();
        proceedToNextPage();
    })
    document.getElementById('submit').addEventListener('click', () => {
        const UPMonth = document.getElementById('page2Month').value;
        const UPDay = document.getElementById('page2Day').value;
        const UPYear = document.getElementById('page2Year').value;
        let suspendDate = UPMonth +'/'+ UPDay +'/'+ UPYear
        collectFinalResponse(retainOptions, source, suspendDate)
    })
 
}

const collectFinalResponse = (retainOptions, source, suspendDate) => {
    let finalOptions = []
    let checkboxes = document.getElementsByName('options');
    checkboxes.forEach(x => { if (x.checked) {  
        finalOptions.push(x)}
    })
    sendResponses(finalOptions, retainOptions, source, suspendDate);
}

const sendResponses = (finalOptions, retainOptions, source, suspendDate) => {
    let sendRefusalData = {};
    let highestStatus = [];
    sendRefusalData[fieldMapping.refusalOptions] = {};
    retainOptions.forEach(x => {
        switch (parseInt(x.dataset.optionkey)) {
            case fieldMapping.refusedSurvey:
            case fieldMapping.refusedBlood:
            case fieldMapping.refusedUrine:
            case fieldMapping.refusedMouthwash:
            case fieldMapping.refusedSpecimenSurevys:
            case fieldMapping.refusedSpecimenSurevys:
            case fieldMapping.refusedFutureSamples:
                sendRefusalData[fieldMapping.refusalOptions][x.dataset.optionkey] = fieldMapping.yes
                break;
            default:
                sendRefusalData[x.dataset.optionkey] = fieldMapping.yes
            }
    })
    if (suspendDate !== '//' && source !== 'page2') sendRefusalData[fieldMapping.suspendContact] = suspendDate
    source === 'page2' ? (
        combineResponses(finalOptions, sendRefusalData, suspendDate)
    ) : (
    finalOptions.forEach(x => {
        sendRefusalData[x.dataset.optionkey] = fieldMapping.yes
    }))
    if (retainOptions.length !== 0) sendRefusalData[fieldMapping.participationStatus] = computeScore(retainOptions, highestStatus);
    let refusalObj = sendRefusalData[fieldMapping.refusalOptions]
    if (JSON.stringify(refusalObj) === '{}') delete sendRefusalData[fieldMapping.refusalOptions]
    const token = localStorage.getItem("token");
    sendRefusalData['token'] = token;
    const siteKey = JSON.parse(localStorage.dashboard).siteKey
    clickHandler(sendRefusalData, siteKey, token);
}

const computeScore = (retainOptions, highestStatus) => {
    retainOptions.forEach(x => {
        switch (x.value) {
            case "Refusing all future activities":
                highestStatus.push(2)
                break;
            case "Revoke HIPAA authorization (no medical records)*":
                highestStatus.push(3)
                break;
            case "Withdraw consent*​":
                highestStatus.push(4)
                break;
            case "Destroy data*​":
                highestStatus.push(5)
                break;
            case "Participant Deceased":
                highestStatus.push(6)
                break;
            default:
                highestStatus.push(1)
            }
    })
    let participationStatusScore = Math.max(...highestStatus);
    return fieldMapping[participationStatusScore.toString()];
}

const combineResponses = (finalOptions, sendRefusalData, suspendDate) => {
    finalOptions.forEach(x => {
        sendRefusalData[fieldMapping.sourceOfDeath] = parseInt(x.dataset.optionkey) })
    if (suspendDate !== '//') sendRefusalData[fieldMapping.dateOfDeath] = suspendDate
}

async function clickHandler(sendRefusalData, siteKey, token) {

    showAnimation();
    const idToken = siteKey;

    const refusalPayload = {
        "data": sendRefusalData
    }
    const response = await (await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/dashboard?api=updateParticipantData`, {
        method:'POST',
        body: JSON.stringify(refusalPayload),
        headers:{
            Authorization:"Bearer "+idToken,
            "Content-Type": "application/json"
            }
    }))
    hideAnimation();
    if (response.status === 200) {
        const participantResponse = await (await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/dashboard?api=getParticipants&type=filter&token=${token}`, {
            method:'GET',
            headers:{
                Authorization:"Bearer "+idToken,
                "Content-Type": "application/json"
                }
        })).json()
        if (participantResponse.code === 200) {
            const loadDetailsPage = '#participantSummary'
            localStorage.setItem("participant", JSON.stringify(participantResponse.data[0]));
            location.replace(window.location.origin + window.location.pathname + loadDetailsPage); // updates url to participantSummary
    }}
       else { 
           (alert('Error'))
    }
}

