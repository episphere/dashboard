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

export const humanReadableMDY = (participantDate) => {
  let consentTimeSubmitted = participantDate;
  let submittedDate = String(consentTimeSubmitted);
  submittedDate = submittedDate.split("T");
  submittedDate = submittedDate[0];
  submittedDate = submittedDate.split("-");
  const readableYear = submittedDate[0];
  const readableMonth = submittedDate[1];
  const readableDate = submittedDate[2];
  const readableConsentDate = readableMonth + "/" + readableDate + "/" + readableYear;
  return readableConsentDate; // 10/30/2020
}

export const humanReadableY = () => {
  const currentYear = new Date().getFullYear();
  return currentYear;
} // 2021

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

import { keyToNameObj } from './siteKeysToName.js';

export const siteKeyToName = (key) => {
  
  return keyToNameObj[key];

}

export const getDataAttributes = (el) => {
  let data = {};
  [].forEach.call(el.attributes, function(attr) {
      if (/^data-/.test(attr.name)) {
          var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
              return $1.toUpperCase();
          });
          data[camelCaseName] = attr.value;
      }
  });
  return data;
}

export const userLoggedIn = () => {
  return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          unsubscribe();
          if (user) {
              resolve(true);
          } else {
              resolve(false);
          }
      });
  });
}

export const getIdToken = () => {
  return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          unsubscribe();
          if (user) {
              user.getIdToken().then((idToken) => {
                  resolve(idToken);
          }, (error) => {
              resolve(null);
          });
          } else {
              resolve(null);
          }
      });
  });
};

// shows/hides a spinner when HTTP request is made/screen is loading
export const showAnimation = () => {
  if(document.getElementById('loadingAnimation')) document.getElementById('loadingAnimation').style.display = '';
}

export const hideAnimation = () => {
  if(document.getElementById('loadingAnimation')) document.getElementById('loadingAnimation').style.display = 'none';
}

let api = '';
if(location.host === 'dashboard-myconnect.cancer.gov') api = 'https://api-myconnect.cancer.gov';
else if(location.host === 'dashboard-myconnect-stage.cancer.gov') api = 'https://api-myconnect-stage.cancer.gov';
else api = 'https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net';
export const baseAPI = api;

export const urls = {
  'stage': 'dashboard-myconnect-stage.cancer.gov',
  'prod': 'dashboard-myconnect.cancer.gov'
}

export const conceptToSiteMapping = {
  531629870: 'HP',
  548392715: 'HFHS',
  125001209: 'KPCO',
  327912200: 'KPGA',
  300267574: 'KPHI',
  452412599: 'KPNW',
  303349821: 'MFC',
  657167265: 'Sanford',
  809703864: 'UCM',
  13: 'NCI'
}
