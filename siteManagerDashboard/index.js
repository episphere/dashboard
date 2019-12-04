window.onload = () => {
    router();
}

window.onhashchange = () => {
    router();
}

const router = () => {
    const hash = decodeURIComponent(window.location.hash);
    const route =  hash || '#';
    if(route === '#') homePage();
    else if(route === '#dashboard') renderDashboard();
    else if(route === '#participants/notverified') renderParticipantsNotVerified();
    else if(route === '#participants/verified') renderParticipantsVerified();
    else if(route === '#participants/all') renderParticipantsAll();
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
        if(isAuthorized.code === 200){
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

const renderNavBarLinks = () => {
    return `
        <li class="nav-item active">
            <a class="nav-item nav-link active" href="#" title="Home"><i class="fas fa-home"></i> Home</a>
        </li>
        <li class="nav-item">
            <a target="_blank" class="nav-item nav-link" href="https://github.com/episphere/connect/issues" title="Please create an issue if you encounter any."><i class="fas fa-bug"></i> Report issue</a>
        </li>
        <li class="nav-item">
            <a target="_blank" class="nav-item nav-link" href="https://github.com/episphere/connect/projects/1" title="GitHub Projects page"><i class="fas fa-tasks"></i> GitHub Projects</a>
        </li>
        <li class="nav-item">
            <a target="_blank" class="nav-item nav-link" href="https://gitter.im/episphere/Connect-AlphaTest" title="Chat with us"><i class="fas fa-comments"></i> Chat with us</a>
        </li>
    `;
}

const dashboardNavBarLinks = () => {
    return `
        <li class="nav-item">
            <a class="nav-item nav-link" href="#dashboard" title="Dashboard" id="dashboardBtn"><i class="fas fa-home"></i> Dashboard</a>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="participants" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-users"></i> Participants
            </a>
            <div class="dropdown-menu" aria-labelledby="participants">
                <a class="dropdown-item" href="#participants/notverified" id="notVerifiedBtn">Not Verified Participants</a>
                <a class="dropdown-item" href="#participants/verified" id="verifiedBtn">Verified Participants</a>
                <a class="dropdown-item" href="#participants/all" id="allBtn">All Participants</a>
            </div>
        </li>
        <li class="nav-item">
            <a class="nav-item nav-link" href="#logout" title="Log Out"><i class="fas fa-sign-out-alt"></i> Log Out</a>
        </li>
        <li class="nav-item">
            <a target="_blank" class="nav-item nav-link" href="https://github.com/episphere/connect/issues" title="Please create an issue if you encounter any."><i class="fas fa-bug"></i> Report issue</a>
        </li>
        <li class="nav-item">
            <a target="_blank" class="nav-item nav-link" href="https://github.com/episphere/connect/projects/1" title="GitHub Projects page"><i class="fas fa-tasks"></i> GitHub Projects</a>
        </li>
        <li class="nav-item">
            <a target="_blank" class="nav-item nav-link" href="https://gitter.im/episphere/Connect-AlphaTest" title="Chat with us"><i class="fas fa-comments"></i> Chat with us</a>
        </li>
    `;
}

const renderLogin = () => {
    return `
        <div class="row">
            <h1>Site Study Manager Dashboard</h1>
        </div>
        <div class="row">
            <div class="col">
                <label for="siteKey">Site Key</label><input type="password" class="form-control" id="siteKey">
            </div>
            
        </div>
        <div class="row">
            <div class="col">
                <input id="rememberMe" type="checkbox">
                <label for="rememberMe" class="form-check-label">Remember Me</label>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <button class="btn btn-primary" id="submit">Log In</button>
            </div>
        </div>
    `;
}

const fetchData = async (siteKey, type) => {
    if(!checkSession()){
        alert('Session expired!');
        clearLocalStroage();
    }
    else{
        const response = await fetch(`https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/getParticipants/${type}`,{
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
        const response = await fetch(`https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/identifyParticipant?type=${verified? `verified`:`notverified`}&token=${token}`, {
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
    }
    else{
        const response = await fetch(`https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/validateSiteUsers`,{
            method:'GET',
            headers:{
                Authorization:"Bearer "+siteKey
            }
        });
        return response.json();
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
    if(status) document.getElementById('loadingAnimation').innerHTML = loadingAnimation();
    if(!status) document.getElementById('loadingAnimation').innerHTML = '';
}

const loadingAnimation = () => {
    return `
    <div class="d-flex justify-content-center">
        <div class="spinner-grow text-dark" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-grow text-dark" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-grow text-dark" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-grow text-dark" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    `;
}

const renderCharts = async (siteKey) => {
    const participantsData = await fetchData(siteKey, 'all');
    if(participantsData.code === 200){
        let pieChart = document.createElement('div');
        pieChart.setAttribute('class', 'col');
        pieChart.setAttribute('id', 'pieChart');

        let barChart = document.createElement('div');
        barChart.setAttribute('class','col');
        barChart.setAttribute('id', 'barChart');

        mainContent.appendChild(pieChart);
        mainContent.appendChild(barChart);
        renderPieChart(participantsData);
        renderBarChart(participantsData);
        animation(false);
    }
    if(participantsData.code === 401){
        clearLocalStroage();
    }
}

const renderPieChart = (participants) => {
    const eligibleParticipants = participants.data.filter(dt => dt.RcrtES_Eligible_v1r0 === 1);
    const inEligibleCancer = participants.data.filter(dt => dt.RcrtES_CancerHist_v1r0 === 1);
    const inEligibleAge = participants.data.filter(dt => dt.RcrtES_AgeQualify_v1r0 === 0);
    const inEligibleAgeCancer = participants.data.filter(dt => dt.RcrtES_CancerHist_v1r0 === 1 && dt.RcrtES_AgeQualify_v1r0 === 0);
    const data = [{
        values: [eligibleParticipants.length, inEligibleCancer.length, inEligibleAge.length, inEligibleAgeCancer.length],
        labels: ['Eligible', 'Not eligible, due to cancer', 'Not eligible, due to age', 'Not eligible, due to age and cancer'],
        type: 'pie',
        textinfo: "value"
    }];
    const pieLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        colorway : ['#00009C', '#006400', '#187981', '#071426'],
        title: 'Eligibility Screener Progress'
    };
    
    Plotly.newPlot('pieChart', data, pieLayout, {responsive: true, displayModeBar: false});
}

const renderBarChart = (participants) => {
    const accountCreated = participants.data.filter(dt => dt.RcrtUP_Fname_v1r0 !== undefined);
    const consent = participants.data.filter(dt => dt.RcrutCS_Consented_v1r0 === 1);
    const trace1 = {
        x: [accountCreated.length, consent.length],
        y: ['Accounts created', '  Consent complete'],
        name: 'Completed',
        type: 'bar',
        orientation: 'h'
    };
    const trace2 = {
        x: [participants.data.length - accountCreated.length, participants.data.length - consent.length],
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
        colorway : ['#184481', '#815518'],
        title: 'Participant Progress'
    };
      
    Plotly.newPlot('barChart', data, layout, {responsive: true, displayModeBar: false});
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
        const response = await fetchData(siteKey, 'notverified');
        if(response.code === 200){
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
            document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Not Verified Participants'
            removeActiveClass('dropdown-item', 'dd-item-active')
            document.getElementById('notVerifiedBtn').classList.add('dd-item-active');
            removeActiveClass('nav-link', 'active');
            document.getElementById('participants').classList.add('active');
            mainContent.innerHTML = renderTable(response.data, true);
            addEventShowMoreInfo(response.data);
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

const renderParticipantsVerified = async () => {
    if(localStorage.dashboard){
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const response = await fetchData(siteKey, 'verified');
        if(response.code === 200){
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
            document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> Verified Participants'
            removeActiveClass('dropdown-item', 'dd-item-active')
            document.getElementById('verifiedBtn').classList.add('dd-item-active');
            removeActiveClass('nav-link', 'active');
            document.getElementById('participants').classList.add('active');
            mainContent.innerHTML = renderTable(response.data);
            addEventShowMoreInfo(response.data);
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

const renderParticipantsAll = async () => {
    if(localStorage.dashboard){
        animation(true);
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const response = await fetchData(siteKey, 'all');
        if(response.code === 200){
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
            document.getElementById('participants').innerHTML = '<i class="fas fa-users"></i> All Participants'
            removeActiveClass('dropdown-item', 'dd-item-active');
            document.getElementById('allBtn').classList.add('dd-item-active');
            removeActiveClass('nav-link', 'active');
            document.getElementById('participants').classList.add('active');
            mainContent.innerHTML = renderTable(response.data);
            // Add button events
            addEventShowMoreInfo(response.data);
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

const addEventShowMoreInfo = data => {
    const elements = document.getElementsByClassName('showMoreInfo');
    Array.from(elements).forEach(element => {
        const filteredData = data.filter(dt => dt.token === element.dataset.token);
        const header = document.getElementById('modalHeader');
        const body = document.getElementById('modalBody');
        const user = filteredData[0];
        header.innerHTML = `<h4>${user.RcrtUP_Fname_v1r0} ${user.RcrtUP_Lname_v1r0}</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
        body.innerHTML = `<pre>${JSON.stringify(user, undefined, 4)}</pre>`
    })
}

const eventVerifiedButton = (siteKey) => {
    const verifiedBtns = document.getElementsByClassName('participantVerified');
    Array.from(verifiedBtns).forEach(elem => {
        elem.addEventListener('click', async () => {
            animation(true);
            const token = elem.dataset.token;
            const response = await participantVerification(token, true, siteKey);
            if(response.code === 200){
                animation(false);
                location.reload();
            }
        });
    });
}

const eventNotVerifiedButton = (siteKey) => {
    const notVerifiedBtns = document.getElementsByClassName('participantNotVerified');
    Array.from(notVerifiedBtns).forEach(elem => {
        elem.addEventListener('click', async () => {
            animation(true);
            const token = elem.dataset.token;
            const response = await participantVerification(token, false, siteKey);
            if(response.code === 200){
                animation(false);
                location.reload();
            }
        });
    });
}

const renderTable = (data, showButtons) => {
    if(data.length < 1) return;
    let template = '';
    let showTable = false;
    data.forEach(participant => {
        if(participant.RcrtUP_Fname_v1r0 && participant.RcrtUP_Lname_v1r0 && participant.RcrtUP_Email1_v1r0) showTable = true;
    });
    if(showTable){
        template += `<div class="row"><div class="col"><table class="table table-striped table-bordered table-sm">`;
        template += `<thead>
            <tr>
                <th>First Name</th>
                <th>Middle Initial</th>
                <th>Last Name</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Show more</th>
                ${showButtons ? `<th>Verify / Not Verify</th>`: ``}
            </tr>
        </thead>`;
        data.forEach(participant => {
            if(participant.RcrtUP_Fname_v1r0 && participant.RcrtUP_Lname_v1r0 && participant.RcrtUP_Email1_v1r0){
                template += `
                <tr>
                    <td>${participant.RcrtUP_Fname_v1r0}</td>
                    <td>${participant.RcrtUP_Minitial_v1r0 ? participant.RcrtUP_Minitial_v1r0 : ''}</td>
                    <td>${participant.RcrtUP_Lname_v1r0}</td>
                    <td>${participant.RcrtUP_MOB_v1r0 && participant.RcrtUP_BD_v1r0 && participant.RcrtUP_YOB_v1r0 ? `${participant.RcrtUP_MOB_v1r0}/${participant.RcrtUP_BD_v1r0}/${participant.RcrtUP_YOB_v1r0}` : ''}</td>
                    <td>${participant.RcrtUP_Email1_v1r0}</td>
                    <td><a data-toggle="modal" data-target="#modalShowMoreData"  class="change-pointer showMoreInfo" data-token="${participant.token}"><i class="fas fa-info-circle"></i></a></td>
                    ${showButtons ? `<td><button class="btn btn-primary participantVerified" data-token="${participant.token}">Verify</button> / <button class="btn btn-primary participantNotVerified" data-token="${participant.token}">Not Verify</button></td>`: ``}
                </tr>
                `;
            }
        });
        template += `</table></div><div class="modal fade" id="modalShowMoreData" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header" id="modalHeader">
                            
                        </div>
                        <div class="modal-body" id="modalBody">
                            
                        </div>
                    </div>
                </div>
            </div></div>`
    }else{
        template += `No data found!`;
    }
    
    return template;
}

const removeActiveClass = (className, activeClass) => {
    let fileIconElement = document.getElementsByClassName(className);
    Array.from(fileIconElement).forEach(elm => {
        elm.classList.remove(activeClass);
    });
}