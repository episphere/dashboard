import fieldMapping from './fieldToConceptIdMapping.js';
import { showAnimation, hideAnimation } from './utils.js';
import { getParticipationStatus } from './participantHeader.js';

export const renderParticipantWithdrawalLandingPage = (participant) => {
    localStorage.setItem('token', participant.token)
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
                  ${participant[fieldMapping.participationStatus] === fieldMapping.noRefusal ?
                                (`<button type="button" data-toggle="modal" data-target="#modalShowSelectedData"
                                    class="btn btn-primary next-btn" id="nextFormPage" style="margin-top:40px;">Next</button>`)
                                    : 
                                (`<button type="button" class="btn btn-secondary" disabled>Next</button>`)
                    }    
                                </div>
                        </div>
                    </div>
                                <div class="col-lg">
                                    <div class="row form-row">
                                        <span> <b>
                                            SUPERVISOR USE ONLY​ <br />
                                            Suspend all contact on case until 
                                            DATE:​ MM/DD/YYYY </b> <br />
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
                optionsHandler();
            })
        }
}

const optionsHandler = () => {
    let retainOptions = []
    const header = document.getElementById('modalHeader');
    const body = document.getElementById('modalBody');
    let checkboxes = document.getElementsByName('options');
    header.innerHTML = `<h5>Options Selected</h5><button type="button" id="closeModal" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
    let template = '<div>'
    checkboxes.forEach(x => { 
        if (x.checked) {  
            retainOptions.push(x)
            template += `<span>${x.value}</span> <br />`}
    })
    if (retainOptions.length === 0) {template += `<span><b>Select an option before proceeding!</b></span> <br />`}
    template += `
        <div style="display:inline-block; margin-top:20px;">
            ${(retainOptions.length === 0) ? 
                ` <button type="button" class="btn btn-primary" data-dismiss="modal" target="_blank" id="proceedFormPage" disabled>Confirm</button>`
            : ` <button type="button" class="btn btn-primary" data-dismiss="modal" target="_blank" id="proceedFormPage">Confirm</button>`
            }
            <button type="button" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
        </div>
    </div>`
    body.innerHTML = template;
    proceedToNextPage(retainOptions)
} 


export const proceedToNextPage = (retainOptions) => {
    const a = document.getElementById('proceedFormPage');
    if (a) {
        a.addEventListener('click',  () => { 
            let checkedValue = document.getElementById('messageCheckbox').checked
            checkedValue ? causeOfDeathPage(retainOptions) : reasonForRefusalPage(retainOptions);
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

export const reasonForRefusalPage = (retainOptions) => {
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

    template += `
            <div>
                    <span><h6>Reason for refusal/withdrawal (select all that apply):​</h6></span>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m no longer interested in the study​" name="options" 
                        id="defaultCheck1">
                        <label class="form-check-label" for="defaultCheck1">
                            I’m no longer interested in the study​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m too busy/the study takes too much time​" name="options" 
                        data-optionKey=${fieldMapping.tooBusy} id="defaultCheck2">
                        <label class="form-check-label" for="defaultCheck2">
                            I’m too busy/the study takes too much time​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m concerned about my privacy​" name="options" 
                        data-optionKey=${fieldMapping.concernedAboutPrivacy} id="defaultCheck3">
                        <label class="form-check-label" for="defaultCheck3">
                            I’m concerned about my privacy​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m not able to complete the study activities online" name="options" 
                        data-optionKey=${fieldMapping.concernedAboutPrivacy} id="defaultCheck4">
                        <label class="form-check-label" for="defaultCheck4">
                            I’m not able to complete the study activities online
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t want to participate in the study for other reasons" name="options" id="defaultCheck5">
                        <label class="form-check-label" for="defaultCheck5">
                            I don’t want to participate in the study for other reasons
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I think the incentive or benefit to participate is not great enough" name="options" 
                        data-optionKey=${fieldMapping.participantGreedy} id="defaultCheck6">
                        <label class="form-check-label" for="defaultCheck6">
                            I think the incentive or benefit to participate is not great enough
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m too sick/my health is too poor to participate" name="options" 
                        data-optionKey=${fieldMapping.tooSick} id="defaultCheck7">
                        <label class="form-check-label" for="defaultCheck7">
                            I’m too sick/my health is too poor to participate
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t have reliable access to the internet/a device" name="options" 
                        data-optionKey=${fieldMapping.noInternet} id="defaultCheck8">
                        <label class="form-check-label" for="defaultCheck8">
                            I don’t have reliable access to the internet/a device
                        </label>
                    </div>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t like to do things online" name="options" 
                        data-optionKey=${fieldMapping.dontLikeThingsOnline} id="defaultCheck">
                        <label class="form-check-label" for="defaultCheck">
                            I don’t like to do things online
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried about receiving results from the study" name="options" 
                        data-optionKey=${fieldMapping.worriedAboutResults} id="defaultCheck9">
                        <label class="form-check-label" for="defaultCheck9">
                            I’m worried about receiving results from the study
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried the study might find something concerning about me" name="options" 
                        data-optionKey=${fieldMapping.concernedAboutResults} id="defaultCheck10">
                        <label class="form-check-label" for="defaultCheck10">
                            I’m worried the study might find something concerning about me
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t trust the government" name="options" 
                        data-optionKey=${fieldMapping.doesntTrustGov} id="defaultCheck11">
                        <label class="form-check-label" for="defaultCheck11">
                            I don’t trust the government
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t trust research/researchers" name="options" 
                        data-optionKey=${fieldMapping.doesntTrustResearch} id="defaultCheck12">
                        <label class="form-check-label" for="defaultCheck12">
                            I don’t trust research/researchers
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t want my information shared with other researchers" name="options" 
                        data-optionKey=${fieldMapping.doesntWantInfoWithResearchers} id="defaultCheck13">
                        <label class="form-check-label" for="defaultCheck13">
                            I don’t want my information shared with other researchers
                        </label>
                    </div>
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="I’m worried my information isn’t secure or there will be a data breach" name="options" 
                            data-optionKey=${fieldMapping.worriedAboutDataBreach} id="defaultCheck14">
                            <label class="form-check-label" for="defaultCheck14">
                                I’m worried my information isn’t secure or there will be a data breach
                            </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried about data being given to my insurance company/effects on insurance (health, life, other)" name="options" 
                        data-optionKey=${fieldMapping.worriedAboutInsurance} id="defaultCheck15">
                        <label class="form-check-label" for="defaultCheck15">
                            I’m worried about data being given to my insurance company/effects on insurance (health, life, other)
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried about data being given to my employer/potential employer" name="options" 
                        data-optionKey=${fieldMapping.worriedAboutEmployer} id="defaultCheck16">
                        <label class="form-check-label" for="defaultCheck16">
                            I’m worried about data being given to my employer/potential employer
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried that my information could be used to discriminate against me/my family" name="options" 
                        data-optionKey=${fieldMapping.worriedAboutDiscrimination} id="defaultCheck17">
                        <label class="form-check-label" for="defaultCheck17">
                            I’m worried that my information could be used to discriminate against me/my family
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried that my information will be used by others to make a profit" name="options" 
                        data-optionKey=${fieldMapping.worriedAboutInformationMisue} id="defaultCheck18">
                        <label class="form-check-label" for="defaultCheck18">
                             I’m worried that my information will be used by others to make a profit
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I have other privacy concerns" name="options" 
                        data-optionKey=${fieldMapping.worriedAboutOtherPrivacyConcerns} id="defaultCheck19">
                        <label class="form-check-label" for="defaultCheck19">
                            I have other privacy concerns
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m concerned about COVID-19" name="options" 
                        data-optionKey=${fieldMapping.concernedAboutCovid} id="defaultCheck20">
                        <label class="form-check-label" for="defaultCheck20">
                            I’m concerned about COVID-19
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Participant is now unable to participate" name="options" 
                        data-optionKey=${fieldMapping.participantUnableToParticipate} id="defaultCheck21">
                        <label class="form-check-label" for="defaultCheck21">
                            Participant is now unable to participate
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Participant is incarcerated" name="options" 
                        data-optionKey=${fieldMapping.participantIncarcerated} id="defaultCheck22">
                        <label class="form-check-label" for="defaultCheck22">
                            Participant is incarcerated
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Reason not given" name="options" 
                        data-optionKey=${fieldMapping.reasonNotGiven}  id="defaultCheck23">
                        <label class="form-check-label" for="defaultCheck23">
                            Reason not given
                        </label>
                </div>
                </div> 
                <div style="display:inline-block; margin-top:20px;">
                    <button type="button" id="backToPrevPage" class="btn btn-primary">Previous</button>
                    <button type="button" id="submit" class="btn btn-success">Submit</button>
                </div>
            `

    renderContent.innerHTML =  template;
    document.getElementById('backToPrevPage').addEventListener('click', () => {
        renderContent.innerHTML = renderParticipantWithdrawalLandingPage();
        retainPreviouslySetOptions(retainOptions);
        autoSelectOptions();
        viewOptionsSelected();
        proceedToNextPage();
    })
    document.getElementById('submit').addEventListener('click', () => {
        collectFinalResponse(retainOptions, source)
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
    template += `
                <div>
                    <span> Date of Death: <b>MM/DD/YYYY</b>​ </span>
                    <br />
                    <span><b> Source of Report:​ </b></span>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="options" value="Spouse/partner" 
                        data-optionKey=${fieldMapping.spouse} id="defaultCheck2">
                        <label class="form-check-label" for="defaultCheck2">
                            Spouse/partner​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="options" value="Child​" 
                        data-optionKey=${fieldMapping.child} id="defaultCheck3">
                        <label class="form-check-label" for="defaultCheck3">
                            Child​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="options" value="Other relative or proxy" 
                        data-optionKey=${fieldMapping.otherRelative} id="defaultCheck4">
                        <label class="form-check-label" for="defaultCheck4">
                            Other relative or proxy​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="options" value="IHCS Staff" 
                        data-optionKey=${fieldMapping.ihcsStaff} id="defaultCheck5">
                        <label class="form-check-label" for="defaultCheck5">
                            IHCS Staff​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="options" value="Other" 
                        data-optionKey=${fieldMapping.other} id="defaultCheck6">
                        <label class="form-check-label" for="defaultCheck6">
                            Other
                        </label>
                    </div>
             </div>
            <div style="display:inline-block; margin-top:20px;">
                <button type="button" id="backToPrevPage" class="btn btn-primary">Previous</button>
                <button type="button" id="submit" class="btn btn-success">Submit</button>
            </div>
            `
    renderContent.innerHTML =  template;
    document.getElementById('backToPrevPage').addEventListener('click', () => {
        renderContent.innerHTML = renderParticipantWithdrawalLandingPage(retainOptions);
        retainPreviouslySetOptions(retainOptions);
        autoSelectOptions();
        viewOptionsSelected();
        proceedToNextPage();
    })
    document.getElementById('submit').addEventListener('click', () => {
        collectFinalResponse(retainOptions, source)
    })
 
}

const collectFinalResponse = (retainOptions, source) => {
    let finalOptions = []
    let checkboxes = document.getElementsByName('options');
    checkboxes.forEach(x => { if (x.checked) {  
        finalOptions.push(x)}
    })
    sendResponses(finalOptions, retainOptions, source);
}

const sendResponses = (finalOptions, retainOptions, source) => {
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
    source === 'page2' ? (
        finalOptions.forEach(x => {
            sendRefusalData[fieldMapping.sourceOfDeath] = parseInt(x.dataset.optionkey) })
    ) : (
    finalOptions.forEach(x => {
        sendRefusalData[x.dataset.optionkey] = fieldMapping.yes
    }))
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
    sendRefusalData[fieldMapping.participationStatus] = fieldMapping[participationStatusScore.toString()];
    let refusalObj = sendRefusalData[fieldMapping.refusalOptions]
    if (JSON.stringify(refusalObj) === '{}') delete sendRefusalData[fieldMapping.refusalOptions]
    getParticipationStatus(fieldMapping[fieldMapping[participationStatusScore.toString()]])
    const token = localStorage.getItem("token");
    sendRefusalData['token'] = token;
    console.log('sendRefusalData', sendRefusalData)
    const siteKey = JSON.parse(localStorage.dashboard).siteKey
    clickHandler(sendRefusalData, siteKey);
}

async function clickHandler(sendRefusalData, siteKey) {
    showAnimation();
    const idToken = siteKey;

    const refusalPayload = {
        "data": sendRefusalData
    }

    const response = await (await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/updateParticipantData`, {
        method:'POST',
        body: JSON.stringify(refusalPayload),
        headers:{
            Authorization:"Bearer "+idToken,
            "Content-Type": "application/json"
            }
    }))
    hideAnimation();
    if (response.status === 200) {
        const loadDetailsPage = '#participantSummary'
        location.replace(window.location.origin + window.location.pathname + loadDetailsPage); // updates url to participantDetails upon screen update
     }
       else { 
           (alert('Error'))
    }
}

