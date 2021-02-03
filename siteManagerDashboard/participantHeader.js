
import fieldMapping from './fieldToConceptIdMapping.js';
import { humanReadableFromISO } from './utils.js';

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

        (headerImportantColumns[x].field === 'Connect_ID' ) ?
            template += `<span><b> ${headerImportantColumns[x].field} </b></span> : ${participant[headerImportantColumns[x].field] !== undefined ?  participant[headerImportantColumns[x].field] : ""} &nbsp;`
        :
        
        (headerImportantColumns[x].field === 'Year(s) in Connect' ) ?
            template += `<span><b> ${headerImportantColumns[x].field} </b></span> : ${getYearsInConnect(participant)} &nbsp;`
        :
        
        (conceptIdMapping[headerImportantColumns[x].field] && conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] === 'Birth Year') ?
            template += `<span><b> DoB </b></span> : ${concatDOB(participant)} &nbsp;`
        :

        (conceptIdMapping[headerImportantColumns[x].field] && conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] === 'Time consent submitted') ?
            template += `<span><b> ${ conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] } </b></span> : ${humanReadableFromISO(participant[fieldMapping.consentDate])} &nbsp;`
        :
            template += `<span><b> ${conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] } </b></span> : ${participant[headerImportantColumns[x].field]  !== undefined ?  participant[headerImportantColumns[x].field]  : ""} &nbsp;`
    }

    template += '</div>'

    return template;
} 

// Year(s) in Connect : 1  

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



function concatDOB(participant){
    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const participantBirthMonth = participant[fieldMapping.birthMonth];
    const participantBirthDate = monthList[parseInt(participant[fieldMapping.birthDay])];
    const participantBirthYear = participant[fieldMapping.birthYear];
    const dateofBirth = participantBirthMonth + '-' + participantBirthDate + '-' + participantBirthYear;
    return dateofBirth; //  02-July-1966  

}