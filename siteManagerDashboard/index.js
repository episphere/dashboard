import { renderParticipantLookup } from './participantLookup.js';
import { renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass } from './navigationBar.js';
import { renderTable, filterdata, renderData, addEventFilterData, activeColumns, eventVerifiedButton } from './participantCommons.js';
import { renderParticipantDetails } from './participantDetails.js';
import { renderParticipantSummary } from './participantSummary.js'
import { internalNavigatorHandler, humanReadableY } from './utils.js'
import fieldMapping from './fieldToConceptIdMapping.js';
import { nameToKeyObj } from './siteKeysToName.js';
import { renderAllCharts } from './participantChartsRender.js'

let saveFlag = false;
let counter = 0;

window.onload = async () => {
    router();
    await getMappings();
    localStorage.setItem("flags", JSON.stringify(saveFlag));
    localStorage.setItem("counters", JSON.stringify(counter));
}

window.onhashchange = () => {
    router();
}

const router = () => {
    const hash = decodeURIComponent(window.location.hash);
    const route = hash || '#';
    if (route === '#') homePage();
    else if (route === '#dashboard') renderDashboard();
    else if (route === '#participants/notyetverified') renderParticipantsNotVerified();
    else if (route === '#participants/cannotbeverified') renderParticipantsCanNotBeVerified();
    else if (route === '#participants/verified') renderParticipantsVerified();
    else if (route === '#participants/all') renderParticipantsAll();
    else if (route === '#participantLookup') renderParticipantLookup();
    else if (route === '#participantDetails') renderParticipantDetails();
    else if (route === '#participantSummary') {
        if (JSON.parse(localStorage.getItem("participant")) === null) {
            renderParticipantSummary();
        }
        else {
            let participant = JSON.parse(localStorage.getItem("participant"))
            renderParticipantSummary(participant);
        }
    }
    else if (route === '#logout') clearLocalStroage();
    else window.location.hash = '#';
}

const homePage = async () => {
    if (localStorage.dashboard) {
        window.location.hash = '#dashboard';
    }
    else {
        document.getElementById('navBarLinks').innerHTML = renderNavBarLinks();
        const mainContent = document.getElementById('mainContent')
        mainContent.innerHTML = renderLogin();
        const submit = document.getElementById('submit');
        submit.addEventListener('click', async () => {
            animation(true);
            const siteKey = document.getElementById('siteKey').value;
            const rememberMe = document.getElementById('rememberMe');
            if (siteKey.trim() === '') return;
            if (rememberMe.checked) {
                const dashboard = { siteKey }
                localStorage.dashboard = JSON.stringify(dashboard);
            }
            else {
                const dashboard = {
                    siteKey,
                    expires: new Date(Date.now() + 3600000)
                }
                localStorage.dashboard = JSON.stringify(dashboard);
            }

            const isAuthorized = await authorize(siteKey);
            if (isAuthorized.code === 200) {
                window.location.hash = '#dashboard';
            }
            if (isAuthorized.code === 401) {
                clearLocalStroage();
            }
        });
    }
}

const renderDashboard = async () => {
    if (localStorage.dashboard) {
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const isAuthorized = await authorize(siteKey);
        if (isAuthorized && isAuthorized.code === 200) {

            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
            removeActiveClass('nav-link', 'active');
            document.getElementById('dashboardBtn').classList.add('active');
            mainContent.innerHTML = '';

            renderCharts(siteKey);
        }
        internalNavigatorHandler(counter); // function call to prevent internal navigation when there's unsaved changes
        if (isAuthorized.code === 401) {
            clearLocalStroage();
        }
    } else {
        animation(false);
        window.location.hash = '#';
    }
}

const renderCharts = async (siteKey) => {

    const stats = await fetchData(siteKey, 'stats');

    const filterWorkflowResults = await fetchStats(siteKey, 'participants_workflow');

    const activeRecruitsFunnel = filterRecruitsFunnel(filterWorkflowResults.stats, 'active')
    const passiveRecruitsFunnel = filterRecruitsFunnel(filterWorkflowResults.stats, 'passive')
    const totalRecruitsFunnel = filterTotalRecruitsFunnel(filterWorkflowResults.stats)

    const activeCurrentWorkflow = filterCurrentWorkflow(filterWorkflowResults.stats, 'active')
    const passiveCurrentWorkflow = filterCurrentWorkflow(filterWorkflowResults.stats, 'passive')
    const totalCurrentWorkflow = filterTotalCurrentWorkflow(filterWorkflowResults.stats)

    const filterVerificationResults = await fetchStats(siteKey, 'participants_verification');

    const activeVerificationStatus = filterVerification(filterVerificationResults.stats, 'active')
    const passiveVerificationStatus = filterVerification(filterVerificationResults.stats, 'passive')
    const denominatorVerificationStatus = filterDenominatorVerificationStatus(filterWorkflowResults.stats)

    const participantsGenderMetric = await fetchStats(siteKey, 'sex');
    const participantsRaceMetric = await fetchStats(siteKey, 'race');
    const participantsAgeMetric = await fetchStats(siteKey, 'age');

    const genderStats = filterGenderMetrics(participantsGenderMetric.stats)
    const raceStats = filterRaceMetrics(participantsRaceMetric.stats)
    const ageStats = filterAgeMetrics(participantsAgeMetric.stats)

    const recruitsCountResults = await fetchStats(siteKey, 'participants_recruits_count');

    const recruitsCount = filterRecruits(recruitsCountResults.stats)

    const objSiteCode = recruitsCount[0] && recruitsCount[0].siteCode
    const siteSelectionRow = document.createElement('div');
    siteSelectionRow.classList = ['row'];
    siteSelectionRow.id = 'siteSelection';
    let dropDownstatusFlag = false;
    if (recruitsCountResults.code === 200) {    
        recruitsCountResults && recruitsCountResults.stats.forEach((i, index) => {
              if (index !== 0 && (objSiteCode !== i.siteCode)) {
                dropDownstatusFlag = true;
              }
        }) 
    if (dropDownstatusFlag === true) {
        let sitekeyName = 'Change Site Preference';
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
    if (stats.code === 401) {
        clearLocalStroage();
    }
}



const renderSiteKeyList = () => {
    let template = ``;
    template += `       
            <div style="margin-top:10px; padding:15px;" class="dropdown">
                <button class="btn btn-secondary dropdown-toggle-sites" id="dropdownSites" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Change Site Preference
                </button>
                <ul class="dropdown-menu" id="dropdownMenuButtonSites" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" data-siteKey="allResults" id="all">All</a></li>
                    <li><a class="dropdown-item" data-siteKey="hfHealth" id="hfHealth">Henry Ford Health Systems</a></li>
                    <li><a class="dropdown-item" data-siteKey="hPartners" id="hPartners">Health Partners</a></li>
                    <li><a class="dropdown-item" data-siteKey="kpGA" id="kpGA">KP GA</a></li>
                    <li><a class="dropdown-item" data-siteKey="kpHI" id="kpHI">KP HI</a></li>
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
            if ( sitekeyName === 'Change Site Preference' || sitekeyName === tempSiteName) {
                a.innerHTML = e.target.textContent;
                const t = getDataAttributes(e.target)
                reRenderDashboard(e.target.textContent, t.sitekey, filterWorkflowResults, participantsGenderMetric, participantsRaceMetric, participantsAgeMetric, filterVerificationResults, recruitsCountResults);
        }})
       
    }
}

const getDataAttributes = (el) => {
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



const fetchData = async (siteKey, type) => {
    if (!checkSession()) {
        alert('Session expired!');
        clearLocalStroage();
    }
    else {
        const response = await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/getParticipants?type=${type}`, {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + siteKey
            }
        });
        return response.json();
    }
}

const fetchStats = async (siteKey, type) => {
    if (!checkSession()) {
        alert('Session expired!');
        clearLocalStroage();
    }
    else {
        const response = await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/stats?type=${type}`, {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + siteKey
            }
        });
        return response.json();
    }
}

export const participantVerification = async (token, verified, siteKey) => {
    if (!checkSession()) {
        alert('Session expired!');
        clearLocalStroage();
    }
    else {
        const response = await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/identifyParticipant?type=${verified ? `verified` : `cannotbeverified`}&token=${token}`, {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + siteKey
            }
        });
        return response.json();
    }
}

const authorize = async (siteKey) => {
    if (!checkSession()) {
        alert('Session expired!');
        clearLocalStroage();
        return false;
    }
    else {
        const response = await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/validateSiteUsers`, {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + siteKey
            }
        });
        return await response.json();
    }

}

const checkSession = () => {
    if (localStorage.dashboard) {
        const localStr = JSON.parse(localStorage.dashboard);
        const expires = localStr.expires ? new Date(localStr.expires) : undefined;
        const currentDateTime = new Date(Date.now());
        return expires ? expires > currentDateTime : true;
    }
}

export const animation = (status) => {
    if (status && document.getElementById('loadingAnimation')) document.getElementById('loadingAnimation').style.display = '';
    if (!status && document.getElementById('loadingAnimation')) document.getElementById('loadingAnimation').style.display = 'none';
}

const filterGenderMetrics = (participantsGenderMetrics) => {
 
    let genderObject = {female: 0, male: 0, intersex: 0, unknown: 0}
    participantsGenderMetrics && participantsGenderMetrics.forEach( i => {
        (parseInt(i.sex) === fieldMapping['male']) ?
            genderObject['male'] = parseInt(i.sexCount)
        :
        (parseInt(i.sex) === fieldMapping['female']) ?
            genderObject['female'] = parseInt(i.sexCount)
        :
        (parseInt(i.sex) === fieldMapping['intersex']) ?
            genderObject['intersex'] = parseInt(i.sexCount)
        :
            genderObject['unknown'] = parseInt(i.sexCount)
        
        }
    )

    return genderObject;


}


const filterRaceMetrics = (participantsRaceMetrics) => {

    let raceObject = {americanIndian: 0, asian: 0, africanAmerican: 0, latino: 0, nativeHawaiian: 0, middleEastern: 0, white: 0, none: 0, other: 0}
    participantsRaceMetrics && participantsRaceMetrics.forEach( i => {
            (parseInt(i.race) === fieldMapping['americanIndian']) ? 
                raceObject['americanIndian'] = parseInt(i.raceCount)
            :
            (parseInt(i.race) === fieldMapping['asian']) ?
                raceObject['asian'] = parseInt(i.raceCount)
            :
            (parseInt(i.race) === fieldMapping['africanAmerican']) ?
                raceObject['africanAmerican'] = parseInt(i.raceCount)
            :
            (parseInt(i.race) === fieldMapping['latino']) ?
                raceObject['latino'] = parseInt(i.raceCount)
            :
            (parseInt(i.race) === fieldMapping['middleEastern']) ?
                raceObject['middleEastern'] = parseInt(i.raceCount)
            :
            (parseInt(i.race) === fieldMapping['nativeHawaiian']) ?
                raceObject['nativeHawaiian'] = parseInt(i.raceCount)
            :
            (parseInt(i.race) === fieldMapping['white']) ?
                raceObject['white'] = parseInt(i.raceCount)
            :
            (parseInt(i.race) === fieldMapping['none']) ?
                raceObject['none'] = parseInt(i.raceCount)
            :
                raceObject['other'] = parseInt(i.raceCount)            
    })
    return raceObject;

}

const filterAgeMetrics = (participantsAgeMetrics) => {
    let ageObject = {'40-45': 0, '46-50': 0, '51-55': 0, '56-60': 0, '61-65': 0}
    participantsAgeMetrics && participantsAgeMetrics.forEach( i => {
        let participantYear = humanReadableY() - parseInt(i.birthYear)
        sortAgeRange(participantYear, ageObject)
        }
    )
    return ageObject;
}

const sortAgeRange = (participantYear, ageRange) => {
    
        (participantYear >= 40 && participantYear <= 45) ? 
                ageRange['40-45']++
        : 
        (participantYear >= 46 && participantYear <= 50) ?
                ageRange['46-50']++
        : 
        (participantYear >= 51 && participantYear <= 55) ?
                ageRange['51-55']++
        :
        (participantYear >= 56 && participantYear <= 60) ?
                ageRange['56-60']++
        : 
        (participantYear >= 61 && participantYear <= 65) ?
                ageRange['61-65']++
        : ""
}

const filterRecruitsFunnel = (data, recruit) => {
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
        (i.recruitType === recruitType && i.consentStatus === fieldMapping.yes))
        consented.forEach((i) => {
            consentedCount += i.consentCount
        })
    let submittedProfile = data.filter(i => 
        (i.recruitType === recruitType && i.submittedStatus === fieldMapping.yes))
        submittedProfile.forEach((i) => {
            submittedProfileCount += i.submittedCount
        })
    let verification = data.filter(i => 
        (i.recruitType === recruitType && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified || i.verificationStatus === fieldMapping.duplicate ) ))
        verification.forEach((i) => {
            verificationCount += i.verificationCount
        })
    
    let verified = data.filter(i => 
        (i.recruitType === recruitType && (i.verificationStatus === fieldMapping.verified ) ))
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
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.signedStatus === fieldMapping.yes))
          signedIn.forEach((i) => {
            signedInCount += i.signedCount
        })
    let consented = data.filter(i => 
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.consentStatus === fieldMapping.yes))
         consented.forEach((i) => {
            consentedCount += i.consentCount
        })
    let submittedProfile = data.filter(i => 
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.submittedStatus === fieldMapping.yes))
         submittedProfile.forEach((i) => {
            submittedProfileCount += i.submittedCount
        })
    let verification = data.filter(i => 
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified || i.verificationStatus === fieldMapping.duplicate ) ))
         verification.forEach((i) => {
            verificationCount += i.verificationCount
        })
    
    let verified = data.filter(i => 
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && (i.verificationStatus === fieldMapping.verified ) ))
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
    let notSignedIn = data.filter(i => (i.recruitType === recruitType && i.signedStatus === fieldMapping.no ))
    let signedIn = data.filter(i => (i.recruitType === recruitType && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.no))
    let consented = data.filter(i => (i.recruitType === recruitType && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.no))
    let submittedProfile = data.filter(i => 
                            (i.recruitType === recruitType && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.notYetVerified || i.verificationStatus === fieldMapping.outreachTimedout) ))
    let verification = data.filter(i => 
                            (i.recruitType === recruitType && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified || i.verificationStatus === fieldMapping.duplicate ) ))
    if (recruitType === fieldMapping.passive) currentWorflowObj.notSignedIn = 0
    else currentWorflowObj.notSignedIn = ( (notSignedIn[0] !== undefined) ? (notSignedIn[0].signedCount): (0))
    currentWorflowObj.signedIn = ( (signedIn[0] !== undefined) ? (signedIn[0].signedCount): (0))
    currentWorflowObj.consented = ( (consented[0] !== undefined) ? (consented[0].consentCount): (0)) 
    currentWorflowObj.submittedProfile = ( (submittedProfile[0] !== undefined) ? (submittedProfile[0].submittedCount): (0))
    currentWorflowObj.verification = ( (verification[0] !== undefined) ? (verification[0].verificationCount): (0) )
    return currentWorflowObj;
}

const filterTotalCurrentWorkflow = (data) => {
    let currentWorflowObj = {}
    let notSignedIn = data.filter(i => ((i.recruitType === fieldMapping.active) && i.signedStatus === fieldMapping.no))
    let signedIn = data.filter(i => ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.signedStatus === fieldMapping.yes && i.consentStatus === fieldMapping.no))
    let consented = data.filter(i => ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.no))
    let submittedProfile = data.filter(i => 
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && i.submittedStatus === fieldMapping.yes && (i.verificationStatus === fieldMapping.notYetVerified || i.verificationStatus === fieldMapping.outreachTimedout) ))
    let verification = data.filter(i => 
        ((i.recruitType === fieldMapping.active || fieldMapping.passive) && (i.verificationStatus === fieldMapping.verified || i.verificationStatus === fieldMapping.cannotBeVerified || i.verificationStatus === fieldMapping.duplicate ) ))
    currentWorflowObj.notSignedIn = ( (notSignedIn[0] !== undefined) ? (notSignedIn[0].signedCount): (0))
    currentWorflowObj.signedIn = ( (signedIn[0] !== undefined) ? (signedIn[0].signedCount): (0))
    currentWorflowObj.consented = ( (consented[0] !== undefined) ? (consented[0].consentCount): (0)) 
    currentWorflowObj.submittedProfile = ( (submittedProfile[0] !== undefined) ? (submittedProfile[0].submittedCount): (0))
    currentWorflowObj.verification = ( (verification[0] !== undefined) ? (verification[0].verificationCount): (0) )   
    return currentWorflowObj;
}

const filterVerification = (data, recruit) =>{
    let currentVerificationObj = {};
    let recruitType = fieldMapping[recruit]
    let filteredData = data.filter(i => i.recruitType === recruitType);
    filteredData.forEach((i) => {
        
    if (i.verificationStatus === fieldMapping.notYetVerified) {
        currentVerificationObj.notYetVerified = i.verificationCount
    }
    else if (i.verificationStatus === fieldMapping.outreachTimedout) {
        currentVerificationObj.outreachTimedout = i.verificationCount
    }
    else if (i.verificationStatus === fieldMapping.verified) {
        currentVerificationObj.verified = i.verificationCount
    }
    else if (i.verificationStatus === fieldMapping.cannotBeVerified) {
        currentVerificationObj.cannotBeVerified = i.verificationCount
    }
    else {
        currentVerificationObj.duplicate = i.verificationCount
    }
    });

    return currentVerificationObj;

}

const filterDenominatorVerificationStatus = (data) => {
    let currentObj = {};
    let activeConsentCount = 0
    let passiveConsentCount = 0
    let activeDenominator = data.filter(i => i.recruitType === fieldMapping.active 
        && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes);
        activeDenominator.forEach((i) => {
            activeConsentCount += i.consentCount
        })
   let passiveDenominator = data.filter(i => i.recruitType === fieldMapping.passive 
        && i.consentStatus === fieldMapping.yes && i.submittedStatus === fieldMapping.yes);
        passiveDenominator.forEach((i) => {
            passiveConsentCount += i.consentCount
    })

    currentObj.activeDenominator = activeConsentCount
    currentObj.passiveDenominator = passiveConsentCount
    return currentObj; 
}

const filterRecruits = (data) => {
    let currentObj = {'activeCount': 0, 'passiveCount': 0};
    data.forEach((i) => {
        i.recruitType === fieldMapping.active ?
            currentObj.activeCount = i.counter
        :
        currentObj.passiveCount = i.counter;
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
        genderStats, raceStats, ageStats, activeVerificationStatus, passiveVerificationStatus, denominatorVerificationStatus, recruitsCount )

    animation(false);
}


const clearLocalStroage = () => {
    internalNavigatorHandler(counter);
    animation(false);
    delete localStorage.dashboard;
    window.location.hash = '#';
}

const filterDatabySiteCode = (resultHolder, filteredResults, siteKeyFilter) => {
    if (siteKeyFilter !== nameToKeyObj.allResults) {
        filteredResults.filter(i => {
            if(i.siteCode === siteKeyFilter) {
                resultHolder.push(i);
            }});  
    } else {
        filteredResults.filter(i => {
                resultHolder.push(i);
            });  
    }
    return resultHolder;
}

const renderParticipantsNotVerified = async () => {
    if (localStorage.dashboard) {
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const response = await fetchData(siteKey, 'notyetverified');
        response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
        if (response.code === 200) {
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
            document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Not Verified Participants'
            removeActiveClass('dropdown-item', 'dd-item-active')
            document.getElementById('notVerifiedBtn').classList.add('dd-item-active');
            removeActiveClass('nav-link', 'active');
            document.getElementById('participants').classList.add('active');
            mainContent.innerHTML = renderTable(filterdata(response.data));
            addEventFilterData(filterdata(response.data), true);
            renderData(filterdata(response.data), true);
            activeColumns(filterdata(response.data), true);
            eventVerifiedButton(siteKey);
            eventNotVerifiedButton(siteKey);
            animation(false);
        }
        internalNavigatorHandler(counter)
        if (response.code === 401) {
            clearLocalStroage();
        }
    } else {
        animation(false);
        window.location.hash = '#';
    }
}

const renderParticipantsCanNotBeVerified = async () => {
    if (localStorage.dashboard) {
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const response = await fetchData(siteKey, 'cannotbeverified');
        response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
        if (response.code === 200) {
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
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
            eventVerifiedButton(siteKey);
            animation(false);
        }
        internalNavigatorHandler(counter);
        if (response.code === 401) {
            clearLocalStroage();
        }
    } else {
        animation(false);
        window.location.hash = '#';
    }
}

const renderParticipantsVerified = async () => {
    if (localStorage.dashboard) {
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const response = await fetchData(siteKey, 'verified');
        response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
        if (response.code === 200) {
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
            document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Verified Participants'
            removeActiveClass('dropdown-item', 'dd-item-active')
            document.getElementById('verifiedBtn').classList.add('dd-item-active');
            removeActiveClass('nav-link', 'active');
            document.getElementById('participants').classList.add('active');
            mainContent.innerHTML = renderTable(filterdata(response.data));
            addEventFilterData(filterdata(response.data));
            renderData(filterdata(response.data));
            activeColumns(filterdata(response.data));
            eventVerifiedButton(siteKey);
            animation(false);
        }
        internalNavigatorHandler(counter);
        if (response.code === 401) {
            clearLocalStroage();
        }
    } else {
        animation(false);
        window.location.hash = '#';
    }
}

const renderParticipantsAll = async () => {
    if (localStorage.dashboard) {
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const response = await fetchData(siteKey, 'all');
        response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
        if (response.code === 200) {
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
            document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> All Participants'
            removeActiveClass('dropdown-item', 'dd-item-active');
            document.getElementById('allBtn').classList.add('dd-item-active');
            removeActiveClass('nav-link', 'active');
            document.getElementById('participants').classList.add('active');
            mainContent.innerHTML = renderTable(filterdata(response.data));
            addEventFilterData(filterdata(response.data));
            renderData(filterdata(response.data));
            activeColumns(filterdata(response.data));
            eventVerifiedButton(siteKey);
            animation(false);
        }
        internalNavigatorHandler(counter);
        if (response.code === 401) {
            clearLocalStroage();
        }
    } else {
        animation(false);
        window.location.hash = '#';
    }
}

const eventNotVerifiedButton = (siteKey) => {
    const notVerifiedBtns = document.getElementsByClassName('participantNotVerified');
    Array.from(notVerifiedBtns).forEach(elem => {
        elem.addEventListener('click', async () => {
            animation(true);
            const token = elem.dataset.token;
            const response = await participantVerification(token, false, siteKey);
            if (response.code === 200) {
                // animation(false);
                // const dataTable = document.getElementById('dataTable');
                // const elements = dataTable.querySelectorAll(`[data-token="${token}"]`);
                // elements[0].parentNode.parentNode.parentNode.removeChild(elements[0].parentNode.parentNode);
                location.reload();
            }
        });
    });
}




const getMappings = async () => {
    const response = await fetch('https://raw.githubusercontent.com/episphere/conceptGithubActions/master/aggregate.json');
    const mappings = await response.json();
    localStorage.setItem("conceptIdMapping", JSON.stringify(mappings));
}



