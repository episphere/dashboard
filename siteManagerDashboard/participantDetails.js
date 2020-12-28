import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';

export function renderParticipantDetails(participant){

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantDetailsBtn').classList.add('active');
    mainContent.innerHTML = render(participant);

}
export function render(participant) {
    let template;
    if (!participant) {
        template=` 
        <div class="container">
            <div id="root">
            Please select a participant first!
            </div>
        </div>
         `
    } else {
        template = `
        <div class="container">
            <div id="root">
            ${participant.Connect_ID} found!
            </div>
        </div>
        `;
    }
    return template;


}
