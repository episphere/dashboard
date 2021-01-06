import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import fieldMapping from './fieldToConceptIdMapping.js'; 

export const headerImportantColumns = ['Connect_ID', fieldMapping.fName, fieldMapping.birthYear, fieldMapping.consentDate, 'Years in Connect']

export const importantColumns = [fieldMapping.lName, fieldMapping.fName, fieldMapping.prefName, fieldMapping.mName, fieldMapping.suffix, fieldMapping.birthMonth, fieldMapping.birthDay, fieldMapping.birthYear, 
    fieldMapping.homePhone, fieldMapping.cellPhone, fieldMapping.otherPhone, fieldMapping.prefEmail, fieldMapping.prefContact, fieldMapping.canWeText, fieldMapping.ssnOnFile,
    fieldMapping.address1, fieldMapping.city, fieldMapping.state, fieldMapping.zip, 'Connect_ID'];


export function renderParticipantDetails(participant){

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantDetailsBtn').classList.add('active');
    mainContent.innerHTML = render(participant);
    changeParticipantDetail()

}
export function render(participant) {
    let template;
    if (!participant) {
        template=` 
        <div class="container">
            <div id="root">
            Please select a participant first!
            </div>
        </div>
         `
    } else {
        let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
        template += `
            <div class="container">
                <div id="root">
                    <div class="alert alert-light" role="alert">`
        headerImportantColumns.forEach(x => template += `<span><b>
                ${conceptIdMapping[x] && conceptIdMapping[x] != 'Years in Connect' ? 
                conceptIdMapping[x]['Variable Label'] || conceptIdMapping[x]['Variable Name'] 
                : 
                getYearsInConnect(participant)}
                </b></span> : ${participant[x] !== undefined ?  participant[x] : ""} &nbsp;`)
        
        template += `</div><form><table class="table"> <h4 style="text-align: center;"> Participant Details </h4><tbody>`
       
        template += ` <div class="modal fade" id="modalShowMoreData" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content sub-div-shadow">
                    <div class="modal-header" id="modalHeader"></div>
                    <div class="modal-body" id="modalBody"></div>
                </div>
            </div>
        </div>`

        importantColumns.forEach(x => template += `<tr ><th scope="row"><div class="mb-3"><label class="form-label">
            ${conceptIdMapping[x] && conceptIdMapping[x] ? conceptIdMapping[x]['Variable Label'] || conceptIdMapping[x]['Variable Name'] : x}</label></div></th>
            <td>${participant[x] !== undefined ?  participant[x] : ""}</td> <td> <a class="showMore" data-toggle="modal" data-target="#modalShowMoreData" 
            data-participantkey=${conceptIdMapping[x] && conceptIdMapping[x] ? conceptIdMapping[x]['Variable Label'] || conceptIdMapping[x]['Variable Name'] : x}
            data-participantValue=${participant[x]} name="modalParticipantData" ><button type="button" class="btn btn-primary">Edit</button></a></td></tr>&nbsp;`) 
        

            template += `</tbody></table>
                    <table class="table">
                                <h4 style="text-align: center;"> Alternate Contact Details &nbsp; <button type="button" class="btn btn-primary">Edit</button> </h4>
                                    <thead>
                                        <tr>
                                        <th scope="col">Contact Name</th>
                                        <th scope="col">Relationship</th>
                                        <th scope="col">Phone Number</th>
                                        <th scope="col">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <th scope="row">1</th>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        </tr>
                                        <tr>
                                        <th scope="row">2</th>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        </tr>
                                        <tr>
                                        <th scope="row">3</th>
                                        <td colspan="2"></td>
                                        <td></td>
                                        </tr>
                                    </tbody>
                                    </table>
                                    <div style="display:inline-block;">
                                        <button type="button" class="btn btn-primary">Save</button>
                                        <button type="button" class="btn btn-danger">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
        `;
        
    }
    return template;
}

function changeParticipantDetail(){
    const timeStamp = getCurrentTimeStamp()
    const a = Array.from(document.getElementsByClassName('showMore'))
    if (a) {
        a.forEach(element => {
            const values = element
            let data = getDataAttributes(values)
            element.addEventListener('click', () => {
                const header = document.getElementById('modalHeader');
                const body = document.getElementById('modalBody');
                header.innerHTML = `<h5>${data.participantkey}</h5><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
                let template = '<div>'
                template += `
                <form id="formResponse" method="post">
                    <ul>
                        <li id="currentValue"><span><strong>Current value</span></strong> :  <span>${data.participantvalue}</span></li>
                        <li id="newValues"><span><strong>New value</span></strong> :  <input required type="text" name="newValue" id="newValue"></li>
                        <li id="timeStamp"><span><strong>Time stamp</span></strong> :  <span>${timeStamp}</span></li>
                        <li id="comment"><span><strong>Comment</span></strong> :  <input required type="text" name="comment" id="comment"></li>
                        <li id="userId><span><strong>User ID</span></strong> :  <span>${timeStamp}</span></li>
                    </ul>
                    <div style="display:inline-block;">
                        <button type="submit" class="btn btn-primary">Submit</button>
                        <button type="button" class="btn btn-danger">Cancel</button>
                    </div>
                </form>
               </div>`
               debugger
               
                body.innerHTML = template;
                saveResponses()
                // create a function taht listens to form event
            });


        })
    }
    else {

    }
}

function saveResponses() {
    const a = document.getElementById('formResponse')
    a.addEventListener('submit', e => {
        e.preventDefault()
        console.log(document.getElementById('currentValue').value)
        console.log(document.getElementById('newValue').value)
        // API
    })
}
    


    // if (a) {
    //     a.addEventListener('click', () => {
    //                 console.log("text", text)
    //                 // let temp = document.createElement("div")
    //                 // temp.innerHTML = text
    //                 // console.log("conceptId", temp)
    //                 const header = document.getElementById('modalHeader');
    //                 const body = document.getElementById('modalBody');
    //                 header.innerHTML = `<h5>Test</h5><button type="button" class="modal-close-btn" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
    //                 let template = '<div>'
    //                 template += `
    //                     <ul>
    //                         <li><span><strong>Current value</span></strong> :  <span>${text}</span></li>
    //                         <li><span><strong>New value</span></strong> :  <input required type="text" name="newValue" id="newValue"></li>
    //                         <li><span><strong>Time stamp</span></strong> :  <span>${currentDate.getTime()}</span></li>
    //                         <li><span><strong>Comment</span></strong> :  <input required type="text" name="comment" id="comment"></li>
    //                         <li><span><strong>User ID</span></strong> :  <span>${currentDate.getTime()}</span></li>
    //                     </ul>
    //                     </div>`
    //                 body.innerHTML = template;
             
    //     });
    // }
    // else {
    //     console.log("test123", a)
    // }

    
    // mainContent.innerHTML = template;




function getDataAttributes(el) {
    var data = {};
    [].forEach.call(el.attributes, function(attr) {
        if (/^data-/.test(attr.name)) {
            var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
            data[camelCaseName] = attr.value;
        }
    });
    return data;
}

function getCurrentTimeStamp() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDayOfMonth = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    const currentMillisecond = currentDate.getMilliseconds();
    const timeStamp = currentYear + "-" + (currentMonth + 1)  + "-" + currentDayOfMonth + "T" 
                        + currentHour + ":" + currentMinute + ":" + currentSecond + ":" + currentMillisecond;
    
    return timeStamp;
}

function getYearsInConnect(participant) {
    let timeProfileSubmitted = participant[fieldMapping.timeProfileSubmitted]
    let submittedYear = String(timeProfileSubmitted)
    submittedYear = submittedYear.split("-")
    submittedYear = parseInt(submittedYear[0])
    const currentTime = getCurrentTimeStamp()
    let currentYear = currentTime.split("-")
    currentYear = parseInt(currentYear[0])
    let totalYears =  currentYear - submittedYear
    totalYears === 0 ? totalYears ='< 1' : totalYears
    let yearsInConnect = `Year(s) in connect: ${totalYears}`
    return yearsInConnect;
}