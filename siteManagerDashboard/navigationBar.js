import { urls } from "./utils.js";

export const renderNavBarLinks = () => {
    return `
        <li class="nav-item active">
            <a class="nav-item nav-link active" href="#" title="Home"><i class="fas fa-home"></i> Home</a>
        </li>
        ${location.host !== urls.prod && location.host !== urls.stage ? `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle ws-nowrap" id="devOps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-users"></i> Feedback
                </a>
                <div class="dropdown-menu sub-div-shadow" aria-labelledby="devOps">
                    <a class="dropdown-item" target="_blank" href="https://github.com/episphere/connect/issues" title="Please create an issue if you encounter any."><i class="fas fa-bug"></i> Report issue</a>
                    <a class="dropdown-item" target="_blank" href="https://github.com/episphere/connect/projects/1" title="GitHub Projects page"><i class="fas fa-tasks"></i> GitHub Projects</a>
                    <a class="dropdown-item" target="_blank" href="https://gitter.im/episphere/connect" title="Chat with us"><i class="fas fa-comments"></i> Chat with us</a>
                </div>
            </li>
        `: ``}
    `;
}

export const dashboardNavBarLinks = (isParent) => {
    const coordinatingCenter = localStorage.getItem('coordinatingCenter');
    return `
        <li class="nav-item">
            <a class="nav-item nav-link ws-nowrap" href="#home" title="Home" id="dashboardBtn"><i class="fas fa-home"></i> Home</a>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle ws-nowrap" id="participants" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-users"></i> Participants
            </a>
            <div class="dropdown-menu sub-div-shadow" aria-labelledby="participants">
                <a class="dropdown-item" href="#participants/notyetverified" id="notVerifiedBtn">Not Yet Verified Participants</a>
                <a class="dropdown-item" href="#participants/cannotbeverified" id="cannotVerifiedBtn">Cannot Be Verified Participants</a>
                <a class="dropdown-item" href="#participants/verified" id="verifiedBtn">Verified Participants</a>
                <a class="dropdown-item" href="#participants/all" id="allBtn">All Participants</a>
                <a class="dropdown-item" href="#participants/profilenotsubmitted" id="profileNotSubmitted">Profile Not Submitted</a>
                <a class="dropdown-item" href="#participants/consentnotsubmitted" id="consentNotSubmitted"> Consent Not Submitted</a>
                <a class="dropdown-item" href="#participants/notsignedin" id="notSignedIn">Not Signed In</a>
            </div>
        </li>
        <li class="nav-item" id="participantLookupBtn">
            <a class="nav-item nav-link ws-nowrap" href="#participantLookup" title="Participant Lookup"><i class="fas fa-search"></i> Participant Lookup</a>
        </li>
        <li class="nav-item" id="participantDetailsBtn">
            <a class="nav-item nav-link ws-nowrap" href="#participantDetails" title="Participant Details"><i class="fa fa-info-circle"></i> Participant Details</a>
        </li>
        <li class="nav-item" id="participantSummaryBtn">
            <a class="nav-item nav-link ws-nowrap" href="#participantSummary" title="Participant Summary"><i class="fa fa-id-badge"></i> Participant Summary</a>
        </li>
        ${isParent === 'true' ?
        (`<li class="nav-item" id="participantWithdrawalBtn">
            <a class="nav-item nav-link ws-nowrap" href="#participantWithdrawal" title="Participant Withdrawal"><i class="fa fa-list-alt"></i> Participant Withdrawal</a>
        </li>`) : (``)  }
        <li class="nav-item" id="participantMessageBtn">
            <a class="nav-item nav-link ws-nowrap" href="#participantMessages" title="Participant Messages"><i class="fa fa-envelope-open"></i> Participant Messages</a>
        </li>
        ${(isParent !== 'true' || coordinatingCenter === 'true') ?
        (`<li class="nav-item" id="siteMessageBtn">
            <a class="nav-item nav-link ws-nowrap" href="#siteMessages" title="Site Messages"><i class="fa fa-comments""></i> Site Messages</a>
        </li>`) : (``) }
        ${coordinatingCenter === 'true' ?
        (`<li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle ws-nowrap" id="notifications" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-bell"></i> Notifications 
                </a>
                <div class="dropdown-menu sub-div-shadow" aria-labelledby="notifications">
                    <a class="dropdown-item" href="#notifications/createnotificationschema" id="storeNotificationSchema">Create Notification Schema</a>
                    <a class="dropdown-item" href="#notifications/retrievenotificationschema" id="retrieveNotificationSchema">Retrieve Notification Schema</a>
                </div>
            </li>`) : (``) }
        <li class="nav-item">
            <a class="nav-item nav-link ws-nowrap" href="#logout" title="Log Out"><i class="fas fa-sign-out-alt"></i> Log Out</a>
        </li>
        ${location.host !== urls.prod && location.host !== urls.stage ? `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle ws-nowrap" id="devOps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-users"></i> Feedback
                </a>
                <div class="dropdown-menu sub-div-shadow" aria-labelledby="devOps">
                    <a class="dropdown-item" target="_blank" href="https://github.com/episphere/connect/issues" title="Please create an issue if you encounter any."><i class="fas fa-bug"></i> Report issue</a>
                    <a class="dropdown-item" target="_blank" href="https://github.com/episphere/connect/projects/1" title="GitHub Projects page"><i class="fas fa-tasks"></i> GitHub Projects</a>
                    <a class="dropdown-item" target="_blank" href="https://gitter.im/episphere/connect" title="Chat with us"><i class="fas fa-comments"></i> Chat with us</a>
                </div>
            </li>
        `: ``}
    `;
}

export const  renderLogin = () => {
    return `
        <h1>Site Study Manager Dashboard</h1>

        ${location.host !== urls.prod && location.host !== urls.stage ? `<div class="row">
            <div class="col">
                <label for="siteKey">Site Key</label><input type="password" class="form-control" id="siteKey">
            </div>
        </div>

        <div class="row">
            <div class="col">
                <button class="btn btn-primary" id="submit">Log In</button>
            </div>
        </div>
        `: ``}
        </br></br>
        <h4>Single Sign-On</h4>
        <form id="ssoLogin">
            <div class="row">
                <div class="col">
                    <label for="ssoEmail">Institutional email</label>
                    <input type="email" required id="ssoEmail" class="form-control">
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <button type="submit" class="btn btn-primary">Log in</button>
                </div>
            </div>
        </form>
    `;
}

export const removeActiveClass = (className, activeClass) => {
    let fileIconElement = document.getElementsByClassName(className);
    Array.from(fileIconElement).forEach(elm => {
        elm.classList.remove(activeClass);
    });
}