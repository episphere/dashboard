import {renderNavBarLinks, dashboardNavBarLinks, renderLogin, removeActiveClass} from './navigationBar.js';
import { renderParticipantHeader } from './participantHeader.js';
import fieldMapping from './fieldToConceptIdMapping.js';
import { humanReadableMDY } from './utils.js';

export function renderParticipantSummary(participant){

    document.getElementById('navBarLinks').innerHTML = dashboardNavBarLinks();
    removeActiveClass('nav-link', 'active');
    document.getElementById('participantSummaryBtn').classList.add('active');
    if (participant !== null) {
        mainContent.innerHTML = render(participant);
      //  downloadCopyHandler(participant)
    }
}


export function render(participant) {
    let template = `<div class="container">`
    if (!participant) {
        template +=` 
            <div id="root">
            Please select a participant first!
            </div>
        </div>
         `
    } else {
        console.log('participantSummaryBtn', participant)
        let conceptIdMapping = JSON.parse(localStorage.getItem('conceptIdMapping'));
        console.log("conceptIdMapping", conceptIdMapping)
        template += `
                <div id="root"> `
        template += renderParticipantHeader(participant);
        template += `<div class="table-responsive">
                        <h4>Baseline activity summary</h4>
                        <table class="table table-borderless">
                        <thead>
                            <tr>
                            <th scope="col">Consent</th>
                            <th scope="col">Modules</th>
                            <th scope="col">SSN</th>
                            <th scope="col">Biospecimen Collection</th>
                            <th scope="col">Incentive</th>
                            <th scope="col">EMR Push</th>
                            <th scope="col">Surveys</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>
                                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr;  grid-gap: 20px;">
                                    <div class="grid-child">
                                        ${consentHandler(participant)}   
                                    </div>
                                    <div class="grid-child">
                                        ${verifiedHandler(participant)} 
                                    </div>
                                    <div class="grid-child">
                                        ${hipaaHandler(participant)} 
                                </div>
                              </div>
                            </td>
                            <td>
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr;  grid-gap: 20px;">
                                <div class="grid-child">
                                    ${moduleHandler(participant.Module1, 1)}   
                                </div>
                                <div class="grid-child">
                                    ${moduleHandler(participant.Module2, 2)} 
                                </div>
                                <div class="grid-child">
                                    ${moduleHandler(participant.Module3, 3)} 
                                </div>
                                <div class="grid-child">
                                    ${moduleHandler(participant.Module4, 4)} 
                                </div>
                            </div>
                            </td>
                            <td>
                                <div>
                                    ${ssnHandler(participant)} 
                                </div>
                            </td>
                            <td>
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr;  grid-gap: 20px;">
                            <div class="grid-child">
                                ${baselineBloodHandler(participant)}   
                            </div>
                            <div class="grid-child">
                                ${baselineMouthwashHandler(participant)} 
                            </div>
                            <div class="grid-child">
                                ${baselineUrineHandler(participant)} 
                            </div>
                        </div>
                            </td>
                            <td>${baselineIncentiveHandler(participant)}</td>
                            <td>${baselineEMRPushHandler(participant)}</td>
                            <td>
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr;  grid-gap: 20px;">
                                <div class="grid-child">
                                    ${baselineSurvey1(participant)}   
                                </div>
                                <div class="grid-child">
                                    ${baselineSurvey2(participant)} 
                                </div>
                                <div class="grid-child">
                                    ${baselineSurvey3(participant)} 
                                </div>
                            </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>`

   

                    let users = [];
                    let incentiveElgible1 = { dateBaselineIncentiveEligible: true, dateRefusedFlag: true,
                        dateRefused: '2/3/2021',  dateIssuedFlag: true, dateIssued:'11/1/2020', source: 'NORC',
                        baselineMouthwash: [ {refusedActivity: false, kitSent: true, method: 'Home Collection', questionnaire: 'No' },
                                              {refusedActivity: false, kitSent: false, method: 'Research Collection', questionnaire: 'Yes' }],
                        baselineUrine: [ {refusedActivity: false, kitSent: false, method: 'Clinical Collection', questionnaire: 'Yes' }],
                        baselineBlood: [ {refusedActivity: false, method: 'Research Collection', questionnaire: 'Yes' },
                                {refusedActivity: false, method: 'Research Collection', questionnaire: 'Yes' },
                                {refusedActivity: false, method: 'Home Collection', questionnaire: 'No' },
                                ]
                    
                    };
                    users.push(incentiveElgible1);

                    localStorage.setItem("users", JSON.stringify(users));
                    let incentiveElgible2 = { dateBaselineIncentiveEligible: true, dateRefusedFlag: false,  
                        dateIssuedFlag: true, dateIssued:'08/10/2020', source: 'NORC',
                        baselineMouthwash: [ {refusedActivity: false, kitSent: true, method: 'Home Collection', Questionnaire: 'No' }],
                        baselineUrine: [ {refusedActivity: false, kitSent: false, method: 'Clinical Collection', questionnaire: 'Yes' },
                                    {refusedActivity: false, kitSent: false, method: 'Clinical Collection', questionnaire: 'Yes' }],
                        baselineBlood: [ {refusedActivity: false, method: 'Research Collection', questionnaire: 'Yes' },
                                    {refusedActivity: false, method: 'Research Collection', questionnaire: 'Yes' },
                                    {refusedActivity: false, method: 'Home Collection', questionnaire: 'No' },
                                    ]
                      };
                    users.push(incentiveElgible2);

                    localStorage.setItem("users", JSON.stringify(users));
                    let incentiveResult = JSON.parse(localStorage.getItem("users"));
                   
        // template += summaryTable(participant, incentiveResult);
        template +=`</div></div>`

    }
    return template;


}

function consentHandler(participant) {
    
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    participant[fieldMapping.consentFlag] ?
    ( template += `<span>Consent</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <span>${participant[fieldMapping.consentDate] && humanReadableMDY(participant[fieldMapping.consentDate])}</span>
        </div>
    ` ) : 
    (
        template += `<span>Consent</span>
        <br />
        <i class="fa fa-times style="color: red; font-size: 15px;"></i>
        <span>${participant[fieldMapping.consentDate] && humanReadableMDY(participant[fieldMapping.consentDate])}</span>
        </div>`
    )
    return template;

}

function verifiedHandler(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    participant[fieldMapping.verifiedFlag] ?
    ( template += `<span>Verified</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <br />
        <span>${participant[fieldMapping.verficationDate] && humanReadableMDY(participant[fieldMapping.verficationDate])}</span>
        </div>
    ` ) : 
    (
        template += `<span>Verified</span>
        <br />
        <i class="fa fa-times" style="color: red; font-size: 15px;"></i>
        </div>`
    )
    return template;
}

function hipaaHandler(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    participant[fieldMapping.hipaaFlag] ?
    ( template += `<span>Verified</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <br />
        <span>${participant[fieldMapping.verficationDate] && humanReadableMDY(participant[fieldMapping.verficationDate])}</span>
        </div>
    ` ) : 
    (
        template += `<span>HIPAA authorization</span>
        <br />
        <i class="fa fa-times" style="color: red; font-size: 11px;"></i>
        </div>`
    )
    return template;
}


function moduleHandler(participantModule, module) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;

    !participantModule ?  
    (
        template += `<span>Module ${module}</span>
        <br />
        <i class="fa fa-times" style="color: red; font-size: 15px;"></i>
        </div>`
    ) :
    ( participantModule && !participantModule.COMPLETED) ?
    ( template += `<span>Module ${module}</span>
        <br />
        <i class="fa fa-circle" style="color: orange; font-size: 15px;"></i>
        <br />
        <span>In Progress</span>
        </div>
    ` ) : 
    ( participantModule && participantModule.COMPLETED) ?
    ( template += `<span>Module ${module}</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <br />
        <span>${humanReadableMDY(participantModule.COMPLETED_TS)}</span>
        </div>
    ` ) :
    ''
    return template;
}

function ssnHandler(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant.ModuleSsn && 
    participant.ModuleSsn.COMPLETED ?
    ( template += `<span>SSN Entered</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <span>${humanReadableMDY(participant.ModuleSsn.COMPLETED_TS)}</span>
        </div>
    ` ) : 
    (
        template += `<span>SSN Entered</span>
        <br />
        <i class="fa fa-times" style="color: red; font-size: 15px;"></i>
        </div>`
    )
    return template;
}

function baselineBloodHandler(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    participant[fieldMapping.blood] ?
    ( template += `<span>Baseline Blood</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <span>${participant.BLOOD_URINE && humanReadableMDY(participant[fieldMapping.bloodDateTime])}</span>
        </div>
    ` ) : 
    (
        template += `<span>Baseline Blood</span>
        <br />
        <i class="fa fa-times" style="color: red; font-size: 15px;"></i>
        </div>`
    )
    return template;
}

function baselineUrineHandler(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    participant[fieldMapping.urine] ?
    ( template += `<span>Baseline Urine</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <span>${participant.BLOOD_URINE && humanReadableMDY(participant[fieldMapping.urineDateTime])}</span>
        </div>
    ` ) : 
    (
        template += `<span>Baseline Urine</span>
        <br />
        <i class="fa fa-times" style="color: red; font-size: 15px;"></i>
        </div>`
    )
    return template;
}

function baselineMouthwashHandler(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    participant[fieldMapping.mouthwash] ?
    ( template += `<span>Baseline Mouthwash</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <span>${participant.BLOOD_URINE && humanReadableMDY(participant[fieldMapping.mouthwashDateTime])}</span>
        </div>
    ` ) : 
    (
        template += `<span>Baseline Mouthwash</span>
        <br />
        <i class="fa fa-times" style="color: red; font-size: 15px;"></i>
        </div>`
    )
    return template;
}

function baselineIncentiveHandler(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    participant[fieldMapping.incentive] ?
    ( template += `<span>Baseline Mouthwash</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <span>${participant.BLOOD_URINE && humanReadableMDY(participant.BLOOD_URINE.BIOBUQ_SAMPLETIME_VLR0)}</span>
        </div>
    ` ) : 
    (
        template += `<span>Baseline Incentive</span>
        <br />
        <i class="fa fa-times" style="color: red; font-size: 15px;"></i>
        </div>`
    )
    return template;
}

function baselineEMRPushHandler(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    participant[fieldMapping.incentive] ?
    ( template += `<span>Baseline EMR Push</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <span>${participant.BLOOD_URINE && humanReadableMDY(participant.BLOOD_URINE.BIOBUQ_SAMPLETIME_VLR0)}</span>
        </div>
    ` ) : 
    (
        template += `<span>Baseline EMR Push</span>
        <br />
        <i class="fa fa-times" style="color: red; font-size: 15px;"></i>
        </div>`
    )
    return template;
}

function baselineSurvey1(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    ( template += `<span>Survey 1</span>
        <br />
        <i class="fa fa-check" style="color: green; font-size: 15px;"></i>
        <span>${participant.BLOOD_URINE && humanReadableMDY(participant.BLOOD_URINE.BIOBUQ_SAMPLETIME_VLR0)}</span>
        </div>
    ` ) 
    return template;
}

function baselineSurvey2(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    (
        template += `<span>Survey 2</span>
        <br />
        <i class="fa fa-times" style="color: red; font-size: 15px;"></i>
        </div>`
    )
    return template;
}

function baselineSurvey3(participant) {
    let template = `<div style="font-size: 10px; width: 65px; height: 75px; border: 1px solid;">`;
    participant && 
    (
        template += `<span>Survey 3</span>
        <br />
        <i class="fa fa-circle" style="color: orange; font-size: 15px;"></i>
        <br />
        <span>In Progress</span>
        </div>`
    )
    return template;
}

