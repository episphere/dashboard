import { renderParticipantLookup } from './participantLookup.js';
import { renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass } from './navigationBar.js';
import { renderTable, filterdata, renderData, addEventFilterData, activeColumns, dropdownTriggerAllParticipants, renderLookupSiteDropdown, reMapFilters } from './participantCommons.js';
import { renderParticipantDetails } from './participantDetails.js';
import { renderParticipantSummary } from './participantSummary.js';
import { renderParticipantMessages } from './participantMessages.js';
import { renderSiteMessages } from './siteMessages.js';
import { renderParticipantWithdrawal } from './participantWithdrawal.js';
import { renderStoreNotificationSchema } from './notifications/storeNotifications.js';
import { renderRetrieveNotificationSchema } from './notifications/retrieveNotifications.js';
import { internalNavigatorHandler, getDataAttributes, getIdToken, userLoggedIn, baseAPI, urls, getAccessToken } from './utils.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import { nameToKeyObj } from './siteKeysToName.js';
import { renderAllCharts } from './participantChartsRender.js';
import { firebaseConfig as devFirebaseConfig } from "./dev/config.js";
import { firebaseConfig as stageFirebaseConfig } from "./stage/config.js";
import { firebaseConfig as prodFirebaseConfig } from "./prod/config.js";
import { SSOConfig as devSSOConfig} from './dev/identityProvider.js';
import { SSOConfig as stageSSOConfig} from './stage/identityProvider.js';
import { SSOConfig as prodSSOConfig} from './prod/identityProvider.js';
import { appState } from './stateManager.js';

let saveFlag = false;
let counter = 0;

const datadogConfig = {
    clientToken: 'pubcb2a7770dcbc09aaf1da459c45ecff65',
    applicationId: '571977b4-ca80-4a04-b8fe-5d5148508afd',
    site: 'ddog-gov.com',
    service: 'studymanager',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input'
}

const isLocalDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

window.onload = async () => {
    if(location.host === urls.prod) {
        !firebase.apps.length ? firebase.initializeApp(prodFirebaseConfig) : firebase.app();
        window.DD_RUM && window.DD_RUM.init({ ...datadogConfig, env: 'prod' });
    } 
    else if(location.host === urls.stage) {
        !firebase.apps.length ? firebase.initializeApp(stageFirebaseConfig) : firebase.app();
        window.DD_RUM && window.DD_RUM.init({ ...datadogConfig, env: 'stage' });
    } 
    else {
        !firebase.apps.length ? firebase.initializeApp(devFirebaseConfig) : firebase.app();
        !isLocalDev && window.DD_RUM && window.DD_RUM.init({ ...datadogConfig, env: 'dev' });
    } 

    !isLocalDev && window.DD_RUM && window.DD_RUM.startSessionReplayRecording();

    router();
    await getMappings();
    localStorage.setItem("flags", JSON.stringify(saveFlag));
    localStorage.setItem("counters", JSON.stringify(counter));
    activityCheckController();
    const userSession = localStorage.getItem('userSession');
    userSession && appState.setState({ userSession: JSON.parse(userSession) });
}

window.onhashchange = () => {
    router();
}

const router = async () => {
    const hash = decodeURIComponent(window.location.hash);
    const route = hash || '#';
    const isParent = localStorage.getItem('isParent')
    if (await userLoggedIn() || localStorage.dashboard) {
        if (route === '#home') renderDashboard();
        else if (route === '#participants/notyetverified') renderParticipantsNotVerified();
        else if (route === '#participants/cannotbeverified') renderParticipantsCanNotBeVerified();
        else if (route === '#participants/verified') renderParticipantsVerified();
        else if (route === '#participants/all') renderParticipantsAll();
        else if (route === '#participants/profilenotsubmitted') renderParticipantsProfileNotSubmitted();
        else if (route === '#participants/consentnotsubmitted') renderParticipantsConsentNotSubmitted();
        else if (route === '#participants/notsignedin') renderParticipantsNotSignedIn();
        else if (route === '#participantLookup') renderParticipantLookup();
        else if (route === '#participantDetails') {
            if (JSON.parse(localStorage.getItem("participant")) === null) {
                alert("No participant selected. Please select a participant from the participants dropdown or the participant lookup page");
            } else {
                let participant = JSON.parse(localStorage.getItem("participant"));
                let changedOption = {};
                renderParticipantDetails(participant, changedOption);
            }
        }
        else if (route === '#participantSummary') {
            if (JSON.parse(localStorage.getItem("participant")) === null) {
                renderParticipantSummary();
            }
            else {
                let participant = JSON.parse(localStorage.getItem("participant"))
                renderParticipantSummary(participant);
            }
        }
        else if (route === '#participantMessages') {
            if (JSON.parse(localStorage.getItem("participant")) === null) {
                renderParticipantMessages();
            }
            else {
                let participant = JSON.parse(localStorage.getItem("participant"))
                renderParticipantMessages(participant);
            }
        }
        else if (route === '#siteMessages') renderSiteMessages();
        else if (route === '#participantWithdrawal' && isParent === 'true') {
            if (JSON.parse(localStorage.getItem("participant")) === null) {
                renderParticipantWithdrawal();
            }
            else {
                let participant = JSON.parse(localStorage.getItem("participant"))
                renderParticipantWithdrawal(participant);
            }
        }
        else if (route === '#notifications/createnotificationschema') renderStoreNotificationSchema();
        else if (route === '#notifications/retrievenotificationschema') renderRetrieveNotificationSchema();
        else if (route === '#logout') clearLocalStorage();
        else window.location.hash = '#home';
    }
    else if (route === '#') homePage();
    else window.location.hash = '#';
}

const headsupBanner = () => {
    let template = ``;
    return template += `<div class="alert alert-danger alert-dismissible fade show" role="alert">
            <center> Warning: This is a test environment, <b> do not use real participant data  </b> </center>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`
}

const homePage = async () => {
    if (localStorage.dashboard) {
        window.location.hash = '#home';
    }
    else {
        document.getElementById('navBarLinks').innerHTML = renderNavBarLinks();
        const mainContent = document.getElementById('mainContent')
        mainContent.innerHTML = renderLogin();

        const form = document.getElementById('ssoLogin');
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const email = document.getElementById('ssoEmail').value;
            let tenantID = '';
            let provider = '';
            
            if(location.host === urls.prod) {
                let config = prodSSOConfig(email);
                tenantID = config.tenantID;
                provider = config.provider;
            }
            else if(location.host === urls.stage) {
                let config = stageSSOConfig(email);
                tenantID = config.tenantID;
                provider = config.provider;
            }
            else {
                let config = devSSOConfig(email);
                tenantID = config.tenantID;
                provider = config.provider;
            }

            const saml = new firebase.auth.SAMLAuthProvider(provider);
            firebase.auth().tenantId = tenantID;
            firebase.auth().signInWithPopup(saml)
                .then(async (result) => {
                    appState.setState({userSession:{email: result.user.email}});
                    localStorage.setItem('userSession', JSON.stringify({email: result.user.email}));
                    location.hash = '#home'
                })
                .catch((error) => {
                    console.log(error)
                });
        })
    }
}

const renderActivityCheck = () => {
    let template = ``
    template += ` <div class="modal fade" id="siteManagerMainModal" data-keyboard="false" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div class="modal-content sub-div-shadow">
                            <div class="modal-header" id="siteManagerModalHeader"></div>
                            <div class="modal-body" id="siteManagerModalBody"></div>
                        </div>
                    </div>
                </div>`
    return template;
}

const metricsCardsView = ({activeRecruits, passiveRecruits, verifiedParticipants, modulesAndBaselinesCompletedParticipants}) => {
    let template = `
    <div class="metrics-card">
      <div class="card-top"></div>
      <div class="metrics-value">${activeRecruits}</div>
        <p class="metrics-value-description">
          Active Recruits
        </p>
    </div>
    <div class="metrics-card">
      <div class="card-top"></div>
      <div class="metrics-value">${verifiedParticipants}</div>
        <p class="metrics-value-description">Verified Participants</p>
      <p class="ratio-value">
      <span class="hovertext" data-hover="out of Active and Passive Recruits">      
          Response Ratio:</span>
          ${activeRecruits + passiveRecruits === 0 || verifiedParticipants ===0? 0 : (verifiedParticipants / (activeRecruits + passiveRecruits) * 100).toFixed(1)}%
      </p>
    </div>
    <div class="metrics-card">
      <div class="card-top"></div>
      <div class="metrics-value"> ${modulesAndBaselinesCompletedParticipants} </div>
        <p class="metrics-value-description"><span class="hovertext" data-hover="All 4 Initial Survey Sections + All 3 Specimen Collections">Verified Participants who Completed Baseline Survey and Samples</span></p>
        <p class="ratio-value">Completion Ratio: ${verifiedParticipants ===0 || modulesAndBaselinesCompletedParticipants ===0 ? 0 : (modulesAndBaselinesCompletedParticipants/verifiedParticipants*100).toFixed(1)}%</p>
    </div>`
    let divElement = document.createElement('div');
    divElement.className = 'row d-flex justify-content-center';
    divElement.innerHTML = template;
    return divElement;
 }

const renderDashboard = async () => {
    if (localStorage.dashboard || await getIdToken()) {
        animation(true);
        const siteKey = await getAccessToken();
        const isAuthorized = await authorize(siteKey);
        if (isAuthorized && isAuthorized.code === 200) {
            localStorage.setItem('isParent', isAuthorized.isParent)
            localStorage.setItem('coordinatingCenter', isAuthorized.coordinatingCenter)
            const isParent = localStorage.getItem('isParent');
            //const coordinatingCenter = localStorage.getItem('coordinatingCenter');
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
            removeActiveClass('nav-link', 'active');
            document.getElementById('dashboardBtn').classList.add('active');
            mainContent.innerHTML = '';
            mainContent.innerHTML = renderActivityCheck();
            location.host !== urls.prod ? mainContent.innerHTML = headsupBanner() : ``
            renderCharts(siteKey, isParent);
        }
        internalNavigatorHandler(counter); // function call to prevent internal navigation when there's unsaved changes
        if (isAuthorized.code === 401) {
            clearLocalStorage();
        }
    } else {
        animation(false);
        window.location.hash = '#';
    }
}

const renderCharts = async (siteKey, isParent) => {

    const recruitsCountResults = await fetchStats(siteKey, 'participants_recruits_count');
    const recruitsCount = filterRecruits(recruitsCountResults.stats);

    const filterWorkflowResults = await fetchStats(siteKey, 'participants_workflow');
    const activeRecruitsFunnel = filterRecruitsFunnel(filterWorkflowResults.stats, 'active', recruitsCount.activeCount)
    const passiveRecruitsFunnel = filterRecruitsFunnel(filterWorkflowResults.stats, 'passive', recruitsCount.passiveCount)
    const totalRecruitsFunnel = filterTotalRecruitsFunnel(activeRecruitsFunnel, passiveRecruitsFunnel)

    const activeCurrentWorkflow = filterCurrentWorkflow(filterWorkflowResults.stats, 'active')
    const passiveCurrentWorkflow = filterCurrentWorkflow(filterWorkflowResults.stats, 'passive')
    const totalCurrentWorkflow = filterTotalCurrentWorkflow(activeCurrentWorkflow, passiveCurrentWorkflow)
    const filterVerificationResults = await fetchStats(siteKey, 'participants_verification');

    const activeVerificationStatus = filterVerification(filterVerificationResults.stats, 'active');
    const passiveVerificationStatus = filterVerification(filterVerificationResults.stats, 'passive');
    const denominatorVerificationStatus = filterDenominatorVerificationStatus(filterWorkflowResults.stats);

    const participantsGenderMetric = await fetchStats(siteKey, 'sex');
    const participantsRaceMetric = await fetchStats(siteKey, 'race');
    const participantsAgeMetric = await fetchStats(siteKey, 'age');

    const genderStats = filterGenderMetrics(participantsGenderMetric.stats, activeVerificationStatus.verified, passiveVerificationStatus.verified);
    const raceStats = filterRaceMetrics(participantsRaceMetric.stats, activeVerificationStatus.verified, passiveVerificationStatus.verified);
    const ageStats = filterAgeMetrics(participantsAgeMetric.stats, activeVerificationStatus.verified, passiveVerificationStatus.verified);

    const optOutsMetric = await fetchStats(siteKey, 'participants_optOuts');
    const optOutsStats = filterOptOutsMetrics(optOutsMetric.stats);

    const modulesMetric = await fetchStats(siteKey, 'participants_allModules');
    const moduleOneMetric = await fetchStats(siteKey, 'participants_moduleOne');
    const moduleTwoThreeMetric = await fetchStats(siteKey, 'participants_modulesTwoThree');
    const moduleNoneMetric = await fetchStats(siteKey, 'participants_modulesNone');
    const allModulesAllSamplesMetric = await fetchStats(siteKey, 'participants_allModulesAllSamples');
    const ssnMetric = await fetchStats(siteKey, 'participants_ssn');
    const modulesStats = filterModuleMetrics(modulesMetric.stats, moduleOneMetric.stats, moduleTwoThreeMetric.stats, moduleNoneMetric.stats, activeVerificationStatus.verified, passiveVerificationStatus.verified, allModulesAllSamplesMetric.stats);
    const ssnStats = filterSsnMetrics(ssnMetric.stats, activeVerificationStatus.verified, passiveVerificationStatus.verified)
    const biospecimenStatsMetric = await fetchStats(siteKey, 'participants_biospecimen');
    const biospecimenStats = filterBiospecimenStats(biospecimenStatsMetric.stats, (activeVerificationStatus.verified + passiveVerificationStatus.verified))

    const siteSelectionRow = document.createElement('div');
    siteSelectionRow.classList = ['row'];
    siteSelectionRow.id = 'siteSelection';
    let dropDownstatusFlag = false;
    localStorage.setItem('dropDownstatusFlag', dropDownstatusFlag);
    if (recruitsCountResults.code === 200) {
        if (isParent === 'true') {
            dropDownstatusFlag = true; 
            localStorage.setItem('dropDownstatusFlag', dropDownstatusFlag);
        }
        if (dropDownstatusFlag === true) {
            let sitekeyName = 'Filter by Site'; 
            siteSelectionRow.innerHTML = renderSiteKeyList(siteKey);
            mainContent.appendChild(siteSelectionRow);
            dropdownTrigger(sitekeyName, filterWorkflowResults.stats, participantsGenderMetric.stats, participantsRaceMetric.stats, participantsAgeMetric.stats,
                filterVerificationResults.stats, recruitsCountResults.stats, modulesMetric.stats, moduleOneMetric.stats, moduleTwoThreeMetric.stats, moduleNoneMetric.stats, ssnMetric.stats, optOutsMetric.stats, biospecimenStatsMetric.stats, allModulesAllSamplesMetric.stats);
        }

        // Add metrics cards at top of dashboard
        const metricsCards = metricsCardsView({ activeRecruits: recruitsCount.activeCount, passiveRecruits: recruitsCount.passiveCount, verifiedParticipants: activeVerificationStatus.verified + passiveVerificationStatus.verified, modulesAndBaselinesCompletedParticipants: modulesStats.allModulesAllSamples });
        mainContent.appendChild(metricsCards);

        renderAllCharts(activeRecruitsFunnel, passiveRecruitsFunnel, totalRecruitsFunnel, activeCurrentWorkflow, passiveCurrentWorkflow, totalCurrentWorkflow,
            genderStats, raceStats, ageStats, activeVerificationStatus, passiveVerificationStatus, denominatorVerificationStatus, recruitsCount, modulesStats, ssnStats, optOutsStats, biospecimenStats);

        animation(false);
    }
    if (recruitsCountResults.code === 401) {
        clearLocalStorage();
    }
}


const renderSiteKeyList = () => {
    let template = ``;
    template += `       
            <div style="margin-top:10px; padding:15px;" class="dropdown">
                <button class="btn btn-secondary dropdown-toggle dropdown-toggle-sites" id="dropdownSites" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Filter by Site
                </button>
                <ul class="dropdown-menu" id="dropdownMenuButtonSites" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" data-siteKey="allResults" id="all">All</a></li>
                    <li><a class="dropdown-item" data-siteKey="hfHealth" id="hfHealth">Henry Ford HS</a></li>
                    <li><a class="dropdown-item" data-siteKey="hPartners" id="hPartners">Health Partners</a></li>
                    <li><a class="dropdown-item" data-siteKey="kpGA" id="kpGA">KP GA</a></li>
                    <li><a class="dropdown-item" data-siteKey="kpHI" id="kpHI">KP HI</a></li>
                    <li><a class="dropdown-item" data-siteKey="kpNW" id="kpNW">KP NW</a></li>
                    <li><a class="dropdown-item" data-siteKey="kpCO" id="kpCO">KP CO</a></li>
                    <li><a class="dropdown-item" data-siteKey="maClinic" id="maClinic">Marshfield Clinic</a></li>
                    ${((location.host !== urls.prod) && (location.host !== urls.stage)) ? `<li><a class="dropdown-item" data-siteKey="nci" id="nci">NCI</a></li>` : ``}
                    <li><a class="dropdown-item" data-siteKey="snfrdHealth" id="snfrdHealth">Sanford Health</a></li>
                    <li><a class="dropdown-item" data-siteKey="uChiM" id="uChiM">UofC Medicine</a></li>
                </ul>
            </div>
            `
    return template;
}






const dropdownTrigger = (sitekeyName, filterWorkflowResults, participantsGenderMetric, participantsRaceMetric, participantsAgeMetric, filterVerificationResults, 
    recruitsCountResults, modulesResults, moduleOneResults, moduleTwoThreeResults, moduleNoneResults, ssnResults, optOutsResults, biospecimenResults, allModulesAllSamplesResults) => {
    let a = document.getElementById('dropdownSites');
    let dropdownMenuButton = document.getElementById('dropdownMenuButtonSites');
    let tempSiteName = a.innerHTML = sitekeyName;
    if (dropdownMenuButton) {
        dropdownMenuButton.addEventListener('click', (e) => {
            if (sitekeyName === 'Filter by Site' || sitekeyName === tempSiteName) {
                a.innerHTML = e.target.textContent;
                const t = getDataAttributes(e.target)
                reRenderDashboard(e.target.textContent, t.sitekey, filterWorkflowResults, participantsGenderMetric, participantsRaceMetric, participantsAgeMetric, 
                    filterVerificationResults, recruitsCountResults, modulesResults, moduleOneResults, moduleTwoThreeResults, moduleNoneResults, ssnResults, optOutsResults, biospecimenResults, allModulesAllSamplesResults);
            }
        })

    }
}


const fetchData = async (siteKey, type) => {
    const limit = 50;
    const response = await fetch(`${baseAPI}/dashboard?api=getParticipants&type=${type}&limit=${limit}`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + siteKey
        }
    });
    return response.json();
}

const fetchStats = async (siteKey, type) => {
    const response = await fetch(`${baseAPI}/dashboard?api=stats&type=${type}`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + siteKey
        }
    });
    return response.json();
}

const authorize = async (siteKey) => {
    const response = await fetch(`${baseAPI}/dashboard?api=validateSiteUsers`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + siteKey
        }
    });
    return await response.json();

}

export const animation = (status) => {
    if (status && document.getElementById('loadingAnimation')) document.getElementById('loadingAnimation').style.display = '';
    if (!status && document.getElementById('loadingAnimation')) document.getElementById('loadingAnimation').style.display = 'none';
}


const filterGenderMetrics = (participantsGenderMetrics, activeVerifiedParticipants, passiveVerifiedParticipants) => {
    const verifiedParticipants =  activeVerifiedParticipants + passiveVerifiedParticipants
    let genderObject = { female: 0, male: 0, intersex: 0, unavailable: 0, verifiedParticipants: 0 }
    participantsGenderMetrics && participantsGenderMetrics.forEach(i => {
        (parseInt(i.sex) === fieldMapping.male) ?
            genderObject['male'] += parseInt(i.sexCount)
        : (parseInt(i.sex) === fieldMapping.female) ?
            genderObject['female'] += parseInt(i.sexCount)
        : (parseInt(i.sex) === fieldMapping.intersex) ?
            genderObject['intersex'] += parseInt(i.sexCount)
        : (parseInt(i.sex) === fieldMapping.unavailable) ?
            genderObject['unavailable'] += parseInt(i.sexCount)
        : (parseInt(i.kpSex) === fieldMapping.male) ? // kp harmonization
            genderObject['male'] += parseInt(i.kpSexCount)
        : (parseInt(i.kpSex) === fieldMapping.female) ?
            genderObject['female'] += parseInt(i.kpSexCount)
        : (parseInt(i.kpSex) === fieldMapping.neitherMF) ?
            genderObject['intersex'] += parseInt(i.kpSexCount)
        : (parseInt(i.kpSex) === fieldMapping.unavailable) ?
            genderObject['unavailable'] += parseInt(i.kpSexCount)
        : (parseInt(i.kpSex) === fieldMapping.other) ?
            genderObject['intersex'] += parseInt(i.kpSexCount) 
        : (parseInt(i.shHfSex) === fieldMapping.male) ? // SH & HF harmonization
            genderObject['male'] += parseInt(i.shHfSexCount)
        : (parseInt(i.shHfSex) === fieldMapping.female) ?
            genderObject['female'] += parseInt(i.shHfSexCount)
        : (parseInt(i.shHfSex) === fieldMapping.unavailable) ?
            genderObject['unavailable'] += parseInt(i.shHfSexCount)
        : ``
})
    genderObject.verifiedParticipants = verifiedParticipants
    return genderObject;
}


const filterRaceMetrics = (participantsRaceMetrics, activeVerifiedParticipants, passiveVerifiedParticipants) => {
    const verifiedParticipants =  activeVerifiedParticipants + passiveVerifiedParticipants
    let raceObject = { white: 0, other: 0, unavailable: 0, verifiedParticipants: 0 }
    participantsRaceMetrics && participantsRaceMetrics.forEach(i => {

        (parseInt(i.race) === fieldMapping.white) ?
        raceObject['white'] += parseInt(i.raceCount)
        :  (parseInt(i.shRace) === fieldMapping.whiteSH) ?
        raceObject['white'] += parseInt(i.shRaceCount)
        :  (parseInt(i.hfRace) === fieldMapping.whiteHF) ?
        raceObject['white'] += parseInt(i.hfRaceCount)
        :  (parseInt(i.race) === fieldMapping.other) ?
        raceObject['other'] += parseInt(i.raceCount)

        :  (parseInt(i.shRace) === fieldMapping.africanAmericanSH) ? // SH Harmonization
        raceObject['other'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.americanIndianSH) ?
        raceObject['other'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.asianSH) ?
        raceObject['other'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.hispanicLBSH) ?
        raceObject['other'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.hispanicLDSH) ?
        raceObject['other'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.hispanicLWSH) ?
        raceObject['other'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.nativeHawaiianSH) ?
        raceObject['other'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.nativeHawaiianPISH) ?
        raceObject['other'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.pacificIslanderSH) ?
        raceObject['other'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.blankSH) ?
        raceObject['unavailable'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.declinedSH) ?
        raceObject['unavailable'] += parseInt(i.shRaceCount)
        :  (parseInt(i.shRace) === fieldMapping.unavailable) ?
        raceObject['unavailable'] += parseInt(i.shRaceCount)
        
        :  (parseInt(i.hfRace) === fieldMapping.africanAmericanHF) ? // HF Harmonization
        raceObject['other'] += parseInt(i.hfRaceCount)
        :  (parseInt(i.hfRace) === fieldMapping.otherHF) ?
        raceObject['other'] += parseInt(i.hfRaceCount)
      
        :  (parseInt(i.race) === fieldMapping.unavailable) ?
        raceObject['unavailable'] += parseInt(i.raceCount)
        : (parseInt(i.hfRace) === fieldMapping.unavailable) ?
        raceObject['unavailable'] += parseInt(i.hfRaceCount)
     :``
})
    raceObject.verifiedParticipants = verifiedParticipants
    return raceObject;

}

const filterAgeMetrics = (participantsAgeMetrics, activeVerifiedParticipants, passiveVerifiedParticipants) => {
    const verifiedParticipants =  activeVerifiedParticipants + passiveVerifiedParticipants
    let ageObject = { '40-45': 0, '46-50': 0, '51-55': 0, '56-60': 0, '61-65': 0, verifiedParticipants: 0 }
    participantsAgeMetrics && participantsAgeMetrics.forEach(i => {
        if (parseInt(i.recruitmentAge) === fieldMapping.ageRange1) {
            ageObject['40-45'] +=  parseInt(i.recruitmentAgeCount)
        }
        else if (parseInt(i.recruitmentAge) === fieldMapping.ageRange2) {
            ageObject['46-50'] +=  parseInt(i.recruitmentAgeCount)
        }
        else if (parseInt(i.recruitmentAge) === fieldMapping.ageRange3) {
            ageObject['51-55'] +=  parseInt(i.recruitmentAgeCount)
        }
        else if (parseInt(i.recruitmentAge) === fieldMapping.ageRange4) {
            ageObject['56-60'] +=  parseInt(i.recruitmentAgeCount)
        }
        else if (parseInt(i.recruitmentAge) === fieldMapping.ageRange5) {
            ageObject['61-65'] +=  parseInt(i.recruitmentAgeCount)
        }
    })
    ageObject.verifiedParticipants = verifiedParticipants
    return ageObject;
}

const filterOptOutsMetrics = (participantOptOutsMetric) => {
    let currentWorflowObj = {}
    let totalOptOuts = 0
    participantOptOutsMetric && participantOptOutsMetric.filter( i => totalOptOuts += i.totalOptOuts );
    currentWorflowObj.totalOptOuts = totalOptOuts
    return currentWorflowObj;
}

const filterModuleMetrics = (participantsModuleMetrics, participantModuleOne, participantModulesTwoThree, participantModuleNone, activeVerifiedParticipants, passiveVerifiedParticipants, participantsAllModulesAllSamples) => {
    let currentWorflowObj = {}
    let noModulesSubmitted = 0
    let moduleOneSubmitted = 0
    let modulesTwoThreeSubmitted = 0
    let modulesSubmitted = 0
    let allModulesAllSamples = 0;
  
    participantsModuleMetrics && participantsModuleMetrics.filter(i => modulesSubmitted += i.countModules)
    participantModuleOne && participantModuleOne.filter( i => moduleOneSubmitted += i.countModule1)
    participantModulesTwoThree && participantModulesTwoThree.filter( i =>  modulesTwoThreeSubmitted += i.countModules )
    participantModuleNone && participantModuleNone.filter( i =>  noModulesSubmitted += i.countModules )
    participantsAllModulesAllSamples && participantsAllModulesAllSamples.forEach(item => {
        allModulesAllSamples += item.countAllModulesAllSamples;
    })
    const verifiedParticipants = activeVerifiedParticipants + passiveVerifiedParticipants
    currentWorflowObj.noModulesSubmitted = noModulesSubmitted
    currentWorflowObj.moduleOneSubmitted = moduleOneSubmitted
    currentWorflowObj.modulesTwoThreeSubmitted = modulesTwoThreeSubmitted
    currentWorflowObj.modulesSubmitted = modulesSubmitted
    currentWorflowObj.verifiedParticipants = verifiedParticipants
    currentWorflowObj.allModulesAllSamples = allModulesAllSamples;
    return currentWorflowObj;  

}

const filterSsnMetrics = (participantsSsnMetrics, activeVerifiedParticipants, passiveVerifiedParticipants) => {
    let currentWorflowObj = {}
    let ssnFullFlagCounter = 0
    let ssnHalfFlagCounter = 0
    let ssnNoFlagCounter = 0
    const verifiedParticipants = activeVerifiedParticipants +  passiveVerifiedParticipants

    participantsSsnMetrics && participantsSsnMetrics.filter( i => {
        if (i.SSN === 'ssnFlag') { ssnFullFlagCounter += i.SSN_token }
        if (i.SSN === 'ssnHalfFlag') { ssnHalfFlagCounter += i.SSN_token }
        if (i.SSN === 'ssnNoFlag' ) { ssnNoFlagCounter += i.SSN_token }

    })
    currentWorflowObj.ssnNoFlagCounter = ssnNoFlagCounter;
    currentWorflowObj.ssnFullFlagCounter = ssnFullFlagCounter;
    currentWorflowObj.ssnHalfFlagCounter = ssnHalfFlagCounter;
    currentWorflowObj.verifiedParticipants = verifiedParticipants;
    return currentWorflowObj; 
}

const filterRecruitsFunnel = (data, recruit) => {
    let recruitType = fieldMapping[recruit];
    let currentWorflowObj = {};
    let signedInCount = 0;
    let consentedCount = 0;
    let submittedProfileCount = 0;
    let verificationCount = 0;
    let verifiedCount = 0;
    let signedIn = ``
    if (recruitType === fieldMapping.active) {
        signedIn = data.filter(i => (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && (i.verificationStatus != fieldMapping.duplicate) ));
        signedIn.forEach((i) => {
            signedInCount += i.signedCount
        })
    }
    else {
        signedIn = data.filter(i => (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes ));
        signedIn.forEach((i) => {
            signedInCount += i.signedCount
        })
    }
    let consented = ``
    if (recruitType === fieldMapping.active) { 
        consented = data.filter(i =>
            (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && (i.verificationStatus != fieldMapping.duplicate)))
        consented.forEach((i) => {
            consentedCount += i.consentCount
        })
    }
    else {
        consented = data.filter(i =>
            (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes))
        consented.forEach((i) => {
            consentedCount += i.consentCount
        })
    }
    let submittedProfile = ``
    if (recruitType === fieldMapping.active) { 
        submittedProfile = data.filter(i =>
            (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes && (i.verificationStatus != fieldMapping.duplicate)))
        submittedProfile.forEach((i) => {
            submittedProfileCount += i.submittedCount
        })
    }
    else {
        submittedProfile = data.filter(i =>
            (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes))
        submittedProfile.forEach((i) => {
            submittedProfileCount += i.submittedCount
        })
    }
    let verification = ``
    if (recruitType === fieldMapping.active) {
        verification = data.filter(i =>
            (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified)))
        verification.forEach((i) => {
            verificationCount += i.verificationCount
        })
    }
    else { 
        verification = data.filter(i =>
            (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified || i.verificationStatus === fieldMapping.duplicate)))
        verification.forEach((i) => {
            verificationCount += i.verificationCount
        })
    }
    let verified = data.filter(i =>
        (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.verified)))
    verified.forEach((i) => {
        verifiedCount += i.verificationCount
    })

    currentWorflowObj.signedIn = signedInCount;
    currentWorflowObj.consented = consentedCount;
    currentWorflowObj.submittedProfile = submittedProfileCount;
    currentWorflowObj.verification = verificationCount;
    currentWorflowObj.verified = verifiedCount;
    return currentWorflowObj;
}

const filterTotalRecruitsFunnel = (activeRecruitsStats, passiveRecruitsStats) => {
    let currentWorflowObj = {}
    currentWorflowObj.signedIn = activeRecruitsStats.signedIn + passiveRecruitsStats.signedIn
    currentWorflowObj.consented = activeRecruitsStats.consented + passiveRecruitsStats.consented
    currentWorflowObj.submittedProfile = activeRecruitsStats.submittedProfile + passiveRecruitsStats.submittedProfile
    currentWorflowObj.verification = activeRecruitsStats.verification + passiveRecruitsStats.verification
    currentWorflowObj.verified = activeRecruitsStats.verified + passiveRecruitsStats.verified

    return currentWorflowObj;
}


const filterCurrentWorkflow = (data, recruit) => {
    let recruitType = fieldMapping[recruit]
    let currentWorflowObj = {}
    let notSignedIn = data.filter(i => (i.recruitType === recruitType && i.signedStatus === fieldMapping.no && i.verificationStatus != fieldMapping.duplicate))
    let signedIn = ``
    if (recruitType === fieldMapping.active) {
        signedIn = data.filter(i => (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.no && i.verificationStatus != fieldMapping.duplicate))
    } else {
        signedIn = data.filter(i => (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.no))
    }
    let consented = ``
    if (recruitType === fieldMapping.active) {
        consented = data.filter(i => (i.recruitType === recruitType && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.no && i.verificationStatus != fieldMapping.duplicate))
    } else {
        consented = data.filter(i => (i.recruitType === recruitType && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.no))
    }
    let submittedProfile = data.filter(i =>
        (i.recruitType === recruitType && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.notYetVerified || i.verificationStatus === fieldMapping.outreachTimedout)))
    let verification = ``
    if (recruitType === fieldMapping.active) {
        verification = data.filter(i =>
            (i.recruitType === recruitType && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified)))
    }
    else {
       verification = data.filter(i =>
        (i.recruitType === recruitType && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified || i.verificationStatus === fieldMapping.duplicate)))
    }
    if (recruitType === fieldMapping.passive) currentWorflowObj.notSignedIn = 0
    else currentWorflowObj.notSignedIn = getCummulativeCountHandler(notSignedIn);
    currentWorflowObj.signedIn = getCummulativeCountHandler(signedIn);
    currentWorflowObj.consented = getCummulativeCountHandler(consented);
    currentWorflowObj.submittedProfile = getCummulativeCountHandler(submittedProfile);
    currentWorflowObj.verification = getCummulativeCountHandler(verification);
    return currentWorflowObj;
}

const getCummulativeCountHandler = (objectHolder) => {
    let workflowCounter = 0;
    if (objectHolder[0] !== undefined) {
        objectHolder.forEach(i => {
            workflowCounter += i.verificationCount
        })
    }
    else {
        return workflowCounter;
    }
    return workflowCounter;
}

const filterTotalCurrentWorkflow = (activeCurrentWorkflow, passiveCurrentWorkflow) => {
    let currentWorflowObj = {}
    currentWorflowObj.notSignedIn = activeCurrentWorkflow.notSignedIn + passiveCurrentWorkflow.notSignedIn;
    currentWorflowObj.signedIn = activeCurrentWorkflow.signedIn +  passiveCurrentWorkflow.signedIn;
    currentWorflowObj.consented = activeCurrentWorkflow.consented + passiveCurrentWorkflow.consented;
    currentWorflowObj.submittedProfile = activeCurrentWorkflow.submittedProfile + passiveCurrentWorkflow.submittedProfile;
    currentWorflowObj.verification = activeCurrentWorkflow.verification + passiveCurrentWorkflow.verification;
    return currentWorflowObj;
}

const filterVerification = (data, recruit) => {
    let currentVerificationObj = {};
    let recruitType = fieldMapping[recruit]
    let outreachTimedout = 0;
    let notYetVerified = 0;
    let verified = 0;
    let cannotBeVerified = 0;
    let duplicate = 0;
    let filteredData = data.filter(i => i.recruitType === recruitType);
    filteredData.forEach((i) => {

        if (i.verificationStatus === fieldMapping.notYetVerified) {
            notYetVerified += i.verificationCount
        }
        else if (i.verificationStatus === fieldMapping.outreachTimedout) {
            outreachTimedout += i.verificationCount
        }
        else if (i.verificationStatus === fieldMapping.verified) {
            verified += i.verificationCount
        }
        else if (i.verificationStatus === fieldMapping.cannotBeVerified) {
            cannotBeVerified += i.verificationCount
        }
        else if (i.verificationStatus === fieldMapping.duplicate) {
            duplicate += i.verificationCount
        }
    });
    currentVerificationObj.notYetVerified = notYetVerified 
    currentVerificationObj.outreachTimedout = outreachTimedout
    currentVerificationObj.verified = verified
    currentVerificationObj.cannotBeVerified = cannotBeVerified
    if (recruitType === fieldMapping.active)  currentVerificationObj.duplicate = duplicate
    else currentVerificationObj.duplicate = duplicate
    return currentVerificationObj;

}

const filterDenominatorVerificationStatus = (data) => {
    let currentObj = {};
    let activeConsentCount = 0
    let passiveConsentCount = 0
    let activeDenominator = data.filter(i => i.recruitType === fieldMapping.active && (i.recruitType !== fieldMapping.inactive)
        && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes);
    activeDenominator.forEach((i) => {
        activeConsentCount += i.consentCount
    })
    let passiveDenominator = data.filter(i => i.recruitType === fieldMapping.passive && (i.recruitType !== fieldMapping.inactive)
        && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes);
    passiveDenominator.forEach((i) => {
        passiveConsentCount += i.consentCount
    })
    currentObj.activeDenominator = activeConsentCount
    currentObj.passiveDenominator = passiveConsentCount
    return currentObj;
}

const filterRecruits = (data) => {
    let currentObj = { 'activeCount': 0, 'passiveCount': 0 };
    let activeCount = 0;
    let passiveCount = 0;
    data.forEach((i) => {
        if (i.recruitType === fieldMapping.active) {
            activeCount = i.counter + activeCount
            currentObj.activeCount = activeCount
        } else if (i.recruitType === fieldMapping.passive) {
            passiveCount = i.counter + passiveCount
            currentObj.passiveCount = passiveCount;
        }
    })
    return currentObj;
}

const filterBiospecimenStats = (data, verifiedParticipants) => {
    let currenntBiospecimenStats = {};
    let all = 0;
    let bloodUrine = 0;
    let bloodMouthwash = 0;
    let urineMouthwash = 0;
    let mouthwash = 0;
    let urine = 0;
    let blood = 0;
    let none = 0;
    data && data.filter( i => {
        if (i.baselineBlood === fieldMapping.yes && i.baselineUrine === fieldMapping.yes && i.baselineMouthwash === fieldMapping.yes) { all += i.verfiedPts }
        if (i.baselineBlood === fieldMapping.yes && i.baselineUrine === fieldMapping.yes && i.baselineMouthwash === fieldMapping.no) { bloodUrine += i.verfiedPts }
        if (i.baselineBlood === fieldMapping.yes && i.baselineUrine === fieldMapping.no && i.baselineMouthwash === fieldMapping.yes) { bloodMouthwash += i.verfiedPts }
        if (i.baselineBlood === fieldMapping.no && i.baselineUrine === fieldMapping.yes && i.baselineMouthwash === fieldMapping.yes) { urineMouthwash += i.verfiedPts }
        if (i.baselineBlood === fieldMapping.yes && i.baselineUrine === fieldMapping.no && i.baselineMouthwash === fieldMapping.no) { blood += i.verfiedPts }
        if (i.baselineBlood === fieldMapping.no && i.baselineUrine === fieldMapping.yes && i.baselineMouthwash === fieldMapping.no) { urine += i.verfiedPts }
        if (i.baselineBlood === fieldMapping.no && i.baselineUrine === fieldMapping.no && i.baselineMouthwash === fieldMapping.yes) { mouthwash += i.verfiedPts }
        if ((i.baselineBlood === fieldMapping.no || i.baselineBlood === null) && (i.baselineUrine === fieldMapping.no || i.baselineUrine === null) 
            && (i.baselineMouthwash === fieldMapping.no || i.baselineMouthwash === null)) { none += i.verfiedPts }
    })

    currenntBiospecimenStats.all = all;
    currenntBiospecimenStats.bloodUrine = bloodUrine;
    currenntBiospecimenStats.bloodMouthwash = bloodMouthwash;
    currenntBiospecimenStats.urineMouthwash = urineMouthwash;
    currenntBiospecimenStats.urine = urine;
    currenntBiospecimenStats.mouthwash = mouthwash;
    currenntBiospecimenStats.blood = blood;
    currenntBiospecimenStats.none = none;
    return currenntBiospecimenStats;
}

const reRenderDashboard = async (siteTextContent, siteKey, filterWorkflowResults, participantsGenderMetric, participantsRaceMetric,
    participantsAgeMetric, filterVerificationResults, recruitsCountResults, modulesResults, moduleOneResults, modulesTwoThreeResults, moduleNoneResults, ssnResults, optOutsResults, biospecimenResults, allModulesAllSamplesResults) => {

    const siteKeyFilter = nameToKeyObj[siteKey];
    let resultWorkflow = []
    filterDatabySiteCode(resultWorkflow, filterWorkflowResults, siteKeyFilter);

    let resultGender = []
    filterDatabySiteCode(resultGender, participantsGenderMetric, siteKeyFilter);

    let resultRace = []
    filterDatabySiteCode(resultRace, participantsRaceMetric, siteKeyFilter);

    let resultAge = []
    filterDatabySiteCode(resultAge, participantsAgeMetric, siteKeyFilter);

    let resultVerification = []
    filterDatabySiteCode(resultVerification, filterVerificationResults, siteKeyFilter);

    let resultRecruitsCount = []
    filterDatabySiteCode(resultRecruitsCount, recruitsCountResults, siteKeyFilter);

    let resultModules = []
    filterDatabySiteCode(resultModules, modulesResults, siteKeyFilter);

    let resultModuleOne = []
    filterDatabySiteCode(resultModuleOne, moduleOneResults, siteKeyFilter);

    let resultModulesTwoThree = []
    filterDatabySiteCode(resultModulesTwoThree, modulesTwoThreeResults, siteKeyFilter);

    let resultModulesNone = []
    filterDatabySiteCode(resultModulesNone, moduleNoneResults, siteKeyFilter);

    let resultSsn = []
    filterDatabySiteCode(resultSsn, ssnResults, siteKeyFilter);

    let resultOptOuts = []
    filterDatabySiteCode(resultOptOuts, optOutsResults, siteKeyFilter);

    let resultBiospecimen = []
    filterDatabySiteCode(resultBiospecimen, biospecimenResults, siteKeyFilter);

    let AllModulesAllSamples = [];
    filterDatabySiteCode(AllModulesAllSamples, allModulesAllSamplesResults, siteKeyFilter);

    mainContent.innerHTML = '';

    const activeRecruitsFunnel = filterRecruitsFunnel(resultWorkflow, 'active');
    const passiveRecruitsFunnel = filterRecruitsFunnel(resultWorkflow, 'passive');
    const totalRecruitsFunnel = filterTotalRecruitsFunnel(activeRecruitsFunnel, passiveRecruitsFunnel);

    const activeCurrentWorkflow = filterCurrentWorkflow(resultWorkflow, 'active');
    const passiveCurrentWorkflow = filterCurrentWorkflow(resultWorkflow, 'passive');
    const totalCurrentWorkflow = filterTotalCurrentWorkflow(activeCurrentWorkflow, passiveCurrentWorkflow);

    const activeVerificationStatus = filterVerification(resultVerification, 'active');
    const passiveVerificationStatus = filterVerification(resultVerification, 'passive');
    const denominatorVerificationStatus = filterDenominatorVerificationStatus(resultWorkflow);

    const genderStats = filterGenderMetrics(resultGender, activeVerificationStatus.verified, passiveVerificationStatus.verified);
    const raceStats = filterRaceMetrics(resultRace, activeVerificationStatus.verified, passiveVerificationStatus.verified);
    const ageStats = filterAgeMetrics(resultAge, activeVerificationStatus.verified, passiveVerificationStatus.verified);

    const recruitsCount = filterRecruits(resultRecruitsCount);
    const optOutsStats = filterOptOutsMetrics(resultOptOuts);

    const modulesStats = filterModuleMetrics(resultModules, resultModuleOne, resultModulesTwoThree, resultModulesNone, activeVerificationStatus.verified, passiveVerificationStatus.verified, AllModulesAllSamples);
    const ssnStats = filterSsnMetrics(resultSsn, activeVerificationStatus.verified, passiveVerificationStatus.verified);
    const biospecimenStats = filterBiospecimenStats(resultBiospecimen);

    const siteSelectionRow = document.createElement('div');
    siteSelectionRow.classList = ['row'];
    siteSelectionRow.id = 'siteSelection';

    siteSelectionRow.innerHTML = renderSiteKeyList(siteKey);
    mainContent.appendChild(siteSelectionRow);
    dropdownTrigger(siteTextContent, filterWorkflowResults, participantsGenderMetric, participantsRaceMetric,
        participantsAgeMetric, filterVerificationResults, recruitsCountResults, modulesResults, moduleOneResults, modulesTwoThreeResults, moduleNoneResults, ssnResults, optOutsResults, biospecimenResults, allModulesAllSamplesResults);
    
    // Add metrics cards at top of dashboard
    const metricsCards = metricsCardsView({ activeRecruits: recruitsCount.activeCount, passiveRecruits: recruitsCount.passiveCount, verifiedParticipants: activeVerificationStatus.verified + passiveVerificationStatus.verified, modulesAndBaselinesCompletedParticipants: modulesStats.allModulesAllSamples });
    mainContent.appendChild(metricsCards);
    
    renderAllCharts(activeRecruitsFunnel, passiveRecruitsFunnel, totalRecruitsFunnel, activeCurrentWorkflow, passiveCurrentWorkflow, totalCurrentWorkflow,
        genderStats, raceStats, ageStats, activeVerificationStatus, passiveVerificationStatus, denominatorVerificationStatus, recruitsCount, modulesStats, ssnStats, optOutsStats, biospecimenStats);

    animation(false);
}


const clearLocalStorage = () => {
    firebase.auth().signOut();
    internalNavigatorHandler(counter);
    animation(false);
    delete localStorage.dashboard;
    delete localStorage.participant;
    delete localStorage.userSession;
    appState.setState({userSession: {}});
    window.location.hash = '#';
}

const filterDatabySiteCode = (resultHolder, filteredResults, siteKeyFilter) => {
    if (siteKeyFilter !== nameToKeyObj.allResults) {
        filteredResults && filteredResults.filter(i => {
            if (i.siteCode === siteKeyFilter) {
                resultHolder.push(i);
            }
        });
    } else {
        filteredResults.filter(i => {
            resultHolder.push(i);
        });
    }
    return resultHolder;
}

const renderParticipantsNotVerified = async () => {
    animation(true);
    const siteKey = await getAccessToken();
    const response = await fetchData(siteKey, 'notyetverified');
    response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
    if (response.code === 200) {
        const isParent = localStorage.getItem('isParent')
        document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
        document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Not Verified Participants'
        removeActiveClass('dropdown-item', 'dd-item-active')
        document.getElementById('notVerifiedBtn').classList.add('dd-item-active');
        removeActiveClass('nav-link', 'active');
        document.getElementById('participants').classList.add('active');
        mainContent.innerHTML = renderTable(filterdata(response.data), 'notyetverified');
        addEventFilterData(filterdata(response.data), true)
        renderData(filterdata(response.data), isParent === 'true' ? true : false, 'notyetverified');
        activeColumns(filterdata(response.data), true);
        animation(false);
    }
    internalNavigatorHandler(counter)
    if (response.code === 401) {
        clearLocalStorage();
    }
}

const renderParticipantsCanNotBeVerified = async () => {
    animation(true);
    const siteKey = await getAccessToken();
    const response = await fetchData(siteKey, 'cannotbeverified');
    response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
    if (response.code === 200) {
        const isParent = localStorage.getItem('isParent')
        document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
        document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Cannot Be Verified Participants'
        removeActiveClass('dropdown-item', 'dd-item-active')
        document.getElementById('cannotVerifiedBtn').classList.add('dd-item-active');
        removeActiveClass('nav-link', 'active');
        document.getElementById('participants').classList.add('active');
        const filteredData = filterdata(response.data);
        if (filteredData.length === 0) {
            mainContent.innerHTML = 'No Data Found!'
            animation(false);
            return;
        }
        mainContent.innerHTML = renderTable(filteredData, 'cannotbeverified');
        addEventFilterData(filteredData);
        renderData(filteredData, 'cannotbeverified');
        activeColumns(filteredData);
        animation(false);
    }
    internalNavigatorHandler(counter);
    if (response.code === 401) {
        clearLocalStorage();
    }
}

const renderParticipantsVerified = async () => {
    animation(true);
    const siteKey = await getAccessToken();
    const response = await fetchData(siteKey, 'verified');
    response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
    if (response.code === 200) {
        const isParent = localStorage.getItem('isParent')
        document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
        document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Verified Participants'
        removeActiveClass('dropdown-item', 'dd-item-active')
        document.getElementById('verifiedBtn').classList.add('dd-item-active');
        removeActiveClass('nav-link', 'active');
        document.getElementById('participants').classList.add('active');
        mainContent.innerHTML = renderTable(filterdata(response.data), 'verified');
        addEventFilterData(filterdata(response.data));
        renderData(filterdata(response.data), 'verified');
        activeColumns(filterdata(response.data));
        animation(false);
    }
    internalNavigatorHandler(counter);
    if (response.code === 401) {
        clearLocalStorage();
    }
}

const renderParticipantsAll = async () => {
    animation(true);
    if (appState.getState().filterHolder)reMapFilters(appState.getState().filterHolder)
    else {
        const siteKey = await getAccessToken();
        const response = await fetchData(siteKey, 'all');
        response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
        if (response.code === 200) {
            const isParent = localStorage.getItem('isParent')
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
            document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> All Participants'
            removeActiveClass('dropdown-item', 'dd-item-active');
            document.getElementById('allBtn').classList.add('dd-item-active');
            removeActiveClass('nav-link', 'active');
            document.getElementById('participants').classList.add('active');
            const filterRawData = filterdata(response.data)
            mainContent.innerHTML = renderTable(filterRawData, 'participantAll');
            addEventFilterData(filterRawData);
            renderData(filterRawData, 'participantAll');
            activeColumns(filterRawData);
            renderLookupSiteDropdown();
            dropdownTriggerAllParticipants('Filter by Site');
        }
        internalNavigatorHandler(counter);
        if (response.code === 401) {
            clearLocalStorage();
        }
    }
    animation(false);
}

const renderParticipantsProfileNotSubmitted = async () => {
    animation(true);
    const siteKey = await getAccessToken();
    const response = await fetchData(siteKey, 'profileNotSubmitted');
    response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
    if (response.code === 200) {
        const isParent = localStorage.getItem('isParent')
        document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
        document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Profile Not Submitted'
        removeActiveClass('dropdown-item', 'dd-item-active');
        document.getElementById('profileNotSubmitted').classList.add('dd-item-active');
        removeActiveClass('nav-link', 'active');
        document.getElementById('participants').classList.add('active');
        mainContent.innerHTML = renderTable(filterdata(response.data), 'profileNotSubmitted');
        addEventFilterData(filterdata(response.data));
        renderData(filterdata(response.data), 'profileNotSubmitted');
        activeColumns(filterdata(response.data));
        animation(false);
    }
    internalNavigatorHandler(counter);
    if (response.code === 401) {
        clearLocalStorage();
    }
}

const renderParticipantsConsentNotSubmitted = async () => {
    animation(true);
    const siteKey = await getAccessToken();
    const response = await fetchData(siteKey, 'consentNotSubmitted');
    response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
    if (response.code === 200) {
        const isParent = localStorage.getItem('isParent')
        document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
        document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Consent Not Submitted'
        removeActiveClass('dropdown-item', 'dd-item-active');
        document.getElementById('consentNotSubmitted').classList.add('dd-item-active');
        removeActiveClass('nav-link', 'active');
        document.getElementById('participants').classList.add('active');
        mainContent.innerHTML = renderTable(filterdata(response.data), 'consentNotSubmitted');
        addEventFilterData(filterdata(response.data));
        renderData(filterdata(response.data), 'consentNotSubmitted');
        activeColumns(filterdata(response.data));
        animation(false);
    }
    internalNavigatorHandler(counter);
    if (response.code === 401) {
        clearLocalStorage();
    }
}

const renderParticipantsNotSignedIn = async () => {
    animation(true);
    const siteKey = await getAccessToken();
    const response = await fetchData(siteKey, 'notSignedIn');
    response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
    if (response.code === 200) {
        const isParent = localStorage.getItem('isParent')
        document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
        document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Not Signed In'
        removeActiveClass('dropdown-item', 'dd-item-active');
        document.getElementById('notSignedIn').classList.add('dd-item-active');
        removeActiveClass('nav-link', 'active');
        document.getElementById('participants').classList.add('active');
        mainContent.innerHTML = renderTable(filterdata(response.data), 'notSignedIn');
        addEventFilterData(filterdata(response.data));
        renderData(filterdata(response.data), 'notSignedIn');
        activeColumns(filterdata(response.data));
        animation(false);
    }
    internalNavigatorHandler(counter);
    if (response.code === 401) {
        clearLocalStorage();
    }
}

const getMappings = async () => {
    const response = await fetch('https://raw.githubusercontent.com/episphere/conceptGithubActions/master/aggregate.json');
    const mappings = await response.json();
    localStorage.setItem("conceptIdMapping", JSON.stringify(mappings));
}

const activityCheckController = () => {
    let time;
    const resetTimer = () => {
        clearTimeout(time);
        time = setTimeout(() => {
            const resposeTimeout = setTimeout(() => {
                // log out user if they don't respond to warning after 5 minutes.
                clearLocalStorage();
            }, 300000)
            // Show warning after 20 minutes of no activity.
            const button = document.createElement('button');
            button.dataset.toggle = 'modal';
            button.dataset.target = '#siteManagerMainModal'
            document.body.appendChild(button);
            button.click();
            const header = document.getElementById('siteManagerModalHeader');
            const body = document.getElementById('siteManagerModalBody');
            header && (header.innerHTML = `<h5 class="modal-title">Inactive</h5>`)

            body && (body.innerHTML = `You were inactive for 20 minutes, would you like to extend your session?
                            <div class="modal-footer">
                                <button type="button" title="Close" class="btn btn-dark log-out-user" data-dismiss="modal">Log Out</button>
                                <button type="button" title="Continue" class="btn btn-primary extend-user-session" data-dismiss="modal">Continue</button>
                            </div>`)
            document.body.removeChild(button);
            Array.from(document.getElementsByClassName('log-out-user')).forEach(e => {
                e.addEventListener('click', () => {
                    clearLocalStorage();
                })
            })
            Array.from(document.getElementsByClassName('extend-user-session')).forEach(e => {
                e.addEventListener('click', () => {
                    clearTimeout(resposeTimeout);
                    resetTimer;
                })
            });
        }, 1200000);
    }
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
};