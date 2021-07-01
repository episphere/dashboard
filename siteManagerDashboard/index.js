import { renderParticipantLookup } from './participantLookup.js';
import { renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass } from './navigationBar.js';
import { renderTable, filterdata, renderData, addEventFilterData, activeColumns, dropdownTriggerAllParticipants, renderLookupSiteDropdown } from './participantCommons.js';
import { renderParticipantDetails } from './participantDetails.js';
import { renderParticipantSummary } from './participantSummary.js';
import { renderParticipantMessages } from './participantMessages.js';
import { renderParticipantWithdrawal } from './participantWithdrawal.js';
import { internalNavigatorHandler, getDataAttributes, getIdToken, userLoggedIn, baseAPI, urls } from './utils.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import { nameToKeyObj } from './siteKeysToName.js';
import { renderAllCharts } from './participantChartsRender.js';
import { firebaseConfig as devFirebaseConfig } from "./dev/config.js";
import { firebaseConfig as stageFirebaseConfig } from "./stage/config.js";
import { firebaseConfig as prodFirebaseConfig } from "./prod/config.js";
import { SSOConfig as devSSOConfig} from './dev/identityProvider.js';
import { SSOConfig as stageSSOConfig} from './stage/identityProvider.js';
import { SSOConfig as prodSSOConfig} from './prod/identityProvider.js';

let saveFlag = false;
let counter = 0;


window.onload = async () => {
    if(location.host === urls.prod) !firebase.apps.length ? firebase.initializeApp(prodFirebaseConfig) : firebase.app();
    else if(location.host === urls.stage) !firebase.apps.length ? firebase.initializeApp(stageFirebaseConfig) : firebase.app();
    else !firebase.apps.length ? firebase.initializeApp(devFirebaseConfig) : firebase.app();

    router();
    await getMappings();
    localStorage.setItem("flags", JSON.stringify(saveFlag));
    localStorage.setItem("counters", JSON.stringify(counter));
    activityCheckController()
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
                renderParticipantDetails();
            }
            else {
                let participant = JSON.parse(localStorage.getItem("participant"));
                let adminSubjectAudit = [];
                let changedOption = {};
                const access_token = await getIdToken();
                const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
                const siteKey = access_token ? access_token : localStr.siteKey;
                renderParticipantDetails(participant, adminSubjectAudit, changedOption, siteKey);
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
        else if (route === '#participantWithdrawal' && isParent === 'true') {
            if (JSON.parse(localStorage.getItem("participant")) === null) {
                renderParticipantWithdrawal();
            }
            else {
                let participant = JSON.parse(localStorage.getItem("participant"))
                renderParticipantWithdrawal(participant);
            }
        }
        else if (route === '#logout') clearLocalStorage();
        else window.location.hash = '#home';
    }
    else if (route === '#') homePage();
    else window.location.hash = '#';
}

const homePage = async () => {
    if (localStorage.dashboard) {
        window.location.hash = '#home';
    }
    else {
        document.getElementById('navBarLinks').innerHTML = renderNavBarLinks();
        const mainContent = document.getElementById('mainContent')
        mainContent.innerHTML = renderLogin();
        const submit = document.getElementById('submit');
        submit.addEventListener('click', async () => {
            animation(true);
            const siteKey = document.getElementById('siteKey').value;
            if (siteKey.trim() === '') return;
            const dashboard = { siteKey }
            localStorage.dashboard = JSON.stringify(dashboard);

            const isAuthorized = await authorize(siteKey);
            if (isAuthorized.code === 200) {
                window.location.hash = '#home';
            }
            if (isAuthorized.code === 401) {
                document.getElementById('mainContent').innerHTML = 'Not Authorized! <a href="#logout" class="btn btn-primary">Log Out</a>';
                animation(false)
            }
        });

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
            else !firebase.apps.length ? firebase.initializeApp(devFirebaseConfig) : firebase.app();{
                let config = devSSOConfig(email);
                tenantID = config.tenantID;
                provider = config.provider;
            }

            const saml = new firebase.auth.SAMLAuthProvider(provider);
            firebase.auth().tenantId = tenantID;
            firebase.auth().signInWithPopup(saml)
                .then(async (result) => {
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

const renderDashboard = async () => {
    if (localStorage.dashboard || await getIdToken()) {
        animation(true);
        const access_token = await getIdToken();
        const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
        const siteKey = access_token ? access_token : localStr.siteKey;
        const isAuthorized = await authorize(siteKey);
        if (isAuthorized && isAuthorized.code === 200) {
            localStorage.setItem('isParent', isAuthorized.isParent)
            const isParent = localStorage.getItem('isParent')
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
            removeActiveClass('nav-link', 'active');
            document.getElementById('dashboardBtn').classList.add('active');
            mainContent.innerHTML = '';
            mainContent.innerHTML = renderActivityCheck();
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

    const filterWorkflowResults = await fetchStats(siteKey, 'participants_workflow');

    const recruitsCountResults = await fetchStats(siteKey, 'participants_recruits_count');
    const recruitsCount = filterRecruits(recruitsCountResults.stats);
    const activeRecruitsFunnel = filterRecruitsFunnel(filterWorkflowResults.stats, 'active', recruitsCount.activeCount)
    const passiveRecruitsFunnel = filterRecruitsFunnel(filterWorkflowResults.stats, 'passive', recruitsCount.passiveCount)
    const totalRecruitsFunnel = filterTotalRecruitsFunnel(filterWorkflowResults.stats)

    const activeCurrentWorkflow = filterCurrentWorkflow(filterWorkflowResults.stats, 'active')
    const passiveCurrentWorkflow = filterCurrentWorkflow(filterWorkflowResults.stats, 'passive')
    const totalCurrentWorkflow = filterTotalCurrentWorkflow(filterWorkflowResults.stats)
    const filterVerificationResults = await fetchStats(siteKey, 'participants_verification');

    const activeVerificationStatus = filterVerification(filterVerificationResults.stats, 'active');
    const passiveVerificationStatus = filterVerification(filterVerificationResults.stats, 'passive');
    const denominatorVerificationStatus = filterDenominatorVerificationStatus(filterWorkflowResults.stats);
    const participantsGenderMetric = await fetchStats(siteKey, 'sex');
    const participantsRaceMetric = await fetchStats(siteKey, 'race');
    const participantsAgeMetric = await fetchStats(siteKey, 'age');

    const genderStats = filterGenderMetrics(participantsGenderMetric.stats)
    const raceStats = filterRaceMetrics(participantsRaceMetric.stats)
    const ageStats = filterAgeMetrics(participantsAgeMetric.stats)
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
                filterVerificationResults.stats, recruitsCountResults.stats);
        }
        renderAllCharts(activeRecruitsFunnel, passiveRecruitsFunnel, totalRecruitsFunnel, activeCurrentWorkflow, passiveCurrentWorkflow, totalCurrentWorkflow,
            genderStats, raceStats, ageStats, activeVerificationStatus, passiveVerificationStatus,
            denominatorVerificationStatus, recruitsCount);

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
                    <li><a class="dropdown-item" data-siteKey="hfHealth" id="hfHealth">Henry Ford Health Systems</a></li>
                    <li><a class="dropdown-item" data-siteKey="hPartners" id="hPartners">HealthPartners</a></li>
                    <li><a class="dropdown-item" data-siteKey="kpGA" id="kpGA">KP GA</a></li>
                    <li><a class="dropdown-item" data-siteKey="kpHI" id="kpHI">KP HI</a></li>
                    <li><a class="dropdown-item" data-siteKey="kpNW" id="kpNW">KP NW</a></li>
                    <li><a class="dropdown-item" data-siteKey="kpCO" id="kpCO">KP CO</a></li>
                    <li><a class="dropdown-item" data-siteKey="maClinic" id="maClinic">Marshfield Clinic</a></li>
                    <li><a class="dropdown-item" data-siteKey="nci" id="nci">NCI</a></li>
                    <li><a class="dropdown-item" data-siteKey="snfrdHealth" id="snfrdHealth">Sanford Health</a></li>
                    <li><a class="dropdown-item" data-siteKey="uChiM" id="uChiM">UofC Medicine</a></li>
                </ul>
            </div>
            `
    return template;
}

const dropdownTrigger = (sitekeyName, filterWorkflowResults, participantsGenderMetric, participantsRaceMetric, participantsAgeMetric, filterVerificationResults, recruitsCountResults) => {
    let a = document.getElementById('dropdownSites');
    let dropdownMenuButton = document.getElementById('dropdownMenuButtonSites');
    let tempSiteName = a.innerHTML = sitekeyName;
    if (dropdownMenuButton) {
        dropdownMenuButton.addEventListener('click', (e) => {
            if (sitekeyName === 'Filter by Site' || sitekeyName === tempSiteName) {
                a.innerHTML = e.target.textContent;
                const t = getDataAttributes(e.target)
                reRenderDashboard(e.target.textContent, t.sitekey, filterWorkflowResults, participantsGenderMetric, participantsRaceMetric, participantsAgeMetric, filterVerificationResults, recruitsCountResults);
            }
        })

    }
}


const fetchData = async (siteKey, type) => {
    const response = await fetch(`${baseAPI}/dashboard?api=getParticipants&type=${type}`, {
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


const filterGenderMetrics = (participantsGenderMetrics) => {
    let genderObject = { female: 0, male: 0, intersex: 0, unavailable: 0 }
    participantsGenderMetrics && participantsGenderMetrics.forEach(i => {
        (parseInt(i.sex) === fieldMapping.male) ?
            genderObject['male'] += parseInt(i.sexCount)
        : (parseInt(i.sex) === fieldMapping.female) ?
            genderObject['female'] += parseInt(i.sexCount)
        : (parseInt(i.sex) === fieldMapping.intersex) ?
            genderObject['intersex'] += parseInt(i.sexCount)
        : (parseInt(i.sex) === fieldMapping.unavailable) ?
            genderObject['unavailable'] += parseInt(i.sexCount)
        : ``
})
    return genderObject;
}


const filterRaceMetrics = (participantsRaceMetrics) => {
    let raceObject = { white: 0, other: 0, unavailable: 0 }
    participantsRaceMetrics && participantsRaceMetrics.forEach(i => {
        switch (parseInt(i.race)) {
            case fieldMapping['africanAmericanSH']:
            case fieldMapping['americanIndianSH']:
            case fieldMapping['hispanicLBSH']:
            case fieldMapping['hispanicLDSH']:
            case fieldMapping['hispanicLWSH']:
            case fieldMapping['nativeHawaiianSH']:
            case fieldMapping['nativeHawaiianPISH']:
            case fieldMapping['pacificIslanderSH']:
            case fieldMapping['blankSH']:
            case fieldMapping['declinedSH']:
            case fieldMapping['africanAmericanBLHHF']:
            case fieldMapping['africanAmericanBNLHHF']:
            case fieldMapping['africanAmericanBEUHF']:
            case fieldMapping['otherHLHF']:
            case fieldMapping['otherNHLHF']:
            case fieldMapping['otherEUHF']:
            case fieldMapping['whiteHLHF']:
            case fieldMapping['whiteEUHF']:
            case fieldMapping['unaviableHLHF']:
            case fieldMapping['other']:
                raceObject['other'] += 1
            case fieldMapping['white']:
            case fieldMapping['whiteSH']:
            case fieldMapping['whiteNHHF']:
                raceObject['white'] += 1
            case fieldMapping['unaviableNHLHF']:
            case fieldMapping['unaviableEUHF']:
            case fieldMapping['unavailable']:
                raceObject['unavailable'] += 1
    }
})
        return raceObject;

}

const filterAgeMetrics = (participantsAgeMetrics) => {
    let ageObject = { '40-45': 0, '46-50': 0, '51-55': 0, '56-60': 0, '61-65': 0 }
    participantsAgeMetrics && participantsAgeMetrics.forEach(i => {
        if (parseInt(i.recruitmentAge) === fieldMapping.ageRange1) {
            ageObject['40-45']++
        }
        else if (parseInt(i.recruitmentAge) === fieldMapping.ageRange2) {
            ageObject['46-50']++
        }
        else if (parseInt(i.recruitmentAge) === fieldMapping.ageRange3) {
            ageObject['51-55']++
        }
        else if (parseInt(i.recruitmentAge) === fieldMapping.ageRange4) {
            ageObject['56-60']++
        }
        else if (parseInt(i.recruitmentAge) === fieldMapping.ageRange5) {
            ageObject['61-65']++
        }
    })
    return ageObject;
}

const filterRecruitsFunnel = (data, recruit, count) => {
    let recruitType = fieldMapping[recruit]
    let currentWorflowObj = {}
    let signedInCount = 0
    let consentedCount = 0
    let submittedProfileCount = 0
    let verificationCount = 0
    let verifiedCount = 0

    let signedIn = data.filter(i =>
        (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes))
    signedIn.forEach((i) => {
        signedInCount += i.signedCount
    })
    let consented = data.filter(i =>
        (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes))
    consented.forEach((i) => {
        consentedCount += i.consentCount
    })
    let submittedProfile = data.filter(i =>
        (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes))
    submittedProfile.forEach((i) => {
        submittedProfileCount += i.submittedCount
    })
    let verification = data.filter(i =>
        (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified || i.verificationStatus === fieldMapping.duplicate)))
    verification.forEach((i) => {
        verificationCount += i.verificationCount
    })

    let verified = data.filter(i =>
        (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.verified)))
    verified.forEach((i) => {
        verifiedCount += i.verificationCount
    })

    currentWorflowObj.signedIn = signedInCount
    currentWorflowObj.consented = consentedCount
    currentWorflowObj.submittedProfile = submittedProfileCount
    currentWorflowObj.verification = verificationCount
    currentWorflowObj.verified = verifiedCount
    return currentWorflowObj;
}

const filterTotalRecruitsFunnel = (data) => {
    let currentWorflowObj = {}
    let signedInCount = 0
    let consentedCount = 0
    let submittedProfileCount = 0
    let verificationCount = 0
    let verifiedCount = 0
    let signedIn = data.filter(i =>
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.signedStatus === fieldMapping.yes && (i.recruitType !== fieldMapping.inactive)))
    signedIn.forEach((i) => {
        signedInCount += i.signedCount
    })
    let consented = data.filter(i =>
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && (i.recruitType !== fieldMapping.inactive)))
    consented.forEach((i) => {
        consentedCount += i.consentCount
    })
    let submittedProfile = data.filter(i =>
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes
        && (i.recruitType !== fieldMapping.inactive)))
    submittedProfile.forEach((i) => {
        submittedProfileCount += i.submittedCount
    })
    let verification = data.filter(i =>
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes 
        && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified || i.verificationStatus === fieldMapping.duplicate) && (i.recruitType !== fieldMapping.inactive)))
    verification.forEach((i) => {
        verificationCount += i.verificationCount
    })
    let verified = data.filter(i =>
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes
         && (i.verificationStatus === fieldMapping.verified) && (i.recruitType !== fieldMapping.inactive)))
    verified.forEach((i) => {
        verifiedCount += i.verificationCount
    })
    currentWorflowObj.signedIn = signedInCount
    currentWorflowObj.consented = consentedCount
    currentWorflowObj.submittedProfile = submittedProfileCount
    currentWorflowObj.verification = verificationCount
    currentWorflowObj.verified = verifiedCount

    return currentWorflowObj;
}


const filterCurrentWorkflow = (data, recruit) => {
    let recruitType = fieldMapping[recruit]
    let currentWorflowObj = {}
    let notSignedIn = data.filter(i => (i.recruitType === recruitType && i.signedStatus === fieldMapping.no))
    let signedIn = data.filter(i => (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.no))
    let consented = data.filter(i => (i.recruitType === recruitType && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.no))
    let submittedProfile = data.filter(i =>
        (i.recruitType === recruitType && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.notYetVerified || i.verificationStatus === fieldMapping.outreachTimedout)))
    let verification = data.filter(i =>
        (i.recruitType === recruitType && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified || i.verificationStatus === fieldMapping.duplicate)))
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

const filterTotalCurrentWorkflow = (data) => {
    let currentWorflowObj = {}
    let notSignedIn = data.filter(i => ((i.recruitType === fieldMapping.active) && i.signedStatus === fieldMapping.no))
    let signedIn = data.filter(i => ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.no)
        && (i.recruitType !== fieldMapping.inactive))
    let consented = data.filter(i => ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.no) 
        && (i.recruitType !== fieldMapping.inactive))
    let submittedProfile = data.filter(i =>
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.notYetVerified || i.verificationStatus === fieldMapping.outreachTimedout)
        && (i.recruitType !== fieldMapping.inactive)))
    let verification = data.filter(i =>
    ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified || i.verificationStatus === fieldMapping.duplicate)
        && (i.recruitType !== fieldMapping.inactive)))
    currentWorflowObj.notSignedIn = getCummulativeCountHandler(notSignedIn);
    currentWorflowObj.signedIn = getCummulativeCountHandler(signedIn);
    currentWorflowObj.consented = getCummulativeCountHandler(consented);
    currentWorflowObj.submittedProfile = getCummulativeCountHandler(submittedProfile);
    currentWorflowObj.verification = getCummulativeCountHandler(verification);
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
    currentVerificationObj.notYetVerified = outreachTimedout
    currentVerificationObj.outreachTimedout = notYetVerified
    currentVerificationObj.verified = verified
    currentVerificationObj.cannotBeVerified = cannotBeVerified
    currentVerificationObj.duplicate = duplicate
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


const reRenderDashboard = async (siteTextContent, siteKey, filterWorkflowResults, participantsGenderMetric, participantsRaceMetric,
    participantsAgeMetric, filterVerificationResults, recruitsCountResults) => {

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

    mainContent.innerHTML = '';

    const activeRecruitsFunnel = filterRecruitsFunnel(resultWorkflow, 'active')
    const passiveRecruitsFunnel = filterRecruitsFunnel(resultWorkflow, 'passive')
    const totalRecruitsFunnel = filterTotalRecruitsFunnel(resultWorkflow)

    const activeCurrentWorkflow = filterCurrentWorkflow(resultWorkflow, 'active')
    const passiveCurrentWorkflow = filterCurrentWorkflow(resultWorkflow, 'passive')
    const totalCurrentWorkflow = filterTotalCurrentWorkflow(resultWorkflow)

    const activeVerificationStatus = filterVerification(resultVerification, 'active')
    const passiveVerificationStatus = filterVerification(resultVerification, 'passive')
    const denominatorVerificationStatus = filterDenominatorVerificationStatus(resultWorkflow)

    const genderStats = filterGenderMetrics(resultGender)
    const raceStats = filterRaceMetrics(resultRace)
    const ageStats = filterAgeMetrics(resultAge)

    const recruitsCount = filterRecruits(resultRecruitsCount)

    const siteSelectionRow = document.createElement('div');
    siteSelectionRow.classList = ['row'];
    siteSelectionRow.id = 'siteSelection';

    siteSelectionRow.innerHTML = renderSiteKeyList(siteKey)
    mainContent.appendChild(siteSelectionRow);
    dropdownTrigger(siteTextContent, filterWorkflowResults, participantsGenderMetric, participantsRaceMetric,
        participantsAgeMetric, filterVerificationResults, recruitsCountResults)

    renderAllCharts(activeRecruitsFunnel, passiveRecruitsFunnel, totalRecruitsFunnel, activeCurrentWorkflow, passiveCurrentWorkflow, totalCurrentWorkflow,
        genderStats, raceStats, ageStats, activeVerificationStatus, passiveVerificationStatus, denominatorVerificationStatus, recruitsCount)

    animation(false);
}


const clearLocalStorage = () => {
    firebase.auth().signOut();
    internalNavigatorHandler(counter);
    animation(false);
    delete localStorage.dashboard;
    delete localStorage.participant;
    window.location.hash = '#';
}

const filterDatabySiteCode = (resultHolder, filteredResults, siteKeyFilter) => {
    if (siteKeyFilter !== nameToKeyObj.allResults) {
        filteredResults.filter(i => {
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
    const access_token = await getIdToken();
    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
    const siteKey = access_token ? access_token : localStr.siteKey;
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
        mainContent.innerHTML = renderTable(filterdata(response.data));
        addEventFilterData(filterdata(response.data), true)
        renderData(filterdata(response.data), isParent === 'true' ? true : false);
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
    const access_token = await getIdToken();
    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
    const siteKey = access_token ? access_token : localStr.siteKey;
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
        mainContent.innerHTML = renderTable(filteredData);
        addEventFilterData(filteredData);
        renderData(filteredData);
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
    const access_token = await getIdToken();
    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
    const siteKey = access_token ? access_token : localStr.siteKey;
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
        mainContent.innerHTML = renderTable(filterdata(response.data));
        addEventFilterData(filterdata(response.data));
        renderData(filterdata(response.data));
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
    const access_token = await getIdToken();
    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
    const siteKey = access_token ? access_token : localStr.siteKey;
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
        mainContent.innerHTML = renderTable(filterdata(response.data), 'participantAll');
        addEventFilterData(filterdata(response.data));
        renderData(filterdata(response.data));
        activeColumns(filterdata(response.data));
        renderLookupSiteDropdown();
        dropdownTriggerAllParticipants('Filter by Site');
        animation(false);
    }
    internalNavigatorHandler(counter);
    if (response.code === 401) {
        clearLocalStorage();
    }
}

const renderParticipantsProfileNotSubmitted = async () => {
    animation(true);
    const access_token = await getIdToken();
    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
    const siteKey = access_token ? access_token : localStr.siteKey;
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
        mainContent.innerHTML = renderTable(filterdata(response.data));
        addEventFilterData(filterdata(response.data));
        renderData(filterdata(response.data));
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
    const access_token = await getIdToken();
    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
    const siteKey = access_token ? access_token : localStr.siteKey;
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
        mainContent.innerHTML = renderTable(filterdata(response.data));
        addEventFilterData(filterdata(response.data));
        renderData(filterdata(response.data));
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
    const access_token = await getIdToken();
    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
    const siteKey = access_token ? access_token : localStr.siteKey;
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
        mainContent.innerHTML = renderTable(filterdata(response.data));
        addEventFilterData(filterdata(response.data));
        renderData(filterdata(response.data));
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