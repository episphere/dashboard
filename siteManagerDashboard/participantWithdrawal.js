import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from './navigationBar.js';
import { renderParticipantHeader } from './participantHeader.js';
import { renderParticipantWithdrawalLandingPage, viewOptionsSelected, proceedToNextPage, autoSelectOptions, addEventMonthSelection, eventMonthSelection } from './participantWithdrawalForm.js'


export const renderParticipantWithdrawal = (participant) => {
    const isParent = localStorage.getItem('isParent')
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantWithdrawalBtn').classList.add('active');
    mainContent.innerHTML = render(participant);
    autoSelectOptions();
    viewOptionsSelected();
    proceedToNextPage();
    addEventMonthSelection('UPMonth', 'UPDay');
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
        template += `<div id="formMainPage">
                    ${renderParticipantWithdrawalLandingPage()}
                    </div></div>`
}
return template;
    }





