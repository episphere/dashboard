import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from './navigationBar.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import { renderParticipantHeader, getParticipantStatus, getParticipantSuspendedDate } from './participantHeader.js';
import { renderParticipantWithdrawalLandingPage, viewOptionsSelected, proceedToNextPage, autoSelectOptions, addEventMonthSelection } from './participantWithdrawalForm.js'


export const renderParticipantWithdrawal = (participant) => {
    if (participant !== undefined) {
        const isParent = localStorage.getItem('isParent')
        document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
        removeActiveClass('nav-link', 'active');
        document.getElementById('participantWithdrawalBtn').classList.add('active');
        mainContent.innerHTML = render(participant);
        autoSelectOptions();
        viewOptionsSelected();
        proceedToNextPage();
        addEventMonthSelection('UPMonth', 'UPDay');
        checkPreviousWithdrawalStatus(participant);
    }
}


export const render = (participant) => {
    localStorage.setItem('token', participant.token)
    let template = `<div class="container-fluid">`
    if (!participant) {
        template +=` 
            <div id="root">
            Please select a participant first!
            </div>
        </div>
         `
    } else {
        template += `
                <div id="root root-margin"> `
        template += renderParticipantHeader(participant);
        template += `<div id="alert_placeholder"></div>`
        template += `<div id="formMainPage">
                    ${renderParticipantWithdrawalLandingPage()}
                    </div></div>`
    }
    return template;
}

const checkPreviousWithdrawalStatus = (participant) => {
    let template = ``;
    let alertList = document.getElementById('alert_placeholder');
    if (participant[fieldMapping.participationStatus] !== fieldMapping.noRefusal && participant[fieldMapping.participationStatus] !== ``) {
        localStorage.setItem('participationStatus', true)
        template += `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                        Previously Selected Refusal Option(s): <b> ${getParticipantSelectedRefusals(participant)} </b>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`
    } else if (participant[fieldMapping.suspendContact] !== "" && participant[fieldMapping.suspendContact] !== ``) {
        localStorage.setItem('suspendContact', true)
        template += `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <b> ${getParticipantSuspendedDate(participant)} </b>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`
    }
    alertList.innerHTML = template;
}

const getParticipantSelectedRefusals = (participant) => {
    let template = ``

    if (participant[fieldMapping.refusalOptions][fieldMapping.refusedSurvey] === fieldMapping.yes ) template += `Baseline survey​, `
    if (participant[fieldMapping.refusalOptions][fieldMapping.refusedBlood] === fieldMapping.yes ) template += `Baseline blood collection, `
    if (participant[fieldMapping.refusalOptions][fieldMapping.refusedUrine] === fieldMapping.yes )  template += `Baseline urine collection, `
    if (participant[fieldMapping.refusalOptions][fieldMapping.refusedMouthwash] === fieldMapping.yes ) template += `Baseline mouthwash collection​, ` 
    if (participant[fieldMapping.refusalOptions][fieldMapping.refusedSpecimenSurevys] === fieldMapping.yes ) template += `Baseline specimen surveys, `
    if (participant[fieldMapping.refusalOptions][fieldMapping.refusedFutureSamples] === fieldMapping.yes ) template += `All future surveys (willing to do specimens)​, `
    if (participant[fieldMapping.refusalOptions][fieldMapping.refusedFutureSurveys] === fieldMapping.yes ) template += `All future specimens (willing to do specimens)​, ` 
    if (participant[fieldMapping.refusedAllFutureActivities] === fieldMapping.yes ) template += `Refusing all future activities​​, ` 
    if (participant[fieldMapping.revokeHIPAA] === fieldMapping.yes ) template += `Revoke HIPAA authorization (no medical records), `
    if (participant[fieldMapping.withdrawConsent] === fieldMapping.yes ) template += `Withdraw consent​, `
    if (participant[fieldMapping.destroyData] === fieldMapping.yes ) template += `Destroy data​, `
    if (participant[fieldMapping.participantDeceased] === fieldMapping.yes ) template += `Participant Deceased, ` 

    template = template.replace(/,\s*$/, "") // removes comma from the end

    return template
}