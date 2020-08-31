const importantColumns = ['399159511', '231676651', '996038075', '564964481', '795827569', '544150384', '849786503'];
window.onload = async () => {
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
    else if(route === '#participants/notyetverified') renderParticipantsNotVerified();
    else if(route === '#participants/cannotbeverified') renderParticipantsCanNotBeVerified();
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
            <a target="_blank" class="nav-item nav-link" href="https://gitter.im/episphere/connect" title="Chat with us"><i class="fas fa-comments"></i> Chat with us</a>
        </li>
    `;
}

const dashboardNavBarLinks = () => {
    return `
        <li class="nav-item">
            <a class="nav-item nav-link" href="#dashboard" title="Dashboard" id="dashboardBtn"><i class="fas fa-home"></i> Dashboard</a>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" id="participants" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-users"></i> Participants
            </a>
            <div class="dropdown-menu sub-div-shadow" aria-labelledby="participants">
                <a class="dropdown-item" href="#participants/notyetverified" id="notVerifiedBtn">Not Yet Verified Participants</a>
                <a class="dropdown-item" href="#participants/cannotbeverified" id="cannotVerifiedBtn">Cannot Be Verified Participants</a>
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
            <a target="_blank" class="nav-item nav-link" href="https://gitter.im/episphere/connect" title="Chat with us"><i class="fas fa-comments"></i> Chat with us</a>
        </li>
    `;
}

const renderLogin = () => {
    return `
        <h1>Site Study Manager Dashboard</h1>
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
        renderBarChart(participantsData, 'barChart', 1);
        renderCounts(participantsData, 'activeCounts', 1)
        renderCounts(participantsData, 'passiveCounts', 2)
        renderFunnelChart(participantsData, 'passiveFunnelChart', 854703046);
        renderBarChart(participantsData, 'passiveBarChart', 2);
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
        title: `${decider === 486306141 ? 'Active':'Passive'} Recruits`
    };
    
    Plotly.newPlot(id, data, layout, {responsive: true, displayModeBar: false});
}

const renderCounts = (participants, id, decider) => {
    document.getElementById(id).innerHTML = `${decider === 486306141 ? 'Active':'Passive'} recruits <br><h3>${participants.data.filter(dt => dt['512820379'] === decider).length}</h3>`
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

const addEventShowMoreInfo = data => {
    const elements = document.getElementsByClassName('showMoreInfo');
    Array.from(elements).forEach(element => {
        element.addEventListener('click', () => {
            const filteredData = data.filter(dt => dt.token === element.dataset.token);
            const header = document.getElementById('modalHeader');
            const body = document.getElementById('modalBody');
            const user = filteredData[0];
            header.innerHTML = `<h4>${user['399159511']} ${user['996038075']}</h4><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
            let template = '<div>';
            for(let key in user){
                if(typeof user[key] === 'object') {
                    template += `<span><strong>${key}</strong></span> - <ul class="user-data-ul">`
                    for(let nestedKey in user[key]){
                        template += `<li><span><strong>${nestedKey}</strong></span> - <span>${user[key][nestedKey]}</span></li>`
                    }
                    template += `</ul>`
                }
                else {
                    template += `<span><strong>${key}</strong></span> - <span>${user[key]}</span></br>`
                }
            }
            body.innerHTML = template;
        })
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
                // animation(false);
                // const dataTable = document.getElementById('dataTable');
                // const elements = dataTable.querySelectorAll(`[data-token="${token}"]`);
                // elements[0].parentNode.parentNode.parentNode.removeChild(elements[0].parentNode.parentNode);
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
                // animation(false);
                // const dataTable = document.getElementById('dataTable');
                // const elements = dataTable.querySelectorAll(`[data-token="${token}"]`);
                // elements[0].parentNode.parentNode.parentNode.removeChild(elements[0].parentNode.parentNode);
                location.reload();
            }
        });
    });
}

const filterdata = (data) => {
    return data.filter(participant => participant['699625233'] !== undefined);
}

const renderTable = (data) => {
    let template = '';
    if(data.length === 0) return `No data found!`;
    let array = [];
    data.forEach(dt => {
        array = array.concat(Object.keys(dt))
    });
    array = array.filter((item, index) => array.indexOf(item) === index);
    if(array.length > 0) {
        template += `<div class="row">
            <div class="col" id="columnFilter">
                ${array.map(x => `<button name="column-filter" class="filter-btn sub-div-shadow" data-column="${x}">${x}</button>`)}
            </div>
        </div>`
    }

    template += `
                <div class="row">
                    <div class="col">
                        <div class="float-right">
                            <input id="filterData" class="form-control sub-div-shadow" type="text" placeholder="Min. 3 characters"><span data-toggle="tooltip" title='Search by first name, last name or connect id' class="fas fa-search search-icon"></span></div>
                        </div>
                    </div>
                <div class="row allow-overflow">
                    <div class="col">
                        <table id="dataTable" class="table table-hover table-bordered table-borderless sub-div-shadow no-wrap"></table>
                        <div id="paginationContainer"></div>
                    </div>
                    <div class="modal fade" id="modalShowMoreData" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content sub-div-shadow">
                                <div class="modal-header" id="modalHeader"></div>
                                <div class="modal-body" id="modalBody"></div>
                            </div>
                        </div>
                    </div>
                </div>`
    return template;
}

const renderData = (data, showButtons) => {
    if(data.length === 0) {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = renderTable(data);
        animation(false);
        return;
    }
    const pageSize = 10;
    const dataLength = data.length;
    const pages = Math.ceil(dataLength/pageSize);
    const array = [];

    for(let i = 0; i< pages; i++){
        array.push(i+1);
    }
    document.getElementById('paginationContainer').innerHTML = paginationTemplate(array);
    addEventPageBtns(pageSize, data, showButtons);
    document.getElementById('dataTable').innerHTML = tableTemplate(dataPagination(0, pageSize, data), showButtons);
    addEventShowMoreInfo(data);
}

const addEventPageBtns = (pageSize, data, showButtons) => {
    const elements = document.getElementsByClassName('page-link');
    Array.from(elements).forEach(element => {
        element.addEventListener('click', () => {
            const previous = element.dataset.previous;
            const next = element.dataset.next;
            const pageNumber = previous ? parseInt(previous) - 1 : next ? parseInt(next) + 1 : element.dataset.page;
            
            if(pageNumber < 1 || pageNumber > Math.ceil(data.length/pageSize)) return;
            
            if(!element.classList.contains('active-page')){
                let start = (pageNumber - 1) * pageSize;
                let end = pageNumber * pageSize;
                document.getElementById('previousPage').dataset.previous = pageNumber;
                document.getElementById('nextPage').dataset.next = pageNumber;
                document.getElementById('dataTable').innerHTML = tableTemplate(dataPagination(start, end, data), showButtons);
                addEventShowMoreInfo(data);
                if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
                Array.from(elements).forEach(ele => ele.classList.remove('active-page'));
                document.querySelector(`a[data-page="${pageNumber}"]`).classList.add('active-page');
            }
        })
    });
}

const dataPagination = (start, end, data) => {
    const paginatedData = [];
    for(let i=start; i<end; i++){
        if(data[i]) paginatedData.push(data[i]);
    }
    return paginatedData;
}

const paginationTemplate = (array) => {
    let template = `
        <nav aria-label="Page navigation example">
            <ul class="pagination">`
    
    array.forEach((a,i) => {
        if(i === 0){
            template += `<li class="page-item">
                            <a class="page-link" id="previousPage" data-previous="1" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                            </a>
                        </li>`
        }
        template += `<li class="page-item"><a class="page-link ${i === 0 ? 'active-page':''}" data-page=${a}>${a}</a></li>`;

        if(i === (array.length - 1)){
            template += `
            <li class="page-item">
                <a class="page-link" id="nextPage" data-next="1" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
                </a>
            </li>`
        }
    });
    template += `
            </ul>
        </nav>
    `;
    return template;
}

const tableTemplate = (data, showButtons) => {
    let template = '';
    template += `<thead class="thead-dark"><tr>`
    importantColumns.forEach(x => template += `<th>${x}</th>`)
    template += `<th class="no-wrap">Show all info</th>
            ${showButtons ? `<th>Verify / Not Verify</th>`: ``}
        </tr>
    </thead>`;
    data.forEach(participant => {
        template += `<tbody><tr>`
        importantColumns.forEach(x => {
            if(participant[x] && typeof participant[x] === 'object'){
                template += `<td><pre>${JSON.stringify(participant[x], undefined, 4)}</pre></td>`
            }
            else {
                template += `<td>${participant[x] ? participant[x] : ''}</td>`
            }
        })
        template += `<td><a data-toggle="modal" data-target="#modalShowMoreData" name="modalParticipantData" class="change-pointer showMoreInfo" data-token="${participant.token}"><i class="fas fa-info-circle"></i></a></td>
        ${showButtons ? `<td class="no-wrap"><button class="btn btn-primary participantVerified" data-token="${participant.token}"><i class="fas fa-user-check"></i> Verify</button> / <button class="btn btn-primary participantNotVerified" data-token="${participant.token}"><i class="fas fa-user-times"></i> Can't Verify</button></td>`: ``}
    </tr>
        `; 
    });
    template += '</tbody>';
    return template;
}

const addEventFilterData = (data, showButtons) => {
    const btn = document.getElementById('filterData');
    if(!btn) return;
    btn.addEventListener('keyup', () => {
        const value = document.getElementById('filterData').value.trim();
        if(value.length < 3) {
            renderData(data, showButtons);
            if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
            return;
        };
        renderData(serachBy(data, value), showButtons);
        if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
    });
}

const serachBy = (data, value) => {
    return data.filter(dt => {
        const fn = dt['399159511'];
        const ln = dt['996038075'];
        
        if((new RegExp(value, 'i')).test(fn)) {
            // dt.RcrtUP_Fname_v1r0 = fn.replace((new RegExp(value, 'ig')), "<b>$&</b>");
            return dt
        }
        if((new RegExp(value, 'i')).test(ln)) {
            // dt.RcrtUP_Lname_v1r0 = ln.replace((new RegExp(value, 'ig')), "<b>$&</b>");
            return dt
        }
        if((new RegExp(value, 'i')).test(dt.Connect_ID)) {
            // const ID = dt.Connect_ID.toString();
            // dt.Connect_ID = ID.replace((new RegExp(value, 'ig')), "<b>$&</b>");
            return dt
        }
    });
}

const activeColumns = (data, showButtons) => {
    const btns = document.getElementsByName('column-filter');
    Array.from(btns).forEach(btn => {
        const value = btn.dataset.column;
        if(importantColumns.indexOf(value) !== -1) {
            btn.classList.add('filter-active');
        }
        btn.addEventListener('click', () => {
            if(!btn.classList.contains('filter-active')){
                btn.classList.add('filter-active');
                importantColumns.push(value);
                if(document.getElementById('filterData').value.trim().length >= 3) {
                    renderData(serachBy(data, document.getElementById('filterData').value.trim()), showButtons);
                    if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
                }
                else {
                    renderData(data, showButtons);
                    if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
                }
            }
            else{
                btn.classList.remove('filter-active');
                importantColumns.splice(importantColumns.indexOf(value), 1);
                if(document.getElementById('filterData').value.trim().length >= 3) {
                    renderData(serachBy(data, document.getElementById('filterData').value.trim()), showButtons);
                    if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
                }
                else {
                    renderData(data, showButtons);
                    if(localStorage.dashboard) eventVerifiedButton(JSON.parse(localStorage.dashboard).siteKey);
                }
            }
        })
    });
}

const removeActiveClass = (className, activeClass) => {
    let fileIconElement = document.getElementsByClassName(className);
    Array.from(fileIconElement).forEach(elm => {
        elm.classList.remove(activeClass);
    });
}