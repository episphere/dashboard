import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from '../navigationBar.js';
import { getAccessToken, showAnimation, hideAnimation, baseAPI, getDataAttributes } from '../utils.js';


export const renderRetrieveNotificationSchema = async () => {
    const isParent = localStorage.getItem('isParent')
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
    removeActiveClass('nav-link', 'active');
    document.getElementById('notifications').classList.add('active');
    showAnimation();
    const siteKey = await getAccessToken();
    const response = await getNotificationSchema('all', siteKey);
    let categoriesHolder = getNotificationSchemaCategories(response.data);
    hideAnimation();
    mainContent.innerHTML = await render(response);
    triggerSchemaEdit(categoriesHolder, 'Filter by Category');
}

const triggerSchemaEdit = (categoriesHolder, categoryName) => {
    editNotificationSchema();
    renderCategorydDropdown(categoriesHolder);
    dropdownTrigger(categoriesHolder, categoryName);
}


const render = async (response) => {
    let template = ``
    template = `<div class="container-fluid">
                    <div id="root root-margin"> 
                    <br />
                    <span> <h4 style="text-align: center;">Notification Schema List</h4> </span>
                    <div style="margin-top:10px; padding:15px;" class="dropdown" id="dropdownForm">
                        <button class="btn btn-secondary dropdown-toggle dropdown-toggle-sites" id="dropdownCategories" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Filter by Category
                        </button>
                        <ul class="dropdown-menu" id="dropdownMenuButtonCategories" aria-labelledby="dropdownMenuButton">
                        
                        </ul>
                    </div>
                    </div>
                    </div> 
                        ${renderNotificationCards(response.data)}
                </div></div>`
 
    return template;
}

const getNotificationSchema = async (category, siteKey) => {
    let type = category != undefined ? category : `all`

    const response = await fetch(`${baseAPI}/dashboard?api=retrieveNotificationSchema&category=${type}`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + siteKey
        }
    });
    return response.json();
}

const renderNotificationCards = (data) => {
    let template = ``;
    data.forEach((i, index) => {
        let schemaInfo = JSON.stringify(i)
        schemaInfo = escape(JSON.stringify(i))
        template += `<div class="card detailedRow">
                            <div class="card-header">
                                Attempt: ${i.attempt}  |   Notification Type: ${i.notificationType[0] && i.notificationType[0]} ${i.notificationType[1] != undefined ? i.notificationType[1] : ``} ${i.notificationType[2] != undefined ? i.notificationType[2] : ``}
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Category: ${i.category} </h5>
                                <p class="card-text">${i.description}</p>
                                <button type="button" class="btn btn-primary editSchema" data-schema=${schemaInfo}>Edit</button>
                            </div>
                        </div>`
    });
    return template;
}

const editNotificationSchema = () => {
    let updateCounter = 1;
    const a = Array.from(document.getElementsByClassName('detailedRow'));
        if (a) {
            a.forEach(element => {
                let editRow = element.getElementsByClassName('editSchema')[0];
                editRow.addEventListener('click', () => {
                    const t = getDataAttributes(editRow);
                    localStorage.setItem("updateNotificationSchema", unescape(t.schema));
                    updateCounter--;
                    localStorage.setItem("updateFlag", updateCounter);
                    redirectToStoreSchema();
                })
            })
        }
}


const redirectToStoreSchema = () => {
    const loadStoreSchemaPage = '#notifications/createnotificationschema'
    window.location.replace(window.location.origin + window.location.pathname + loadStoreSchemaPage); // updates url to store notification schema
}

const getNotificationSchemaCategories = (categories) => {
    let categoriesHolder = ["all"]
    categories.forEach(i => {
        categoriesHolder.push(i.category);
    })
    categoriesHolder = [...new Set(categoriesHolder)]
    return categoriesHolder;
}

const renderCategorydDropdown = (categoriesHolder) => {
    let unlistedDiv = document.getElementById('dropdownMenuButtonCategories');
    categoriesHolder.forEach( i => {
        let list = document.createElement("li");
        let listHyperLink = document.createElement("a");
        listHyperLink.classList.add("dropdown-item");
        listHyperLink.id = "categoryFilter";
        listHyperLink.setAttribute("category", i);
        listHyperLink.innerHTML = i;
        list.appendChild(listHyperLink);
        unlistedDiv.appendChild(list);
    })
}


const dropdownTrigger = (originalCategoriesHolder, categoryName) => {
    let a = document.getElementById('dropdownCategories');
    let dropdownMenuButton = document.getElementById('dropdownMenuButtonCategories');
    let tempCategory = a.innerHTML = categoryName;
    if (dropdownMenuButton) {
        dropdownMenuButton.addEventListener('click', async (e) => {
            if (categoryName === 'Filter by Category' || categoryName === tempCategory) {
                a.innerHTML = e.target.textContent;
                const siteKey = await getAccessToken();
                const response = await getNotificationSchema(e.target.textContent, siteKey);
                mainContent.innerHTML = await render(response);
                triggerSchemaEdit(originalCategoriesHolder, e.target.textContent);
            }
        })
    }
}

