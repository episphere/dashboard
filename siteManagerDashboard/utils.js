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
  const dateofBirth = participantBirthMonth + '-' + participantBirthDate + '-' + participantBirthYear;
  return dateofBirth; //  07-02-1966  

}




export const getCurrentTimeStamp = () => {

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
                
export const humanReadableFromISO = (participantDate) => {
  const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let timeSubmitted = participantDate;
  let submittedDate = String(timeSubmitted);
  submittedDate = submittedDate.split("T");
  submittedDate = submittedDate[0];
  submittedDate = submittedDate.split("-");
  const readableYear = submittedDate[0];
  const readableMonth = monthList[parseInt(submittedDate[1])-1];
  const readableDate = submittedDate[2];
  const readableConsentDate = readableMonth + " " + readableDate + ", " + readableYear;
  return readableConsentDate; // October 30, 2020
}

export const humanReadableMDYFromISO = (participantDate) => {
let consentTimeSubmitted = participantDate;
let submittedDate = String(consentTimeSubmitted);
submittedDate = submittedDate.split("T");
console.log('submittedDate1', submittedDate)
submittedDate = submittedDate[0];
submittedDate = submittedDate.split("-");
const readableYear = submittedDate[0];
const readableMonth = submittedDate[1];
const readableDate = submittedDate[2];
const readableConsentDate = readableMonth + "-" + readableDate + "-" + readableYear;
return readableConsentDate; // 10-30-2020
}

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

export const humanReadableMDYwithTime = (participantDate) => {
let consentTimeSubmitted = participantDate;
let submittedDate = String(consentTimeSubmitted);
submittedDate = submittedDate.split("T");
let submittedTime = submittedDate[1];
submittedTime = submittedTime.split(".")
submittedTime = submittedTime[0]
submittedDate = submittedDate[0];
submittedDate = submittedDate.split("-");
const readableYear = submittedDate[0];
const readableMonth = parseInt(submittedDate[1])-1
const readableDate = submittedDate[2];
const readableConsentDateTime = readableMonth + "/" + readableDate + "/" + readableYear + " " + submittedTime;
return readableConsentDateTime; // 10/30/2020 20:30:22
}

// Function prevents the user from internal navigation if unsaved changes are present
export const internalNavigatorHandler = (counter) => {
setTimeout(() => {
  document.getElementById('navBarLinks').addEventListener('click', function(e) {
      let getSaveFlag = JSON.parse(localStorage.getItem("flags"));
      let getCounter = JSON.parse(localStorage.getItem("counters"));
      if (getCounter > 0 && getSaveFlag === false) {
          // Cancel the event and show alert that the unsaved changes would be lost 
          let confirmFlag = !confirm("Unsaved changes detected. Navigate away?");
          if (confirmFlag) {
            // when user decides to stay on the page
              e.preventDefault();
              return;
          } 
          else {
              counter = 0;
              localStorage.setItem("counters", JSON.stringify(counter));
          }
          return;
      }
  })
}, 50);
}