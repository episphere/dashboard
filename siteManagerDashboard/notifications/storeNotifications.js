import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from '../navigationBar.js';
import { getIdToken, showAnimation, hideAnimation, baseAPI } from '../utils.js';


export const renderStoreNotificationSchema = () => {
    const isParent = localStorage.getItem('isParent')
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
    removeActiveClass('nav-link', 'active');
    document.getElementById('notifications').classList.add('active');
    mainContent.innerHTML = render();
    let originalHTML = mainContent.innerHTML;
    init();
   // resetChanges(originalHTML);
    
}

const init = async () => {
    const concepts = await getConcepts();  
    addEventMoreCondition(concepts);
    conceptDropdown(concepts, 'condition-key');
    conceptDropdown(concepts, 'condition-value');
    conceptDropdown(concepts, 'email-concept');
    conceptDropdown(concepts, 'first-name-concept');
    conceptDropdown(concepts, 'preferred-name-concept');
    conceptDropdown(concepts, 'primary-field');
    conceptDropdown(concepts, 'phone-concept');
    addEventNotificationCheckbox();
    formSubmit();
}


export const render = () => {
    let template = `<div class="container-fluid">
                        <div id="root root-margin"> 
                        <div id="alert_placeholder"></div>
                        <br />
                        <span> <h4 style="text-align: center;">Store Notification Schema</h4> </span>
                            <form method="post" class="mt-3" id="configForm">
                                <div class="row form-group">
                                    <label class="col-form-label col-md-4" for="attempt">Attempt</label>
                                    <input autocomplete="off" required class="col-md-8" type="text" id="attempt" placeholder="eg. 1st contact">
                                </div>
                                
                                <div class="row form-group">
                                    <label class="col-form-label col-md-4" for="description">Description</label>
                                    <textarea class="col-md-8" required id="description" cols="30" rows="3"></textarea>
                                </div>
                                
                                <div class="row form-group">
                                    <label class="col-form-label col-md-4" for="category">Category</label>
                                    <input autocomplete="off" required class="col-md-8" type="text" id="category" placeholder="eg. consented">
                                </div>
                    
                                <div class="row form-group">
                                    <label class="col-form-label col-md-4">Notification type</label>
                                    <input type="checkbox" name="notification-checkbox" data-type="email" id="emailCheckBox" style="height: 25px;">&nbsp;<label class="mr-3" for="emailCheckBox">Email</label>
                                    <input type="checkbox" name="notification-checkbox" data-type="sms" id="smsCheckBox" style="height: 25px;">&nbsp;<label class="mr-3" for="smsCheckBox">SMS</label>
                                    <input type="checkbox" name="notification-checkbox" data-type="push" id="pushNotificationCheckBox" style="height: 25px;">&nbsp;<label for="pushNotificationCheckBox">Push Notification</label>
                                </div>
                    
                                <div id="emailDiv"></div>
                                <div id="smsDiv"></div>
                                <div id="pushDiv"></div>
                    
                                <div id="conditionsDiv">
                                    <div class="row form-group">
                                        <label class="col-form-label col-md-4">Condition</label>
                                        <div class="condition-key col-md-3 mr-2 p-0"></div>
                                        <select name="condition-operator" class="col-md-1 form-control mr-2">
                                            <option value="equals">equals</option>
                                            <option value="notequals">notequals</option>
                                        </select>
                                        <div class="condition-value col-md-3 mr-2 p-0"></div>
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
                                    <input required autocomplete="off" pattern="[0-9]+" class="col-md-2 mr-2" type="text" id="days" placeholder="# days">
                                    <input required autocomplete="off" pattern="[0-9]+" class="col-md-2 mr-2" type="number" min="0" max="23" id="hours" placeholder="hour (0-23)">
                                    <input required autocomplete="off" pattern="[0-9]+" class="col-md-2" type="number" min="0" max="59" id="minutes" placeholder="minutes (0-59)">
                                </div>
                                
                                <div class="mt-4 mb-4" style="display:inline-block;">
                                    <button type="submit" class="btn btn-primary">Submit</button>
                                </div>
        
                            </form>
                    </div></div>`


    return template;

}

const formSubmit = () => {
    const form = document.getElementById('configForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const obj = {};
        obj['attempt'] = document.getElementById('attempt').value.trim();
        obj['description'] = document.getElementById('description').value.trim();
        obj['category'] = document.getElementById('category').value.trim();
        obj['notificationType'] = Array.from(document.getElementsByName('notification-checkbox')).filter(dt => dt.checked).map(dt => dt.dataset.type);
        obj['emailField'] = document.getElementById('emailconcept0').value;
        obj['firstNameField'] = document.getElementById('firstnameconcept0').value;
        if(document.getElementById('preferrednameconcept0').value) obj['preferredNameField'] = document.getElementById('preferrednameconcept0').value;
        obj['phoneField'] = document.getElementById('phoneconcept0').value;
        obj['primaryField'] = document.getElementById('primaryfield0').value;
        obj['time'] = {}
        obj['time']['day'] = parseInt(document.getElementById('days').value);
        obj['time']['hour'] = parseInt(document.getElementById('hours').value);
        obj['time']['minute'] = parseInt(document.getElementById('minutes').value);

        if(document.getElementById('emailSubject')) {
            obj['email'] = {};
            obj['email']['subject'] = document.getElementById('emailSubject').value;
            obj['email']['body'] = document.getElementById('emailBody').value.replace(/\n/g, '<br/>');
        }

        if(document.getElementById('smsBody')) {
            obj['sms'] = {};
            obj['sms']['body'] = document.getElementById('smsBody').value;
        }

        if(document.getElementById('pushSubject')) {
            obj['push'] = {};
            obj['push']['subject'] = document.getElementById('pushSubject').value;
            obj['push']['body'] = document.getElementById('pushBody').value;
        }

        obj['conditions'] = {};

        Array.from(document.getElementsByName('condition-key')).forEach((e, i) => {
            obj['conditions'][e.value] = {};
            obj['conditions'][e.value][Array.from(document.getElementsByName('condition-operator'))[i].value] = parseInt(Array.from(document.getElementsByName('condition-value'))[i].value)
        })
        
        storeNotificationSchema(obj, 'notification_specification')
    })
}

const addEventMoreCondition = (concepts) => {
    const btn = document.getElementById('addConditions');
    btn.addEventListener('click', () => {
        const conditionNo = parseInt(btn.dataset.condition);
        const conditionDiv = document.getElementById('conditionsDiv');
        const div = document.createElement('div');
        div.classList = ['row form-group'];
        div.innerHTML = `
            <label class="col-form-label col-md-4">Condition</label>
            <div class="condition-key col-md-3 mr-2 p-0">${getDataListTemplate(concepts, `conditionkey${conditionNo}`, 'condition-key')}</div>
            <select name="condition-operator" class="col-md-1 form-control mr-2">
                <option value="equals">equals</option>
                <option value="notequals">notequals</option>
            </select>
            <div class="condition-value col-md-3 mr-2 p-0">${getDataListTemplate(concepts, `conditionvalue${conditionNo}`, 'condition-value')}</div>
        `
        conditionDiv.appendChild(div);
        btn.dataset.condition = conditionNo + 1;
    });
}

const getConcepts = async () => {
    return await (await fetch('https://raw.githubusercontent.com/episphere/conceptGithubActions/master/jsons/varToConcept.json')).json()
}

const conceptDropdown = (concepts, name) => {
    const elements = document.getElementsByClassName(name);
    Array.from(elements).forEach((ele, i) => {
        ele.innerHTML = getDataListTemplate(concepts, `${name.replace(/-/g, '')}${i}`, name);
    })
}

const getDataListTemplate = (concepts, id, name) => {
    let template = `<input ${id !== 'preferrednameconcept0'? 'required': ''} list="dataList${id}" id="${id}" class="form-control" ${name ? `name="${name}"`: ''}>`;
    template += `<datalist id="dataList${id}">`
    for(let key in concepts) {
        template += `<option value="${concepts[key]}">${key}</option>`
    }
    template += `</datalist>`
    return template;
}  

const addEventNotificationCheckbox = () => {
    const chkbs = document.getElementsByName('notification-checkbox');
    Array.from(chkbs).forEach(box => {
        box.addEventListener('click', () => {
            const checked = Array.from(chkbs).filter(cb => cb.checked).map(dt => dt.dataset.type);
            renderDivs(checked);
        })
    })
}

const renderDivs = (array) => {
    if(array.includes('email')){
        let template = `
            <div class="row">
                <div class="col">
                    <h5>Email</h5>
                    <div class="row form-group">
                        <label class="col-form-label col-md-4" for="emailSubject">Subject</label>
                        <input autocomplete="off" required class="col-md-8" type="text" id="emailSubject" placeholder="Email subject">
                    </div>
                    <div class="row form-group">
                        <label class="col-form-label col-md-4" for="emailBody">Body</label>
                        <textarea rows="5" class="col-md-4" id="emailBody" placeholder="Email body"></textarea>
                        <div class="col-md-4" id="emailBodyPreview"></div>
                    </div>
                </div>
            </div>
        `
        document.getElementById('emailDiv').innerHTML = template
    }
    else document.getElementById('emailDiv').innerHTML = '';

    if(array.includes('sms')){
        let template = `
            <div class="row">
                <div class="col">
                    <h5>SMS</h5><small id="characterCounts">0/160 characters</small>
                    <div class="row form-group">
                        <label class="col-form-label col-md-4" for="smsBody">Body</label>
                        <textarea rows="2" class="col-md-8" id="smsBody" maxlength="160" placeholder="SMS body"></textarea>
                    </div>
                </div>
            </div>
        `
        document.getElementById('smsDiv').innerHTML = template
    }
    else document.getElementById('smsDiv').innerHTML = '';

    if(array.includes('push')){
        let template = `
            <div class="row">
                <div class="col">
                    <h5>Push notification</h5>
                    <div class="row form-group">
                        <label class="col-form-label col-md-4" for="pushSubject">Subject</label>
                        <input autocomplete="off" required class="col-md-8" type="text" id="pushSubject" placeholder="Push notification subject">
                    </div>
                    <div class="row form-group">
                        <label class="col-form-label col-md-4" for="pushBody">Body</label>
                        <textarea rows="2" class="col-md-8" id="pushBody" placeholder="Push notification body"></textarea>
                    </div>
                </div>
            </div>
        `
        document.getElementById('pushDiv').innerHTML = template;
    }
    else document.getElementById('pushDiv').innerHTML = '';

    const emailBody = document.getElementById('emailBody');
    if(emailBody) addEmailPreview(emailBody);

    addEventSMSCharacterCount();
}

const addEventSMSCharacterCount = () => {
    if(document.getElementById('smsBody')){
        document.getElementById('smsBody').addEventListener('keyup', () => {
            document.getElementById('characterCounts').innerHTML = `${document.getElementById('smsBody').value.length}/160 characters`;
        })
    }
}

const addEmailPreview = (emailBody) => {
    const converter = new showdown.Converter()
    emailBody.addEventListener('keyup', () => {
        const text = emailBody.value;
        const html = converter.makeHtml(text);
        document.getElementById('emailBodyPreview').innerHTML = html;
    })
}

const downloadObjectAsJson = (exportObj, exportName) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

const storeNotificationSchema = async (schema) => {
    console.log('obj', schema)
    showAnimation();
    const access_token = await getIdToken();
    const localStr = localStorage.dashboard ? JSON.parse(localStorage.dashboard) : '';
    const siteKey = access_token !== null ? access_token : localStr.siteKey   

    const schemaPayload = {
        "data": schema
    }

    const response = await (await fetch(`${baseAPI}/dashboard?api=storeNotificationSchema`,{
        method:'POST',
        body: JSON.stringify(schemaPayload),
        headers:{
            Authorization:"Bearer "+siteKey,
            "Content-Type": "application/json"
            }
        }))
        hideAnimation();
        if (response.status === 200) {
            successAlert();
         }
           else { 
               (alert('Error'))
        }
}

const successAlert = () => {
    let alertList = document.getElementById('alert_placeholder');
    let template = '';
    // throws an alert when canncel changes button is clicked
    template += `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    Notfication Schema Saved.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>`
    alertList.innerHTML = template;
}
