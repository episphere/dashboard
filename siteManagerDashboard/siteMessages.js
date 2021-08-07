import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from './navigationBar.js';
import { renderParticipantHeader } from './participantHeader.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import {  baseAPI, humanReadableFromISO, getAccessToken } from './utils.js';


export const renderSiteMessages = async () => {
    const isParent = localStorage.getItem('isParent')
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantMessageBtn').classList.add('active');
    mainContent.innerHTML = await render();
}

export const render = async () => {
    let template = `<div class="container-fluid">`
    let siteHolder = []
    template +=` 
        <div id="root">
            Hello
        </div>
    </div>
         `
    return template;
 }