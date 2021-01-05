import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import fieldMapping from './fieldToConceptIdMapping.js'; 

export const headerImportantColumns = ['Connect_ID', fieldMapping.fName, fieldMapping.birthYear, fieldMapping.consentDate]

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

    console.log('participant', participant)
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
        console.log('conceptIdMapping', conceptIdMapping)
        template += `
            <div class="container">
                <div id="root">
                    <div class="alert alert-light" role="alert">`
        headerImportantColumns.forEach(x => template += `<span><b>${conceptIdMapping[x] && conceptIdMapping[x] ? conceptIdMapping[x]['Variable Label']
        || conceptIdMapping[x]['Variable Name'] : x}</b></span> : ${participant[x]} &nbsp;`)
        
        template += `</div><form><table class="table"> <h4 style="text-align: center;"> Participant Details </h4><tbody>`
       
        importantColumns.forEach(x => template += `<tr><th scope="row"><div class="mb-3"><label class="form-label">
            ${conceptIdMapping[x] && conceptIdMapping[x] ? conceptIdMapping[x]['Variable Label'] || conceptIdMapping[x]['Variable Name'] : x}</label></div></th>
            <td>${participant[x] !== undefined ?  participant[x] : ""}</td> <td> <a id="showMore" ><button type="button" class="btn btn-primary">Edit</button></a></td></tr>&nbsp;`)
          
        template += `</tbody></table>
                    <table class="table">
                                <h4 style="text-align: center;"> Alternate Contact Details &nbsp; <button type="button" id="showMore" class="btn btn-primary">Edit</button> </h4>
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
                                        <button type="button"  id="showMore" class="btn btn-primary">Save</button>
                                        <button type="button"  id="showMore"class="btn btn-danger">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
        `;
        
    }
    return template;
}

export function changeParticipantDetail(){
    console.log("123456")
    const a = document.getElementById('showMore')
    if (a) {
        a.addEventListener('click', click_handler1);
    }
    else {
        console.log("test123", a)
    }
    // console.log("conceptId", conceptId)
    // console.log("particpantDetail", particpantDetail)
    // template = '';

    // template += `
    //     <div class="modal" tabindex="-1">
    //         <div class="modal-dialog">
    //             <div class="modal-content">
    //             <div class="modal-header">
    //                 <h5 class="modal-title">Modal title</h5>
    //                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    //             </div>
    //             <div class="modal-body">
    //                 <p>Modal body text goes here.</p>
    //             </div>
    //             <div class="modal-footer">
    //                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    //                 <button type="button" class="btn btn-primary">Save changes</button>
    //             </div>
    //             </div>
    //         </div>
    //     </div>`
    
    // mainContent.innerHTML = template;
}

function click_handler1() { 
    console.log("conceptId")
    alert("hello")
 }
