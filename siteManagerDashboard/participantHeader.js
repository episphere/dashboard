
import fieldMapping from './fieldToConceptIdMapping.js';

export const headerImportantColumns = [
    { field: 'Connect_ID' },
    { field: fieldMapping.fName },
    { field: fieldMapping.lName },
    { field: fieldMapping.birthYear },
    { field: fieldMapping.consentDate },
    { field: 'Year(s) in Connect' },

];

export function renderParticipantHeader(participant) {

    let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
    let template = `<div class="alert alert-light" role="alert">`

    for (let x in headerImportantColumns) {

        if (headerImportantColumns[x].field === 'Connect_ID' ) {
            template += `<span><b> ${headerImportantColumns[x].field} </b></span> : ${participant[headerImportantColumns[x].field] !== undefined ?  participant[headerImportantColumns[x].field] : ""} &nbsp;`
        }

        else if (headerImportantColumns[x].field === 'Year(s) in Connect' ) {
            template += `<span><b> ${headerImportantColumns[x].field} </b></span> : ${getYearsInConnect(participant)} &nbsp;`
        }

        else if (conceptIdMapping[headerImportantColumns[x].field] && conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] === 'Time consent submitted') {
            template += `<span><b> ${ conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] } </b></span> : ${humanReadbaleFromISO(participant)} &nbsp;`
        }
        else {
            template += `<span><b> ${conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] } </b></span> : ${participant[headerImportantColumns[x].field]  !== undefined ?  participant[headerImportantColumns[x].field]  : ""} &nbsp;`
        }
    }

    template += '</div>'

    return template;
} 


function getYearsInConnect(participant) {
    let timeProfileSubmitted = participant[fieldMapping.timeProfileSubmitted];
    let submittedYear = String(timeProfileSubmitted);
    submittedYear = submittedYear.split("-");
    submittedYear = parseInt(submittedYear[0]);
    const currentTime = new Date().toISOString();
    let currentYear = currentTime.split("-");
    currentYear = parseInt(currentYear[0]);
    let totalYears =  currentYear - submittedYear;
    totalYears <= 0 ? totalYears = '< 1' : totalYears;
    let yearsInConnect = totalYears;
    return yearsInConnect;
}

function humanReadbaleFromISO(participant) {
    let consentTimeSubmitted = participant[fieldMapping.consentDate]
    let submittedDate = String(consentTimeSubmitted);
    submittedDate = submittedDate.split("T");
    submittedDate = submittedDate[0]
    submittedDate = submittedDate.split("-");
    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let consentYear = submittedDate[0]
    let consentMonth = monthList[parseInt(submittedDate[1])]
    let consentDate = submittedDate[2]
    let readableConsentDate = consentMonth + " " + consentDate + ", " + consentYear
    return readableConsentDate
}