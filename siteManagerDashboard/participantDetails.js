import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import fieldMapping from './fieldToConceptIdMapping.js'; 
export const headerImportantColumns = ['Connect_ID', fieldMapping.fName, fieldMapping.birthYear, 
    fieldMapping.consentDate ]
export const importantColumns = [fieldMapping.lName, fieldMapping.fName, fieldMapping.prefName, fieldMapping.mName, fieldMapping.birthMonth, fieldMapping.birthDay, fieldMapping.birthYear, 
    fieldMapping.homePhone, fieldMapping.cellPhone, fieldMapping.otherPhone, fieldMapping.prefEmail, fieldMapping.prefContact, fieldMapping.canWeText,
    fieldMapping.address1, fieldMapping.address2, fieldMapping.city, fieldMapping.state, fieldMapping.zip, 'Connect_ID'];


export function renderParticipantDetails(participant){

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantDetailsBtn').classList.add('active');
    mainContent.innerHTML = render(participant);

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
        template += `
            <div class="container">
                <div id="root">
                    <div class="alert alert-light" role="alert">`
        headerImportantColumns.forEach(x => template += `<span><b>${conceptIdMapping[x] && conceptIdMapping[x] ? conceptIdMapping[x]['Variable Label']
        || conceptIdMapping[x]['Variable Name'] : x}</b></span> : ${participant[x]} &nbsp;`)
        
        template += `</div><form><table class="table"> <h4 style="text-align: center;"> Participant Details </h4><tbody>`
       
        importantColumns.forEach(x => template += `<tr><th scope="row"><div class="mb-3"><label class="form-label">
            ${conceptIdMapping[x] && conceptIdMapping[x] ? conceptIdMapping[x]['Variable Label'] || conceptIdMapping[x]['Variable Name'] : x}</label></div></th> :
            <td>${participant[x]}</td> <td><button type="button" class="btn btn-primary">Edit</button></td></tr>&nbsp;`)

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
                                </form>
                            </div>
                        </div>
        `;
    }
    return template;
}
