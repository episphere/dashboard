window.onload = () => {
    main();
}

const main = async () => {
    if(localStorage.dashboard){
        const localStr = JSON.parse(localStorage.dashboard);
        const siteKey = localStr.siteKey;
        const userId = localStr.userId;
        const isAuthorized = await authorize(siteKey, userId);
        if(isAuthorized.code === 200){
            document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
            mainContent.innerHTML = '';
            renderCharts(siteKey, userId);
            eventParticipantAll(siteKey, userId);
            eventParticipantVerified(siteKey, userId);
            eventParticipantNotVerified(siteKey, userId);
            eventDashboard(siteKey, userId);
            eventLogOut();
        }
    }
    else{
        document.getElementById('navBarLinks').innerHTML = renderNavBarLinks();
        const mainContent = document.getElementById('mainContent')
        mainContent.innerHTML = renderLogin();
    }
    const submit = document.getElementById('submit');
    if(submit){
        submit.addEventListener('click',async () => {
            const siteKey = document.getElementById('siteKey').value;
            const userId = document.getElementById('userId').value;
            const rememberMe = document.getElementById('rememberMe');
            if(siteKey.trim() === '' || userId.trim() === '') return;
            if(rememberMe.checked){
                const dashboard = {
                    siteKey,
                    userId
                }
                localStorage.dashboard = JSON.stringify(dashboard);
            }

            const isAuthorized = await authorize(siteKey, userId);
            if(isAuthorized.code === 200){
                document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
                mainContent.innerHTML = '';
                renderCharts(siteKey, userId);
                eventParticipantAll(siteKey, userId);
                eventParticipantVerified(siteKey, userId);
                eventParticipantNotVerified(siteKey, userId);
                eventDashboard(siteKey, userId);
                eventLogOut();
            }
        });
    }
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
            <div class="col">
                <label for="userId">User Id</label><input type="text" class="form-control" id="userId">
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

const renderNavBarLinks = () => {
    return `
        <li class="nav-item active">
            <a class="nav-item nav-link active" href="#" title="Home"><i class="fas fa-home"></i> Home</a>
        </li>
    `;
}

const dashboardNavBarLinks = () => {
    return `
        <li class="nav-item active">
            <a class="nav-item nav-link active" href="#" id="dashboard" title="Dashboard"><i class="fas fa-home"></i> Dashboard</a>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="participants" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-users"></i> Participants
            </a>
            <div class="dropdown-menu" aria-labelledby="participants">
                <a class="dropdown-item" href="#" id="notVerified">Not Verified Participants</a>
                <a class="dropdown-item" href="#" id="verified">Verified Participants</a>
                <a class="dropdown-item" href="#" id="all">All Participants</a>
            </div>
        </li>
        <li class="nav-item">
            <a class="nav-item nav-link" href="#" id="logOut" title="Log Out"><i class="fas fa-sign-out-alt"></i> Log Out</a>
        </li>
    `;
}

const fetchData = async (siteKey, userId, type) => {
    let response = await fetch(`https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/getParticipants/${type}?userId=`+userId,{
        method:'GET',
        headers:{
            Authorization:"Bearer "+siteKey
        }
    });
    return response.json();
}

const authorize = async (siteKey, userId) => {
    let response = await fetch(`https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/validateSiteUsers?userId=${userId}`,{
        method:'GET',
        headers:{
            Authorization:"Bearer "+siteKey
        }
    });
    return response.json();
}

const renderTable = (data, showButtons) => {
    if(data.length < 1) return;
    let template = '<div class="row"><div class="col"><table class="table table-striped table-bordered table-sm">'
    template += `<thead>
        <tr>
            <th>First Name</th>
            <th>Middle Initial</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            ${showButtons ? `<th>Verify / Not Verify</th>`: ``}
        </tr>
    </thead>`;
    data.forEach(participant => {
        if(participant.RcrutUP_Fname_v1r0 && participant.RcrutUP_Lname_v1r0 && participant.RcrutUP_Email1_v1r0){
            template += `
            <tr>
                <td>${participant.RcrutUP_Fname_v1r0}</td>
                <td>${participant.RcrutUP_Minitial_v1r0 ? participant.RcrutUP_Minitial_v1r0 : ''}</td>
                <td>${participant.RcrutUP_Lname_v1r0}</td>
                <td>${participant.RcrutUP_MOB_v1r0 && participant.RcrutUP_BD_v1r0 && participant.RcrutUP_YOB_v1r0 ? `${participant.RcrutUP_MOB_v1r0}/${participant.RcrutUP_BD_v1r0}/${participant.RcrutUP_YOB_v1r0}` : ''}</td>
                <td>${participant.RcrutUP_Email1_v1r0}</td>
                ${showButtons ? `<td><button disabled class="btn btn-primary">Verify</button> / <button disabled class="btn btn-primary">Not Verify</button></td>`: ``}
            </tr>
            `;
        }
    });
    template += '</table></div></div>'
    return template;
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
    const accountCreated = participants.data.filter(dt => dt.RcrutUP_Fname_v1r0 !== undefined);
    const consent = participants.data.filter(dt => dt.RcrutCS_Consented_v1r0 === 1);
    const trace1 = {
        x: [accountCreated.length, consent.length],
        y: ['Accounts created', '  Consent complete'],
        name: 'Completed',
        type: 'bar',
        orientation: 'h'
    };
    const trace2 = {
        x: [participants.data.length-accountCreated.length, participants.data.length-consent.length],
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

const removeActiveClass = (className, activeClass) => {
    let fileIconElement = document.getElementsByClassName(className);
    Array.from(fileIconElement).forEach(elm => {
        elm.classList.remove(activeClass);
    });
}

const eventParticipantAll = (siteKey, userId) => {
    const all = document.getElementById('all');
    const participants = document.getElementById('participants');
    all.addEventListener('click', async () => {
        removeActiveClass('nav-link', 'active');
        participants.classList.add('active');
        const response = await fetchData(siteKey, userId, 'all');
        if(response.code === 200){
            mainContent.innerHTML = renderTable(response.data);
        }
    });
}

const renderCharts = async (siteKey, userId) => {
    const participantsData = await fetchData(siteKey, userId, 'all');
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
    }
}

const eventParticipantVerified = (siteKey, userId) => {
    const verified = document.getElementById('verified');
    const participants = document.getElementById('participants');
    verified.addEventListener('click', async () => {
        removeActiveClass('nav-link', 'active');
        participants.classList.add('active');
        const response = await fetchData(siteKey, userId, 'verified');
        if(response.code === 200){
            mainContent.innerHTML = renderTable(response.data);
        }
    });
}

const eventParticipantNotVerified = (siteKey, userId) => {
    const notVerified = document.getElementById('notVerified');
    const participants = document.getElementById('participants');
    notVerified.addEventListener('click', async () => {
        removeActiveClass('nav-link', 'active');
        participants.classList.add('active');
        const response = await fetchData(siteKey, userId, 'notverified');
        if(response.code === 200){
            mainContent.innerHTML = renderTable(response.data, true);
        }
    });
}

const eventDashboard = (siteKey, userId) => {
    const dashboard = document.getElementById('dashboard');
    dashboard.addEventListener('click', async () => {
        removeActiveClass('nav-link', 'active');
        dashboard.classList.add('active');
        mainContent.innerHTML = '';
        renderCharts(siteKey, userId);
    });
}

const eventLogOut = () => {
    const logOutBtn = document.getElementById('logOut');
    logOutBtn.addEventListener('click', () => {
        delete localStorage.dashboard;
        location.reload();
    });
}