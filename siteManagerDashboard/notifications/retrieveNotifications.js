import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from '../navigationBar.js';
import { getIdToken, showAnimation, hideAnimation, baseAPI } from '../utils.js';


export const renderRetrieveNotificationSchema = () => {
    const isParent = localStorage.getItem('isParent')
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
    removeActiveClass('nav-link', 'active');
    document.getElementById('notifications').classList.add('active');
    mainContent.innerHTML = render();
}


export const render = async () => {
    showAnimation();
    const response = await getNotificationSchema('all');
    hideAnimation()
    let template = `<div class="container-fluid">
                        <div id="root root-margin"> 
                        <div id="alert_placeholder"></div>
                        <br />
                        <span> <h4 style="text-align: center;">Notification Schema List</h4> </span>
                                <div class="card">
                                <div class="card-header">
                                Featured
                                </div>
                                <div class="card-body">
                                <h5 class="card-title">Special title treatment</h5>
                                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                <a href="#" class="btn btn-primary">Go somewhere</a>
                                </div>
                            </div>
                    </div></div>`


    return template;

}

const getNotificationSchema = (category) => {
    const access_token = await getIdToken();
    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
    const siteKey = access_token !== null ? access_token : localStr.siteKey

    let type = category != undefined ? category : `all`
    
    const response = await fetch(`${baseAPI}/dashboard?api=retrieveNotificationSchema&category=${type}`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + siteKey
        }
    });
    return response.json();
}