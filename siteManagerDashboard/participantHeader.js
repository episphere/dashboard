
import fieldMapping from './fieldToConceptIdMapping.js';
import { humanReadableMDY } from './utils.js';
import { keyToNameObj } from './siteKeysToName.js';

export const headerImportantColumns = [
    { field: 'Connect_ID' },
    { field: fieldMapping.fName },
    { field: fieldMapping.lName },
    { field: fieldMapping.birthYear },
    { field: fieldMapping.consentFlag },
    { field: fieldMapping.verifiedFlag },
    { field: 'Site' },
    { field: 'Year(s) in Connect' },
    { field: 'Status' }
];


export const renderParticipantHeader = (participant) => {

    let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
    let template = `<div class="alert alert-light .sticky-participant-header" role="alert">`

    for (let x in headerImportantColumns) {

        (headerImportantColumns[x].field === 'Connect_ID' ) ?
            template += `<span><b> ${headerImportantColumns[x].field} </b></span> : ${participant[headerImportantColumns[x].field] !== undefined ?  participant[headerImportantColumns[x].field] : ""} &nbsp;`
        :
        
        (headerImportantColumns[x].field === 'Status' ) ?
            template += `<span><b> Status </b></span> : Active &nbsp;`
        :

        (headerImportantColumns[x].field === 'Year(s) in Connect' ) ?
            template += `<span><b> ${headerImportantColumns[x].field} </b></span> : ${getYearsInConnect(participant)} &nbsp;`
        :

        (headerImportantColumns[x].field === 'Site' ) ?
            template += `<span><b> ${headerImportantColumns[x].field} </b></span> : ${renderSiteLocation(participant)} &nbsp;`
        :
        
        (conceptIdMapping[headerImportantColumns[x].field] && conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] === 'Birth Year') ?
            template += `<span><b> DoB </b></span> : ${concatDOB(participant)} &nbsp;`
        :
        
        (conceptIdMapping[headerImportantColumns[x].field] && conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] === 'Consent submitted') ?
            (participant[fieldMapping.consentFlag] === (fieldMapping.yes) ? 
                template += `<span><b> Consented</b></span> : ${humanReadableMDY(participant[fieldMapping.consentDate])} &nbsp;`
                :
                template += `<span><b> Not Consented</b></span> : N/A &nbsp;`)
        :

        (conceptIdMapping[headerImportantColumns[x].field] && conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] === 'Verification status') ?
            (
                (participant[fieldMapping.verifiedFlag] === fieldMapping.verified) ? 
                    (template += `<span><b> Verified</b></span> : ${humanReadableMDY(participant[fieldMapping.verficationDate])} &nbsp;`)
                    :
                (participant[fieldMapping.verifiedFlag] === fieldMapping.cannotBeVerified) ? 
                    (template += `<span><b>Can't be Verified</b></span> : ${humanReadableMDY(participant[fieldMapping.verficationDate])} &nbsp;`)
                    :
                (participant[fieldMapping.verifiedFlag] === fieldMapping.notYetVerified) ? 
                    (template += `<span><b>Not yet Verified</b></span> : ${humanReadableMDY(participant[fieldMapping.verficationDate])} &nbsp;`)
                    :
                (participant[fieldMapping.verifiedFlag] === fieldMapping.duplicate) ? 
                    (template += `<span><b>Duplicate</b></span> : ${humanReadableMDY(participant[fieldMapping.verficationDate])} &nbsp;`)
                    :
                    (template += `<span><b>Outreach Timed Out</b></span> : ${humanReadableMDY(participant[fieldMapping.verficationDate])} &nbsp;`)
            )
            :
            template += `<span><b> ${conceptIdMapping[headerImportantColumns[x].field]['Variable Label'] } </b></span> : ${participant[headerImportantColumns[x].field]  !== undefined ?  participant[headerImportantColumns[x].field]  : ""} &nbsp;`
    }

    template += '</div>'

    return template;
} 

// Year(s) in Connect : 1  

const getYearsInConnect = (participant) => {
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



const concatDOB = (participant) => {
    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const participantBirthMonth = participant[fieldMapping.birthMonth];
    const participantBirthDate = participant[fieldMapping.birthDay];
    const participantBirthYear = participant[fieldMapping.birthYear];
    const dateofBirth = participantBirthMonth + '/' + participantBirthDate + '/' + participantBirthYear;
    return dateofBirth; //  07/02/1966  

}

const renderSiteLocation = (participant) => {
    const siteHealthcareProvider = participant[fieldMapping.healthcareProvider];
    return keyToNameObj[siteHealthcareProvider];
}