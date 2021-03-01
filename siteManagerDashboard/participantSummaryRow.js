import { humanReadableMDY } from './utils.js';
import fieldMapping from './fieldToConceptIdMapping.js';


export const userProfile = (participant) => {
    let template = ``;
    !participant ?
    (template += `
        <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
        <td>Enrollment</td>
        <td>N/A</td>
        <td>User Profile</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
    `)
    :
    (participant[fieldMapping.userProfileFlag] === (fieldMapping.yes) ?

    ( template += `
        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
        <td>Enrollment</td>
        <td>N/A</td>
        <td>User Profile</td>
        <td>Submitted</td>
        <td>${humanReadableMDY(participant[fieldMapping.userProfileDateTime])}</td>
        <td>N/A</td>
        <td>N</td>
        <td>N/A</td>
    ` ) :
    ( 
        template += `
        <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
        <td>Enrollment</td>
        <td>N/A</td>
        <td>User Profile</td>
        <td>Not Submitted</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
    `)
    )

    return template;
}


export const verificationStatus = (participant) => {
    let template = ``;

    !participant ?
    (template += `
        <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
        <td>Enrollment</td>
        <td>N/A</td>
        <td>Verification</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>N/A</td>
    `)
    : (
    (participant[fieldMapping.verifiedFlag] === fieldMapping.verified) ?
            (template += `
            <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
            <td>Enrollment</td>
            <td>N/A</td>
            <td>Verification Status</td>
            <td>Verified</td>
            <td>${humanReadableMDY(participant[fieldMapping.verficationDate])}</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N/A</td>
            `)
    :
    (participant[fieldMapping.verifiedFlag] === fieldMapping.cannotBeVerified) ?
        ( template += `
            <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
            <td>Enrollment</td>
            <td>N/A</td>
            <td>Verification Status</td>
            <td>Cann't Be Verified</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N/A</td>
        ` ) :
    (participant[fieldMapping.verifiedFlag] === fieldMapping.notYetVerified) ?
        ( template += `
            <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
            <td>Enrollment</td>
            <td>N/A</td>
            <td>Verification Status</td>
            <td>Not Yet Verified</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N</td>
            <td>N/A</td>
        ` ) :
    (participant[fieldMapping.verifiedFlag] === fieldMapping.duplicate) ?
        ( template += `
            <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
            <td>Enrollment</td>
            <td>N/A</td>
            <td>Verification Status</td>
            <td>Duplicate</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N</td>
            <td>N/A</td>
        ` ) :
        ( template += `
            <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
            <td>Enrollment</td>
            <td>N/A</td>
            <td>Verification Status</td>
            <td>Outreach Timed Out</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N</td>
            <td>N/A</td>
    ` ) 
    )

    return template;
}

export const baselineSurvey = (participantModule, surveyName) => {
    let template = ``;

    !participantModule ?  
    (
        template += `
        <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
        <td>Baseline</td>
        <td>Survey</td>
        <td>${surveyName}</td>
        <td>Not Started</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>Y</td>
        <td>N/A</td>
        `
    ) :
    ( participantModule && !participantModule.COMPLETED) ?
    ( template += `
        <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
        <td>Baseline</td>
        <td>Survey</td>
        <td>${surveyName}</td>
        <td>Started</td>
        <td>${humanReadableMDY(participantModule.START_TS)}</td>
        <td>N/A</td>
        <td>N</td>
        <td>N/A</td>
    ` ) : 
    ( participantModule && participantModule.COMPLETED) ?
    ( template += `
        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
        <td>Baseline</td>
        <td>Survey</td>
        <td>${surveyName}</td>
        <td>${participantModule.SOCIALSECUR1 ? ((participantModule.SOCIALSECUR1).length <= 4 ? '4' : '9') : 'Submitted'}</td>
        <td>${humanReadableMDY(participantModule.COMPLETED_TS)}</td>
        <td>N/A</td>
        <td>N</td>
        <td>N/A</td>
    ` ) :
    ''
    return template;
}


export const baselineBloodSample = (participantModule) => {

    let template = ``;
    !participantModule[fieldMapping.bloodFlag] ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Sample</td>
                    <td>Blood</td>
                    <td>Not Collected</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
    ) : 
    participantModule[fieldMapping.refusedBlood] === (fieldMapping.yes) ?
        (
            template += `
                <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                <td>Baseline</td>
                <td>Sample</td>
                <td>Blood</td>
                <td>Not Collected</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>Y</td>
                <td>N/A</td>`
        )
    :   
    (
        ( participantModule[fieldMapping.bloodFlag] === (fieldMapping.yes)) ?
            template += `
                        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                        <td>Baseline</td>
                        <td>Sample</td>
                        <td>Blood</td>
                        <td>Collected</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.bloodDateTime])}</td>
                        <td>${biospecimenStatus(participantModule)}</td>
                        <td>N</td>
                        <td>N/A</td>`
            : (
                template += `
                        <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                        <td>Baseline</td>
                        <td>Sample</td>
                        <td>Blood</td>
                        <td>Not Collected</td>
                        <td>N/A</td>
                        <td>${biospecimenStatus(participantModule)}</td>
                        <td>N</td>
                        <td>N/A</td>`
            )
    )
    return template;

}

export const baselineUrineSample = (participantModule) => {
    let template = ``;
    !participantModule[fieldMapping.urineFlag] ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Sample</td>
                    <td>Urine</td>
                    <td>Not Collected</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
    ) : 
    participantModule[fieldMapping.refusedUrine] === (fieldMapping.yes) ?
    (
        template += `
            <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
            <td>Baseline</td>
            <td>Sample</td>
            <td>Urine</td>
            <td>Not Collected</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>Y</td>
            <td>N/A</td>`
    ) :
    (
        ( participantModule[fieldMapping.urineFlag] === (fieldMapping.yes)) ?
            template += `
                        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                        <td>Baseline</td>
                        <td>Sample</td>
                        <td>Urine</td>
                        <td>Collected</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.urineDateTime])}</td>
                        <td>${biospecimenStatus(participantModule)}</td>
                        <td>N</td>
                        <td>N/A</td>`
            : (
                template += `
                        <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                        <td>Baseline</td>
                        <td>Sample</td>
                        <td>Urine</td>
                        <td>Not Collected</td>
                        <td>N/A</td>
                        <td>${biospecimenStatus(participantModule)}</td>
                        <td>N</td>
                        <td>N/A</td>`
            )
    )
    return template;

}


export const baselineMouthwashSample = (participantModule) => {
    let template = ``;
    !participantModule[fieldMapping.mouthwash] ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Sample</td>
                    <td>Mouthwash</td>
                    <td>Not Collected</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
    ) : 
    participantModule[fieldMapping.refusedMouthwash] === (fieldMapping.yes) ?
    (
        template += `
            <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
            <td>Baseline</td>
            <td>Sample</td>
            <td>Mouthwash</td>
            <td>Not Collected</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>Y</td>
            <td>N/A</td>`
    ) :
    (
        ( participantModule[fieldMapping.mouthwash] === (fieldMapping.yes)) ?
            template += `
                        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                        <td>Baseline</td>
                        <td>Sample</td>
                        <td>Mouthwash</td>
                        <td>Collected</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.mouthwashDateTime])}</td>
                        <td>${biospecimenStatusMouthwash(participantModule)}</td>
                        <td>N</td>
                        <td>Kit Sent</td>`
            : (
                template += `
                        <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                        <td>Baseline</td>
                        <td>Sample</td>
                        <td>Mouthwash</td>
                        <td>Not Collected</td>
                        <td>N/A</td>
                        <td>${biospecimenStatusMouthwash(participantModule)}</td>
                        <td>N</td>
                        <td>Kit Sent</td>`
            )
    )
    return template;
}

export const baselineBOHSurvey = (participantModule, surveyName) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>Y</td>
                    <td>N/A</td>`
    ) :
    (
        (participantModule[fieldMapping.bohStatusFlag] === fieldMapping.submitted) ?
        (
            template += `
                        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td> 
                        <td>${surveyName}</td>
                        <td>Completed</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.bohCompletedDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`

        ) :
        (participantModule[fieldMapping.bohStatusFlag] === fieldMapping.started) ?
        (
            template += `
                        <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td>
                        <td>${surveyName}</td>
                        <td>Started</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.bohStartDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`
        ) : 
        ( template += `
                    <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>Not Started</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
        ))
    return template;
    
}


export const baselineMRESurvey = (participantModule, surveyName) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>Y</td>
                    <td>N/A</td>`
    ) :
    (
        (participantModule[fieldMapping.mreStatusFlag] === fieldMapping.submitted) ?
        (
            template += `
                        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td> 
                        <td>${surveyName}</td>
                        <td>Completed</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.mreCompletedDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`

        ) :
        (participantModule[fieldMapping.mreStatusFlag] === fieldMapping.started) ?
        (
            template += `
                        <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td>
                        <td>${surveyName}</td>
                        <td>Started</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.mreStartDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`
        ) : 
        ( template += `
                    <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>Not Started</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
        ))
    return template;
    
}

export const baselineSASSurvey = (participantModule, surveyName) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>Y</td>
                    <td>N/A</td>`
    ) :
    (
        (participantModule[fieldMapping.sasStatusFlag] === fieldMapping.submitted) ?
        (
            template += `
                        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td> 
                        <td>${surveyName}</td>
                        <td>Completed</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.sasCompletedDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`

        ) :
        (participantModule[fieldMapping.sasStatusFlag] === fieldMapping.started) ?
        (
            template += `
                        <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td>
                        <td>${surveyName}</td>
                        <td>Started</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.sasStartDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`
        ) : 
        ( template += `
                    <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>Not Started</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
        ))
    return template;
    
}

export const baselineLAWSurvey = (participantModule, surveyName) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>Y</td>
                    <td>N/A</td>`
    ) :
    (
        (participantModule[fieldMapping.lawStausFlag] === fieldMapping.submitted) ?
        (
            template += `
                        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td> 
                        <td>${surveyName}</td>
                        <td>Completed</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.lawCompletedDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`

        ) :
        (participantModule[fieldMapping.lawStausFlag] === fieldMapping.started) ?
        (
            template += `
                        <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td>
                        <td>${surveyName}</td>
                        <td>Started</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.lawStartDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`
        ) : 
        ( template += `
                    <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>${surveyName}</td>
                    <td>Not Started</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
        ))
    return template;
    
}
export const baselineSSN = (participantModule) => {
        let template = ``;
        !participantModule ?  
        (
        template += `
                <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                <td>Baseline</td>
                <td>Survey</td>
                <td>SSN</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N</td>
                <td>N/A*</td>`
        ) : 
        (
            (participantModule[fieldMapping.ssnFullflag]) ?
            (
            template += `
                <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                <td>Baseline</td>
                <td>Survey</td>
                <td>SSN</td>
                <td>9 digits</td>
                <td>${humanReadableMDY(participantModule[fieldMapping.ssnFulldate])}</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>`

            ) : 
            ( template += `
                <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                <td>Baseline</td>
                <td>Survey</td>
                <td>SSN</td>
                <td>4 digits</td>
                <td>${humanReadableMDY(participantModule[fieldMapping.ssnPartialDate])}</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>`
            ))
    return template;
}

export const baselineBloodUrineSurvey = (participantModule) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>Blood/Urine</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A*</td>`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                <td>Baseline</td>
                <td>Survey</td>
                <td>Blood/Urine</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>Y</td>
                <td>N/A</td>`
    ) :
    (
        (participantModule[fieldMapping.bloodUrineSurveyFlag] === fieldMapping.submitted) ?
        (
            template += `
                        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td>
                        <td>Blood/Urine</td>
                        <td>Completed</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.bloodUrineSurveyCompletedDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`

        ) :
        (participantModule[fieldMapping.bloodUrineSurveyFlag] === fieldMapping.started) ?
        (
            template += `
                        <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td>
                        <td>Blood/Urine</td>
                        <td>Started</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.bloodUrineSurveyStartedDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`
        ) : 
        ( template += `
                    <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>Blood/Urine</td>
                    <td>Not Started</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
        ))
    return template;
    
}

export const baselineMouthwashSurvey = (participantModule) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>Mouthwash</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                <td>Baseline</td>
                <td>Survey</td>
                <td>Mouthwash</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>Y</td>
                <td>N/A</td>`
    ) :
    (
        (participantModule[fieldMapping.mouthwashSurveyFlag] === fieldMapping.submitted) ?
        (
            template += `
                        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td>
                        <td>Mouthwash</td>
                        <td>Completed</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.mouthwashSurveyCompletedDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`

        ) :
        (participantModule[fieldMapping.mouthwashSurveyFlag] === fieldMapping.started) ?
        (
            template += `
                        <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
                        <td>Baseline</td>
                        <td>Survey</td>
                        <td>Mouthwash</td>
                        <td>Started</td>
                        <td>${humanReadableMDY(participantModule[fieldMapping.mouthwashSurveyStartedDate])}</td>
                        <td>N/A</td>
                        <td>N</td>
                        <td>N/A</td>`
        ) : 
        ( template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Survey</td>
                    <td>Mouthwash</td>
                    <td>Not Started</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
        )
    )
    return template;
    
}

export const baselineEMR = (participantModule) => {
    let template = ``;
    !(participantModule) ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>EMR</td>
                    <td>N/A</td>
                    <td>Not Pushed</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>`
    ) : 
    (participantModule[fieldMapping.baselineEMRflag]) === (fieldMapping.yes) ?  
    (
        template += `
                    <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                    <td>Baseline</td>
                    <td>EMR</td>
                    <td>N/A</td>
                    <td>Pushed</td>
                    <td>${humanReadableMDY(participantModule[fieldMapping.baselineEMRpushDate])}</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>`
    ) : (
        template += `
                <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                <td>Baseline</td>
                <td>EMR</td>
                <td>N/A</td>
                <td>Not Pushed</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>`
    )
    return template;
}



export const baselinePayment = (participantModule) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Payment</td>f
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>N</td>
                    <td>N/A</td>`
    ) : 
    participantModule[fieldMapping.refusedBaselinePayment] === (fieldMapping.yes) ?
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Payment</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>${humanReadableMDY(participantModule[fieldMapping.refusedBaselinePaymentDate])}</td>
                    <td>N/A</td>
                    <td>Y</td>
                    <td>N/A</td>`
    )
    :
    participantModule[fieldMapping.baslinePayment] === (fieldMapping.yes) ?
    (
        template += `
            <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
            <td>Baseline</td>
            <td>Payment</td>
            <td>N/A</td>
            <td>Issued</td>
            <td>${humanReadableMDY(participantModule[fieldMapping.baselinePaymentDate])}</td>
            <td>N/A</td>
            <td>N</td>
            <td>N/A</td>`
    ) :
    (
        template += `

            <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
            <td>Baseline</td>
            <td>Payment</td>
            <td>N/A</td>
            <td>Not Issued</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>N</td>
            <td>N/A</td>`
    )
    return template;
}

const biospecimenStatus = (part) => {
    let template = ``;
    !(part) ?  
    (
        template += `N/A`
    ) : 
    (
        (part[fieldMapping.biospecimenFlag]) === (fieldMapping.biospecimenResearch) ?  
        (   
            template += `Research`
        ) : 
        (part[fieldMapping.biospecimenFlag]) === (fieldMapping.biospecimenClinical) ?
        (
            template += `Clinical`
        ) : (
            template += `Home`
        )
    )   
    return template;
}

const biospecimenStatusMouthwash = (part) => {
    let template = ``;
    !(part) ?  
    (
        template += `N/A`
    ) : 
    (
        (part[fieldMapping.biospecimenFlag]) === (fieldMapping.biospecimenClinical) ?
        (
            template += `Clinical`
        ) : (
            template += `Home`
        )
    )   
    return template;
}