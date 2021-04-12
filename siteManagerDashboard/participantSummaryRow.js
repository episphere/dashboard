import { humanReadableMDY } from './utils.js';
import fieldMapping from './fieldToConceptIdMapping.js';


export const userProfile = (participant) => {
    let template = ``;
    !participant ?
    (template += `
            ${getTemplateRow("fa fa-times fa-2x", "color: red", "Enrollment", "N/A", "User Profile", "N/A", "N/A", "N/A", "N/A", "N/A")}
    `)
    :
    (participant[fieldMapping.userProfileFlag] === (fieldMapping.yes) ?

    ( template += `
        ${getTemplateRow("fa fa-check fa-2x", "color: green", "Enrollment", "N/A", "User Profile", "Submitted", 
            humanReadableMDY(participant[fieldMapping.userProfileDateTime]), "N/A", "N", "N/A")}
    ` ) :
    ( 
        template += `
        ${getTemplateRow("fa fa-times fa-2x", "color: red", "Enrollment", "N/A", "User Profile", "Not Submitted", 
            "N/A", "N/A", "N/A", "N/A")}
    `)
    )

    return template;
}


export const verificationStatus = (participant) => {
    let template = ``;
    !participant ?
    (template += `
        ${getTemplateRow("fa fa-times fa-2x", "color: red", "Enrollment", "N/A", "Verification", "N/A", "N/A", "N/A", "N/A", "N/A")}
    `)
    : (
    (participant[fieldMapping.verifiedFlag] === fieldMapping.verified) ?
            (template += `
                ${getTemplateRow("fa fa-check fa-2x", "color: green", "Enrollment", "N/A", "Verification Status", "Verified", 
                humanReadableMDY(participant[fieldMapping.verficationDate]), "N/A", "N", "N/A")}
            `)
    :
    (participant[fieldMapping.verifiedFlag] === fieldMapping.cannotBeVerified) ?
        ( template += `
            ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Enrollment", "N/A", "Verification Status", "Can't be Verified", 
                "N/A", "N/A", "N", "N/A")}
        ` ) :
    (participant[fieldMapping.verifiedFlag] === fieldMapping.notYetVerified) ?
        ( template += `
            ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Enrollment", "N/A", "Verification Status", "Not yet Verified", 
                "N/A", "N/A", "N", "N/A")}
        ` ) :
    (participant[fieldMapping.verifiedFlag] === fieldMapping.duplicate) ?
        ( template += `
            ${getTemplateRow("fa fa-times fa-2x", "color: red", "Enrollment", "N/A", "Verification Status", "Duplicate", 
                    "N/A", "N/A", "N", "N/A")}
            ` ) :
        ( template += `
                ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Enrollment", "N/A", "Verification Status", "Outreach Timed Out", 
                "N/A", "N/A", "N", "N/A")}
    ` ) 
    )

    return template;
}

export const baselineBloodSample = (participantModule) => {

    let template = ``;
    !participantModule[fieldMapping.bloodFlag] ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Blood", "Not Collected", "N/A", "N/A", "N/A", "N/A")}
            `
    ) : 
    participantModule[fieldMapping.refusedBlood] === (fieldMapping.yes) ?
        (
            template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Blood", "Not Collected", "N/A", "N/A", "Y", "N/A")}
               `
        )
    :   
    (
        ( participantModule[fieldMapping.bloodFlag] === (fieldMapping.yes)) ?
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Sample", "Blood", "Collected", 
                        humanReadableMDY(participantModule[fieldMapping.bloodDateTime]), biospecimenStatus(participantModule), "N", "N/A")}`
            : (
                template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Blood", "Not Collected", "N/A", "N/A", "N", "N/A")}`
            )
    )
    return template;

}

export const baselineUrineSample = (participantModule) => {
    let template = ``;
    !participantModule[fieldMapping.urineFlag] ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Urine", "Not Collected", "N/A", "N/A", "N/A", "N/A")}`
    ) : 
    participantModule[fieldMapping.refusedUrine] === (fieldMapping.yes) ?
    (
        template += `
                 ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Urine", "Not Collected", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        ( participantModule[fieldMapping.urineFlag] === (fieldMapping.yes)) ?
            template += `
                ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Sample", "Urine", "Collected", 
                    humanReadableMDY(participantModule[fieldMapping.urineDateTime]), biospecimenStatus(participantModule), "N", "N/A")}`
            : (
                template += `
                        ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Urine", "Not Collected", "N/A", "N/A", "N", "N/A")}`
            )
    )
    return template;

}


export const baselineMouthwashSample = (participantModule) => {
    let template = ``;
    !participantModule[fieldMapping.mouthwash] ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Mouthwash", "Not Collected", "N/A", "N/A", "N/A", "N/A")}`
    ) : 
    participantModule[fieldMapping.refusedMouthwash] === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Mouthwash", "Not Collected", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        ( participantModule[fieldMapping.mouthwash] === (fieldMapping.yes)) ?
            template += `
            ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Sample", "Mouthwash", "Collected", 
                    humanReadableMDY(participantModule[fieldMapping.mouthwashDateTime]), biospecimenStatusMouthwash(participantModule), "N", "N/A")}`
            : (
                template += `
                        ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Mouthwash", "Not Collected", "N/A", "N/A", "N", "N/A")}`
            )
    )
    return template;
}

export const baselineBOHSurvey = (participantModule) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
            ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "BOH", "N/A", "N/A", "N/A", "N/A", "N/A")}`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
            ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "BOH", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        (participantModule[fieldMapping.bohStatusFlag] === fieldMapping.submitted) ?
        (
            template += `
                ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "BOH", "Completed",
                    humanReadableMDY(participantModule[fieldMapping.bohCompletedDate]), "N/A", "N", "N/A")}`

        ) :
        (participantModule[fieldMapping.bohStatusFlag] === fieldMapping.started) ?
        (
            template += `
                ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "BOH", "Started",
                    humanReadableMDY(participantModule[fieldMapping.bohStartDate]), "N/A", "N", "N/A")}`
        ) : 
        ( template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "BOH", "N/A", "N/A", "N/A", "N", "N/A")}`
        ))
    return template;
    
}


export const baselineMRESurvey = (participantModule) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "MRE", "N/A", "N/A", "N/A", "N/A", "N/A")}`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "MRE", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        (participantModule[fieldMapping.mreStatusFlag] === fieldMapping.submitted) ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "MRE", "Completed",
                    humanReadableMDY(participantModule[fieldMapping.mreCompletedDate]), "N/A", "N", "N/A")}`

        ) :
        (participantModule[fieldMapping.mreStatusFlag] === fieldMapping.started) ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "MRE", "Started",
                    humanReadableMDY(participantModule[fieldMapping.mreStartDate]), "N/A", "N", "N/A")}`
        ) : 
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "MRE", "N/A", "N/A", "N/A", "N", "N/A")}`
        ))
    return template;
    
}

export const baselineSASSurvey = (participantModule) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "SAS", "N/A", "N/A", "N/A", "N/A", "N/A")}`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "SAS", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        (participantModule[fieldMapping.sasStatusFlag] === fieldMapping.submitted)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "SAS", "Completed",
                    humanReadableMDY(participantModule[fieldMapping.sasCompletedDate]), "N/A", "N", "N/A")}`

        ) :
        (participantModule[fieldMapping.sasStatusFlag] === fieldMapping.started) ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "SAS", "Started",
                    humanReadableMDY(participantModule[fieldMapping.sasStartDate]), "N/A", "N", "N/A")}`
        ) : 
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "SAS", "N/A", "N/A", "N/A", "N", "N/A")}`
        ))
    return template;
    
}

export const baselineLAWSurvey = (participantModule) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "LAW", "N/A", "N/A", "N/A", "N/A", "N/A")}`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "LAW", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        (participantModule[fieldMapping.lawStausFlag] === fieldMapping.submitted)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "LAW", "Completed",
                    humanReadableMDY(participantModule[fieldMapping.lawCompletedDate]), "N/A", "N", "N/A")}`

        ) :
        (participantModule[fieldMapping.lawStausFlag] === fieldMapping.started)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "LAW", "Started",
                    humanReadableMDY(participantModule[fieldMapping.lawStartDate]), "N/A", "N", "N/A")}`
        ) : 
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "LAW", "N/A", "N/A", "N/A", "N", "N/A")}`
        ))
    return template;
    
    
}
export const baselineSSN = (participantModule) => {
        let template = ``;
        !participantModule ?  
        (
        template += `
            ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "SSN", "N/A", "N/A", "N/A", "N/A", "N/A")}`
        ) : 
        (
            (participantModule[fieldMapping.ssnFullflag]) ?
            (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "SSN", "9 digits", 
                    humanReadableMDY(participantModule[fieldMapping.ssnFulldate]), "N/A", "N/A", "N/A")}`
            ) : 
            ( template += `
                ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "SSN", "4 digits", 
                humanReadableMDY(participantModule[fieldMapping.ssnPartialDate]), "N/A", "N/A", "N/A")}`
            ))
    return template;
}

export const baselineBloodUrineSurvey = (participantModule) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Blood/Urine", "N/A", "N/A", "N/A", "N/A", "N/A")}`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Blood/Urine", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        (participantModule[fieldMapping.bloodUrineSurveyFlag] === fieldMapping.submitted)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "Blood/Urine", "Completed",
                    humanReadableMDY(participantModule[fieldMapping.bloodUrineSurveyCompletedDate]), "N/A", "N", "N/A")}`

        ) :
        (participantModule[fieldMapping.bloodUrineSurveyFlag] === fieldMapping.started)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "Blood/Urine", "Started",
                    humanReadableMDY(participantModule[fieldMapping.bloodUrineSurveyStartedDate]), "N/A", "N", "N/A")}`
        ) : 
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Blood/Urine", "N/A", "N/A", "N/A", "N", "N/A")}`
        ))
    return template;
    
}

export const baselineMouthwashSurvey = (participantModule) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Mouthwash", "N/A", "N/A", "N/A", "N/A", "N/A")}`
    ) : 
    participantModule[fieldMapping.refusedSurvey] === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Mouthwash", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        (participantModule[fieldMapping.mouthwashSurveyFlag] === fieldMapping.submitted)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "Mouthwash", "Completed",
                    humanReadableMDY(participantModule[fieldMapping.mouthwashSurveyCompletedDate]), "N/A", "N", "N/A")}`

        ) :
        (participantModule[fieldMapping.mouthwashSurveyFlag] === fieldMapping.started) ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "Mouthwash", "Started",
                    humanReadableMDY(participantModule[fieldMapping.mouthwashSurveyStartedDate]), "N/A", "N", "N/A")}`
        ) : 
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Mouthwash", "N/A", "N/A", "N/A", "N", "N/A")}`
        ))
    return template;
    
    
}


export const baselineEMR = (participantModule) => {
    let template = ``;
    !(participantModule) ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "EMR", "N/A", "Not Pushed", "N/A", "N/A", "N/A", "N/A")}`
    ) : 
    (participantModule[fieldMapping.baselineEMRflag]) === (fieldMapping.yes) ?  
    (
        template += `
                ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "EMR", "N/A","Pushed", 
                humanReadableMDY(participantModule[fieldMapping.baselineEMRpushDate]), "N/A", "N/A", "N/A")}`
    ) : (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "EMR", "N/A", "Not Pushed", "N/A", "N/A", "N/A", "N/A")}`
    )
    return template;
}



export const baselinePayment = (participantModule) => {
    let template = ``;
    !participantModule ?  
    (
        template += `
                 ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Payment", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A")}
                `
    ) : 
    participantModule[fieldMapping.refusedBaselinePayment] === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Payment", "N/A", "N/A", 
                humanReadableMDY(participantModule[fieldMapping.refusedBaselinePaymentDate]), "N/A", "Y", "N/A")}`
    )
    :
    participantModule[fieldMapping.baslinePayment] === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Payment", "N/A", "Issued", 
                humanReadableMDY(participantModule[fieldMapping.baselinePaymentDate]), "N/A", "N", "Eligible")}`
    ) :
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Payment", "N/A", "Not Issued", 
                "N/A", "N/A", "N", "Not Eligible")}`
    )
    return template;
}


const biospecimenStatus = (biospecimenRow) => {
    let template = ``;
    !(biospecimenRow) ?  
    (
        template += `N/A`
    ) : 
    (
        (biospecimenRow[fieldMapping.biospecimenFlag]) === (fieldMapping.biospecimenResearch) ?  
        (   
            template += `Research`
        ) : 
        (biospecimenRow[fieldMapping.biospecimenFlag]) === (fieldMapping.biospecimenClinical) ?
        (
            template += `Clinical`
        ) : (
            template += `Home`
        )
    )   
    return template;
}

const biospecimenStatusMouthwash = (biospecimenRow) => {
    let template = ``;
    !(biospecimenRow) ?  
    (
        template += `N/A`
    ) : 
    (
        (biospecimenRow[fieldMapping.biospecimenFlag]) === (fieldMapping.biospecimenClinical) ?
        (
            template += `Clinical`
        ) : (
            template += `Home`
        )
    )   
    return template;
}

const getTemplateRow = (faIcon, color, timeline, category, item, status, date, setting, refused, extra) => {
    let template = ``;
    template += 
    `
        <td><i class="${faIcon}" style="${color};"></i></td>
        <td>${timeline}</td>
        <td>${category}</td>
        <td>${item}</td>
        <td>${status}</td>
        <td>${date}</td>
        <td>${setting}</td>
        <td>${refused}</td>
        <td>${extra}</td>
    `
    return template;
}