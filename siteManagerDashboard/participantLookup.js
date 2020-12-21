import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';



export function renderParticipantLookup(){

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantLookupBtn').classList.add('active');
    mainContent.innerHTML = rederParticipantSearch();

    addEventSearch();
    addEventSearchConnectId();
}
const api = 'https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/';
export function rederParticipantSearch() {

    return `
        <div class="container">
        <div id="root">
                <div class="row">
                <div class="col-lg">
                    <h5>Participant Lookup</h5>
                </div>
            </div>
            <div class="row">
                <div class="col-lg">
                    <div class="row form-row">
                        <form id="search" method="POST">
                            <div class="form-group">
                                <label class="col-form-label search-label">First name</label>
                                <input class="form-control" autocomplete="off" type="text" id="firstName" placeholder="Enter First Name"/>
                            </div>
                            <div class="form-group">
                                <label class="col-form-label search-label">Last name</label>
                                <input class="form-control" autocomplete="off" type="text" id="lastName" placeholder="Enter Last Name"/>
                            </div>
                            <div class="form-group">
                                <label class="col-form-label search-label">Date of birth</label>
                                <input class="form-control" type="date" id="dob"/>
                            </div>
                            <div class="form-group">
                                <label class="col-form-label search-label">Phone number</label>
                                <input class="form-control" id="phone" placeholder="Enter Phone Number"/>
                            </div>
                            <div class="form-group">
                                <label class="col-form-label search-label">Email</label>
                                <input class="form-control" type="email" id="email" placeholder="Enter Email"/>
                            </div>
                            <div id="search-failed" class="search-not-found" hidden>
                                The participant with entered search criteria not found!
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-outline-primary">Search</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-lg">
                    <div class="row form-row">
                        <form id="searchConnectId" method="POST">
                            <div class="form-group">
                                <label class="col-form-label search-label">Connect ID</label>
                                <input class="form-control" autocomplete="off" required type="text" maxlength="10" id="connectId" placeholder="Enter ConnectID"/>
                            </div>
                        <div id="search-connect-id-failed" class="search-not-found" hidden>
                            The participant with entered search criteria not found!
                        </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-outline-primary">Search</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </div>
        `;


}

const addEventSearch = () => {
    console.log("registering")
    const form = document.getElementById('search');

    if(!form) return;
    form.addEventListener('submit', e => {
        document.getElementById("search-failed").hidden = true;
        console.log("clicked",e);
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const dob = document.getElementById('dob').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        if(!firstName && !lastName && !dob && !phone && !email) return;
        let query = '';
        if(firstName) query += `firstName=${firstName}&`;
        if(lastName) query += `lastName=${lastName}&`;
        if(dob) query += `dob=${dob.replace(/-/g,'')}&`;
        if(phone) query += `phone=${phone}&`;
        if(email) query += `email=${email}&`;
        performSearch(query, "search-failed");
    })
};

export const addEventSearchConnectId = () => {
    const form = document.getElementById('searchConnectId');
    if(!form) return;
    form.addEventListener('submit', e => {
        document.getElementById("search-connect-id-failed").hidden = true;
        e.preventDefault();
        const connectId = document.getElementById('connectId').value;
        let query = '';
        if(connectId) query += `connectId=${connectId}`;
        performSearch(query,"search-connect-id-failed");
    })
};

export const performSearch = async (query, failedElem) => {
    showAnimation();
    const response = await findParticipant(query);
    hideAnimation();
    const getVerifiedParticipants = response.data.filter(dt => dt['821247024'] === 197316935);
    
    if(response.code === 200 && getVerifiedParticipants.length > 0) console.log(getVerifiedParticipants);
    else if(response.code === 200 && getVerifiedParticipants.length === 0) document.getElementById(failedElem).hidden = false;
}

export const showAnimation = () => {
    if(document.getElementById('loadingAnimation')) document.getElementById('loadingAnimation').style.display = '';
}

export const hideAnimation = () => {
    if(document.getElementById('loadingAnimation')) document.getElementById('loadingAnimation').style.display = 'none';
}

export const showNotifications = (data, error) => {
    document.getElementById("search-failed").hidden = false;
    // const div = document.createElement('div');
    // //debugger;
    // div.classList = ["notification"];
    // // div.innerHTML = `
    // //     <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
    // //         <div class="toast-header">
    // //             <strong class="mr-auto ${error ? 'error-heading': ''}">${data.title}</strong>
    // //             <button type="button" class="ml-2 mb-1 close hideNotification" data-dismiss="toast" aria-label="Close">&times;</button>
    // //         </div>
    // //         <div class="toast-body">
    // //             ${data.body}
    // //         </div>
    // //     </div>
    // // `
    // div.innerHTML = `<h2>hello</h2>`
    // document.getElementById('showNotification').appendChild(div);
    // //document.getElementsByClassName('container')[0].scrollIntoView(true);
    // addEventHideNotification(div);
}



export const findParticipant = async (query) => {
    const localStr = JSON.parse(localStorage.dashboard);
    const siteKey = localStr.siteKey;
    const response = await fetch(`${api}getParticipants?type=filter&${query}`, {
        method: "GET",
        headers: {
            Authorization:"Bearer "+siteKey
        }
    });
    return await response.json();
}

