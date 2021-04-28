import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from './navigationBar.js';
import { renderParticipantHeader } from './participantHeader.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import { userProfile, verificationStatus, baselineBOHSurvey, baselineMRESurvey,
    baselineSASSurvey, baselineLAWSurvey, baselineSSN, baselineBloodSample, baselineUrineSample, 
    baselineMouthwashSample, baselineBloodUrineSurvey, baselineMouthwashSurvey, baselineEMR, baselinePayment } from './participantSummaryRow.js';
import { humanReadableMDY, getCurrentTimeStamp } from './utils.js';

const headerImportantColumns = [
    { field: fieldMapping.fName },
    { field: fieldMapping.lName },
];

const { PDFDocument, StandardFonts } = PDFLib

document.body.scrollTop = document.documentElement.scrollTop = 0;

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
    let template = `<div class="container-fluid">`
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

        template += `<div class="table-responsive">

                        <span> <h4 style="text-align: center;"><i style="float: left;" class="fa fa-sort fa-lg"></i> 
                        <i style="float: left;" class="fa fa-filter fa-lg"></i> Participant Summary </h4> </span>

                        <div class="sticky-header">
                            <table class="table table-striped">
                                <thead class="thead-dark sticky-row"> 
                                    <tr>
                                        <th class="sticky-row" scope="col">Icon</th>
                                        <th class="sticky-row" scope="col">Timeline</th>
                                        <th class="sticky-row" scope="col">Category</th>
                                        <th class="sticky-row" scope="col">Item</th>
                                        <th class="sticky-row" scope="col">Status</th>
                                        <th class="sticky-row" scope="col">Date</th>
                                        <th class="sticky-row" scope="col">Setting</th>
                                        <th class="sticky-row" scope="col">Refused</th>
                                        <th class="sticky-row" scope="col">Extra</th>
                                    </tr>
                                </thead>   
                            
                            <tbody>
                                <tr class="row-color-enrollment-dark">
                                    ${consentHandler(participant)}
                                </tr>
                                <tr class="row-color-enrollment-light">
                                    ${hippaHandler(participant)}
                                </tr>
                                <tr class="row-color-enrollment-dark">
                                    ${userProfile(participant)}
                                </tr>
                                <tr class="row-color-enrollment-light">
                                    ${verificationStatus(participant)}
                                </tr>
                                <tr class="row-color-survey-dark">
                                    ${baselineBOHSurvey(participant[fieldMapping.boh], "BOH")}
                                </tr>
                                <tr class="row-color-survey-light">
                                    ${baselineMRESurvey(participant[fieldMapping.mre], "MRE")}
                                </tr>
                                <tr class="row-color-survey-dark">
                                    ${baselineSASSurvey(participant[fieldMapping.sas], "SAS")}
                                </tr>
                                <tr class="row-color-survey-light">
                                    ${baselineLAWSurvey(participant[fieldMapping.law], "LAW")}
                                </tr>
                                <tr class="row-color-survey-dark">
                                    ${baselineSSN(participant[fieldMapping.ssn])}
                                </tr>
                                <tr class="row-color-survey-light">
                                    ${baselineBloodUrineSurvey(participant[fieldMapping.bloodUrineSurvey])}
                                </tr>
                                <tr class="row-color-survey-dark">
                                    ${baselineMouthwashSurvey(participant[fieldMapping.mouthwashSurvey])}
                                </tr>
                                <tr class="row-color-sample-dark">
                                    ${baselineBloodSample(participant)}
                                </tr>                           
                                <tr class="row-color-sample-light">
                                    ${baselineUrineSample(participant)}
                                </tr>
                                <tr class="row-color-sample-dark">
                                    ${baselineMouthwashSample(participant)}
                                </tr>
                                <tr class="row-color-payment">
                                    ${baselinePayment(participant[fieldMapping.baselinePayment])}
                                </tr>
                                <tr class="row-color-emr-light">
                                    ${baselineEMR(participant[fieldMapping.baselineEMR])}
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
    participant[fieldMapping.consentFlag] === (fieldMapping.yes)?
    ( template += `<td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                    <td>Enrollment</td>
                    <td>Agreement</td>
                    <td>Consent</td>
                    <td>Signed</td>
                    <td>${participant[fieldMapping.consentDate] && humanReadableMDY(participant[fieldMapping.consentDate])}</td>
                    <td>${participant[fieldMapping.consentVersion]}</td>
                    <td>N/A</td>
                    <td><a style="color: blue; text-decoration: underline;" target="_blank" id="downloadCopy">Download Link</a></td>
    ` ) : 
    (
        template += `<td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Enrollment</td>
                    <td>Agreement</td>
                    <td>Consent</td>
                    <td>Not Signed</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>Y</td>
                    <td style="color: grey; text-decoration: underline;">Download Link</td>`
    )
    return template;

}


const hippaHandler = (participant) => {
    let template = ``;
    participant && 
    participant[fieldMapping.hippaFlag] === (fieldMapping.yes)?
    ( template += `<td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                    <td>Enrollment</td>
                    <td>Agreement</td>
                    <td>HIPAA</td>
                    <td>Signed</td>
                    <td>${participant[fieldMapping.hippaDate] && humanReadableMDY(participant[fieldMapping.hippaDate])}</td>
                    <td>${participant[fieldMapping.hippaVersion]}</td>
                    <td>N/A</td>
                    <td style="color: grey; text-decoration: underline;">Download Link</td>
    ` ) : 
    (
        template +=`<td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Enrollment</td>
                    <td>Agreement</td>
                    <td>HIPAA</td>
                    <td>Not Signed</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td style="color: grey; text-decoration: underline;">Download Link</td>`
    )
    return template;
}