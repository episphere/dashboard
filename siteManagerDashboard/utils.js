
export function getCurrentTimeStamp() {

    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const currentMonth = monthList[currentDate.getMonth()];
    const currentDayOfMonth = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    const timeStamp = currentMonth +" "+ currentDayOfMonth + ", "+ currentYear + " " 
                        + currentHour + ":" + currentMinute + ":" + currentSecond;
    return timeStamp; // January 28, 2021 16:11:54
    
  }
                  
export function humanReadableFromISO(participantDate) {
    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let consentTimeSubmitted = participantDate;
    let submittedDate = String(consentTimeSubmitted);
    submittedDate = submittedDate.split("T");
    submittedDate = submittedDate[0];
    submittedDate = submittedDate.split("-");
    const readableYear = submittedDate[0];
    const readableMonth = monthList[parseInt(submittedDate[1])-1];
    const readableDate = submittedDate[2];
    const readableConsentDate = readableMonth + " " + readableDate + ", " + readableYear;
    return readableConsentDate; // October 30, 2020
}

export function humanReadableMDY(participantDate) {
  let consentTimeSubmitted = participantDate;
  let submittedDate = String(consentTimeSubmitted);
  submittedDate = submittedDate.split("T");
  submittedDate = submittedDate[0];
  submittedDate = submittedDate.split("-");
  const readableYear = submittedDate[0];
  const readableMonth = parseInt(submittedDate[1])-1
  const readableDate = submittedDate[2];
  const readableConsentDate = readableMonth + "/" + readableDate + "/" + readableYear;
  return readableConsentDate; // 10, 30, 2020
}