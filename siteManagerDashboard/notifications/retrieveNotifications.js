import { renderNavBarLinks, dashboardNavBarLinks, removeActiveClass } from '../navigationBar.js';
import { getAccessToken, showAnimation, hideAnimation, baseAPI, getDataAttributes } from '../utils.js';
import { mapSchemaNotificaiton, addEventMoreCondition, getConcepts, conceptDropdown } from './storeNotifications.js'


export const renderRetrieveNotificationSchema = async () => {
    const isParent = localStorage.getItem('isParent')
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
    removeActiveClass('nav-link', 'active');
    const notificationsAnchor = document.getElementById('notifications');
    notificationsAnchor && notificationsAnchor.classList.add('active');
    showAnimation();
    const siteKey = await getAccessToken();
    const response = await getNotificationSchema('all', siteKey);
    let categoriesHolder = getNotificationSchemaCategories(response.data);
    hideAnimation();
    mainContent.innerHTML = await render(response);
    const concepts = await getConcepts();  
    triggerSchemaEdit(categoriesHolder, 'Filter by Category', concepts);
}

const triggerSchemaEdit = (categoriesHolder, categoryName, concepts) => {
    viewNotificationSchema(concepts);
    editNotificationSchema();
    renderCategorydDropdown(categoriesHolder);
    triggerCategories(categoriesHolder, categoryName);
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
        template += ` <div class="modal fade" id="modalShowSchema" data-keyboard="false" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
            <div class="modal-content sub-div-shadow">
                <div class="modal-header" id="modalHeader"></div>
                <div class="modal-body" id="modalBody"></div>
            </div>
        </div>
    </div>`
         
 
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
    if (!data || data.length === 0) return template;
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
                                <button type="button" class="btn btn-success viewSchema" data-toggle="modal" data-target="#modalShowSchema"  data-schema=${schemaInfo} >View</button>
                                <button type="button" class="btn btn-primary editSchema" data-schema=${schemaInfo}>Edit</button>
                            </div>
                        </div>`
    });
    return template;
}

const viewNotificationSchema = (concepts) => {
    const a = Array.from(document.getElementsByClassName('detailedRow'));
    if (a) {
        a.forEach(element => {
            let viewCard = element.getElementsByClassName('viewSchema')[0];
            viewCard.addEventListener('click', () => {
                let viewSelectedSchema = getDataAttributes(viewCard);
                const setSelectedData  = JSON.parse(unescape(viewSelectedSchema.schema));
                const header = document.getElementById('modalHeader');
                const body = document.getElementById('modalBody');
                header.innerHTML = `<h5>View Schema</h5><button type="button" class="modal-close-btn" id="closeModal" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
                
                let template = '<div>'
                template += `
                    <div class="row form-group">
                    <label class="col-form-label col-md-4" for="attempt">Attempt</label> 
                    <input autocomplete="off" required class="col-md-8" type="text" id="attempt" placeholder="eg. 1st contact" value=${unescape(JSON.stringify(setSelectedData.attempt))} readonly>
                </div>
                
                <div class="row form-group">
                    <label class="col-form-label col-md-4" for="description">Description</label>
                    <textarea class="col-md-8" required id="description" cols="30" rows="3" readonly>${setSelectedData.description}</textarea>
                </div>
                
                <div class="row form-group">
                    <label class="col-form-label col-md-4" for="category">Category</label>
                    <input autocomplete="off" required class="col-md-8" type="text" id="category" placeholder="eg. consented" value=${unescape(JSON.stringify(setSelectedData.category))} readonly>
                </div>
    
                <div class="row form-group">
                    <label class="col-form-label col-md-4">Notification type</label>
                    <input type="checkbox" name="notification-checkbox" data-type="email" id="emailCheckBox" style="height: 25px;" readonly>&nbsp;<label class="mr-3" for="emailCheckBox" readonly>Email</label>
                    <input type="checkbox" name="notification-checkbox" data-type="sms" id="smsCheckBox" style="height: 25px;" readonly>&nbsp;<label class="mr-3" for="smsCheckBox" readonly>SMS</label>
                    <input type="checkbox" name="notification-checkbox" data-type="push" id="pushNotificationCheckBox" style="height: 25px;" readonly>&nbsp;<label for="pushNotificationCheckBox" readonly>Push Notification</label>
                </div>
    
                <div id="emailDiv"></div>
                <div id="smsDiv"></div>
                <div id="pushDiv"></div>
    
                <div id="conditionsDiv">
                    <div class="row form-group">
                        <label class="col-form-label col-md-3">Condition</label>
                        <div class="condition-key col-md-2 mr-2 p-0"></div>
                        <select name="condition-operator" class="col-md-2 form-control mr-2" id="operatorkey0">
                            <option value="equals">equals</option>
                            <option value="notequals">notequals</option>
                            <option value="greater">greater</option>
                            <option value="greaterequals">greaterequals</option>
                            <option value="less">less</option>
                            <option value="lessequals">lessequals</option>
                        </select>
                        <select name="value-type" class="col-md-2 form-control mr-2" id="valuetype0">
                            <option value="number">number</option>
                            <option value="string">string</option>
                        </select>
                        <div class="condition-value col-md-2 mr-2 p-0"></div>
                    </div>
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-outline-primary" id="addConditions" data-condition="1">Add more condition</button>
                </div>
                
                <div class="row form-group">
                    <label class="col-form-label col-md-4">Email field concept</label>
                    <div class="email-concept col-md-8 p-0"></div>
                </div>
                
                <div class="row form-group">
                    <label class="col-form-label col-md-4">Phone no. concept</label>
                    <div class="phone-concept col-md-8 p-0"></div>
                </div>
    
                <div class="row form-group">
                    <label class="col-form-label col-md-4">First name concept</label>
                    <div class="first-name-concept col-md-8 p-0"></div>
                </div>
    
                <div class="row form-group">
                    <label class="col-form-label col-md-4">Preferred name concept</label>
                    <div class="preferred-name-concept col-md-8 p-0"></div>
                </div>
    
                <div class="row form-group">
                    <label class="col-form-label col-md-4">Primary field</label>
                    <div class="primary-field col-md-8 p-0"></div>
                </div>
                
                <div class="row form-group">
                    <label class="col-form-label col-md-4">Time</label>
                    <input required autocomplete="off" pattern="[0-9]+" class="col-md-2 mr-2" type="text" id="days" placeholder="# days" readonly>
                    <input required autocomplete="off" pattern="[0-9]+" class="col-md-2 mr-2" type="number" min="0" max="23" id="hours" placeholder="hour (0-23)" readonly>
                    <input required autocomplete="off" pattern="[0-9]+" class="col-md-2" type="number" min="0" max="59" id="minutes" placeholder="minutes (0-59)" readonly>
                </div>
               </div>`

                body.innerHTML = template;
                addEventMoreCondition(concepts, true);
                conceptDropdown(concepts, 'condition-key');
                conceptDropdown(concepts, 'condition-value');
                mapSchemaNotificaiton(setSelectedData, concepts, true);
                document.getElementById('addConditions').disabled = true; 
            })
        })
    }
}

const editNotificationSchema = () => {
    let updateCounter = 1;
    const a = Array.from(document.getElementsByClassName('detailedRow'));
        if (a) {
            a.forEach(element => {
                let editRow = element.getElementsByClassName('editSchema')[0];
                editRow.addEventListener('click', () => {
                    const editSelectedSchema = getDataAttributes(editRow);
                    localStorage.setItem("updateNotificationSchema", unescape(editSelectedSchema.schema));
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
        unlistedDiv.style.maxHeight = "300px"; // Adjust the maximum height as needed
        unlistedDiv.style.overflowY = "auto"; 
    })
}


const triggerCategories = (originalCategoriesHolder, categoryName) => {
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