import {renderParticipantLookup} from './participantLookup.js'; 
import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import {renderTable, filterdata, renderData, importantColumns, addEventFilterData, activeColumns, eventVerifiedButton} from './commons.js';
import { renderParticipantDetails } from './participantDetails.js';

window.onload = async () => {
    router();
    await getMappings();
}

window.onhashchange = () => {
    router();
}

const router = () => {
    const hash = decodeURIComponent(window.location.hash);
    const route =  hash || '#';
    if(route === '#') homePage();
    else if(route === '#dashboard') renderDashboard();
    else if(route === '#participants/notyetverified') renderParticipantsNotVerified();
    else if(route === '#participants/cannotbeverified') renderParticipantsCanNotBeVerified();
    else if(route === '#participants/verified') renderParticipantsVerified();
    else if(route === '#participants/all') renderParticipantsAll();
    else if(route === '#participantLookup') renderParticipantLookup();
    else if(route === '#participantDetails') renderParticipantDetails();
    else if(route === '#logout') clearLocalStroage();
    else window.location.hash = '#';
}

const homePage = async () => {
    if(localStorage.dashboard){
        window.location.hash = '#dashboard';
    }
    else{
        document.getElementById('navBarLinks').innerHTML = renderNavBarLinks();
        const mainContent = document.getElementById('mainContent')
        mainContent.innerHTML = renderLogin();
        const submit = document.getElementById('submit');
        submit.addEventListener('click', async () => {
            animation(true);
            const siteKey = document.getElementById('siteKey').value;
            const rememberMe = document.getElementById('rememberMe');
            if(siteKey.trim() === '') return;
            if(rememberMe.checked){
                const dashboard = { siteKey }
                localStorage.dashboard = JSON.stringify(dashboard);
            }
            else{
                const dashboard = {
                    siteKey,
                    expires: new Date(Date.now() + 3600000)
                }
                localStorage.dashboard = JSON.stringify(dashboard);
            }
    
            const isAuthorized = await authorize(siteKey);
            if(isAuthorized.code === 200){
                window.location.hash = '#dashboard';
            }
            if(isAuthorized.code === 401){
                clearLocalStroage();
            }
        });
    }
}

const renderDashboard = async () => {
    if(localStorage.dashboard){
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const isAuthorized = await authorize(siteKey);
        if(isAuthorized && isAuthorized.code === 200){
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
            removeActiveClass('nav-link', 'active');
            document.getElementById('dashboardBtn').classList.add('active');
            mainContent.innerHTML = '';
            renderCharts(siteKey);
        }
        if(isAuthorized.code === 401){
            clearLocalStroage();
        }
    }else{
        animation(false);
        window.location.hash = '#';
    }
}



const fetchData = async (siteKey, type) => {
    if(!checkSession()){
        alert('Session expired!');
        clearLocalStroage();
    }
    else{
        const response = await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/getParticipants?type=${type}`,{
            method:'GET',
            headers:{
                Authorization:"Bearer "+siteKey
            }
        });
        return response.json();
    }
}

const participantVerification = async (token, verified, siteKey) => {
    if(!checkSession()){
        alert('Session expired!');
        clearLocalStroage();
    }
    else{
        const response = await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/identifyParticipant?type=${verified? `verified`:`cannotbeverified`}&token=${token}`, {
            method:'GET',
            headers:{
                Authorization:"Bearer "+siteKey
            }
        });
        return response.json();
    }
}

const authorize = async (siteKey) => {
    if(!checkSession()){
        alert('Session expired!');
        clearLocalStroage();
        return false;
    }
    else{
        const response = await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/validateSiteUsers`,{
            method:'GET',
            headers:{
                Authorization:"Bearer "+siteKey
            }
        });
        return await response.json();
    }
    
}

const checkSession = () => {
    if(localStorage.dashboard){
        const localStr = JSON.parse(localStorage.dashboard);
        const expires = localStr.expires ? new Date(localStr.expires) : undefined;
        const currentDateTime = new Date(Date.now());
        return expires ? expires > currentDateTime : true;
    }
}

const animation = (status) => {
    if(status && document.getElementById('loadingAnimation')) document.getElementById('loadingAnimation').style.display = '';
    if(!status && document.getElementById('loadingAnimation')) document.getElementById('loadingAnimation').style.display = 'none';
}

const renderCharts = async (siteKey) => {
    const participantsData = await fetchData(siteKey, 'all');
    if(participantsData.code === 200){
        const row = document.createElement('div');
        row.classList = ['row'];

        let activeCounts = document.createElement('div');
        activeCounts.classList = ['col-lg-4 charts'];

        let subActiveCounts = document.createElement('div');
        subActiveCounts.classList = ['col-lg-12 sub-div-shadow viz-div'];
        subActiveCounts.setAttribute('id', 'activeCounts');
        activeCounts.appendChild(subActiveCounts);

        let funnelChart = document.createElement('div');
        funnelChart.classList = ['col-lg-4 charts'];

        let subFunnelChart = document.createElement('div');
        subFunnelChart.classList = ['col-lg-12 sub-div-shadow viz-div'];
        subFunnelChart.setAttribute('id', 'funnelChart');
        funnelChart.appendChild(subFunnelChart);

        let barChart = document.createElement('div');
        barChart.classList = ['col-lg-4 charts'];

        let subBarChart = document.createElement('div');
        subBarChart.classList = ['col-lg-12 sub-div-shadow viz-div'];
        subBarChart.setAttribute('id', 'barChart');
        barChart.appendChild(subBarChart);

        row.appendChild(activeCounts);
        row.appendChild(funnelChart);
        row.appendChild(barChart);
        mainContent.appendChild(row);

        const row1 = document.createElement('div');
        row1.classList = ['row'];

        let activeCounts1 = document.createElement('div');
        activeCounts1.classList = ['col-lg-4 charts'];

        let subActiveCounts1 = document.createElement('div');
        subActiveCounts1.classList = ['col-lg-12 viz-div sub-div-shadow'];
        subActiveCounts1.setAttribute('id', 'passiveCounts');
        activeCounts1.appendChild(subActiveCounts1);

        let funnelChart1 = document.createElement('div');
        funnelChart1.classList = ['col-lg-4 charts'];

        let subFunnelChart1 = document.createElement('div');
        subFunnelChart1.classList = ['col-lg-12 viz-div sub-div-shadow'];
        subFunnelChart1.setAttribute('id', 'passiveFunnelChart');
        funnelChart1.appendChild(subFunnelChart1);

        let barChart1 = document.createElement('div');
        barChart1.classList = ['col-lg-4 charts'];

        let subBarChart1 = document.createElement('div');
        subBarChart1.classList = ['col-lg-12 viz-div sub-div-shadow'];
        subBarChart1.setAttribute('id', 'passiveBarChart');
        barChart1.appendChild(subBarChart1);

        row1.appendChild(activeCounts1);
        row1.appendChild(funnelChart1);
        row1.appendChild(barChart1);
        mainContent.appendChild(row1);

        renderFunnelChart(participantsData, 'funnelChart', 486306141);
        renderBarChart(participantsData, 'barChart', 486306141);
        renderCounts(participantsData, 'activeCounts', 486306141)
        renderCounts(participantsData, 'passiveCounts', 854703046)
        renderFunnelChart(participantsData, 'passiveFunnelChart', 854703046);
        renderBarChart(participantsData, 'passiveBarChart', 854703046);
        animation(false);
    }
    if(participantsData.code === 401){
        clearLocalStroage();
    }
}

const renderFunnelChart = (participants, id, decider) => {
    const UPSubmitted = participants.data.filter(dt => dt['699625233'] === 353358909 && dt['512820379'] === decider);
    const consented = participants.data.filter(dt => dt['919254129'] === 353358909 && dt['512820379'] === decider);
    const signedIn = participants.data.filter(dt => dt['142654897'] !== undefined && dt['512820379'] === decider);
    
    const data = [{
        x: [signedIn.length, consented.length, UPSubmitted.length],
        y: ['Sign-on', 'Consent', 'User Profile'],
        type: 'funnel',
        marker: {
            color: ["#0C1368", "#242C8F", "#525DE9"]
        }
    }];
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: `${decider === 486306141 ? 'Active' : 'Passive'} Recruits`
    };
    
    Plotly.newPlot(id, data, layout, {responsive: true, displayModeBar: false});
}

const renderCounts = (participants, id, decider) => {
    document.getElementById(id).innerHTML = `${decider === 486306141 ? 'Active' : 'Passive'} recruits <br><h3>${participants.data.filter(dt => dt['512820379'] === decider).length}</h3>`
}

const renderBarChart = (participants, id, decider) => {
    const accountCreated = participants.data.filter(dt => dt['699625233'] === 353358909 && dt['512820379'] === decider);
    const consent = participants.data.filter(dt => dt['919254129'] === 353358909 && dt['512820379'] === decider);
    const participantData = participants.data.filter(dt => dt['512820379'] === decider)
    const trace1 = {
        x: [accountCreated.length, consent.length],
        y: ['Accounts created', '  Consent complete'],
        name: 'Completed',
        type: 'bar',
        orientation: 'h'
    };
    const trace2 = {
        x: [participantData.length - accountCreated.length, participantData.length - consent.length],
        y: ['Accounts created', '  Consent complete'],
        name: 'Pending',
        type: 'bar',
        orientation: 'h'
    };
    const data = [trace1, trace2];
      
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
        colorway : ['#7f7fcc', '#0C1368'],
        title: 'Participant Progress'
    };
      
    Plotly.newPlot(id, data, layout, {responsive: true, displayModeBar: false});
}

const clearLocalStroage = () => {
    animation(false);
    delete localStorage.dashboard;
    window.location.hash = '#';
}

const renderParticipantsNotVerified = async () => {
    if(localStorage.dashboard){
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const response = await fetchData(siteKey, 'notyetverified');
        response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
        if(response.code === 200){
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
        if(response.code === 401){
            clearLocalStroage();
        }
    }else{
        animation(false);
        window.location.hash = '#';
    }
}

const renderParticipantsCanNotBeVerified = async () => {
    if(localStorage.dashboard){
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const response = await fetchData(siteKey, 'cannotbeverified');
        response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
        if(response.code === 200){
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
            document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Cannot Be Verified Participants'
            removeActiveClass('dropdown-item', 'dd-item-active')
            document.getElementById('cannotVerifiedBtn').classList.add('dd-item-active');
            removeActiveClass('nav-link', 'active');
            document.getElementById('participants').classList.add('active');
            const filteredData = filterdata(response.data);
            if(filteredData.length === 0) {
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
        if(response.code === 401){
            clearLocalStroage();
        }
    }else{
        animation(false);
        window.location.hash = '#';
    }
}

const renderParticipantsVerified = async () => {
    if(localStorage.dashboard){
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const response = await fetchData(siteKey, 'verified');
        response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
        if(response.code === 200){
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
        if(response.code === 401){
            clearLocalStroage();
        }
    }else{
        animation(false);
        window.location.hash = '#';
    }
}

const renderParticipantsAll = async () => {
    if(localStorage.dashboard){
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const response = await fetchData(siteKey, 'all');
        response.data = response.data.sort((a, b) => (a['827220437'] > b['827220437']) ? 1 : ((b['827220437'] > a['827220437']) ? -1 : 0));
        if(response.code === 200){
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
        if(response.code === 401){
            clearLocalStroage();
        }
    }else{
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
            if(response.code === 200){
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



