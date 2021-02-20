import { humanReadableMDY } from './utils.js';
import fieldMapping from './fieldToConceptIdMapping.js';



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
        <td>Extra</td>
    ` ) :
    ''
    return template;
}


export const baselineBloodSample = (participantModule) => {
    let template = ``;
    !participantModule[fieldMapping.blood] ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Sample</td>
                    <td>Blood</td>
                    <td>Not Collected</td>
                    <td>N/A</td>
                    <td>Clinical***</td>
                    <td>Y/N</td>
                    <td>N/A</td>`
    ) : (
        template += `
                    <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                    <td>Baseline</td>
                    <td>Sample</td>
                    <td>Blood</td>
                    <td>Collected</td>
                    <td>${humanReadableMDY(participantModule[fieldMapping.bloodDateTime])}</td>
                    <td>Clinical***</td>
                    <td>Y/N</td>
                    <td>N/A</td>`
    )
    return template;

}

export const baselineUrineSample = (participantModule) => {
    let template = ``;
    !participantModule[fieldMapping.urine] ?  
    (
        template += `
                    <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
                    <td>Baseline</td>
                    <td>Sample</td>
                    <td>Urine</td>
                    <td>Not Collected</td>
                    <td>N/A</td>
                    <td>Clinical***</td>
                    <td>Y/N</td>
                    <td>N/A</td>`
    ) : (
        template += `
                    <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                    <td>Baseline</td>
                    <td>Sample</td>
                    <td>Urine</td>
                    <td>Collected</td>
                    <td>${humanReadableMDY(participant[fieldMapping.urineDateTime])}</td>
                    <td>Clinical***</td>
                    <td>Y/N</td>
                    <td>N/A</td>`
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
                    <td>Blood</td>
                    <td>Not Collected</td>
                    <td>N/A</td>
                    <td>Clinical***</td>
                    <td>Y/N</td>
                    <td>Kit Sent**</td>`
    ) : (
        template += `
                    <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
                    <td>Baseline</td>
                    <td>Sample</td>
                    <td>Blood</td>
                    <td>Collected</td>
                    <td>${humanReadableMDY(participant[fieldMapping.mouthwashDateTime])}</td>
                    <td>Clinical***</td>
                    <td>Y/N</td>
                    <td>Kit Sent**</td>`
    )
    return template;
}

export const baselineBloodUrineSurvey = (participantModule) => {
    let template = ``;
    !participantModule.BLOOD_URINE ?  
    (
        template += `
        <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
        <td>Baseline</td>
        <td>Survey</td>
        <td>Blood/Urine</td>
        <td>Not Started</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>Y</td>
        <td>N/A</td>
        `
    ) :
    ( participantModule.BLOOD_URINE && !participantModule.BLOOD_URINE.COMPLETED) ?
    ( template += `
        <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
        <td>Baseline</td>
        <td>Survey</td>
        <td>Blood/Urine</td>
        <td>Started</td>
        <td>${humanReadableMDY(participantModule.BLOOD_URINE.START_TS)}</td>
        <td>N/A</td>
        <td>N</td>
        <td>N/A</td>
    ` ) : 
    ( participantModule && participantModule.BLOOD_URINE.COMPLETED) ?
    ( template += `
        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
        <td>Baseline</td>
        <td>Survey</td>
        <td>Blood/Urine</td>
        <td>Submitted</td>
        <td>${humanReadableMDY(participantModule.BLOOD_URINE.COMPLETED_TS)}</td>
        <td>N/A</td>
        <td>N</td>
        <td>N/A</td>
    ` ) :
    ''
    return template;
}


export const biAnnualSurvey = (participantModule) => {
    let template = ``;
    !participantModule.BLOOD_URINE ?  
    (
        template += `
        <td><i class="fa fa-times fa-2x" style="color: red;"></i></td>
        <td>Baseline</td>
        <td>Survey</td>
        <td>Blood/Urine</td>
        <td>Not Started</td>
        <td>N/A</td>
        <td>N/A</td>
        <td>Y</td>
        <td>N/A</td>
        `
    ) :
    ( participantModule.BLOOD_URINE && !participantModule.BLOOD_URINE.COMPLETED) ?
    ( template += `
        <td><i class="fa fa-hashtag fa-2x" style="color: orange;"></i></td>
        <td>Baseline</td>
        <td>Survey</td>
        <td>Blood/Urine</td>
        <td>Started</td>
        <td>${humanReadableMDY(participantModule.BLOOD_URINE.START_TS)}</td>
        <td>N/A</td>
        <td>N</td>
        <td>N/A</td>
    ` ) : 
    ( participantModule && participantModule.BLOOD_URINE.COMPLETED) ?
    ( template += `
        <td><i class="fa fa-check fa-2x" style="color: green;"></i></td>
        <td>Baseline</td>
        <td>Survey</td>
        <td>Blood/Urine</td>
        <td>Submitted</td>
        <td>${humanReadableMDY(participantModule.BLOOD_URINE.COMPLETED_TS)}</td>
        <td>N/A</td>
        <td>N</td>
        <td>N/A</td>
    ` ) :
    ''
    return template;
}