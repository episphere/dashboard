
export function getCurrentTimeStamp() {

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const currentDate = new Date();
    const currentMonth = month[currentDate.getMonth()];
    const currentDayOfMonth = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    const timeStamp = currentMonth +" "+ currentDayOfMonth + ", "+ currentYear + " " 
                        + currentHour + ":" + currentMinute + ":" + currentSecond;

    return timeStamp;
  }
                    
// remove this
  export const humanReadableMDY = (participantDate) => {
    let consentTimeSubmitted = participantDate;
    let submittedDate = String(consentTimeSubmitted);
    submittedDate = submittedDate.split("T");
    submittedDate = submittedDate[0];
    submittedDate = submittedDate.split("-");
    const readableYear = submittedDate[0];
    const readableMonth = parseInt(submittedDate[1])-1
    const readableDate = submittedDate[2];
    const readableConsentDate = readableMonth + "/" + readableDate + "/" + readableYear;
    return readableConsentDate; // 10/30/2020
  }