import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import { renderParticipantHeader } from './participantHeader.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import { humanReadableMDY } from './utils.js';

export function renderParticipantSummary(participant){

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantSummaryBtn').classList.add('active');
    if (participant !== null) {
        mainContent.innerHTML = render(participant);
      //  downloadCopyHandler(participant)
    }
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
        template += `<div class="table-responsive">
                        <span> <h4 style="text-align: center;"><i style="float: left;" class="fa fa-sort fa-lg"></i> 
                        <i style="float: left;" class="fa fa-filter fa-lg"></i> Participant Summary </h4> </span>
                        <table class="table table-borderless">
                        <thead>
                            <tr>
                                <th scope="col">Icon</th>
                                <th scope="col">Timeline</th>
                                <th scope="col">Category</th>
                                <th scope="col">Item</th>
                                <th scope="col">Status</th>
                                <th scope="col">Date</th>
                                <th scope="col">Setting</th>
                                <th scope="col">Refused</th>
                                <th scope="col">Extra</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                                <td>Baseline</td>
                                <td>Survey</td>
                                <td>BOH</td>
                                <td>Not Started</td>
                                <td>Date Started</td>
                                <td>N/A</td>
                                <td>Y/N</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                                <td>Baseline</td>
                                <td>Sample</td>
                                <td>MRE</td>
                                <td>Started</td>
                                <td>Date Started</td>
                                <td>N/A</td>
                                <td>Y/N</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                                <td>Baseline</td>
                                <td>Sample</td>
                                <td>SAS</td>
                                <td>Submitted</td>
                                <td>Date Started</td>
                                <td>N/A</td>
                                <td>Y/N</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                                <td>Baseline</td>
                                <td>EMR</td>
                                <td>Law</td>
                                <td>Submitted</td>
                                <td>Date Started</td>
                                <td>N/A</td>
                                <td>Y/N</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                                <td>Baseline</td>
                                <td>Survey</td>
                                <td>SSN</td>
                                <td>None 4 9</td>
                                <td>Date Started</td>
                                <td>N/A</td>
                                <td>Y/N</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                                <td>Baseline</td>
                                <td>Sample</td>
                                <td>Blood</td>
                                <td>(NOT) Collected</td>
                                <td>Date collected</td>
                                <td>Clinical</td>
                                <td>Y/N</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                                <td>Baseline</td>
                                <td>Sample</td>
                                <td>Urine</td>
                                <td>(NOT) Collected</td>
                                <td>Date collected</td>
                                <td>Clinical</td>
                                <td>Y/N</td>
                                <td>N/A</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                                <td>Baseline</td>
                                <td>Sample</td>
                                <td>Mouthwash</td>
                                <td>(NOT) Collected</td>
                                <td>Date collected</td>
                                <td>Research OR Home</td>
                                <td>Y/N</td>
                                <td>Kit Sent</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                                <td>Baseline</td>
                                <td>Survey</td>
                                <td>Blood/Urine</td>
                                <td>(Not) started</td>
                                <td>Date Started</td>
                                <td>N/A</td>
                                <td>Y/N</td>
                                <td>Kit Sent</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                                <td>6 months</td>
                                <td>Survey</td>
                                <td>DHQ</td>
                                <td>Submitted</td>
                                <td>Date submitted</td>
                                <td>N/A</td>
                                <td>Y/N</td>
                                <td>Kit Sent</td>
                            </tr>
                            <tr>
                                <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                                <td>Annual</td>
                                <td>EMR</td>
                                <td>N/A</td>
                                <td>(NOT) Pushed</td>
                                <td>Date Pushed</td>
                                <td>N/A</td>
                                <td>Y/N</td>
                                <td>Kit Sent</td>
                        </tr>
                        </tbody>
                        </table>
                    </div>`

   
                   
        template +=`</div></div>`

    }
    return template;


}

