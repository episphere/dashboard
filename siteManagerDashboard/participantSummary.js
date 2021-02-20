import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import { getCurrentTimeStamp } from './utils.js';
import { renderParticipantHeader } from './participantHeader.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import { baselineSurvey, baselineBloodSample, baselineUrineSample, baselineMouthwashSample, 
        baselineBloodUrineSurvey, biAnnualSurvey } from './participantSummaryRow.js';
import { humanReadableMDY } from './utils.js';

const headerImportantColumns = [
    { field: fieldMapping.fName },
    { field: fieldMapping.lName },
];

const { degrees, PDFDocument, StandardFonts } = PDFLib

export const renderParticipantSummary = (participant) => {

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantSummaryBtn').classList.add('active');
    if (participant !== null) {
        mainContent.innerHTML = render(participant);
        downloadCopyHandler(participant)
    }
}

export const render = (participant) => {
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
                        <div style="height: 600px; overflow: scroll;">
                            <table class="table table-borderless">
                                <thead style="position: sticky;" class="thead-dark"> 
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
                                    ${baselineSurvey(participant.Module1, "BOH")}
                                </tr>
                                <tr>
                                    ${baselineSurvey(participant.Module2, "MRE")}
                                </tr>
                                <tr>
                                    ${baselineSurvey(participant.Module3, "SAS")}
                                </tr>
                                <tr>
                                    ${baselineSurvey(participant.Module4, "LAW")}
                                </tr>
                                <tr>
                                    ${baselineSurvey(participant.ModuleSsn, "SSN")}
                                </tr>
                                <tr>
                                    ${baselineBloodSample(participant)}
                                </tr>
                                <tr>
                                    ${baselineUrineSample(participant)}
                                </tr>
                                <tr>
                                    ${baselineMouthwashSample(participant)}
                                </tr>
                                <tr>
                                    ${baselineBloodUrineSurvey(participant)}
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
                                    <td>N/A</td>
                                </tr>
                                <tr>
                                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                                    <td>Annual</td>
                                    <td>EMR</td>
                                    <td>N/A</td>
                                    <td>Not Pushed</td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                    <td>Y/N</td>
                                    <td>N/A</td>
                                </tr>
                                <tr>
                                    ${consentHandler(participant)}
                                </tr>
                                <tr>
                                    <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                                    <td>Baseline</td>
                                    <td>Agreement</td>
                                    <td>HIPAA</td>
                                    <td>Submitted</td>
                                    <td>Date submitted</td>
                                    <td>N/A</td>
                                    <td>N/A</td>
                                    <td>Download link</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                    </div>`

   
                   
        template +=`</div></div>`

    }
    return template;


}

const downloadCopyHandler = (participant) => {
    const a = document.getElementById('downloadCopy');
    if (a) {
        a.addEventListener('click',  () => {  
            renderDownloadConsentCopy(participant);
        })
    }
}

const renderDownloadConsentCopy = async (participant) => {
    const participantSignature = createSignature(participant)
    let seekLastPage;
    const pdfLocation = './consent.pdf';
    const existingPdfBytes = await fetch(pdfLocation).then(res => res.arrayBuffer());
    const pdfConsentDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfConsentDoc.embedFont(StandardFonts.TimesRomanItalic);
    const pages = pdfConsentDoc.getPages();
    for (let i = 0; i <= pages.length; i++) {seekLastPage = i}
    const editPage = pages[seekLastPage-1];
    const currentTime = getCurrentTimeStamp();

    editPage.drawText(`
    ${participant[headerImportantColumns[0].field]} ${participant[headerImportantColumns[1].field]} 
    ${currentTime}`, {
                x: 200,
                y: 625,
                size: 24,
      });

    editPage.drawText(`
    ${participantSignature}`, {
        x: 200,
        y: 560,
        size: 34,
        font: helveticaFont,
      });
    
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfConsentDoc.save();

    // Trigger the browser to download the PDF document
    download(pdfBytes, "consent.pdf", "application/pdf");
}


const createSignature = (participant) => {
    let lastInitial =  participant[headerImportantColumns[1].field]
    lastInitial = lastInitial.split('')[0]
    const createParticipantSignature = participant[headerImportantColumns[0].field]+"."+lastInitial
    return createParticipantSignature;
}

const consentHandler = (participant) => {
    
    let template = ``;
    participant && 
    participant[fieldMapping.consentFlag] ?
    ( template += `<td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                    <td>Baseline</td>
                    <td>Agreement</td>
                    <td>Consent</td>
                    <td>Submitted</td>
                    <td>${participant[fieldMapping.consentDate] && humanReadableMDY(participant[fieldMapping.consentDate])}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td><a style="color: blue; text-decoration: underline;" target="_blank" id="downloadCopy">Download Link</a></td>
    ` ) : 
    (
        template += `<td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                    <td>Baseline</td>
                    <td>Agreement</td>
                    <td>Consent</td>
                    <td>Not Submitted</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>Y</td>
                    <td style="color: grey; text-decoration: underline;">Download Link</td>`
    )
    return template;

}