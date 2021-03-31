import { renderParticipantLookup } from './participantLookup.js';
import { renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass } from './navigationBar.js';
import { renderTable, filterdata, renderData, addEventFilterData, activeColumns, eventVerifiedButton } from './participantCommons.js';
import { renderParticipantDetails } from './participantDetails.js';
import { renderParticipantSummary } from './participantSummary.js'
import { internalNavigatorHandler, humanReadableY } from './utils.js'
import fieldMapping from './fieldToConceptIdMapping.js';

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

// const reRenderDashboard = async (siteKey) => {
//     if (siteKey) {
//         animation(true);
//         const isAuthorized = await authorize(siteKey);
//         if (isAuthorized && isAuthorized.code === 200) {

//             document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
//             removeActiveClass('nav-link', 'active');
//             document.getElementById('dashboardBtn').classList.add('active');
//             mainContent.innerHTML = '';

//             renderCharts(siteKey);
//         }
//         internalNavigatorHandler(counter); // function call to prevent internal navigation when there's unsaved changes
//         if (isAuthorized.code === 401) {
//             clearLocalStroage();
//         }
//     } else {
//         animation(false);
//         window.location.hash = '#';
//     }
// }

// const renderSiteKeyList = (siteKey) => {
//     let template = ``;
//     if (siteKey === fieldMapping['nci'] || fieldMapping['norc']) {
  
//     template += `
//             <div style="margin-top:10px; padding:15px;" class="dropdown">
//                 <button class="btn btn-secondary dropdown-toggle" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                 Change Site Preference 
//                 </button>
//             <div class="dropdown-menu" id="dropdownMenuButton" aria-labelledby="dropdownMenuButton">
//                 <a class="dropdown-item" data-siteKey="kpGA" id="kpGA">KP GA</a>
//                 <a class="dropdown-item" data-siteKey="kpHI" id="kpHI">KP HI</a>
//                 <a class="dropdown-item" data-siteKey="nci" id="nci">NCI</a>
//                 <a class="dropdown-item" data-siteKey="kpCO" id="kpCO">KP CO</a>
//                 <a class="dropdown-item" data-siteKey="maClinic" id="maClinic">Marshfield Clinic</a>
//                 <a class="dropdown-item" data-siteKey="hfHealth" id="hfHealth">Henry Ford Health Systems</a>
//             </div>
//         </div>
//             `}
//     return template;
// }

// const dropdownTrigger = () => {

//     const dropdownMenuButton = document.getElementById('dropdownMenuButton')
//     if (dropdownMenuButton) {
//         dropdownMenuButton.addEventListener('click', (e) => {
//             const t = getDataAttributes(e.target)
//             reRenderDashboard(fieldMapping[t.sitekey]);
//         })
//     }
// }

// const getDataAttributes = (el) => {
//     let data = {};
//     [].forEach.call(el.attributes, function(attr) {
//         if (/^data-/.test(attr.name)) {
//             var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
//                 return $1.toUpperCase();
//             });
//             data[camelCaseName] = attr.value;
//         }
//     });
//     return data;
// }

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

const renderCharts = async (siteKey) => {

    const stats = await fetchData(siteKey, 'stats');

    const filterWorkflowResults = await fetchStats(siteKey, 'participants_workflow');
    const filterVerificationResults = await fetchStats(siteKey, 'participants_verification');
    const recruitsCountResults = await fetchStats(siteKey, 'participants_recruits_count');

    const activeRecruitsFunnel = filterRecruitsFunnel(filterWorkflowResults.stats, 'active')
    const passiveRecruitsFunnel = filterRecruitsFunnel(filterWorkflowResults.stats, 'passive')
    const totalRecruitsFunnel = filterTotalRecruitsFunnel(filterWorkflowResults.stats)

    const activeCurrentWorkflow = filterCurrentWorkflow(filterWorkflowResults.stats, 'active')
    const passiveCurrentWorkflow = filterCurrentWorkflow(filterWorkflowResults.stats, 'passive')
    const totalCurrentWorkflow = filterTotalCurrentWorkflow(filterWorkflowResults.stats)

    const participantsGenderMetric = await fetchStats(siteKey, 'sex');
    const participantsRaceMetric = await fetchStats(siteKey, 'race');
    const participantsAgeMetric = await fetchStats(siteKey, 'age');

    const activeVerificationStatus = filterVerification(filterVerificationResults.stats, 'active')
    const passiveVerificationStatus = filterVerification(filterVerificationResults.stats, 'passive')
    const denominatorVerificationStatus = filterDenominatorVerificationStatus(filterWorkflowResults.stats)


    const recruitsCount = filterRecruits(recruitsCountResults.stats)

    if (stats.code === 200) {
        const siteSelectionRow = document.createElement('div');
        siteSelectionRow.classList = ['row'];
        siteSelectionRow.id = 'siteSelection';
        if (stats.data.length > 1) {
            //mainContent.appendChild(siteSelectionRow);
            //renderSiteSelection(stats.data);
        }
        // const rowHeader = document.createElement('div');
        // rowHeader.classList = ['rowHeader'];
        // rowHeader.innerHTML = renderSiteKeyList(siteKey)
        // mainContent.appendChild(rowHeader);
        // dropdownTrigger();

        const row = document.createElement('div');
        row.classList = ['row'];

        let funnelChart = document.createElement('div');
        funnelChart.classList = ['col-lg-4 charts'];

        let subFunnelChart = document.createElement('div');
        subFunnelChart.classList = ['col-lg-12 sub-div-shadow viz-div'];
        subFunnelChart.innerHTML = renderLabel(recruitsCount.activeCount, 'Active');
        subFunnelChart.setAttribute('id', 'funnelChart');
        funnelChart.appendChild(subFunnelChart);

        let barChart = document.createElement('div');
        barChart.classList = ['col-lg-4 charts'];

        let subBarChart = document.createElement('div');
        subBarChart.classList = ['col-lg-12 sub-div-shadow viz-div'];
        subBarChart.innerHTML = renderLabel(recruitsCount.activeCount, 'Active');
        subBarChart.setAttribute('id', 'barChart');
        barChart.appendChild(subBarChart);

        let activeOptouts = document.createElement('div');
        activeOptouts.classList = ['col-lg-4 charts'];

        let subactiveOptouts = document.createElement('div');
        subactiveOptouts.classList = ['col-lg-12 sub-div-shadow viz-div'];
    //    activeOptouts.innerHTML = renderLabel(recruitsCount.activeCount, 'Active')
        subactiveOptouts.setAttribute('id', 'activeOptouts');
        activeOptouts.appendChild(subactiveOptouts);

        row.appendChild(funnelChart);
        row.appendChild(barChart);
        row.appendChild(activeOptouts);

        mainContent.appendChild(row); // active 

        const row1 = document.createElement('div');
        row1.classList = ['row'];

        let funnelChart1 = document.createElement('div');
        funnelChart1.classList = ['col-lg-4 charts'];

        let subFunnelChart1 = document.createElement('div');
        subFunnelChart1.classList = ['col-lg-12 viz-div sub-div-shadow'];
        subFunnelChart1.innerHTML = renderLabel(recruitsCount.passiveCount, 'Passive');
        subFunnelChart1.setAttribute('id', 'passiveFunnelChart');
        funnelChart1.appendChild(subFunnelChart1);

        let barChart1 = document.createElement('div');
        barChart1.classList = ['col-lg-4 charts'];

        let subBarChart1 = document.createElement('div');
        subBarChart1.classList = ['col-lg-12 viz-div sub-div-shadow'];
        subBarChart1.innerHTML = renderLabel(recruitsCount.passiveCount, 'Passive');
        subBarChart1.setAttribute('id', 'passiveBarChart');
        barChart1.appendChild(subBarChart1);

        let activeCounts1 = document.createElement('div');
        activeCounts1.classList = ['col-lg-4 charts'];
        let subActiveCounts1 = document.createElement('div');
        subActiveCounts1.classList = ['col-lg-12 viz-div sub-div-shadow'];
       // subActiveCounts1.innerHTML = renderLabel(recruitsCount.passiveCount, 'Passive');
        subActiveCounts1.setAttribute('id', 'passiveCounts');
        activeCounts1.appendChild(subActiveCounts1);


        row1.appendChild(funnelChart1);
        row1.appendChild(barChart1);
        row1.appendChild(activeCounts1);

        mainContent.appendChild(row1); // passive

        const row2 = document.createElement('div');
        row2.classList = ['row'];

        let funnelChart2 = document.createElement('div');
        funnelChart2.classList = ['col-lg-4 charts'];

        let subFunnelChart2 = document.createElement('div');
        subFunnelChart2.classList = ['col-lg-12 viz-div sub-div-shadow'];
        subFunnelChart2.innerHTML = renderLabel(recruitsCount.activeCount + recruitsCount.passiveCount, 'Total');
        subFunnelChart2.setAttribute('id', 'totalFunnelChart');
        funnelChart2.appendChild(subFunnelChart2);
        row2.appendChild(funnelChart2)

        let barChart2 = document.createElement('div');
        barChart2.classList = ['col-lg-4 charts'];

        let subBarChart2 = document.createElement('div');
        subBarChart2.classList = ['col-lg-12 viz-div sub-div-shadow'];
        subBarChart2.innerHTML = renderLabel(recruitsCount.activeCount + recruitsCount.passiveCount, 'Total');;
        subBarChart2.setAttribute('id', 'totalBarChart');
        barChart2.appendChild(subBarChart2);
        row2.appendChild(barChart2);

        let totalCounts = document.createElement('div');
        totalCounts.classList = ['col-lg-4 charts'];

        let subTotalCounts = document.createElement('div');
        subTotalCounts.classList = ['col-lg-12 sub-div-shadow viz-div'];
      //  subTotalCounts.innerHTML = renderLabel(recruitsCount.activeCount + recruitsCount.passiveCount, 'Total');;
        subTotalCounts.setAttribute('id', 'totalCounts');
        totalCounts.appendChild(subTotalCounts);
        row2.appendChild(totalCounts);

        mainContent.appendChild(row2); // total

        const row3 = document.createElement('div');
        row3.classList = ['row'];

        let stackedBarChart = document.createElement('div');
        stackedBarChart.classList = ['col-lg-4 charts'];

        let subStackedBarChart = document.createElement('div');
        subStackedBarChart.classList = ['col-lg-12 viz-div sub-div-shadow'];
        subStackedBarChart.setAttribute('id', 'metrics');
        stackedBarChart.appendChild(subStackedBarChart);
        row3.appendChild(stackedBarChart);

        let pieChart = document.createElement('div');
        pieChart.classList = ['col-lg-4 charts'];

        let subPieChart = document.createElement('div');
        subPieChart.classList = ['col-lg-12 viz-div sub-div-shadow'];
        subPieChart.setAttribute('id', 'activeVerificationStatus');
        pieChart.appendChild(subPieChart);
        row3.appendChild(pieChart);

        let pieChart1 = document.createElement('div');
        pieChart1.classList = ['col-lg-4 charts'];

        let subPieChart1 = document.createElement('div');
        subPieChart1.classList = ['col-lg-12 viz-div sub-div-shadow'];
        subPieChart1.setAttribute('id', 'passiveVerificationStatus');
        pieChart1.appendChild(subPieChart1);
        row3.appendChild(pieChart1);

        mainContent.appendChild(row3); // Misc.



        renderAllMetricCharts(participantsGenderMetric, participantsRaceMetric, participantsAgeMetric)

        renderActiveFunnelChart(activeRecruitsFunnel, 'funnelChart')
        renderActiveBarChart(activeCurrentWorkflow, 'barChart');
        renderActiveOptouts('activeOptouts');

        renderPassiveFunnelChart(passiveRecruitsFunnel, 'passiveFunnelChart');
        renderPassiveBarChart(passiveCurrentWorkflow, 'passiveBarChart');

        renderTotalFunnelChart(totalRecruitsFunnel, 'totalFunnelChart');
        renderTotalCurrentWorkflow(totalCurrentWorkflow, 'totalBarChart');

        renderActiveVerificationStatus(activeVerificationStatus, denominatorVerificationStatus, 'activeVerificationStatus');
        renderPassiveVerificationStatus(passiveVerificationStatus, denominatorVerificationStatus, 'passiveVerificationStatus');

        animation(false);
    }
    if (stats.code === 401) {
        clearLocalStroage();
    }
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
    data = filterVerificationStatus(filteredData, currentVerificationObj);
    return data;
}

const filterVerificationStatus = (stats, currentVerificationObj) => {
    stats.forEach((i) => {
        
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

const renderLabel = (count, recruitType) => {
    let template = ``;
    (recruitType === 'Active') ?
        (template += `<span class="badge bg-primary" style="color:white"> ${recruitType} Recruits: ${count}</span>`)
        :
    (recruitType === 'Passive') ?
        (template += `<span class="badge bg-primary" style="color:white"> ${recruitType} Recruits: ${count}</span>`)
        :
    (recruitType === 'Total') ?
        (template += `<span class="badge bg-primary" style="color:white"> ${recruitType} Recruits: ${count}</span>`)
        :
        ''

    return template;

}

const renderActiveFunnelChart = (activeRecruitsFunnel, id) => {
    const signIn =  activeRecruitsFunnel.signedIn
    const consent = activeRecruitsFunnel.consented;
    const userProfile =  activeRecruitsFunnel.submittedProfile
    const verification = activeRecruitsFunnel.verification
    const verified = activeRecruitsFunnel.verified
    
        const data = [{
            x: [signIn, consent, userProfile, verification, verified],
            y: ['Signed In', 'Consented', 'Submitted', 'Verification', 'Verified'],
            type: 'funnel',
            textinfo: 'hello ${23}', 
            marker: {
                color: ["#0C1368", "#242C8F", "#525DE9", '#008ECC', '#6593F5']
            }
        }];
    
        const layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            title: `Cumulative Status`
        };
    
        Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
    }


const renderActiveBarChart = (activeCurrentWorkflow, id) => {
    const notSignedIn = activeCurrentWorkflow.notSignedIn;
    const signedInNotConsented = activeCurrentWorkflow.signedIn;
    const consentedNotSubmitted = activeCurrentWorkflow.consented;
    const submittedVerificationNotCompleted = activeCurrentWorkflow.submittedProfile;
    const verificationCompleted = activeCurrentWorkflow.verification;
    const trace1 = {
        x: ['Never Signed In', 'Signed In, No Consent', 'Consented, No Profile', 'Profile, Verified Not Complete', 'Verification Complete'],
        y: [notSignedIn, signedInNotConsented, consentedNotSubmitted, submittedVerificationNotCompleted, verificationCompleted],
        name: 'Completed',
        type: 'bar'
    };

    const data = [trace1];

    const layout = {
        barmode: 'stack',
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
       // colorway: ['#7f7fcc', '#0C1368', '#525DE9', '#008ECC'],
        title: 'Current Status in Workflow'
    };

    Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
}

const renderPassiveFunnelChart = (passiveRecruitsFunnel, id) => {
    
    const signIn =  passiveRecruitsFunnel.signedIn
    const consent = passiveRecruitsFunnel.consented;
    const userProfile =  passiveRecruitsFunnel.submittedProfile
    const verification = passiveRecruitsFunnel.verification
    const verified = passiveRecruitsFunnel.verified

        const data = [{
            x: [signIn, consent, userProfile, verification, verified],
            y: ['Signed In', 'Consented', 'Submitted', 'Verification', 'Verified'],
            type: 'funnel',
            marker: {
                color: ["#0C1368", "#242C8F", "#525DE9", '#008ECC', '#6593F5']
            }
        }];
    
        const layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };
    
        Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
};

const renderActiveOptouts = (id) => {
    let template = ``;
    template += `
        <span style="text-align: center;"><h5>Opt Outs</h5></span>`
    document.getElementById(id).innerHTML = template
}

const renderPassiveBarChart = (passiveCurrentWorkflow, id) => {
    const notSignedIn = passiveCurrentWorkflow.notSignedIn;
    const signedInNotConsented = passiveCurrentWorkflow.signedIn;
    const consentedNotSubmitted = passiveCurrentWorkflow.consented;
    const submittedVerificationNotCompleted = passiveCurrentWorkflow.submittedProfile;
    const verificationCompleted = passiveCurrentWorkflow.verification;
    const trace1 = {
        x: ['Not signed in ', 'Signed in not consent ', ' Consented User Profile not Submitted', 'Submitted Verification Not Completed', 'Verification'],
        y: [notSignedIn, signedInNotConsented, consentedNotSubmitted, submittedVerificationNotCompleted, verificationCompleted],
        name: 'Completed',
        type: 'bar'
    };

    const data = [trace1];

    const layout = {
        barmode: 'stack',
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
       // colorway: ['#7f7fcc', '#0C1368', '#525DE9', '#008ECC'],
    };

    Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });

}

const renderTotalFunnelChart = (totalRecruitsFunnel, id) => {

    const signIn =  totalRecruitsFunnel.signedIn
    const consent = totalRecruitsFunnel.consented;
    const userProfile =  totalRecruitsFunnel.submittedProfile
    const verified = totalRecruitsFunnel.verified
    const verification = totalRecruitsFunnel.verification
    
        const data = [{
            x: [signIn, consent, userProfile, verification, verified],
            y: ['Signed In', 'Consented', 'Submitted', 'Verification', 'Verified'],
            type: 'funnel',
            marker: {
                color: ["#0C1368", "#242C8F", "#525DE9", '#008ECC', '#6593F5']
            }
        }];
    
        const layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
        };
    
        Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
};


const renderTotalCurrentWorkflow = (totalCurrentWorkflow, id) => {
    const notSignedIn = totalCurrentWorkflow.notSignedIn;
    const signedInNotConsented = totalCurrentWorkflow.signedIn;
    const consentedNotSubmitted = totalCurrentWorkflow.consented;
    const submittedVerificationNotCompleted = totalCurrentWorkflow.submittedProfile;
    const verificationCompleted = totalCurrentWorkflow.verification;
    const trace1 = {
        x: ['Not signed in ', 'Signed in not consent ', ' Consented User Profile not Submitted', 'Submitted Verification Not Completed', 'Verification'],
        y: [notSignedIn, signedInNotConsented, consentedNotSubmitted, submittedVerificationNotCompleted, verificationCompleted],
        name: 'Completed',
        type: 'bar'
    };

    const data = [trace1];

    const layout = {
        barmode: 'stack',
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
       // colorway: ['#7f7fcc', '#0C1368', '#525DE9', '#008ECC'],
    };

    Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });

}

const renderActiveVerificationStatus = (activeVerificationStatus, denominatorVerificationStatus, id) => {
    const notYetVerified =  activeVerificationStatus.notYetVerified 
                            && ((activeVerificationStatus.notYetVerified)/(denominatorVerificationStatus.activeDenominator)*100).toFixed(2);
    const verified = activeVerificationStatus.verified 
                        && ((activeVerificationStatus.verified)/(denominatorVerificationStatus.activeDenominator)*100).toFixed(2);
    const cannotBeVerified =  activeVerificationStatus.cannotBeVerified 
                        && ((activeVerificationStatus.cannotBeVerified)/(denominatorVerificationStatus.activeDenominator)*100).toFixed(2);
    const duplicate = activeVerificationStatus.duplicate 
                        && ((activeVerificationStatus.duplicate)/(denominatorVerificationStatus.activeDenominator)*100).toFixed(2);
    const outreachTimedOut = activeVerificationStatus.outreachTimedOut 
                        && ((activeVerificationStatus.outreachTimedOut)/(denominatorVerificationStatus.activeDenominator)*100).toFixed(2);

    var data = [{
        values: [notYetVerified, verified, cannotBeVerified, duplicate, outreachTimedOut],
        labels: [ 'Not Verified', 'Verified', 'Cannot be Verified','Duplicate', 'Outreach Maxed Out'],
        type: 'pie'
      }];
      
      const layout = {

        showlegend: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
       // colorway: ['#7f7fcc', '#0C1368', '#525DE9', '#008ECC'],
        title: 'Active Recruits Verification Status'
    };
      

  
      Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
  }

  const renderPassiveVerificationStatus = (passiveVerificationStatus, denominatorVerificationStatus, id) => {
    const notYetVerified =  passiveVerificationStatus.notYetVerified 
                            && ((passiveVerificationStatus.notYetVerified)/(denominatorVerificationStatus.passiveDenominator)*100).toFixed(2);
    const verified = passiveVerificationStatus.verified 
                        && ((passiveVerificationStatus.verified)/(denominatorVerificationStatus.passiveDenominator)*100).toFixed(2);
    const cannotBeVerified =  passiveVerificationStatus.cannotBeVerified 
                        && ((passiveVerificationStatus.cannotBeVerified)/(denominatorVerificationStatus.passiveDenominator)*100).toFixed(2);
    const duplicate = passiveVerificationStatus.duplicate 
                        && ((passiveVerificationStatus.duplicate)/(denominatorVerificationStatus.passiveDenominator)*100).toFixed(2);
     const outreachTimedOut = passiveVerificationStatus.outreachTimedOut 
                        && ((passiveVerificationStatus.outreachTimedOut)/(denominatorVerificationStatus.passiveDenominator)*100).toFixed(2);
    var data = [{
        values: [notYetVerified, verified, cannotBeVerified, duplicate, outreachTimedOut],
        labels: [ 'Not Verified', 'Verified', 'Cannot be Verified','Duplicate', 'Outreach Maxed Out'],
        type: 'pie'
      }];

      const layout = {
        showlegend: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
       // colorway: ['#7f7fcc', '#0C1368', '#525DE9', '#008ECC'],
        title: 'Passive Recruits Verification Status'
    };
      
      Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
  }

  const renderAllMetricCharts = (participantsGenderMetric, participantsRaceMetric, participantsAgeMetric) => {
    let genderObject = {female: 0, male: 0, intersex: 0, unknown: 0}
    filterGenderMetrics(participantsGenderMetric.stats, genderObject)
    let raceObject = {americanIndian: 0, asian: 0, africanAmerican: 0, latino: 0, nativeHawaiian: 0, middleEastern: 0, white: 0, none: 0, other: 0}
    filterRaceMetrics(participantsRaceMetric.stats, raceObject)
    let ageObject = {'40-45': 0, '46-50': 0, '51-55': 0, '56-60': 0, '61-65': 0}
    filterAgeMetrics(participantsAgeMetric.stats, ageObject)

    renderStackBarChart(genderObject, raceObject, ageObject, 'metrics')
   
}

const filterGenderMetrics = (participantsGenderMetrics, genderObject) => {
        participantsGenderMetrics.forEach( i => {
        (parseInt(i.gender) === fieldMapping['male']) ?
            genderObject['male']++
        :
        (parseInt(i.gender) === fieldMapping['female']) ?
            genderObject['female']++
        :
        (parseInt(i.gender) === fieldMapping['intersex']) ?
            genderObject['intersex']++
        :
            genderObject['unknown']++
        return genderObject;
        }
    )}


const filterRaceMetrics = (participantsRaceMetrics, raceObject) => {
    participantsRaceMetrics.forEach( i => {
            i.Race && 
            (parseInt(i.Race[0]) === fieldMapping['americanIndian']) ? 
                raceObject['americanIndian']++
            :
            i.Race && 
            (parseInt(i.Race[0]) === fieldMapping['asian']) ?
                raceObject['asian']++
            :
            i.Race && 
            (parseInt(i.Race[0]) === fieldMapping['africanAmerican']) ?
                raceObject['africanAmerican']++
            :
            i.Race && 
            (parseInt(i.Race[0]) === fieldMapping['latino']) ?
                raceObject['latino']++
            :
            i.Race && 
            (parseInt(i.Race[0]) === fieldMapping['middleEastern']) ?
                raceObject['middleEastern']++
            :
            i.Race && 
            (parseInt(i.Race[0]) === fieldMapping['nativeHawaiian']) ?
                raceObject['nativeHawaiian']++
            :
            i.Race && 
            (parseInt(i.Race[0]) === fieldMapping['white']) ?
                raceObject['white']++
            :
            i.Race && 
            (parseInt(i.Race[0]) === fieldMapping['none']) ?
                raceObject['none']++
            :
                raceObject['other']++;
            return raceObject;
            
    })}

const filterAgeMetrics = (participantsAgeMetrics, ageRange) => {
    participantsAgeMetrics.forEach( i => {
        let participantYear = humanReadableY() - parseInt(i.birthYear)
        sortAgeRange(participantYear, ageRange)
        return ageRange;
        }
    )
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

const renderStackBarChart = (participantGenderResponse, participantRaceResponse, participantAgeRangeResponse, id) => {

    const participantGenderResponseF = participantGenderResponse.female;
    const participantGenderResponseM = participantGenderResponse.male;
    const participantGenderResponseI = participantGenderResponse.intersex;
    const participantGenderResponseU = participantGenderResponse.unknown;
 
    const totalGenderResponse = participantGenderResponseF + participantGenderResponseM + participantGenderResponseI + participantGenderResponseU

    const participantRaceResponseAI = participantRaceResponse.americanIndian;
    const participantRaceResponseA = participantRaceResponse.asian;
    const participantRaceResponseAA = participantRaceResponse.africanAmerican;
    const participantRaceResponseL = participantRaceResponse.latino;
    const participantRaceResponseME = participantRaceResponse.middleEastern;
    const participantRaceResponseNH = participantRaceResponse.nativeHawaiian;
    const participantRaceResponseW = participantRaceResponse.white;
    const participantRaceResponseO = participantRaceResponse.none;
    const participantRaceResponseU = participantRaceResponse.other;
        
    const totalRaceResponse = participantRaceResponseAI + participantRaceResponseA + participantRaceResponseAA +
                                participantRaceResponseL + participantRaceResponseME + participantRaceResponseNH +
                            participantRaceResponseW + participantRaceResponseO + participantRaceResponseU
                            

    const participantAgeRangeResponse1 = participantAgeRangeResponse['40-45'];
    const participantAgeRangeResponse2 = participantAgeRangeResponse['46-50'];
    const participantAgeRangeResponse3 = participantAgeRangeResponse['51-55'];
    const participantAgeRangeResponse4 = participantAgeRangeResponse['56-60'];
    const participantAgeRangeResponse5 = participantAgeRangeResponse['61-65'];

    const totalAgeRangeResponse = participantAgeRangeResponse1 + participantAgeRangeResponse2 + participantAgeRangeResponse3 + participantAgeRangeResponse4 + participantAgeRangeResponse5
    const totalVerifiedParticipants = totalGenderResponse + totalRaceResponse + totalAgeRangeResponse

    const genderPercent = Math.round((totalGenderResponse / totalVerifiedParticipants) * 100)
    const racePercent = Math.round((totalRaceResponse / totalVerifiedParticipants) * 100)
    const ageRangePercent = Math.round((totalAgeRangeResponse / totalVerifiedParticipants) * 100)


    let ageTrace1 = {
        y: ['Age'],
        x: [participantAgeRangeResponse1],
        type: 'bar',
        name: '40-45',
        text: `Total: ${ageRangePercent}%`,
        orientation: 'h'
    };

    let ageTrace11 = {
        y: ['Age'],
        x: [participantAgeRangeResponse2],
        type: 'bar',
        name: '46-50',
        text: `Total: ${ageRangePercent}%`,
        orientation: 'h'
    };

    let ageTrace12 = {
        y: ['Age'],
        x: [participantAgeRangeResponse3],
        type: 'bar',
        name: '51-55',
        text: `Total: ${ageRangePercent}%`,
        orientation: 'h'
    };

    let ageTrace13 = {
        y: ['Age'],
        x: [participantAgeRangeResponse4],
        type: 'bar',
        name: '56-60',
        text: `Total: ${ageRangePercent}%`,
        orientation: 'h'
    };

    let ageTrace14 = {
        y: ['Age'],
        x: [participantAgeRangeResponse5],
        type: 'bar',
        name: '61-66',
        text: `Total: ${ageRangePercent}%`,
        orientation: 'h'
    };

    let raceTrace = {
        y: ['Race Binary'],
        x: [participantRaceResponseAI],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'American Indian',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace1 = {
        y: ['Race Binary'],
        x: [participantRaceResponseA],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Asian',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace2 = {
        y: ['Race Binary'],
        x: [participantRaceResponseAA],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'African American',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace3 = {
        y: ['Race Binary'],
        x: [participantRaceResponseL],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Latino',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace4 = {
        y: ['Race Binary'],
        x: [participantRaceResponseME],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Middle Eastern',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace5 = {
        y: ['Race Binary'],
        x: [participantRaceResponseNH],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Native Hawaiian',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };


    let raceTrace6 = {
        y: ['Race Binary'],
        x: [participantRaceResponseW],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'White',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };

    let raceTrace7 = {
        y: ['Race Binary'],
        x: [participantRaceResponseO],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Other',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace8 = {
        y: ['Race Binary'],
        x: [participantRaceResponseU],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Unknown',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };

    let genderTrace = {
        y: ['Sex'],
        x: [participantGenderResponseF],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'bar',
        name: 'Female',
        text: `Total: ${genderPercent}%`,
        orientation: 'h'
    };

    let genderTrace2 = {
        y: ['Sex'],
        x: [participantGenderResponseM],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'bar',
        name: 'Male',
        text: `Total: ${genderPercent}%`,
        orientation: 'h'
    };

    let genderTrace3 = {
        y: ['Sex'],
        x: [participantGenderResponseI],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'bar',
        name: 'Intersex',
        text: `Total: ${genderPercent}%`,
        orientation: 'h'
    };

    let genderTrace4 = {
        y: ['Sex'],
        x: [participantGenderResponseU],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'bar',
        name: 'Unknown',
        text: `Total: ${genderPercent}%`,
        orientation: 'h'
    };

    let data = [
        ageTrace1, ageTrace11, ageTrace12, ageTrace13, ageTrace14,
        raceTrace, raceTrace1, raceTrace2, raceTrace3, raceTrace4, raceTrace5, raceTrace6, raceTrace7, raceTrace8,
        genderTrace, genderTrace2, genderTrace3, genderTrace4
    ];


    let layout = {
        barmode: 'stack',
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',


        // colorway: ['#111E6C', '#1D2951', '#0E4D92', '#0080FF', '#008ECC', '#6593F5'],  
        autosize: false,
        width: 600,
        height: 300,
        title: 'Demographics of Verified Participants',
        yaxis: { domain: [0, 0.266], automargin: true },
        xaxis: { showgrid: false, automargin: true, showticklabels: false, title: { text: `Total number of verified participants: ${totalVerifiedParticipants}` } },
        xaxis3: { anchor: 'y3', showticklabels: false, automargin: true },
        xaxis2: { anchor: 'y2', showticklabels: false, automargin: true },
        yaxis2: { domain: [0.366, 0.633], automargin: true },
        yaxis3: { domain: [0.733, 1], automargin: true },

    };

    Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
}


// const renderSiteSelection = (data) => {
//     let template = `<label class="col-md-1 col-form-label" for="selectSites">Select IHCS</label><div class="col-md-4 form-group"><select id="selectSites" class="form-control">`
//     template += `<option value="all">All</option>`
//     data.map(dt => dt['siteCode']).forEach(siteCode => {
//         template += `<option value="${siteCode}">${JSON.parse(localStorage.conceptIdMapping)[siteCode] && [siteCode]['Variable Name'] || [siteCode]['Variable Label']}</option>`
//     })
//     template += '</select></div>'
//     document.getElementById('siteSelection').innerHTML = template;
//     addEventSiteSelection(data);
// }

// const addEventSiteSelection = (data) => {
//     const select = document.getElementById('selectSites');
//     select.addEventListener('change', () => {
//         let filteredData = '';
//         if (select.value === 'all') filteredData = data;
//         else filteredData = data.filter(dt => dt['siteCode'] === parseInt(select.value));
//         renderAllCharts(filteredData);
//     })
// }


const clearLocalStroage = () => {
    internalNavigatorHandler(counter);
    animation(false);
    delete localStorage.dashboard;
    window.location.hash = '#';

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



