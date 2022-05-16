import { workflows } from "https://episphere.github.io/biospecimen/src/tubeValidation.js";

export const getCurrentTimeStamp = () => {
  const date = new Date(new Date().toISOString());
  const timeStamp = date.toLocaleString('en-US',  {month: 'long'}) + ' ' + date.getDate() + ',' + date.getFullYear() + ' ' + 
                        date.getHours() + ':'+ date.getMinutes()+':'+ date.getSeconds();
  return timeStamp; // January 28, 2021 16:11:54
}
                
export const humanReadableFromISO = (participantDate) => {
  const submittedDate = new Date(String(participantDate));
  const humanReadable = submittedDate.toLocaleString('en-US', { month: 'long' }) + ' ' + submittedDate.getDate() + ',' + submittedDate.getFullYear();
  return humanReadable; // October 30, 2020
}

export const humanReadableMDY = (participantDate) => {
  const humanReadableDate = new Date(String(participantDate)).toLocaleDateString()
  return humanReadableDate; // 10/30/2020
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

export const urls = {
  'stage': 'dashboard-myconnect-stage.cancer.gov',
  'prod': 'dashboard-myconnect.cancer.gov'
}

let api = '';
if(location.host === urls.prod) api = 'https://api-myconnect.cancer.gov';
else if(location.host === urls.stage) api = 'https://api-myconnect-stage.cancer.gov';
else api = 'https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net';
export const baseAPI = api;

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

export const getAccessToken = async () => {
  const access_token = await getIdToken();
  const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
  const siteKey = access_token !== null ? access_token : localStr.siteKey
  return siteKey;
}

export const checkDefaultFlags = (data) => {
  
  if(!data) return {};
  
  const defaultFlags = {
    948195369: 104430631,
    919254129: 104430631,
    821247024: 875007964,
    828729648: 104430631,
    699625233: 104430631,
    912301837: 208325815,
    253883960: 972455046,
    547363263: 972455046,
    949302066: 972455046,
    536735468: 972455046,
    976570371: 972455046,
    663265240: 972455046,
    265193023: 972455046,
    459098666: 972455046,
    126331570: 972455046,
    311580100: 104430631,
    914639140: 104430631,
    878865966: 104430631,
    167958071: 104430631,
    684635302: 104430631,
    100767870: 104430631
  }

  let missingDefaults = {};

  Object.entries(defaultFlags).forEach(item => {
    if(!data[item[0]]) {
      missingDefaults[item[0]] = item[1];
    }
  });

  return missingDefaults;
}

export const checkPaymentEligibility = async (data, baselineCollections) => {
  
  if(baselineCollections.length === 0) return false;

  const module1 = (data['949302066'] && data['949302066'] === 231311385);
  const module2 = (data['536735468'] && data['536735468'] === 231311385);
  const module3 = (data['976570371'] && data['976570371'] === 231311385);
  const module4 = (data['663265240'] && data['663265240'] === 231311385);
  const bloodCollected = (data['878865966'] && data['878865966'] === 353358909);
  const tubes = baselineCollections[0]['650516960'] === 534621077 ? workflows.research.filter(tube => tube.tubeType === 'Blood tube') : workflows.clinical.filter(tube => tube.tubeType === 'Blood tube');

  let eligible = false;

  if(module1 && module2 && module3 && module4) {
    if(bloodCollected) {
      eligible = true;
    }    
    else {
      baselineCollections.forEach(collection => {
        tubes.forEach(tube => {
          if(collection[tube.concept] && collection[tube.concept]['883732523'] && collection[tube.concept]['883732523'] != 681745422) {
            eligible = true;
          }
        });
      });
    }
  }

  return eligible;
}