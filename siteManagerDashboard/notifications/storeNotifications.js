import { dashboardNavBarLinks, removeActiveClass } from '../navigationBar.js';
import { appState } from '../stateManager.js';
import { showAnimation, hideAnimation, baseAPI, getIdToken } from '../utils.js';

export const editSchema = async () => {
  const notificationData = appState.getState().notification || {};
  if (!notificationData.isEditing) {
    const createSchemaRoute = "#notifications/createnotificationschema";
    location.replace(location.origin + location.pathname + createSchemaRoute);
    return;
  }

  const concepts = await renderStoreNotificationSchema();
  mapSchemaNotificaiton(notificationData.savedSchema, concepts, true);
};

export const renderStoreNotificationSchema = async () => {
  const isParent = localStorage.getItem("isParent");
  document.getElementById("navBarLinks").innerHTML = dashboardNavBarLinks(isParent);
  removeActiveClass("nav-link", "active");
  document.getElementById("notifications").classList.add("active");
  mainContent.innerHTML = render();
  localStorage.setItem("emailCheck", false);
  localStorage.setItem("smsCheck", false);
  localStorage.setItem("pushNotificationCheck", false);
  const concepts = await getConcepts();
  init(concepts);

  return concepts;
};

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
};

const render = () => {
    const isEditing = appState.getState().notification?.isEditing;
    const titleStr = isEditing ? "Edit Notification Schema" : "Create Notification Schema";
    let template = `
        <div class="container-fluid">
            <div id="root root-margin"> 
                <div id="alert_placeholder"></div>
                <br />
                <span> <h4 style="text-align: center;" id="getCurrentTitle">${titleStr}</h4> </span>
                <form method="post" class="mt-3" id="configForm">
                    <div class="row form-group">
                        <label class="col-form-label col-md-3" for="attempt">Attempt</label>
                        <input autocomplete="off" required class="col-md-8" type="text" id="attempt" placeholder="eg. 1st contact">
                    </div>
                    
                    <div class="row form-group">
                        <label class="col-form-label col-md-3" for="description">Description</label>
                        <textarea class="col-md-8" required id="description" cols="30" rows="3"></textarea>
                    </div>
                    
                    <div class="row form-group">
                        <label class="col-form-label col-md-3" for="category">Category</label>
                        <input autocomplete="off" required class="col-md-8" type="text" id="category" placeholder="eg. consented">
                    </div>
        
                    <div class="row form-group">
                        <label class="col-form-label col-md-3">Notification type</label>
                        <input type="checkbox" name="notification-checkbox" data-type="email" id="emailCheckBox" style="height: 25px;">&nbsp;<label class="mr-3" for="emailCheckBox">Email</label>
                        <input type="checkbox" name="notification-checkbox" data-type="sms" id="smsCheckBox" style="height: 25px;">&nbsp;<label class="mr-3" for="smsCheckBox">SMS</label>
                        <input type="checkbox" disabled name="notification-checkbox" data-type="push" id="pushNotificationCheckBox" style="height: 25px;">&nbsp;<label for="pushNotificationCheckBox">Push Notification</label>
                    </div>
        
                    <div class="row">
                        <label class="col-form-label col-md-3" for="condition-key">Schedule at (EST)</label>
                        <div class="col-md-1 form-check">
                            <input class="form-check-input" checked value="15:00" type="radio" name="scheduleAt" id="scheduleAt1">
                            <label class="form-check-label" for="scheduleAt1">
                                3:00 PM
                            </label>
                        </div>
                        <div class="col-md-1 form-check">
                            <input class="form-check-input" type="radio" value="20:00" name="scheduleAt" id="scheduleAt2">
                            <label class="form-check-label" for="scheduleAt2">
                                8:00 PM
                            </label>
                        </div>
                    </div>
                    <div id="emailDiv"></div>
                    <div id="smsDiv"></div>
                    <div id="pushDiv"></div>
                    <div id="conditionsDiv">
                        <div class="row form-group">
                            <label class="col-form-label col-md-3">Condition</label>
                            <div class="condition-key col-md-2 mr-2 p-0"></div>
                            <select id="operatorkey0" name="condition-operator" class="col-md-2 form-control mr-2">
                                <option value="equals">equals</option>
                                <option value="notequals">notequals</option>
                                <option value="greater">greater</option>
                                <option value="greaterequals">greaterequals</option>
                                <option value="less">less</option>
                                <option value="lessequals">lessequals</option>
                            </select>
                            <select id="valuetype0" name="value-type" class="col-md-2 form-control mr-2">
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
                        <label class="col-form-label col-md-3">Email field concept</label>
                        <div class="email-concept col-md-8 p-0"></div>
                    </div>
                    
                    <div class="row form-group">
                        <label class="col-form-label col-md-3">Phone no. concept</label>
                        <div class="phone-concept col-md-8 p-0"></div>
                    </div>
        
                    <div class="row form-group">
                        <label class="col-form-label col-md-3">First name concept</label>
                        <div class="first-name-concept col-md-8 p-0"></div>
                    </div>
        
                    <div class="row form-group">
                        <label class="col-form-label col-md-3">Preferred name concept</label>
                        <div class="preferred-name-concept col-md-8 p-0"></div>
                    </div>
        
                    <div class="row form-group">
                        <label class="col-form-label col-md-3">Primary field</label>
                        <div class="primary-field col-md-8 p-0"></div>
                    </div>
                    
                    <div class="row form-group">
                        <label class="col-form-label col-md-3">Time</label>
                        <input required autocomplete="off" pattern="[0-9]+" class="col-md-2 mr-2" type="text" id="days" placeholder="# days">
                        <input required autocomplete="off" pattern="[0-9]+" class="col-md-2 mr-2" type="number" min="0" max="23" id="hours" placeholder="hour (0-23)">
                        <input required autocomplete="off" pattern="[0-9]+" class="col-md-2" type="number" min="0" max="59" id="minutes" placeholder="minutes (0-59)">
                    </div>
                    
                    <div class="mt-4 mb-4 d-flex justify-content-center">
                        <button type="submit" title="Save schema as complete. Notifications triggered" class="btn btn-primary" id="updateId">
                            Save Changes
                        </button>
                        <button type="submit" title="Save schema as a draft. Notifications NOT triggered" class="btn btn-outline-secondary ml-2" id="saveSchemaAsDraft" data-draft="true">
                            Save as Draft
                        </button>
                        <button type="button" class="btn btn-danger ml-2" id="exitForm">Exit Without Saving</button>
                    </div>
                </form>
            </div>
        </div>`;

    return template;
};

export const mapSchemaNotificaiton = (updateSchemaNotification, concepts, flag) => {
    document.getElementById("attempt").value = updateSchemaNotification.attempt;
    document.getElementById("description").value = updateSchemaNotification.description;
    document.getElementById("category").value = updateSchemaNotification.category;
    const titleElement = document.getElementById("getCurrentTitle");
    if (titleElement) titleElement.innerText = "Edit Notification Schema";

    (updateSchemaNotification.notificationType).forEach(i => {
        if (i === "email") {
            document.getElementById('emailCheckBox').checked = true
            renderDivs("email", flag);
            document.getElementById('emailSubject').value = updateSchemaNotification.email.subject
            document.getElementById('emailBody').value = updateSchemaNotification.email.body
            localStorage.setItem("emailCheck", true);
        }
        if (i === "sms") {
            document.getElementById('smsCheckBox').checked = true
            renderDivs("sms", flag);
            document.getElementById('smsBody').value = updateSchemaNotification.sms.body
            localStorage.setItem("smsCheck", true);
        } 
        if (i === "push") {
            document.getElementById('pushCheckBox').checked = true
            renderDivs("push", flag);
            document.getElementById('pushSubject').value = updateSchemaNotification.push.subject
            document.getElementById('pushBody').value = updateSchemaNotification.push.body
            localStorage.setItem("pushNotificationCheck", true);
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

                let storedValue = getConditionsResponse(conditions[i]);
                document.getElementById(`conditionvalue${counter}`).value = storedValue;

                if(typeof storedValue == 'string') {
                    document.getElementById(`valuetype${counter}`).selectedIndex = 1;
                }
            }

            if(flag) {
                document.getElementById(`conditionkey${counter}`).setAttribute('readonly', true);
                document.getElementById(`operatorkey${counter}`).setAttribute('readonly', true);
                document.getElementById(`valuetype${counter}`).setAttribute('readonly', true);
                document.getElementById(`conditionvalue${counter}`).setAttribute('readonly', true);
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
    if (updateSchemaNotification.preferredNameField && preferredname) { preferredname.value = updateSchemaNotification.preferredNameField; }


    conceptDropdown(concepts, 'phone-concept');
    const phoneconcept = document.getElementById('phoneconcept0')
    if (phoneconcept) {phoneconcept.value = updateSchemaNotification.phoneField}

    conceptDropdown(concepts, 'primary-field');
    const primaryfield = document.getElementById('primaryfield0');
    if (primaryfield) {primaryfield.value = updateSchemaNotification.primaryField}
    Array.from(document.getElementsByName('scheduleAt')).forEach(dt => {
        if(dt.value === updateSchemaNotification.scheduleAt) dt.checked = true;
    });
    document.getElementById('days').value = updateSchemaNotification.time['day'];
    document.getElementById('hours').value = updateSchemaNotification.time['hour'];
    document.getElementById('minutes').value = updateSchemaNotification.time['minute'];
};


const formSubmit = () => {
  const form = document.getElementById("configForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let schema = {};
    schema.isDraft = e.submitter.dataset.draft === "true";
    schema["attempt"] = document.getElementById("attempt").value.trim();
    schema["description"] = document.getElementById("description").value.trim();
    schema["category"] = document.getElementById("category").value.trim();
    schema["notificationType"] = Array.from(document.getElementsByName("notification-checkbox"))
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.dataset.type);
    schema["emailField"] = document.getElementById("emailconcept0").value;
    schema["firstNameField"] = document.getElementById("firstnameconcept0").value;
    schema["scheduleAt"] = Array.from(document.getElementsByName("scheduleAt")).filter((dt) => dt.checked)[0].value;
    if (document.getElementById("preferrednameconcept0").value) {
      schema["preferredNameField"] = document.getElementById("preferrednameconcept0").value;
    }

    schema["phoneField"] = document.getElementById("phoneconcept0").value;
    schema["primaryField"] = document.getElementById("primaryfield0").value;
    schema["time"] = {
      day: parseInt(document.getElementById("days").value),
      hour: parseInt(document.getElementById("hours").value),
      minute: parseInt(document.getElementById("minutes").value),
    };

    const emailSubjectEle = document.getElementById("emailSubject");
    if (emailSubjectEle) {
      schema["email"] = { subject: emailSubjectEle.value };
      schema["category"] === "newsletter"
        ? (schema["email"]["body"] = document.getElementById("emailBody").value)
        : (schema["email"]["body"] = document.getElementById("emailBody").value.replace(/\n/g, "<br/>"));
    }

    const smsBodyEle = document.getElementById("smsBody");
    if (smsBodyEle) {
      schema["sms"] = { body: smsBodyEle.value };
    }

    const pushSubjectEle = document.getElementById("pushSubject");
    if (pushSubjectEle) {
      schema["push"] = { subject: pushSubjectEle.value, body: document.getElementById("pushBody").value };
    }

    const opeartorEleArray = Array.from(document.getElementsByName("condition-operator"));
    const valueTypeEleArray = Array.from(document.getElementsByName("value-type"));
    const valueEleArray = Array.from(document.getElementsByName("condition-value"));
    schema["conditions"] = {};
    Array.from(document.getElementsByName("condition-key")).forEach((element, i) => {
      schema["conditions"][element.value] = {};
      if (valueTypeEleArray[i].value === "string") {
        schema["conditions"][element.value][opeartorEleArray[i].value] = valueEleArray[i].value;
      } else if (valueTypeEleArray[i].value === "number") {
        schema["conditions"][element.value][opeartorEleArray[i].value] = parseInt(valueEleArray[i].value);
      }
    });

    storeNotificationSchema(schema);
  });
};

export const addEventMoreCondition = (concepts, isReadonly = false) => {
    const btn = document.getElementById('addConditions');
    btn.addEventListener('click', () => {
        const conditionNo = parseInt(btn.dataset.condition);
        const conditionDiv = document.getElementById('conditionsDiv');
        const div = document.createElement('div');
        div.classList = ['row form-group'];
        div.innerHTML = `
            <label class="col-form-label col-md-3">Condition</label>
            <div class="condition-key col-md-2 mr-2 p-0">${getDataListTemplate(concepts, `conditionkey${conditionNo}`, 'condition-key', isReadonly)}</div>
            <select name="condition-operator" class="col-md-2 form-control mr-2" id="operatorkey${conditionNo}">
                <option value="equals">equals</option>
                <option value="notequals">notequals</option>
                <option value="greater">greater</option>
                <option value="greaterequals">greaterequals</option>
                <option value="less">less</option>
                <option value="lessequals">lessequals</option>
            </select>
            <select name="value-type" class="col-md-2 form-control mr-2" id="valuetype${conditionNo}">
                <option value="number">number</option>
                <option value="string">string</option>
            </select>
            <div class="condition-value col-md-2 mr-2 p-0">${getDataListTemplate(concepts, `conditionvalue${conditionNo}`, 'condition-value', isReadonly)}</div>
        `;
        conditionDiv.appendChild(div);
        btn.dataset.condition = conditionNo + 1;
    });
};

export const getConcepts = async () => {
    return await (await fetch('https://raw.githubusercontent.com/episphere/conceptGithubActions/master/jsons/varToConcept.json')).json()
}

export const conceptDropdown = (concepts, name) => {
    const elements = document.getElementsByClassName(name);
    Array.from(elements).forEach((ele, i) => {
        ele.innerHTML = getDataListTemplate(concepts, `${name.replace(/-/g, '')}${i}`, name);
    })
}

const getDataListTemplate = (concepts, id, name, isReadonly = false) => {
  let template = `<input ${id !== "preferrednameconcept0" ? "required" : ""} list="dataList${id}" id="${id}" 
    class="form-control" ${name ? `name="${name}"` : ""} ${isReadonly === true ? "readonly" : ""}>`;

  template += `<datalist id="dataList${id}">`;
  for (let key in concepts) {
    template += `<option value="${concepts[key]}">${key}</option>`;
  }
  template += `</datalist>`;

  return template;
};  

const addEventNotificationCheckbox = () => {
    const chkbs = document.getElementsByName('notification-checkbox');
    Array.from(chkbs).forEach(box => {
        box.addEventListener('click', () => {
            const checked = Array.from(chkbs).filter(cb => cb.checked).map(dt => dt.dataset.type);
            renderDivs(checked);
        })
    })
}

const getEmailNotificationTemplate = () => {
  return `
    <div class="row">
        <div class="col">
            <h5>Email</h5>
            <div class="row form-group">
                <label class="col-form-label col-md-3" for="emailSubject">Subject</label>
                <input autocomplete="off" required class="col-md-8" type="text" id="emailSubject" placeholder="Email subject">
            </div>
            <div class="row form-group">
                <label class="col-form-label col-md-3" for="emailBody">Body</label>
                <textarea rows="5" class="col-md-4" id="emailBody" placeholder="Email body"></textarea>
                <div class="col-md-4" id="emailBodyPreview"></div>
            </div>
        </div>
    </div>`;
};

const getSmsNotificationTemplate = () => {
  return `
    <div class="row">
        <div class="col">
            <h5>SMS</h5>
            <div class="row form-group">
                <label class="col-form-label col-md-3" for="smsBody">Body (<small id="characterCounts">0/160 characters</small>)</label>
                <textarea rows="2" class="col-md-8" id="smsBody" maxlength="160" placeholder="SMS body"></textarea>

            </div>
        </div>
    </div>`;
};

const getPushNotificationTemplate = () => {
  return `
    <div class="row">
        <div class="col">
            <h5>Push notification</h5>
            <div class="row form-group">
                <label class="col-form-label col-md-3" for="pushSubject">Subject</label>
                <input autocomplete="off" required class="col-md-8" type="text" id="pushSubject" placeholder="Push notification subject">
            </div>
            <div class="row form-group">
                <label class="col-form-label col-md-3" for="pushBody">Body</label>
                <textarea rows="2" class="col-md-8" id="pushBody" placeholder="Push notification body"></textarea>
            </div>
        </div>
    </div>`;
};

const renderDivs = (array, flag) => {

    if (flag === true) {
        if(array.includes('email')){
            let template = getEmailNotificationTemplate();
            document.getElementById('emailDiv').innerHTML = template
        }
    
        if(array.includes('sms')){
            let template = getSmsNotificationTemplate();
            document.getElementById('smsDiv').innerHTML = template
        }
    
        if(array.includes('push')){
            let template = getPushNotificationTemplate();
            document.getElementById('pushDiv').innerHTML = template;
        }
    }

    else {
        if(array.includes('email') && localStorage.getItem('emailCheck') === 'false'){
            let template = getEmailNotificationTemplate();
            document.getElementById('emailDiv').innerHTML = template
            localStorage.setItem("emailCheck", true);
            reRenderNotficationDivs();
        }

        if(array.includes('sms') && localStorage.getItem('smsCheck') === 'false'){
            let template = getSmsNotificationTemplate();
            document.getElementById('smsDiv').innerHTML = template
            localStorage.setItem("smsCheck", true);
            reRenderNotficationDivs();

        }

        if(array.includes('push') && localStorage.getItem('pushNotificationCheck') === 'false'){
            let template = getPushNotificationTemplate();
            document.getElementById('pushDiv').innerHTML = template;
            localStorage.setItem("pushNotificationCheck", true);
            reRenderNotficationDivs();
        }
    }
    const emailBody = document.getElementById('emailBody');
    if(emailBody) addEmailPreview(emailBody);

    addEventSMSCharacterCount();
}


const reRenderNotficationDivs = () => {
    const emailRecheck = document.getElementById('emailCheckBox');
    emailRecheck.addEventListener('click', () => {
        if (emailRecheck.checked === false) document.getElementById('emailDiv').innerHTML = '';
        if (emailRecheck.checked === true) {
            let template = getEmailNotificationTemplate();
            document.getElementById('emailDiv').innerHTML = template; 
        }
    })
    const smsRecheck = document.getElementById('smsCheckBox');
    smsRecheck.addEventListener('click', () => {
        if (smsRecheck.checked === false) document.getElementById('smsDiv').innerHTML = '';
        if (smsRecheck.checked === true) {
            let template = getSmsNotificationTemplate();
            document.getElementById('smsDiv').innerHTML = template;
        }
    })
    const pushRecheck = document.getElementById('pushNotificationCheckBox');
    pushRecheck.addEventListener('click', () => {
        if (pushRecheck.checked === false) document.getElementById('pushDiv').innerHTML = '';
        if (pushRecheck.checked === true) {
            let template = getPushNotificationTemplate();
        document.getElementById('pushDiv').innerHTML = template;
        }
    })
}

const addEventSMSCharacterCount = () => {
  const characterCountEle = document.getElementById("characterCounts");
  const smsBodyEle = document.getElementById("smsBody");
  if (characterCountEle && smsBodyEle) {
    smsBodyEle.addEventListener("input", () => {
      characterCountEle.innerText = `${smsBodyEle.value.length}/160 characters`;
    });
  }
};

const addEmailPreview = (emailBody) => {
    const converter = new showdown.Converter()
    emailBody.addEventListener('mouseenter', () => {
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
  schema.id = appState.getState().notification?.savedSchema?.id || "";

  showAnimation();
  const idToken = await getIdToken();
  const schemaPayload = { data: schema };

  const response = await fetch(`${baseAPI}/dashboard?api=storeNotificationSchema`, {
    method: "POST",
    body: JSON.stringify(schemaPayload),
    headers: {
      Authorization: "Bearer " + idToken,
      "Content-Type": "application/json",
    },
  });
  hideAnimation();
  if (response.status === 200) {
    successAlert();
  } else {
    alert("Error in saving notification schema");
  }
};

const successAlert = () => {
  let alertDiv = document.getElementById("alert_placeholder");
  alertDiv.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        Notfication Schema Saved.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`;
};

const getOperatorResponse = (i) => {
    return Object.keys(i)[0];
} 

const getConditionsResponse = (i) => {
    if (i['equals'] !== undefined) {
        return i['equals'];
    } else if (i['notequals'] !== undefined) {
        return i['notequals'];
    }
    else if (i['greater'] !== undefined) {
        return i['greater'];
    }
    else if (i['greaterequals'] !== undefined) {
        return i['greaterequals'];
    }
    else if (i['less'] !== undefined) {
        return i['less'];
    }
    else if (i['lessequals'] !== undefined) {
        return i['lessequals'];
    }
}

const clearNotificationSchemaForm = () => {
    const a = document.getElementById('exitForm');
    a.addEventListener("click", () => {
        const loadDetailsPage = '#notifications/retrievenotificationschema'
        location.replace(window.location.origin + window.location.pathname + loadDetailsPage);
    })
}