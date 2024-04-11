import { dashboardNavBarLinks, removeActiveClass } from '../navigationBar.js';
import { showAnimation, hideAnimation, baseAPI, getIdToken, triggerNotificationBanner } from '../utils.js';
import { appState } from '../stateManager.js';

const newsletterCategories = ["newsletter", "eNewsletter", "anniversaryNewsletter"];
let conceptsOptionsStr = "";
let concepts = null;

export const editNotificationSchema = async () => {
  const notificationData = appState.getState().notification || {};
  if (!notificationData.isEditing) {
    const createSchemaRoute = "#notifications/createnotificationschema";
    location.replace(location.origin + location.pathname + createSchemaRoute);
    return;
  }

  await renderSchemaPage(notificationData.savedSchema);
};

export const createNotificationSchema = async () => {
  appState.setState({ notification: { } });
  await renderSchemaPage();
};

const renderSchemaPage = async (schemaData = null) => {
  const isParent = localStorage.getItem("isParent");
  document.getElementById("navBarLinks").innerHTML = dashboardNavBarLinks(isParent);
  removeActiveClass("nav-link", "active");
  document.getElementById("notifications").classList.add("active");

  if (!concepts) {
    concepts = await getConcepts();
    if (concepts) {
      for (const key in concepts) {
        conceptsOptionsStr += `<option value="${concepts[key]}">${key}</option>`;
      }
    }
  }

  const isEditing = appState.getState().notification?.isEditing;
  const titleStr = isEditing ? "Edit Notification Schema" : "Create Notification Schema";

  mainContent.innerHTML = `
    <div class="container-fluid">
        <div id="root root-margin"> 
            <div id="alert_placeholder"></div>
            <br />
            <span> <h4 style="text-align: center;" id="getCurrentTitle">${titleStr}</h4> </span>
            <form method="post" class="mt-3" id="configForm">
                ${getSchemaHtmlStr(schemaData)}
                <div class="mt-4 mb-4 d-flex justify-content-center">
                    <button type="submit" title="Save schema as complete. Notifications triggered" class="btn btn-primary" id="updateId">
                        Save Changes
                    </button>
                    <button type="submit" title="Save schema as a draft. Notifications NOT triggered" class="btn btn-outline-secondary ml-2" id="saveSchemaAsDraft" data-draft="true">
                        Save as Draft
                    </button>
                    <button type="button" class="btn btn-danger ml-2" id="exitForm">Exit Without Saving</button>
                </div>
                ${schemaData?.id ? getDryRunHtlmStr() : ""}
            </form>
        </div>
    </div>`;

  handleEmailPreview();
  handleDeleteExistingConditions();
  handleAddCondition();
  handleNotficationDivs(schemaData);
  handleSMSCharacterCount();
  handleFormSubmit();
  handleExitForm();
  handleDryRun();
};

const getDryRunHtlmStr = () => `
  <hr style="border: solid gray 1px"/>
  <div class="row form-group align-items-center">
      <div class="col-md-3">
          <button type="button" class="btn btn-secondary" id="dryRunBtn" title="Test notification schemas scheduled at 3pm or 8pm">Dry Run</button>
      </div>
      <textarea class="col-md-8" id="dryRunResult" cols="30" rows="3" style="font-family: monospace, Courier New"></textarea>
  </div>`;

export const getSchemaHtmlStr = (schemaData = null, isReadOnly = false) => {
  let conditionHtmlStrAll = "";
  let index = 0;
  if (schemaData) {
    for (const conditionKey in schemaData.conditions) {
      const [conditionOperator, conditionValue] = Object.entries(schemaData.conditions[conditionKey])[0];
      conditionHtmlStrAll += getConditionHtmlStr({
        index,
        isReadOnly,
        conditionKey,
        conditionOperator,
        conditionValue,
      });
      index++;
    }
  } else {
    conditionHtmlStrAll = getConditionHtmlStr({index: 0, isReadOnly});
  }

  return `
    <div class="row form-group">
        <label class="col-form-label col-md-3" for="attempt">Attempt</label>
        <input autocomplete="off" required class="col-md-8" type="text" id="attempt" placeholder="eg. 1st contact" ${schemaData?.attempt? `value="${schemaData.attempt}"`: "" }>
    </div>
    
    <div class="row form-group">
        <label class="col-form-label col-md-3" for="description">Description</label>
        <textarea class="col-md-8" required id="description" cols="30" rows="3">${schemaData?.description ?? ""}</textarea>
    </div>
    
    <div class="row form-group">
        <label class="col-form-label col-md-3" for="category">Category</label>
        <input autocomplete="off" required class="col-md-8" type="text" id="category" placeholder="eg. consented" ${schemaData?.category? `value="${schemaData.category}"`: ""}>
    </div>

    <div class="row form-group">
        <label class="col-form-label col-md-3">Notification type</label>
        <input type="checkbox" name="notification-checkbox" data-type="email" id="emailCheckBox" ${schemaData?.notificationType?.includes("email")? "checked": ""} style="height: 25px;">&nbsp;
        <label class="mr-3" for="emailCheckBox">Email</label>
        <input type="checkbox" name="notification-checkbox" data-type="sms" id="smsCheckBox" ${schemaData?.notificationType?.includes("sms")? "checked": ""} style="height: 25px;">&nbsp;
        <label class="mr-3" for="smsCheckBox">SMS</label>
        <input type="checkbox" disabled name="notification-checkbox" data-type="push" id="pushNotificationCheckBox" ${schemaData?.notificationType?.includes("push")? "checked": ""} style="height: 25px;">&nbsp;<label for="pushNotificationCheckBox">Push Notification</label>
    </div>

    <div class="row">
        <label class="col-form-label col-md-3" for="condition-key">Schedule at (EST)</label>
        <div class="col-md-1 form-check">
            <input class="form-check-input" type="radio" value="15:00" ${schemaData?.scheduleAt !== "20:00" ? "checked" : ""} name="scheduleAt" id="scheduleAt1">
            <label class="form-check-label" for="scheduleAt1">
                3:00 PM
            </label>
        </div>
        <div class="col-md-1 form-check">
            <input class="form-check-input" type="radio" value="20:00" ${schemaData?.scheduleAt === "20:00" ? "checked" : ""} name="scheduleAt" id="scheduleAt2">
            <label class="form-check-label" for="scheduleAt2">
                8:00 PM
            </label>
        </div>
    </div>
    <div id="emailDiv">${schemaData?.email?.subject  ? getEmailDivHtml(schemaData) : "" }</div>
    <div id="smsDiv">${schemaData?.sms?.body ? getSmsDivHtml(schemaData) : "" }</div>
    <div id="pushDiv">${schemaData?.push?.subject ? getPushDivHtml(schemaData) : "" }</div>
    <div id="conditionsDiv">
        ${conditionHtmlStrAll}
    </div>
    <div class="form-group">
        <button type="button" class="btn btn-outline-primary" id="addConditions" data-condition="${index}" ${isReadOnly ? "disabled" : ""}>Add more condition</button>
    </div>
    
    <div class="row form-group">
        <label class="col-form-label col-md-3">Email field concept</label>
        <div class="email-concept col-md-8 p-0">
            <input id="emailConceptId" required list="dataListEmailConcept" class="form-control" ${schemaData?.emailField ? `value="${schemaData.emailField}"`: ""}>
            <datalist id="dataListEmailConcept">
                ${conceptsOptionsStr}
            </datalist>
        </div>
    </div>
    
    <div class="row form-group">
        <label class="col-form-label col-md-3">Phone no. concept</label>
        <div class="phone-concept col-md-8 p-0">
            <input id="phoneConceptId" required list="dataListPhoneConcept" class="form-control" ${schemaData?.phoneField ? `value="${schemaData.phoneField}"`: ""}>
            <datalist id="dataListPhoneConcept">
                ${conceptsOptionsStr}
            </datalist>
        </div>
    </div>

    <div class="row form-group">
        <label class="col-form-label col-md-3">First name concept</label>
        <div class="first-name-concept col-md-8 p-0">
            <input id="firstNameConceptId" required list="dataListFirstNameConcept" class="form-control" ${schemaData?.firstNameField ? `value="${schemaData.firstNameField}"`: ""}>
            <datalist id="dataListFirstNameConcept">
                ${conceptsOptionsStr}
            </datalist>
        </div>
    </div>

    <div class="row form-group">
        <label class="col-form-label col-md-3">Preferred name concept</label>
        <div class="preferred-name-concept col-md-8 p-0">
            <input id="preferredNameConceptId" required list="dataListPreferredNameConcept" class="form-control" ${schemaData?.preferredNameField ? `value="${schemaData.preferredNameField}"`: ""}>
            <datalist id="dataListPreferredNameConcept">
                ${conceptsOptionsStr}
            </datalist>
        </div>
    </div>

    <div class="row form-group">
        <label class="col-form-label col-md-3">Primary field</label>
        <div class="primary-field col-md-8 p-0">
            <input id="primaryFieldConceptId" required list="dataListPrimaryField" class="form-control" ${schemaData?.primaryField ? `value="${schemaData.primaryField}"`: ""}>
            <datalist id="dataListPrimaryField">
                ${conceptsOptionsStr}
            </datalist>
        </div>
    </div>
    
    <div class="row form-group">
        <label class="col-form-label col-md-3">Time</label>
        <input required autocomplete="off" pattern="[0-9]+" class="col-md-2 mr-2" type="text" id="days" placeholder="# days" ${schemaData?.time ? `value="${schemaData.time.day ?? 0}"` : ""}>
        <input required autocomplete="off" pattern="[0-9]+" class="col-md-2 mr-2" type="number" min="0" max="23" id="hours" placeholder="hour (0-23)" ${schemaData?.time ? `value="${schemaData.time.hour ?? 0}"`: ""}>
        <input required autocomplete="off" pattern="[0-9]+" class="col-md-2" type="number" min="0" max="59" id="minutes" placeholder="minutes (0-59)" ${schemaData?.time ? `value="${schemaData.time.minute ?? 0}"`: ""}>
    </div>`;
};

const handleFormSubmit = () => {
  const form = document.getElementById("configForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let schema = {};
    schema.id = appState.getState().notification?.savedSchema?.id ?? "";
    schema.isDraft = e.submitter.dataset.draft === "true";
    schema["attempt"] = document.getElementById("attempt").value.trim();
    schema["description"] = document.getElementById("description").value.trim();
    schema["category"] = document.getElementById("category").value.trim();
    schema["notificationType"] = Array.from(document.getElementsByName("notification-checkbox"))
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.dataset.type);
    schema["scheduleAt"] = Array.from(document.getElementsByName("scheduleAt")).filter((dt) => dt.checked)[0].value;

    schema["emailField"] = document.getElementById("emailConceptId").value;
    schema["phoneField"] = document.getElementById("phoneConceptId").value;
    schema["firstNameField"] = document.getElementById("firstNameConceptId").value;
    const preferredNameValue = document.getElementById("preferredNameConceptId").value;
    if (preferredNameValue) {
      schema["preferredNameField"] = preferredNameValue;
    }

    schema["primaryField"] = document.getElementById("primaryFieldConceptId").value;
    schema["time"] = {
      day: parseInt(document.getElementById("days").value),
      hour: parseInt(document.getElementById("hours").value),
      minute: parseInt(document.getElementById("minutes").value),
    };

    const emailSubjectEle = document.getElementById("emailSubject");
    if (emailSubjectEle) {
      schema["email"] = { subject: emailSubjectEle.value };
      if (newsletterCategories.includes(schema["category"])) {
        schema["email"]["body"] = document.getElementById("emailBody").value;
      } else {
        schema["email"]["body"] = document.getElementById("emailBody").value.replace(/\n/g, "<br/>");
      }
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

    const currSchemaId = await storeNotificationSchema(schema);
    if (!schema.id && currSchemaId.length > 0) {
      const form = document.getElementById("configForm");
      const wrapperDiv = document.createElement("div");
      wrapperDiv.innerHTML = getDryRunHtlmStr();
      form && form.append(...wrapperDiv.children);
      handleDryRun();
    }
  });
};

const handleAddCondition = () => {
  const conditionDiv = document.getElementById("conditionsDiv");
  const btn = document.getElementById("addConditions");

  btn && btn.addEventListener("click", () => {
    const index = parseInt(btn.dataset.condition);
    const wrapperDiv = document.createElement("div");
    wrapperDiv.innerHTML = getConditionHtmlStr({ index });
    conditionDiv.appendChild(wrapperDiv.firstElementChild);
    conditionDiv.querySelector(`button[data-btn-idx="${index}"]`).addEventListener("click", deleteConditionListener);
    btn.dataset.condition = index + 1;
  });
};

const handleDeleteExistingConditions = () => {
  const conditionDiv = document.getElementById("conditionsDiv");
  const btns = conditionDiv.querySelectorAll("button[data-btn-idx]");
  btns.forEach((btn) => {
    if (!btn.hasClickListener) {
      btn.addEventListener("click", deleteConditionListener);
      btn.hasClickListener = true;
    }
  });
};

const getConditionHtmlStr = ({
  index = 0,
  isReadOnly = false,
  conditionKey = null,
  conditionOperator = null,
  conditionValue = null,
}) => {
  return `
    <div class="row form-group" data-condition-idx="${index}">
        <label class="col-form-label col-md-3">Condition</label>
        <div class="condition-key col-md-2 mr-2 p-0">
          <input id="conditionkey${index}" required list="dataListconditionkey${index}" class="form-control" name="condition-key" ${conditionKey ? `value="${conditionKey}"` : ""}>
          <datalist id="dataListconditionkey${index}">
              ${conceptsOptionsStr}
          </datalist>
        </div>
        <select id="operatorkey${index}" name="condition-operator" class="col-md-2 form-control mr-2">
            <option value="equals" ${conditionOperator === "equals" ? "selected" : ""}>equals</option>
            <option value="notequals" ${conditionOperator === "notequals" ? "selected" : ""}>notequals</option>
            <option value="greater" ${conditionOperator === "greater" ? "selected" : ""}>greater</option>
            <option value="greaterequals" ${conditionOperator === "greaterequals" ? "selected" : ""}>greaterequals</option>
            <option value="less" ${conditionOperator === "eless" ? "selected" : ""}>less</option>
            <option value="lessequals" ${conditionOperator === "lessequals" ? "selected" : ""}>lessequals</option>
        </select>
        <select id="valuetype${index}" name="value-type" class="col-md-1 form-control mr-2">
            <option value="number" ${typeof conditionValue === "number" ? "selected" : ""}>number</option>
            <option value="string" ${typeof conditionValue === "string" ? "selected" : ""}>string</option>
        </select>
        <div class="condition-value col-md-2 mr-2 p-0">
          <input id="conditionvalue${index}" required  list="dataListconditionvalue${index}" class="form-control" name="condition-value" ${conditionValue ? `value="${conditionValue}"` : ""}>
          <datalist id="dataListconditionvalue${index}">
              ${conceptsOptionsStr}
          </datalist>
        </div>
        <button type ="button" data-btn-idx="${index}" ${isReadOnly ? "disabled" : ""} class="btn btn-warning ml-1 col-md-1" title="Delete condition in this row">Delete</button>
    </div>`;
};

const deleteConditionListener = (event) => {
  event.target.parentElement.remove();
};

const getConcepts = async () => {
  if (concepts) return concepts;

  try {
    const response = await fetch("https://raw.githubusercontent.com/episphere/conceptGithubActions/master/jsons/varToConcept.json");
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error in fetching concepts.", error);
    return null;
  }
}; 

const getEmailDivHtml = (schemaData = null) => {
  return `
    <div class="row">
        <div class="col">
            <h5>Email</h5>
            <div class="row form-group">
                <label class="col-form-label col-md-3" for="emailSubject">Subject</label>
                <input autocomplete="off" required class="col-md-8" type="text" id="emailSubject" placeholder="Email subject" ${schemaData?.email?.subject ? `value="${schemaData.email.subject}"`: ""}>
            </div>
            <div class="row form-group">
                <label class="col-form-label col-md-3" for="emailBody">Body</label>
                <textarea rows="5" class="col-md-4" id="emailBody" placeholder="Email body">${schemaData?.email?.body ?? ""}</textarea>
                <div class="col-md-4" id="emailBodyPreview"></div>
            </div>
        </div>
    </div>`;
};

const getSmsDivHtml = (schemaData = null) => {
  return `
    <div class="row">
        <div class="col">
            <h5>SMS</h5>
            <div class="row form-group">
                <label class="col-form-label col-md-3" for="smsBody">Body (<small id="characterCounts">${schemaData?.sms?.body?.length ?? 0}/160 characters</small>)</label>
                <textarea rows="2" class="col-md-8" id="smsBody" maxlength="160" placeholder="SMS body">${schemaData?.sms?.body ?? ""}</textarea>

            </div>
        </div>
    </div>`;
};

const getPushDivHtml = (schemaData = null) => {
  return `
    <div class="row">
        <div class="col">
            <h5>Push notification</h5>
            <div class="row form-group">
                <label class="col-form-label col-md-3" for="pushSubject">Subject</label>
                <input autocomplete="off" required class="col-md-8" type="text" id="pushSubject" placeholder="Push notification subject" ${schemaData?.push?.subject ? `value="${schemaData.push.subject}"`: ""}>
            </div>
            <div class="row form-group">
                <label class="col-form-label col-md-3" for="pushBody">Body</label>
                <textarea rows="2" class="col-md-8" id="pushBody" placeholder="Push notification body">${schemaData?.push?.body ?? ""}</textarea>
            </div>
        </div>
    </div>`;
};

const handleNotficationDivs = (schemaData) => {
  const emailCheckbox = document.getElementById("emailCheckBox");
  emailCheckbox.addEventListener("click", () => {
    if (emailCheckbox.checked === true) {
      document.getElementById("emailDiv").innerHTML = getEmailDivHtml(schemaData);
      handleEmailPreview();
    } else {
      document.getElementById("emailDiv").innerHTML = "";
    }
  });

  const smsCheckbox = document.getElementById("smsCheckBox");
  smsCheckbox.addEventListener("click", () => {
    if (smsCheckbox.checked === true) {
      document.getElementById("smsDiv").innerHTML = getSmsDivHtml(schemaData);
      handleSMSCharacterCount();
    } else {
      document.getElementById("smsDiv").innerHTML = "";
    }
  });

  const pushCheckbox = document.getElementById("pushNotificationCheckBox");
  pushCheckbox.addEventListener("click", () => {
    if (pushCheckbox.checked === true) {
      document.getElementById("pushDiv").innerHTML = getPushDivHtml(schemaData);
    } else {
      document.getElementById("pushDiv").innerHTML = "";
    }
  });
};

const handleSMSCharacterCount = () => {
  const characterCountEle = document.getElementById("characterCounts");
  const smsBodyEle = document.getElementById("smsBody");
  if (characterCountEle && smsBodyEle && !smsBodyEle.hasInputListener) {
    smsBodyEle.addEventListener("input", () => {
      characterCountEle.innerText = `${smsBodyEle.value.length}/160 characters`;
    });
    smsBodyEle.hasInputListener = true;
  }
};

export const handleEmailPreview = () => {
  const emailBody = document.getElementById("emailBody");
  if (!emailBody || emailBody?.hasMouseenterListener) return;

  const converter = new showdown.Converter();
  emailBody.addEventListener("mouseenter", () => {
    const text = emailBody.value;
    const html = converter.makeHtml(text);
    document.getElementById("emailBodyPreview").innerHTML = html;
  });
  emailBody.hasMouseenterListener = true;
};

const storeNotificationSchema = async (schema) => {
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
  const res = await response.json();
  if (res.code === 200 && res.data?.length > 0) {
    schema.id = res.data[0].schemaId;
    appState.setState((state) => ({
      notification: { savedSchema: schema, isEditing: state.notification?.isEditing ?? false },
    }));
    triggerNotificationBanner(`Notfication Schema Saved as ${schema.isDraft ? "Draft" : "Complete"}.`, "success");
    return res.data[0].schemaId;
  }

  triggerNotificationBanner("Error in saving notification schema!", "danger");
  return "";
};

const handleExitForm = () => {
  const exitBtn = document.getElementById("exitForm");
  exitBtn.addEventListener("click", () => {
    const loadDetailsPage = "#notifications/retrievenotificationschema";
    location.replace(window.location.origin + window.location.pathname + loadDetailsPage);
  });
};

const handleDryRun = () => {
  const resultEle = document.getElementById("dryRunResult");
  const dryRunBtn = document.getElementById("dryRunBtn");
  if (!dryRunBtn || dryRunBtn.hasClickListener) return;

  dryRunBtn.addEventListener("click", async () => {
    showAnimation();
    const schemaId = appState.getState().notification.savedSchema.id;
    const idToken = await getIdToken();
    const res = await fetch(`${baseAPI}/dashboard?api=dryRunNotificationSchema&schemaId=${schemaId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + idToken,
      },
    });

    const resJson = await res.json();
    const dataObj = resJson.data[0] || { emailCount: 0, smsCount: 0 };

    resultEle.textContent = `${"Emails count:".padEnd(25, " ")}${dataObj.emailCount}\n${"SMS messages count:".padEnd(25, " ")}${dataObj.smsCount}\n`;
    if (resJson.code === 200) {
      resultEle.textContent += "Everything looks good!";
    } else {
      resultEle.textContent += `Error occurred in dry run:\n${resJson.message}`;
    }

    hideAnimation();
  });

  dryRunBtn.hasClickListener = true;
};
