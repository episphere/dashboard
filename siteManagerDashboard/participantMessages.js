import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from './navigationBar.js';
import { renderParticipantHeader } from './participantHeader.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import {  humanReadableFromISO } from './utils.js';


const headerImportantColumns = [
    { field: fieldMapping.fName },
    { field: fieldMapping.lName },
];

export const renderParticipantMessages = async (participant) => {
    const isParent = localStorage.getItem('isParent')
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantMessageBtn').classList.add('active');
    if (participant !== null) {
        mainContent.innerHTML = await render(participant);
    }
}

export const render = async (participant) => {
    let template = `<div class="container-fluid">`
    let messageHolder = []
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
        template += `<span> <h4 style="text-align: center;">Participant Messages </h4> </span>`
        const token = '2b8fad88-bc48-4bb1-8afa-513d3f73e0d2';
        const siteKey = JSON.parse(localStorage.dashboard).siteKey
        let messages =  await getParticipantMessage(token, siteKey);
        console.log('messageHolder', messages)
        messages.data.forEach(message => 
            template += `
                        <div class="list-group">
                        <span class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                            <small> Attempt: ${message.attempt !== undefined ? message.attempt : `N/A`} | Category: ${message.category !== undefined ? message.category : `N/A`} </small>
                            <h5 class="mb-1">${message.notification.title}</h5>
                            <small>${humanReadableFromISO(message.notification.time)}</small>
                            </div>
                            <p class="mb-1">${message.notification.body}</p>
                        </span>
                </div>  <br />`
            
        )}
    return template;
}

const getParticipantMessage = async (token, idToken) => {
    let results = null;
    const response = await fetch (`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/dashboard?api=getParticipantNotification&token=${token}`, {
        method:'GET',
        headers:{
            Authorization:"Bearer "+idToken,
            "Content-Type": "application/json"
            }
    })

    return response.json();
   
}