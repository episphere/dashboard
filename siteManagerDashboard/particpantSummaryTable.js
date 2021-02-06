import fieldMapping from './fieldToConceptIdMapping.js';
import { humanReadableMDYwithTime, getCurrentTimeStamp } from './utils.js';

export const headerImportantColumns = [
    { field: fieldMapping.fName },
    { field: fieldMapping.lName }
];
const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib

export function summaryTable(participant, incentiveResult) {
    
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
                    <th scope="col">[Date Issued]</th>
                    <th scope="col">Incentive Eligible</th>
                    <th scope="col">Incentive Offered</th>
                    <th scope="col">Incentive Claimed</th>
                    <th scope="col">Method</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    ${summaryTableIncentiveHandler(participant, incentiveResult)}
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
                    ${summaryTableBaselineMouthwashHandler(participant, incentiveResult)}
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
                    ${summaryTableBaselineUrineHandler(participant, incentiveResult)}
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
                    ${summaryTableBaselineBloodHandler(participant, incentiveResult)}
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
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td><a style="color: blue; text-decoration: underline;" target="_blank" id="downloadCopy1" >Download Copy</a></td>
                
                </tr>
                </tbody>
                </table>
            </div>`


return template;

}

export function downloadCopyHandler (participant)  {
    const a = document.getElementById('downloadCopy1');
    a.addEventListener('click',  () => {  
         renderDownloadConsentCopy(participant)
    })

}

async function renderDownloadConsentCopy (participant)  {
    let seekLastPage;
    const pdfLocation = './consent.pdf'
    const existingPdfBytes = await fetch(pdfLocation).then(res => res.arrayBuffer())
    const pdfConsentDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfConsentDoc.getPages()
    for (let i = 0; i <= pages.length; i++) {seekLastPage = i}
    const editPage = pages[seekLastPage-1]
    const currentTime = getCurrentTimeStamp() 
    editPage.drawText(
        `Name: ${participant[headerImportantColumns[0].field]} ${participant[headerImportantColumns[1].field]} 
         Signed at: ${currentTime}`, {
        x: 15,
        y: 30,
        size: 24,
      })
    
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfConsentDoc.save()

    // Trigger the browser to download the PDF document
    download(pdfBytes, "consent.pdf", "application/pdf");

}


const summaryTableModuleHandler = (participantModule) => {
    let template = ``;
    !participantModule ? template += `<span> Not Completed </span>` :
    (participantModule && !participantModule.COMPLETED) ? template += `<span> In Progress</span>` :
    (participantModule && participantModule.COMPLETED) ? template += `<span> ${humanReadableMDYwithTime(participantModule.COMPLETED_TS)} </span>` : ''
    return template;            
}

const summaryTableIncentiveHandler = (participant, incentiveResult) => {
    let template = ``;
    participant[fieldMapping.fName] === 'Abhinav' ? 

    (
        template += `<td></td>
                     <td></td>
                     <td>${incentiveResult[0].dateBaselineIncentiveEligible ? 'Yes': 'No'}</td>
                     <td>${incentiveResult[0].dateIssuedFlag? 'Yes <br/>' + incentiveResult[0].dateIssued : 'No'}</td>
                     <td>${!incentiveResult[0].dateRefusedFlag? 'Yes' : 'No'}</td>
                     <td>${incentiveResult[0].source}</td>`

    )
    :
    (
        template += `<td></td>
                     <td></td>
                     <td>${incentiveResult[1].dateBaselineIncentiveEligible ? 'Yes': 'No'}</td>
                     <td>${incentiveResult[1].dateIssuedFlag? 'Yes <br/>' + incentiveResult[1].dateIssued : 'No'}</td>
                     <td>${!incentiveResult[1].dateRefusedFlag? 'Yes' : 'No'}</td>
                     <td>${incentiveResult[1].source}</td>`
    )

    return template;
}


const summaryTableBaselineMouthwashHandler = (participant, incentiveResult) => {
    let template = ``;
    participant[fieldMapping.fName] === 'Abhinav' ? 

    (
        incentiveResult[0].baselineMouthwash.forEach(x => 
            template += `<tr><td></td>
                     <td></td>
                     <td>${x.refusedActivity ? 'Yes': 'No'}</td>
                     <td>${x.kitSent? 'Yes' : 'No'}</td>
                     <td>${x.method}</td>
                     <td>${x.questionnaire}</td></tr>`
        )
    )
    :
    (
        incentiveResult[1].baselineMouthwash.forEach(x => 
            template += `<tr><td></td>
                        <td></td>
                        <td>${x.refusedActivity ? 'Yes': 'No'}</td>
                        <td>${x.kitSent? 'Yes' : 'No'}</td>
                        <td>${x.method}</td>
                        <td>${x.questionnaire}</td></tr>`
    )
)
    return template;
}

const summaryTableBaselineUrineHandler = (participant, incentiveResult) => {
    let template = ``;
    participant[fieldMapping.fName] === 'Abhinav' ? 

    (
        incentiveResult[0].baselineUrine.forEach(x => 
            template += `<tr><td></td>
                     <td></td>
                     <td>${x.refusedActivity ? 'Yes': 'No'}</td>
                     <td>${x.kitSent? 'Yes' : 'No'}</td>
                     <td>${x.method}</td>
                     <td>${x.questionnaire}</td></tr>`
        )
    )
    :
    (
        incentiveResult[1].baselineUrine.forEach(x => 
            template += `<tr><td></td>
                        <td></td>
                        <td>${x.refusedActivity ? 'Yes': 'No'}</td>
                        <td>${x.kitSent? 'Yes' : 'No'}</td>
                        <td>${x.method}</td>
                        <td>${x.questionnaire}</td></tr>`
    )
)
    return template;
}

const summaryTableBaselineBloodHandler = (participant, incentiveResult) => {
    let template = ``;
    participant[fieldMapping.fName] === 'Abhinav' ? 

    (
        incentiveResult[0].baselineBlood.forEach(x => 
            template += `<tr><td></td>
                     <td></td>
                     <td>${x.refusedActivity ? 'Yes': 'No'}</td>
                     <td>${x.method}</td>
                     <td>${x.questionnaire}</td></tr>`
        )
    )
    :
    (
        incentiveResult[1].baselineBlood.forEach(x => 
            template += `<tr><td></td>
                        <td></td>
                        <td>${x.refusedActivity ? 'Yes': 'No'}</td>
                        <td>${x.method}</td>
                        <td>${x.questionnaire}</td></tr>`
    )
)
    return template;
}

