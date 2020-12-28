import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import {renderTable, filterdata, renderData, importantColumns, addEventFilterData, activeColumns, eventVerifiedButton} from './commons.js';

export function renderParticipantDetails(){

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantDetailsBtn').classList.add('active');
    mainContent.innerHTML = rederParticipantDetails();

}
export function rederParticipantDetails(participant) {
    let template;
    if (!participant) {
        template=` 
        <div class="container">
            <div id="root">
            Please select a participant first!
            </div>
        </div>
         `
    }
    return template;


}
