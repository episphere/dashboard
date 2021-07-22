import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from './navigationBar.js';
import { renderParticipantHeader } from './participantHeader.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import {  baseAPI, humanReadableFromISO, getIdToken } from './utils.js';


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
        const token = participant.token;
        const access_token = await getIdToken();
        const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
        const siteKey = access_token !== null ? access_token : localStr.siteKey   
        let messages =  await getParticipantMessage(token, siteKey);
        messages.data.length !== 0 ? (
            messages.data.forEach(message => 
                template += `
                            <div class="list-group">
                            <span class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between">
                                <small> Attempt: ${message.attempt !== undefined ? message.attempt : `N/A`} | Category: ${message.category !== undefined ? message.category : `N/A`} </small>
                                <h5 class="mb-1">${message.notification.title}</h5>
                                <small>Date Sent: ${humanReadableFromISO(message.notification.time)}</small>
                                </div>
                                <p class="mb-1">${message.notification.body}</p>
                            </span>
                            </div>  <br />`) 
                    ): (  
                template += `
                    <div class="list-group" style="text-align: center;">
                    <span class="list-group-item list-group-item-action" >
                        <div class="d-flex w-100 justify-content-between" >
                        <h4>No Messages</h4>
                        </div>
                    </span>
                </div>  <br />`)
            
        }
    return template;
}

const getParticipantMessage = async (token, idToken) => {
    let results = null;
    const response = await fetch (`${baseAPI}/dashboard?api=getParticipantNotification&token=${token}`, {
        method:'GET',
        headers:{
            Authorization:"Bearer "+idToken,
            "Content-Type": "application/json"
            }
    })

    return response.json();
   
}