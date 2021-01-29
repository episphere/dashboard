import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import { renderParticipantHeader } from './participantHeader.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import { humanReadableFromISO } from './utils.js';

export function renderParticipantSummary(participant){

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantSummaryBtn').classList.add('active');
    mainContent.innerHTML = render(participant);
}


export function render(participant) {
    let template = `<div class="container">`
    if (!participant) {
        template +=` 
            <div id="root">
            Please select a participant first!
            </div>
        </div>
         `
    } else {
        console.log('participantSummaryBtn', participant)
        let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
        console.log("conceptIdMapping", conceptIdMapping)
        template += `
                <div id="root"> `
        template += renderParticipantHeader(participant);
        template += `<div class="container-fluid">
                        <h4>Baseline activity summary...</h4>
                        <table class="table table-borderless">
                        <thead>
                            <tr>
                            <th scope="col">Consent</th>
                            <th scope="col">Modules</th>
                            <th scope="col">Biospecimen Collection</th>
                            <th scope="col">Incentive</th>
                            <th scope="col">EMR Push</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>
                                <div style="display:grid; grid-template-columns: 1fr 1fr;  grid-gap: 20px;">
                                    <div class="grid-child">
                                        ${consentHandler(participant)}   
                                    </div>
                                    <div class="grid-child">
                                        ${verifiedHandler(participant)} 
                                    </div>
                              </div>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            </tr>
                        </tbody>
                        </table>
                    </div>`
        template += `</div></div>`

    }
    return template;

}

function consentHandler(participant) {
    
    let template = `<div style="width: 80px; height: 100px; border: 1px solid; display:inline-block;">`;
    participant && 
    participant[fieldMapping.consentFlag] ?
    ( template += `<span>Consent</span>
        <br />
        <i class="fa fa-check"></i>
        <span>${participant[fieldMapping.consentDate] && humanReadableFromISO(participant[fieldMapping.consentDate])}</span>
        </div>
    ` ) : 
    (
        template += `<span>Consent</span>
        <br />
        <i class="fa fa-times"></i>
        <span>${participant[fieldMapping.consentDate] && humanReadableFromISO(participant[fieldMapping.consentDate])}</span>
        </div>`
    )
    return template;

}

function verifiedHandler(participant) {
    let template = `<div style="width: 80px; height: 100px; border: 1px solid; display:inline-block;">`;
    participant && 
    participant[fieldMapping.verifiedFlag] ?
    ( template += `<span>Verified</span>
        <br />
        <i class="fa fa-check"></i>
        <span>${participant[fieldMapping.verficationDate] && humanReadableFromISO(participant[fieldMapping.verficationDate])}</span>
        </div>
    ` ) : 
    (
        template += `<span>Verified</span>
        <br />
        <i class="fa fa-times"></i>
       <span>${participant[fieldMapping.verficationDate] && humanReadableFromISO(participant[fieldMapping.verficationDate])}</span>
        </div>`
    )
    return template;
}