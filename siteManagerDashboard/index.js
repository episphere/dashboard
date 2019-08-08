window.onload = () => {
    main();
}

const main = () => {
    document.getElementById('navBarLinks').innerHTML = renderNavBarLinks();
    const mainContent = document.getElementById('mainContent')
    mainContent.innerHTML = renderLogin();
    const submit = document.getElementById('submit');

    if(localStorage.dashboard){
        const localStr = JSON.parse(localStorage.dashboard);
        document.getElementById('siteKey').value = localStr.siteKey;
        document.getElementById('userId').value = localStr.userId;
        document.getElementById('rememberMe').checked = true;
    }

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
            const participants = document.getElementById('participants');
            mainContent.innerHTML = '';
            renderPieChart(siteKey, userId);

            const all = document.getElementById('all');
            all.addEventListener('click', async () => {
                removeActiveClass('nav-link', 'active');
                participants.classList.add('active');
                const response = await fetchData(siteKey, userId, 'all');
                if(response.code === 200){
                    mainContent.innerHTML = renderTable(response.data);
                }
            });

            const verified = document.getElementById('verified');
            verified.addEventListener('click', async () => {
                removeActiveClass('nav-link', 'active');
                participants.classList.add('active');
                const response = await fetchData(siteKey, userId, 'verified');
                if(response.code === 200){
                    mainContent.innerHTML = renderTable(response.data);
                }
            });

            const notVerified = document.getElementById('notVerified');
            notVerified.addEventListener('click', async () => {
                removeActiveClass('nav-link', 'active');
                participants.classList.add('active');
                const response = await fetchData(siteKey, userId, 'notverified');
                if(response.code === 200){
                    mainContent.innerHTML = renderTable(response.data, true);
                }
            });

            const dashboard = document.getElementById('dashboard');
            dashboard.addEventListener('click', () => {
                removeActiveClass('nav-link', 'active');
                dashboard.classList.add('active');
                mainContent.innerHTML = '';
                renderPieChart(siteKey, userId);
            });
        }
    })
}

const renderLogin = () => {
    return `
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
    let template = '<div class="row"><div class="col"><table class="table table-striped table-bordered table-sm">'
    template += `<thead>
        <tr>
            <th>RcrutES_Fname_v1r0</th>
            <th>RcrutES_Lname_v1r0</th>
            <th>RcrutES_Email_v1r0</th>
            ${showButtons ? `<th>Verify / Not Verify</th>`: ``}
        </tr>
    </thead>`;
    data.forEach(participant => {
        template += `
            <tr>
                <td>${participant.RcrutES_Fname_v1r0}</td>
                <td>${participant.RcrutES_Lname_v1r0}</td>
                <td>${participant.RcrutES_Email_v1r0}</td>
                ${showButtons ? `<td><button class="btn btn-primary">Verify</button> / <button class="btn btn-primary">Not Verify</button></td>`: ``}
            </tr>
        `;
    });
    template += '</table></div></div>'
    return template;
}

const renderPieChart = async (siteKey, userId) => {
    const verifiedData = await fetchData(siteKey, userId, 'verified');
    const notVerifiedData = await fetchData(siteKey, userId, 'notverified');

    if(verifiedData.code === 200 && notVerifiedData.code === 200){
        const data = [{
            values: [verifiedData.data.length, notVerifiedData.data.length],
            labels: ['Verified', 'Not Verified'],
            type: 'pie'
        }];
        const pieLayout = {
            title: {
                text: "Participants",
                font: {
                    size: 18
                }
            }
        };
        Plotly.newPlot('mainContent', data, pieLayout, {responsive: true, displayModeBar: false});
    }
}

const removeActiveClass = (className, activeClass) => {
    let fileIconElement = document.getElementsByClassName(className);
    Array.from(fileIconElement).forEach(elm => {
        elm.classList.remove(activeClass);
    });
}