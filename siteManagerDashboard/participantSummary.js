import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from './navigationBar.js';
import { renderParticipantHeader } from './participantHeader.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import { userProfile, verificationStatus, baselineBOHSurvey, baselineMRESurvey,
    baselineSASSurvey, baselineLAWSurvey, baselineSSN, baselineBloodSample, baselineUrineSample, 
    baselineMouthwashSample, baselineBloodUrineSurvey, baselineMouthwashSurvey, baselineEMR, baselinePayment } from './participantSummaryRow.js';
import { humanReadableMDY, getCurrentTimeStamp, conceptToSiteMapping } from './utils.js';

const headerImportantColumns = [
    { field: fieldMapping.fName },
    { field: fieldMapping.mName },
    { field: fieldMapping.lName },
    { field: fieldMapping.suffix }
];

const { PDFDocument, StandardFonts } = PDFLib

document.body.scrollTop = document.documentElement.scrollTop = 0;

export const renderParticipantSummary = (participant) => {
    const isParent = localStorage.getItem('isParent')
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
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

                        <span> <h4 style="text-align: center;">Participant Summary </h4> </span>

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
                                    ${baselineBOHSurvey(participant)}
                                </tr>
                                <tr class="row-color-survey-light">
                                    ${baselineMRESurvey(participant)}
                                </tr>
                                <tr class="row-color-survey-dark">
                                    ${baselineSASSurvey(participant)}
                                </tr>
                                <tr class="row-color-survey-light">
                                    ${baselineLAWSurvey(participant)}
                                </tr>
                                <tr class="row-color-survey-dark">
                                    ${baselineSSN(participant)}
                                </tr>
                                <tr class="row-color-survey-light">
                                    ${baselineBloodUrineSurvey(participant)}
                                </tr>
                                <tr class="row-color-survey-dark">
                                    ${baselineMouthwashSurvey(participant)}
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
                                ${participant[fieldMapping.revokeHIPAA] === fieldMapping.yes ? 
                                    (`<tr class="row-color-enrollment-dark"> ${hipaaRevocation(participant)} </tr>`) : (``)}
                                ${participant[fieldMapping.destroyData] === fieldMapping.yes ? 
                                    (`<tr class="row-color-enrollment-dark"> ${dataDestroy(participant)} </tr>`): (``)}
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
            renderDownload(participant, humanReadableMDY(participant[fieldMapping.consentDate]), `./forms/Consent/${conceptToSiteMapping[participant[fieldMapping.healthcareProvider]]}_consent_V1.0.pdf`, getHealthcareProviderCoordinates(conceptToSiteMapping[participant[fieldMapping.healthcareProvider]], 'consent'));
        })
    }
    const b = document.getElementById('downloadCopyHIPAA');
    if (b) {
        b.addEventListener('click',  () => {  
            renderDownload(participant, humanReadableMDY(participant[fieldMapping.hippaDate]), `./forms/HIPAA/${conceptToSiteMapping[participant[fieldMapping.healthcareProvider]]}_HIPAA_V1.0.pdf`, getHealthcareProviderCoordinates(conceptToSiteMapping[participant[fieldMapping.healthcareProvider]], 'hipaa'));
        })
    }
    const c = document.getElementById('downloadCopyHipaaRevoc');
    if (c) {
        c.addEventListener('click',  () => {  
            renderDownload(participant, humanReadableMDY(participant[fieldMapping.dateHIPAARevoc]), './forms/HIPAA Revocation/HIPAA_Revocation_V1.0.pdf', getRevocationCoordinates());
        })
    }
    const d = document.getElementById('downloadCopyDataDestroy');
    if (d) {
        d.addEventListener('click',  () => {  
            renderDownload(participant, humanReadableMDY(participant[fieldMapping.dateDataDestroy]), './forms/Data Destruction/Data_Destruction_V1.0.pdf', getRevocationCoordinates());
        })
    }
 
}

const getHealthcareProviderCoordinates = (healthcareProvider, source) => {
    let coordinates = ``;
    if (source === 'consent') {
        switch(healthcareProvider) {
            case 'Sanford':
                coordinates = [{x: 110, y: 400}, {x0: 110, y0: 360}, {x1: 110, y1: 330}]
                break;
            case 'HP':
                coordinates = [{x: 110, y: 420}, {x0: 110, y0: 380}, {x1: 110, y1: 340}]
                break;
            case 'MFC':
                coordinates = [{x: 110, y: 420}, {x0: 110, y0: 380}, {x1: 110, y1: 340}]
                break;
            case 'KPCO':
                coordinates = [{x: 110, y: 395}, {x0: 110, y0: 355}, {x1: 110, y1: 315}]
                break;
            case 'KPGA':
                coordinates = [{x: 110, y: 395}, {x0: 110, y0: 355}, {x1: 110, y1: 315}]
                break;
            case 'KPHI':
                coordinates = [{x: 110, y: 365}, {x0: 110, y0: 325}, {x1: 110, y1: 285}]
                break;
            case 'KPNW':
                coordinates = [{x: 110, y: 385}, {x0: 110, y0: 345}, {x1: 110, y1: 305}]
                break;
            case 'UCM':
                coordinates = [{x: 110, y: 385}, {x0: 110, y0: 345}, {x1: 110, y1: 310}]
                break;
            case 'HFHS':
                coordinates = [{x: 110, y: 380}, {x0: 110, y0: 340}, {x1: 110, y1: 302}]
                break;
            default:
                coordinates = [{x: 110, y: 400}, {x0: 110, y0: 410}, {x1: 110, y1: 330}]

        }
        return coordinates  // x0/y0: date x/y: name x1/y1: signature
        // to go down - decrease the number & vice-versa
    } else {
        switch(healthcareProvider) {
            case 'Sanford':
                coordinates = [{x: 100, y: 410}, {x0: 100, y0: 370}, {x1: 100, y1: 452}]
                break;
            case 'HP':
                coordinates = [{x: 100, y: 415}, {x0: 100, y0: 370}, {x1: 100, y1: 465}]
                break;
            case 'MFC':
                coordinates = [{x: 100, y: 425}, {x0: 100, y0: 380}, {x1: 100, y1: 465}]
                break;
            case 'KPCO':
                coordinates = [{x: 100, y: 410}, {x0: 100, y0: 370}, {x1: 100, y1: 450}]
                break;
            case 'KPGA':
                coordinates = [{x: 100, y: 345}, {x0: 100, y0: 300}, {x1: 100, y1: 385}]
                break;
            case 'KPHI':
                coordinates = [{x: 110, y: 410}, {x0: 110, y0: 370}, {x1: 110, y1: 450}]
                break;
            case 'KPNW':
                coordinates = [{x: 100, y: 410}, {x0: 100, y0: 370}, {x1: 100, y1: 450}]
                break;
            case 'UCM':
                coordinates = [{x: 100, y: 410}, {x0: 100, y0: 370}, {x1: 100, y1: 450}]
                break;
            case 'HFHS':
                coordinates = [{x: 100, y: 440}, {x0: 100, y0: 400}, {x1: 100, y1: 480}]
                break;
            default:
                coordinates = [{x: 100, y: 410}, {x0: 100, y0: 420}, {x1: 100, y1: 450}]
        }
        return coordinates 
    }
}

const getRevocationCoordinates = () => {
    const coordinates = [{x: 150, y: 425}, {x0: 150, y0: 380}, {x1: 150, y1: 405}];
    return coordinates;
}

const renderDownload = async (participant, timeStamp, fileLocation, coordinates) => {
    let fileLocationDownload = fileLocation.slice(2)
    const participantPrintName = createPrintName(participant)
    const participantSignature = createSignature(participant)
    let seekLastPage;
    const pdfLocation = fileLocation;
    const existingPdfBytes = await fetch(pdfLocation).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    const pages = pdfDoc.getPages();
    for (let i = 0; i <= pages.length; i++) {seekLastPage = i}
    const editPage = pages[seekLastPage-1];
    editPage.drawText(`
    ${participantPrintName}`, {
                x: coordinates[0].x,
                y: coordinates[0].y,
                size: 24,
      });

    editPage.drawText(`
    ${timeStamp}`, {
                x: coordinates[1].x0,
                y: coordinates[1].y0,
                size: 24,
    });

    editPage.drawText(`
    ${participantSignature}`, {
        x: coordinates[2].x1,
        y: coordinates[2].y1,
        size: 20,
        font: helveticaFont,
      });
    
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Trigger the browser to download the PDF document
    download(pdfBytes, fileLocationDownload, "application/pdf");
}

const createSignature = (participant) => {
    const middleName = participant[fieldMapping.consentMiddleName] !== undefined ? participant[fieldMapping.consentMiddleName] : ``
    const createParticipantSignature = participant[fieldMapping.consentFirstName] + " " + middleName + " " + participant[fieldMapping.consentLastName]
    return createParticipantSignature;
}

const createPrintName = (participant) => {
    const firstName = participant[fieldMapping.consentFirstName]
    const middleName = participant[fieldMapping.consentMiddleName] !== undefined ? participant[fieldMapping.consentMiddleName] : ``
    const lastName = participant[fieldMapping.consentLastName]
    const suffix = participant[fieldMapping.consentSuffix] !== undefined ? fieldMapping[participant[fieldMapping.consentSuffix]] : ``
    const createParticipantPrintName = firstName +  " " + middleName + " " + lastName + " " + suffix
    return createParticipantPrintName;
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
                    <td>N/A</td>
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
                    <td><a style="color: blue; text-decoration: underline;" target="_blank" id="downloadCopyHIPAA">Download Link</a></td>
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

const hipaaRevocation = (participant) => {
    let template = ``;
    participant && 
    participant[fieldMapping.revokeHIPAA] === (fieldMapping.yes) ?
    ( participant[fieldMapping.signedHIPAARevoc] === fieldMapping.yes ?
        ( template += `<td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                        <td>Revocation</td>
                        <td>Agreement</td>
                        <td>HIPAA Revoc Form</td>
                        <td>Signed</td>
                        <td>${(participant[fieldMapping.dateHIPAARevoc] !== undefined) ? humanReadableMDY(participant[fieldMapping.dateHIPAARevoc]) : `N/A`}</td>
                        <td>${(participant[fieldMapping.versionHIPAARevoc] !== undefined) ? participant[fieldMapping.versionHIPAARevoc] : `N/A`}</td>
                        <td>N/A</td>
                        <td><a style="color: blue; text-decoration: underline;" target="_blank" id="downloadCopyHipaaRevoc">Download Link</a></td>
        ` ) : 
        ( template += `<td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                        <td>Revocation</td>
                        <td>Agreement</td>
                        <td>HIPAA Revoc Form</td>
                        <td>Not Signed</td>
                        <td>${(participant[fieldMapping.dateHIPAARevoc] !== undefined) ? humanReadableMDY(participant[fieldMapping.dateHIPAARevoc]) : `N/A`}</td>
                        <td>${(participant[fieldMapping.versionHIPAARevoc] !== undefined) ? participant[fieldMapping.versionHIPAARevoc] : `N/A`}</td>
                        <td>N/A</td>
                        <td style="color: grey; text-decoration: underline;">Download Link</td>` 
    ) ):
     (
        template +=`<td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Revocation</td>
                    <td>Agreement</td>
                    <td>HIPAA Revoc Form</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td><a style="color: blue; text-decoration: underline;" target="_blank" id="downloadCopyHipaaRevoc">Download Link</a></td>`
    )
    return template;
}

const dataDestroy = (participant) => {
    let template = ``;
    participant && 
    participant[fieldMapping.destroyData] === (fieldMapping.yes) ?
        ( participant[fieldMapping.signedDataDestroy] === fieldMapping.yes ?
            ( template += `<td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                            <td>Destruction</td>
                            <td>Agreement</td>
                            <td>Data Destroy Form</td>
                            <td>Signed</td>
                            <td>${(participant[fieldMapping.dateDataDestroy] !== undefined) ? humanReadableMDY(participant[fieldMapping.dateDataDestroy]) : `N/A`}</td>
                            <td>${(participant[fieldMapping.versionDataDestroy] !== undefined) ? participant[fieldMapping.versionDataDestroy] : `N/A` }</td>      
                            <td>N/A</td>
                            <td><a style="color: blue; text-decoration: underline;" target="_blank" id="downloadCopyDataDestroy">Download Link</a></td>
            ` ) : 
        ( template += `<td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                        <td>Destruction</td>
                        <td>Agreement</td>
                        <td>Data Destroy Form</td>
                        <td>Not Signed</td>
                        <td>${(participant[fieldMapping.dateDataDestroy] !== undefined) ? humanReadableMDY(participant[fieldMapping.dateDataDestroy]) : `N/A`}</td>
                        <td>${(participant[fieldMapping.versionDataDestroy] !== undefined) ? participant[fieldMapping.versionDataDestroy] : `N/A` }</td>      
                        <td>N/A</td>
                        <td style="color: grey; text-decoration: underline;">Download Link</td>
        ` )  )
    : 
    (
        template +=`<td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Destruction</td>
                    <td>Agreement</td>
                    <td>Data Destroy Form</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td><a style="color: blue; text-decoration: underline;" target="_blank" id="downloadCopyDataDestroy">Download Link</a></td>`
    )
    return template;
}