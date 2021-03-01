import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import { getCurrentTimeStamp } from './utils.js';
import { renderParticipantHeader } from './participantHeader.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import participantInfoResponse from './participantInfoResponse.js';
import { userProfile, verificationStatus, baselineSurvey, baselineBOHSurvey, baselineMRESurvey,
    baselineSASSurvey, baselineLAWSurvey, baselineSSN, baselineBloodSample, baselineUrineSample, 
    baselineMouthwashSample, baselineBloodUrineSurvey, baselineMouthwashSurvey, baselineEMR, baselinePayment } from './participantSummaryRow.js';
import { humanReadableMDY } from './utils.js';

const headerImportantColumns = [
    { field: fieldMapping.fName },
    { field: fieldMapping.lName },
];

const { PDFDocument, StandardFonts } = PDFLib

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

        // participant info displayed is from MOCK DATA & would be swapped once
        // real data is  active
        let participantInfo = [];
                    participantInfo.push(participantInfoResponse);
                    localStorage.setItem("participantInfo", JSON.stringify(participantInfo));
                    let participantInfoResult = JSON.parse(localStorage.getItem("participantInfo"));
                    participantInfoResult = participantInfoResult[0];

        template += `<div class="table-responsive">

                        <span> <h4 style="text-align: center;"><i style="float: left;" class="fa fa-sort fa-lg"></i> 
                        <i style="float: left;" class="fa fa-filter fa-lg"></i> Participant Summary </h4> </span>

                        <div >
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
                                <tr>
                                    ${userProfile(participantInfoResult[fieldMapping.userProfile])}
                                </tr>
                                <tr>
                                    ${verificationStatus(participantInfoResult[fieldMapping.ifVeriffied])}
                                </tr>
                                <tr>
                                    ${baselineBOHSurvey(participantInfoResult[fieldMapping.boh], "BOH")}
                                </tr>
                                <tr>
                                    ${baselineMRESurvey(participantInfoResult[fieldMapping.mre], "MRE")}
                                </tr>
                                <tr>
                                    ${baselineSASSurvey(participantInfoResult[fieldMapping.sas], "SAS")}
                                </tr>
                                <tr>
                                    ${baselineLAWSurvey(participantInfoResult[fieldMapping.law], "LAW")}
                                </tr>
                                <tr>
                                    ${baselineSSN(participantInfoResult[fieldMapping.ssn])}
                                </tr>
                                <tr>
                                    ${baselineBloodUrineSurvey(participantInfoResult[fieldMapping.bloodUrineSurvey])}
                                </tr>
                                <tr>
                                    ${baselineMouthwashSurvey(participantInfoResult[fieldMapping.mouthwashSurvey])}
                                </tr>
                                <tr>
                                    ${baselineBloodSample(participantInfoResult)}
                                </tr>                           
                                <tr>
                                    ${baselineUrineSample(participantInfoResult)}
                                </tr>
                                <tr>
                                    ${baselineMouthwashSample(participantInfoResult)}
                                </tr>
                                <tr>
                                    ${baselineEMR(participantInfoResult[fieldMapping.baselineEMR])}
                                </tr>
                                <tr>
                                    ${baselinePayment(participantInfoResult[fieldMapping.baselinePaymentFlag])}
                                </tr>
                                
                                <tr>
                                    ${consentHandler(participant)}
                                </tr>
                                <tr>
                                   ${hippaHandler(participant)}
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
                    <td>Timeline</td>
                    <td>Agreement</td>
                    <td>Consent</td>
                    <td>Signed</td>
                    <td>${participant[fieldMapping.consentDate] && humanReadableMDY(participant[fieldMapping.consentDate])}</td>
                    <td>${participant[fieldMapping.consentVersion]}</td>
                    <td>N/A</td>
                    <td><a style="color: blue; text-decoration: underline;" target="_blank" id="downloadCopy">Download Link</a></td>
    ` ) : 
    (
        template += `<td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                    <td>Timeline</td>
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
                    <td>N/A</td>
                    <td>Agreement</td>
                    <td>HIPPA</td>
                    <td>Signed</td>
                    <td>${participant[fieldMapping.hippaDate] && humanReadableMDY(participant[fieldMapping.hippaDate])}</td>
                    <td>${participant[fieldMapping.hippaVersion]}</td>
                    <td>N/A</td>
                    <td style="color: grey; text-decoration: underline;">Download Link</td>
    ` ) : 
    (
        template +=`<td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>N/A</td>
                    <td>Agreement</td>
                    <td>HIPPA</td>
                    <td>Not Signed</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td style="color: grey; text-decoration: underline;">Download Link</td>`
    )
    return template;
}