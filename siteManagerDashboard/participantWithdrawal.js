import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from './navigationBar.js';
import { renderParticipantHeader } from './participantHeader.js';
import { renderParticipantWithdrawalLandingPage, viewOptionsSelected, proceedToNextPage, autoSelectOptions } from './participantWithdrawalForm.js'


export const renderParticipantWithdrawal = (participant) => {
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantWithdrawalBtn').classList.add('active');
    mainContent.innerHTML = render(participant);
    autoSelectOptions();
    viewOptionsSelected();
    proceedToNextPage();
}


export const render = (participant) => {
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





