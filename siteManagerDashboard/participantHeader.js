
import fieldMapping from './fieldToConceptIdMapping.js'; 

export const headerImportantColumns = [
    // { field: 'Connect_ID' },
    { field: fieldMapping.fName },
    { field: fieldMapping.birthYear },
    { field: fieldMapping.consentDate },
    { field: 'Years in Connect' },

]

export function renderParticipantHeader(participant) {

    let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
    let template = `<div class="alert alert-light" role="alert">`

    headerImportantColumns.forEach(x => template += `<span><b>
        ${conceptIdMapping[x.field] && conceptIdMapping[x.field] != 'Years in Connect' ? 
        conceptIdMapping[x.field]['Variable Label'] || conceptIdMapping[x.field]['Variable Name'] : getYearsInConnect(participant)}
                </b></span> : ${participant[x.field] !== undefined ?  participant[x.field] : ""} &nbsp; `)

    template += '</div>'

    return template
} 


function getCurrentTimeStamp() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDayOfMonth = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    const currentMillisecond = currentDate.getMilliseconds();
    const timeStamp = currentYear + "-" + (currentMonth + 1)  + "-" + currentDayOfMonth + "T" 
                        + currentHour + ":" + currentMinute + ":" + currentSecond + ":" + currentMillisecond;
    
    return timeStamp;
}

function getYearsInConnect(participant) {
    let timeProfileSubmitted = participant[fieldMapping.timeProfileSubmitted]
    let submittedYear = String(timeProfileSubmitted)
    submittedYear = submittedYear.split("-")
    submittedYear = parseInt(submittedYear[0])
    const currentTime = getCurrentTimeStamp()
    let currentYear = currentTime.split("-")
    currentYear = parseInt(currentYear[0])
    let totalYears =  currentYear - submittedYear
    totalYears === 0 ? totalYears = '< 1' : totalYears
    let yearsInConnect = `Year(s) in connect: ${totalYears}`
    return yearsInConnect;  
}

