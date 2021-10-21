import {renderNavBarLinks, dashboardNavBarLinks, removeActiveClass} from '../navigationBar.js';
import { showAnimation, hideAnimation, baseAPI, getAccessToken } from '../utils.js';


export const renderStoreNotificationSchema = async () => {
    const isParent = localStorage.getItem('isParent')
    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks(isParent);
    removeActiveClass('nav-link', 'active');
    document.getElementById('notifications').classList.add('active');
    let updateSchemaNotification = JSON.parse(localStorage.getItem("updateNotificationSchema"));
    let updateCounter = localStorage.getItem("updateFlag");
    localStorage.removeItem('updateFlag');
    mainContent.innerHTML = render();
    localStorage.setItem("emailCheck", false);
    localStorage.setItem("smsCheck", false);
    const concepts = await getConcepts();  
    init(concepts);
    if(updateCounter == 0) mapSchemaNotificaiton(updateSchemaNotification, concepts);
}

const init = (concepts) => { 
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
    clearNotificationSchemaForm();
}


export const render = () => {
    let template = `<div class="container-fluid">
                        <div id="root root-margin"> 
                        <div id="alert_placeholder"></div>
                        <br />
                        <span> <h4 style="text-align: center;" id="getCurrentTitle">Create Notification Schema</h4> </span>
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
                                        <select id="operatorkey0" name="condition-operator" class="col-md-1 form-control mr-2">
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
                                    <button type="submit" class="btn btn-primary" id="updateId">Submit</button>
                                    <button type="button" class="btn btn-danger" id="clearForm">Clear</button>
                                </div>
        
                            </form>
                    </div></div>`


    return template;

}

const mapSchemaNotificaiton = (updateSchemaNotification, concepts) => {
    document.getElementById("attempt").value = updateSchemaNotification.attempt;
    document.getElementById("description").value = updateSchemaNotification.description;
    document.getElementById("category").value = updateSchemaNotification.category;
    const titleElement = document.getElementById("getCurrentTitle");
    titleElement.innerHTML = "Update Notification Schema";

    (updateSchemaNotification.notificationType).forEach(i => {
        console.log('i', i)
        if (i === "email") {
            document.getElementById('emailCheckBox').checked = true
            renderDivs("email");
            document.getElementById('emailSubject').value = updateSchemaNotification.email.subject
            document.getElementById('emailBody').value = updateSchemaNotification.email.body
            localStorage.setItem("emailCheck", true);
        }
        if (i === "sms") {
            document.getElementById('smsCheckBox').checked = true
            renderDivs("sms");
            console.log('updateSchemaNotification', updateSchemaNotification, i)
            document.getElementById('smsBody').value = updateSchemaNotification.sms.body
            localStorage.setItem("smsCheck", true);
        } 
        if (i === "push") {
            document.getElementById('pushCheckBox').checked = true
            renderDivs("push");
            document.getElementById('pushSubject').value = updateSchemaNotification.push.subject
            document.getElementById('pushBody').value = updateSchemaNotification.push.body
        }
    })

    const size = Object.keys(updateSchemaNotification.conditions).length;
    let counter = 0;
    const conditions = updateSchemaNotification.conditions;
    for (let i in updateSchemaNotification.conditions) {
        if (counter <= (size-1)) {
            document.getElementById(`conditionkey${counter}`).value = i;
            document.getElementById(`operatorkey${counter}`).value = getOperatorResponse(conditions[i]);
            if((conditions).hasOwnProperty(i)) {
                document.getElementById(`conditionvalue${counter}`).value = getConditionsResponse(conditions[i]);
            }
            counter++;
            if(counter != size) document.getElementById('addConditions').click();
        }
    }

   
    conceptDropdown(concepts, 'email-concept');
    const emailconcept =  document.getElementById('emailconcept0');
    emailconcept.value = updateSchemaNotification.emailField;

    conceptDropdown(concepts, 'first-name-concept');
    const firstname = document.getElementById("firstnameconcept0");
    if (firstname) {firstname.value = updateSchemaNotification.firstNameField}

    conceptDropdown(concepts, 'preferred-name-concept');
    const preferredname = document.getElementById('preferrednameconcept0');
    if(updateSchemaNotification.preferredNameField && preferredname) { preferredname.value = updateSchemaNotification.preferredNameField};


    conceptDropdown(concepts, 'phone-concept');
    const phoneconcept = document.getElementById('phoneconcept0')
    if (phoneconcept) {phoneconcept.value = updateSchemaNotification.phoneField}

    conceptDropdown(concepts, 'primary-field');
    const primaryfield = document.getElementById('primaryfield0');
    if (primaryfield) {primaryfield.value = updateSchemaNotification.primaryField}

    document.getElementById('days').value = updateSchemaNotification.time['day'];
    document.getElementById('hours').value = updateSchemaNotification.time['hour'];
    document.getElementById('minutes').value = updateSchemaNotification.time['minute'];
    const a = document.getElementById('updateId');
    a.dataset.id = updateSchemaNotification.id;
    localStorage.setItem("idFlag", true);
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
            <select name="condition-operator" class="col-md-1 form-control mr-2" id="operatorkey${conditionNo}">
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
    console.log('chkbs', chkbs)
    Array.from(chkbs).forEach(box => {
        box.addEventListener('click', () => {
            console.log('box', chkbs)
            const checked = Array.from(chkbs).filter(cb => cb.checked).map(dt => dt.dataset.type);
            renderDivs(checked);
        })
    })
}

const renderDivs = (array) => {
    const emailFlag = localStorage.getItem('emailCheck')
    console.log('arr', array)
    if(array.includes('email') && localStorage.getItem('emailCheck') === 'false'){
        console.log('em123456', emailFlag)
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
        console.log('1234')
        document.getElementById('emailDiv').innerHTML = template
        localStorage.setItem("emailCheck", true);
    }
    // else { 
    //     document.getElementById('emailDiv').innerHTML = '';
    //     localStorage.setItem("emailCheck", false);
    // }
    const smsFlag = localStorage.getItem('smsCheck')
    console.log('esm', smsFlag, array)
    if(array.includes('sms') && localStorage.getItem('smsCheck') === 'false'){
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
        console.log('56789')
        document.getElementById('smsDiv').innerHTML = template
        localStorage.setItem("smsCheck", true);
    }
    // else {
    //     document.getElementById('smsDiv').innerHTML = '';
    //     localStorage.setItem("smsCheck", false);
    // } 

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
    const a = document.getElementById('updateId').getAttribute('data-id');
    const idFlag = localStorage.getItem("idFlag");
    if(idFlag == "true" || a && a.length != 0) { 
        let updateSchemaNotification = JSON.parse(localStorage.getItem("updateNotificationSchema"));
        localStorage.setItem("idFlag", false);
        schema.id = updateSchemaNotification.id;
    }
    showAnimation();
    const siteKey = await getAccessToken();  
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

const getOperatorResponse = (i) => {
    return Object.keys(i)[0];
} 

const getConditionsResponse = (i) => {
    if (i['equals'] !== undefined) {
        return i['equals'];
    } else if (i['notequals'] !== undefined) {
        return i['notequals'];
    }
}

const clearNotificationSchemaForm = () => {
    const a = document.getElementById('clearForm');
    a.addEventListener("click", () => {
        window.location.reload();
    })
}