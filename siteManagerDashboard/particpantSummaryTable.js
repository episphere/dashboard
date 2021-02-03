import fieldMapping from './fieldToConceptIdMapping.js';
import { humanReadableMDYwithTime } from './utils.js';

export function summaryTable(participant) {

    let template = `<div class="container-fluid">`
    template += `
            <table class="table">
                <thead>
                <tr class="table-warning">
                    <th scope="col">Annual EMR Push</th>
                    <th scope="col">Data Pushed</th>
                    <th scope="col">Data Received</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td>[Yes/No
                        Date, if "Yes"]</td>
                    <td>[Yes/No
                        Date, if "Yes"]</td>
                </tr>
                </tbody>
            </table>
            <table class="table">
                <thead>
                <tr class="table-info">
                    <th scope="col">12 Month Module</th>
                    <th scope="col">[Date Available]</th>
                    <th scope="col">Refused Activity</th>
                    <th scope="col">[Descriptions, e.g. FFQ]</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td>[Yes/No]</td>
                    <td>[Status Date/time completed]
                </tr>
                </tbody>
            </table>
            <table class="table">
            <thead>
            <tr class="table-info">
                <th scope="col">6 Month Module</th>
                <th scope="col">[Date Available]</th>
                <th scope="col">Refused Activity</th>
                <th scope="col">[Descriptions, e.g. FFQ]</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td></td>
                <td></td>
                <td>[Yes/No]</td>
                <td>[Status Date/time completed]
            </tr>
            </tbody>
            </table>
            <table class="table">
                <thead>
                <tr class="table-warning">
                    <th scope="col">Baseline EMR Push</th>
                    <th scope="col">Data Pushed</th>
                    <th scope="col">Data Received</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td>[Yes/No
                        Date, if "Yes"]</td>
                    <td>[Yes/No
                        Date, if "Yes"]</td>
                </tr>
                </tbody>
            </table>
            <table class="table">
                <thead>
                <tr class="table-success">
                    <th scope="col">Baseline Incentive</th>
                    <th scope="col">[Data Issued]</th>
                    <th scope="col">Incentive Eligible</th>
                    <th scope="col">Incentive Offered</th>
                    <th scope="col">Incentive Claimed</th>
                    <th scope="col">Method</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td>${ participant[fieldMapping.incentive] ? `Yes` : `No`}</td>
                    <td>[Yes/No]</td>
                    <td>[Yes/No
                        Date, if "Yes"]</td>
                    <td>[Issued by NORC/issued by site]</td>
                </tr>
                </tbody>
            </table>
            <table class="table">
                <thead>
                <tr class="table-primary">
                    <th scope="col">Baseline Mouthwash Collection</th>
                    <th scope="col">[Data Collected]</th>
                    <th scope="col">Refused Activity</th>
                    <th scope="col">Kit Sent</th>
                    <th scope="col">Method</th>
                    <th scope="col">Mouthwash Questionnaire Completed</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td>${ participant[fieldMapping.mouthwash] ? `Yes` : `No`}</td>
                    <td>[Yes/No]</td>
                    <td>Research Collection, Clinical Collection, Home Collection</td>
                    <td>[Yes/No
                        Date, if "Yes"]</td>
                </tr>
                </tbody>
            </table>
            <table class="table">
                <thead>
                <tr class="table-primary">
                    <th scope="col">Baseline Urine Collection</th>
                    <th scope="col">[Data Collected]</th>
                    <th scope="col">Refused Activity</th>
                    <th scope="col">Kit Sent</th>
                    <th scope="col">Method</th>
                    <th scope="col">Urine Questionnaire Completed</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td>[Yes/No]</td>
                    <td>[Yes/No]</td>
                    <td>Research Collection, Clinical Collection, Home Collection</td>
                    <td>[Yes/No
                        Date, if "Yes"]</td>
                </tr>
                </tbody>
            </table>
            <table class="table">
                <thead>
                <tr class="table-primary">
                    <th scope="col">Baseline Blood Collection</th>
                    <th scope="col">[Data Collected]</th>
                    <th scope="col">Refused Activity</th>
                    <th scope="col">Method</th>
                    <th scope="col">Urine Questionnaire Completed</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td>[Yes/No]</td>
                    <td>Research Collection, Clinical Collection, Home Collection</td>
                    <td>[Yes/No
                        Date, if "Yes"]</td>
                </tr>
                </tbody>
            </table>
            <table class="table">
            <thead>
            <tr class="table-primary">
                <th scope="col">Baseline Modules</th>
                <th scope="col">Date Available</th>
                <th scope="col">Refused Activity</th>
                <th scope="col">Module 1</th>
                <th scope="col">Module 2</th>
                <th scope="col">Module 3</th>
                <th scope="col">Module 4</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td></td>
                <td>${participant[fieldMapping.consentDate] && 
                    humanReadableMDYwithTime(participant[fieldMapping.consentDate])}</td>
                <td>[Yes/No]</td>
                <td>${summaryTableModuleHandler(participant.Module1)}</td>
                    <td>${summaryTableModuleHandler(participant.Module2)}</td>
                        <td>${summaryTableModuleHandler(participant.Module3)}</td>
                            <td>${summaryTableModuleHandler(participant.Module4)}</td>
            </tr>
            </tbody>
            </table>
            <table class="table">
            <thead>
            <tr class="table-warning">
                <th scope="col">Identitiy Verification</th>
                <th scope="col"> ${participant[fieldMapping.verifiedFlag] && 
                    humanReadableMDYwithTime(participant[fieldMapping.verficationDate])}</th>
            </tr>
            </thead>
                </table>
                <table class="table">
                <thead>
                <tr class="table-warning">
                <th scope="col">Study Consent</th>
                <th scope="col">     <span>${participant[fieldMapping.consentDate] && 
                    humanReadableMDYwithTime(participant[fieldMapping.consentDate])}</span></th>
                <th scope="col">Consent</th>
                </tr>
                </thead>
                </table>
            </div>`


return template;

}

function summaryTableModuleHandler(participantModule) {
    let template = ``;
    !participantModule ? template += `<span> Not Completed </span>` :
    (participantModule && !participantModule.COMPLETED) ? template += `<span> In Progress</span>` :
    (participantModule && participantModule.COMPLETED) ? template += `<span> ${humanReadableMDYwithTime(participantModule.COMPLETED_TS)} </span>` : ''
    return template;            
}