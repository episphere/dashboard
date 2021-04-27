import fieldMapping from './fieldToConceptIdMapping.js';

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
                                        optionKey=${fieldMapping.refusedSurvey} id="defaultCheck1">
                                        <label class="form-check-label" for="defaultCheck1">
                                            Baseline survey​
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="Baseline blood collection" id="defaultCheck2">
                                        <label class="form-check-label" for="defaultCheck2">
                                            Baseline blood collection​
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="Baseline urine collection" id="defaultCheck3">
                                        <label class="form-check-label" for="defaultCheck3">
                                            Baseline urine collection​
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="Baseline mouthwash collection​" id="defaultCheck4">
                                        <label class="form-check-label" for="defaultCheck4">
                                            Baseline mouthwash collection​
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="Baseline specimen surveys" id="defaultCheck5">
                                        <label class="form-check-label" for="defaultCheck5">
                                            Baseline specimen surveys
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="All future surveys (willing to do specimens)" id="defaultCheck6">
                                        <label class="form-check-label" for="defaultCheck6">
                                            All future surveys (willing to do specimens)​
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" name="options" type="checkbox" value="All future specimens (willing to do surveys)" id="defaultCheck7">
                                        <label class="form-check-label" for="defaultCheck7">
                                            All future specimens (willing to do surveys)
                                        </label>
                                    </div>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="options" type="checkbox" value="Refusing all future activities" id="defaultCheck8">
                                    <label class="form-check-label" for="defaultCheck8">
                                        Refusing all future activities​
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="options" type="checkbox" value="Revoke HIPAA authorization (no medical records)*​" id="defaultCheck9">
                                    <label class="form-check-label" for="defaultCheck9">
                                        Revoke HIPAA authorization (no medical records)*​
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="options" type="checkbox" value="Withdraw consent*​" id="defaultCheck10">
                                    <label class="form-check-label" for="defaultCheck10">
                                        Withdraw consent*​
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="options" type="checkbox" value="Destroy data*​" id="defaultCheck11">
                                    <label class="form-check-label" for="defaultCheck11">
                                            Destroy data*​
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="options" id = "messageCheckbox" type="checkbox" value="Participant Deceased">
                                    <label class="form-check-label" for="defaultCheck12">
                                        Participant Deceased
                                    </label>
                                </div>
                                &nbsp;
                                    <button type="button" data-toggle="modal" data-target="#modalShowSelectedData"
                                    class="btn btn-primary next-btn" id="nextFormPage" style="margin-top:20px;">Next</button>
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
    if (a) {
        a.addEventListener('change', function() {
            let checkedValue = document.getElementById('defaultCheck10');
            checkedValue.checked = true;
            let checkedValue1 = document.getElementById('defaultCheck9');
            checkedValue1.checked = true;
            let checkedValue2 = document.getElementById('defaultCheck8');
            checkedValue2.checked = true;
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
    let holdOptions = []
    const header = document.getElementById('modalHeader');
    const body = document.getElementById('modalBody');
    let checkboxes = document.getElementsByName('options');
    header.innerHTML = `<h5>Options Selected</h5><button type="button" id="closeModal" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
    let template = '<div>'
    //checkboxes.length === 0 && template += `<span>${x.value}</span> <br />`
    checkboxes.forEach(x => { 
        
        if (x.checked) {  
            holdOptions.push(x.value)
            console.log('checkboxes', x.value)
            template += `<span>${x.value}</span> <br />`}
    })
    if (holdOptions.length === 0) {template += `<span><b>Select an option before proceeding!</b></span> <br />`}
    template += `
        <div style="display:inline-block; margin-top:20px;">
            ${(holdOptions.length === 0) ? 
                ` <button type="button" class="btn btn-primary" data-dismiss="modal" target="_blank" id="proceedFormPage" disabled>Confirm</button>`
            : ` <button type="button" class="btn btn-primary" data-dismiss="modal" target="_blank" id="proceedFormPage">Confirm</button>`
            }
            <button type="button" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
        </div>
    </div>`
    body.innerHTML = template;
    proceedToNextPage(holdOptions)
} 


export const proceedToNextPage = (holdOptions) => {
  
    const a = document.getElementById('proceedFormPage');
    if (a) {
        a.addEventListener('click',  () => { 
            let checkedValue = document.getElementById('messageCheckbox').checked
            checkedValue ? causeOfDeathPage(holdOptions) : reasonForRefusalPage(holdOptions);
        })
    }
}


export const reasonForRefusalPage = (holdOptions) => {

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
                        <input class="form-check-input" type="checkbox" value="I’m no longer interested in the study​" name="options" id="defaultCheck1">
                        <label class="form-check-label" for="defaultCheck1">
                            I’m no longer interested in the study​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m too busy/the study takes too much time​" name="options" id="defaultCheck2">
                        <label class="form-check-label" for="defaultCheck2">
                            I’m too busy/the study takes too much time​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m concerned about my privacy​" name="options" id="defaultCheck3">
                        <label class="form-check-label" for="defaultCheck3">
                            I’m concerned about my privacy​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m not able to complete the study activities online" name="options" id="defaultCheck4">
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
                        <input class="form-check-input" type="checkbox" value="I think the incentive or benefit to participate is not great enough" name="options" id="defaultCheck6">
                        <label class="form-check-label" for="defaultCheck6">
                            I think the incentive or benefit to participate is not great enough
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m too sick/my health is too poor to participate" name="options" id="defaultCheck7">
                        <label class="form-check-label" for="defaultCheck7">
                            I’m too sick/my health is too poor to participate
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t have reliable access to the internet/a device" name="options" id="defaultCheck8">
                        <label class="form-check-label" for="defaultCheck8">
                            I don’t have reliable access to the internet/a device
                        </label>
                    </div>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t like to do things online" name="options" id="defaultCheck">
                        <label class="form-check-label" for="defaultCheck">
                            I don’t like to do things online
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried about receiving results from the study" name="options" id="defaultCheck9">
                        <label class="form-check-label" for="defaultCheck9">
                            I’m worried about receiving results from the study
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried the study might find something concerning about me" name="options" id="defaultCheck10">
                        <label class="form-check-label" for="defaultCheck10">
                            I’m worried the study might find something concerning about me
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t trust the government" name="options" id="defaultCheck11">
                        <label class="form-check-label" for="defaultCheck11">
                            I don’t trust the government
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t trust research/researchers" name="options" id="defaultCheck12">
                        <label class="form-check-label" for="defaultCheck12">
                            I don’t trust research/researchers
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I don’t want my information shared with other researchers" name="options" id="defaultCheck13">
                        <label class="form-check-label" for="defaultCheck13">
                            I don’t want my information shared with other researchers
                        </label>
                    </div>
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="I’m worried my information isn’t secure or there will be a data breach" name="options" id="defaultCheck14">
                            <label class="form-check-label" for="defaultCheck14">
                                I’m worried my information isn’t secure or there will be a data breach
                            </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried about data being given to my insurance company/effects on insurance (health, life, other)" name="options" id="defaultCheck15">
                        <label class="form-check-label" for="defaultCheck15">
                            I’m worried about data being given to my insurance company/effects on insurance (health, life, other)
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried about data being given to my employer/potential employer" name="options" id="defaultCheck16">
                        <label class="form-check-label" for="defaultCheck16">
                            I’m worried about data being given to my employer/potential employer
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried that my information could be used to discriminate against me/my family" name="options" id="defaultCheck17">
                        <label class="form-check-label" for="defaultCheck17">
                            I’m worried that my information could be used to discriminate against me/my family
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m worried that my information will be used by others to make a profit" name="options" id="defaultCheck17">
                        <label class="form-check-label" for="defaultCheck17">
                             I’m worried that my information will be used by others to make a profit
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I have other privacy concerns" name="options" id="defaultCheck17">
                        <label class="form-check-label" for="defaultCheck17">
                            I have other privacy concerns
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="I’m concerned about COVID-19" name="options" id="defaultCheck17">
                        <label class="form-check-label" for="defaultCheck17">
                            I’m concerned about COVID-19
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Participant is now unable to participate" name="options" id="defaultCheck17">
                        <label class="form-check-label" for="defaultCheck17">
                            Participant is now unable to participate
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Participant is incarcerated" name="options" id="defaultCheck17">
                        <label class="form-check-label" for="defaultCheck17">
                            Participant is incarcerated
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Reason not given" name="options" id="defaultCheck17">
                        <label class="form-check-label" for="defaultCheck17">
                            Reason not given
                        </label>
                </div>
                </div> 
                <div style="display:inline-block; margin-top:20px;">
                    <button type="button" id="backToPrevPage" class="btn btn-primary">Previous</button>
                    <button type="button" data-toggle="modal" data-target="#modalShowFinalSelectedData" id="submit" class="btn btn-success">Submit</button>
                </div>
            `

    renderContent.innerHTML =  template;
    document.getElementById('backToPrevPage').addEventListener('click', () => {
        renderContent.innerHTML = renderParticipantWithdrawalLandingPage();
        autoSelectOptions();
        viewOptionsSelected();
        proceedToNextPage();
    })
    document.getElementById('submit').addEventListener('click', () => {
        collectFinalResponse(holdOptions)
    })
 
}

export const causeOfDeathPage = (holdOptions) => {
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
                        <input class="form-check-input" type="checkbox" name="options" value="Spouse/partne" id="defaultCheck2">
                        <label class="form-check-label" for="defaultCheck2">
                            Spouse/partner​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="options" value="Child​" id="defaultCheck3">
                        <label class="form-check-label" for="defaultCheck3">
                            Child​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="options" value="Other relative or proxy" id="defaultCheck4">
                        <label class="form-check-label" for="defaultCheck4">
                            Other relative or proxy​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="options" value="IHCS Staff" id="defaultCheck5">
                        <label class="form-check-label" for="defaultCheck5">
                            IHCS Staff​
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="options" value="Other" id="defaultCheck6">
                        <label class="form-check-label" for="defaultCheck6">
                            Other
                        </label>
                    </div>
             </div>
            <div style="display:inline-block; margin-top:20px;">
                <button type="button" id="backToPrevPage" class="btn btn-primary">Previous</button>
                <button type="button" data-toggle="modal" data-target="#modalShowFinalSelectedData" id="submit" class="btn btn-success">Submit</button>
            </div>
            `
    renderContent.innerHTML =  template;
    document.getElementById('backToPrevPage').addEventListener('click', () => {
        renderContent.innerHTML = renderParticipantWithdrawalLandingPage();
        autoSelectOptions();
        viewOptionsSelected();
        proceedToNextPage();
    })
    document.getElementById('submit').addEventListener('click', () => {
        collectFinalResponse(holdOptions)
    })
 
}

const collectFinalResponse = (holdOptions) => {
    let finalOptions = []
    const header = document.getElementById('modalHeader');
    const body = document.getElementById('modalBody');
    let checkboxes = document.getElementsByName('options');
    header.innerHTML = `<h5>Options Selected</h5><button type="button" id="closeModal" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
    
    let template = '<div>'
    holdOptions.forEach(x =>  template += `<span>${x}</span> <br />`)
    checkboxes.forEach(x => { if (x.checked) {  
        holdOptions.push(x.value)
        finalOptions.push(x.value)
        template += `<span>${x.value}</span> <br />`}
    })
    if (finalOptions.length === 0) { template += `<span><b>Select a reason/source before submitting</b></span> <br />` }
    template += `
        <div style="display:inline-block; margin-top:20px;">
        ${(finalOptions.length === 0) ? 
            ` <button type="button" class="btn btn-success" data-dismiss="modal" target="_blank" id="sendResponses" disabled>Confirm</button>`
        : `<button type="button" class="btn btn-success" data-dismiss="modal" target="_blank" id="sendResponses">Confirm</button>`
        }
            <button type="button" class="btn btn-danger" data-dismiss="modal" target="_blank">Cancel</button>
        </div>
    </div>`
    body.innerHTML = template;
    sendResponses(holdOptions);
}

const sendResponses = (holdOptions) => {
    const a = document.getElementById('sendResponses');
    if (a) {
        a.addEventListener('click',  () => { 
            console.log('response', holdOptions)
        })
    }
}