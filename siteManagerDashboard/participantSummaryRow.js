import { humanReadableMDY } from './utils.js';
import fieldMapping from './fieldToConceptIdMapping.js';


export const userProfile = (participant) => {
    let template = ``;
    !participant ?
    (template += `
            ${getTemplateRow("fa fa-times fa-2x", "color: red", "Enrollment", "N/A", "User Profile", "N/A", "N/A", "N/A", "N", "N/A")}
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
        ${getTemplateRow("fa fa-times fa-2x", "color: red", "Enrollment", "N/A", "Verification", "N/A", "N/A", "N/A", "N", "N/A")}
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
    let refusedBloodOption = participantModule[fieldMapping.refusalOptions] && participantModule[fieldMapping.refusalOptions][fieldMapping.refusedBlood]
    let template = ``;
    refusedBloodOption === (fieldMapping.yes) ?
    (
        template += `
            ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Blood", "Not Collected", "N/A", "N/A", "Y", "N/A")}
           `
    ) : 
    !participantModule[fieldMapping.bloodFlag]?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Blood", "Not Collected", "N/A", "N/A", "N", "N/A")}
            `
    ) :   
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
    let refusedUrineOption = participantModule[fieldMapping.refusalOptions] && participantModule[fieldMapping.refusalOptions][fieldMapping.refusedUrine]
    let template = ``;
    refusedUrineOption === (fieldMapping.yes) ?
    (
        template += `
                 ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Urine", "Not Collected", "N/A", "N/A", "Y", "N/A")}`
    ) :
    !participantModule[fieldMapping.urineFlag]?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Urine", "Not Collected", "N/A", "N/A", "N", "N/A")}`
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
    let refusedMouthwashOption = participantModule[fieldMapping.refusalOptions] && participantModule[fieldMapping.refusalOptions][fieldMapping.refusedMouthwash]
    let template = ``;
    refusedMouthwashOption === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Mouthwash", "Not Collected", "N/A", "N/A", "Y", "N/A")}`
    ) :
    !participantModule[fieldMapping.mouthwash]  ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Mouthwash", "Not Collected", "N/A", "N/A", "N", "N/A")}`
    ) : 
    (
        ( participantModule[fieldMapping.mouthwash] === (fieldMapping.yes)) ?
            template += `
            ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Sample", "Mouthwash", "Collected", 
                    humanReadableMDY(participantModule[fieldMapping.mouthwashDateTime]), biospecimenStatus(participantModule), "N", "N/A")}`
            : (
                template += `
                        ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Sample", "Mouthwash", "Not Collected", "N/A", "N/A", "N", "N/A")}`
            )
    )
    return template;
}

export const baselineBOHSurvey = (participant) => {
    let refusedSurveyOption = participant[fieldMapping.refusalOptions] && participant[fieldMapping.refusalOptions][fieldMapping.refusedSurvey]
    let template = ``;
    refusedSurveyOption === (fieldMapping.yes) ?
    (
        template += `
            ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "BOH", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        (participant[fieldMapping.bohStatusFlag1] === fieldMapping.submitted1) ?
        (
            template += `
                ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "BOH", "Submitted",
                    humanReadableMDY(participant[fieldMapping.bohCompletedDate1]), "N/A", "N", "N/A")}`
        ) :
        (participant[fieldMapping.bohStatusFlag1] === fieldMapping.started1) ?
        (
            template += `
                ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "BOH", "Started",
                    humanReadableMDY(participant[fieldMapping.bohStartDate1]), "N/A", "N", "N/A")}`
        ) : 
        (participant[fieldMapping.bohStatusFlag1] === fieldMapping.notStarted1) ?
        ( template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "BOH", "Not Started", "N/A", "N/A", "N", "N/A")}`
        ):
        (
            template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "BOH", "N/A", "N/A", "N/A", "N", "N/A")}`
        ))
    return template;
    
}


export const baselineMRESurvey = (participant) => {
    let refusedSurveyOption = participant[fieldMapping.refusalOptions] && participant[fieldMapping.refusalOptions][fieldMapping.refusedSurvey]
    let template = ``;
    refusedSurveyOption === (fieldMapping.yes)  ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "MRE", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        (participant[fieldMapping.mreStatusFlag1] === fieldMapping.submitted1) ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "MRE", "Submitted",
                    humanReadableMDY(participant[fieldMapping.mreCompletedDate1]), "N/A", "N", "N/A")}`

        ) :
        (participant[fieldMapping.mreStatusFlag1] === fieldMapping.started1) ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "MRE", "Started",
                    humanReadableMDY(participant[fieldMapping.mreStartDate1]), "N/A", "N", "N/A")}`
        ) : 
        (participant[fieldMapping.mreStatusFlag1] === fieldMapping.notStarted1) ?
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "MRE", "Not Started", "N/A", "N/A", "N", "N/A")}`
        ):
           ( template += `
            ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "MRE", "N/A", "N/A", "N/A", "N", "N/A")}`
           )
        )
    return template;
    
}

export const baselineSASSurvey = (participant) => {
    let refusedSurveyOption = participant[fieldMapping.refusalOptions] && participant[fieldMapping.refusalOptions][fieldMapping.refusedSurvey]
    let template = ``;
    refusedSurveyOption === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "SAS", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        (participant[fieldMapping.sasStatusFlag1] === fieldMapping.submitted1)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "SAS", "Submitted",
                    humanReadableMDY(participant[fieldMapping.sasCompletedDate1]), "N/A", "N", "N/A")}`

        ) :
        (participant[fieldMapping.sasStatusFlag1] === fieldMapping.started1) ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "SAS", "Started",
                    humanReadableMDY(participant[fieldMapping.sasStartDate1]), "N/A", "N", "N/A")}`
        ) : 
        (participant[fieldMapping.sasStatusFlag1] === fieldMapping.notStarted1) ?
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "SAS", "Not Started", "N/A", "N/A", "N", "N/A")}`
        )  :
        (
            template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "SAS", "N/A", "N/A", "N/A", "N", "N/A")}`
        )
)
    return template;
    
}

export const baselineLAWSurvey = (participant) => {
    let refusedSurveyOption = participant[fieldMapping.refusalOptions] && participant[fieldMapping.refusalOptions][fieldMapping.refusedSurvey]
    let template = ``;
    refusedSurveyOption === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "LAW", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    (
        (participant[fieldMapping.lawStausFlag1] === fieldMapping.submitted1)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "LAW", "Submitted",
                    humanReadableMDY(participant[fieldMapping.lawCompletedDate1]), "N/A", "N", "N/A")}`

        ) :
        (participant[fieldMapping.lawStausFlag1] === fieldMapping.started1)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "LAW", "Started",
                    humanReadableMDY(participant[fieldMapping.lawStartDate1]), "N/A", "N", "N/A")}`
        ) : 
        (participant[fieldMapping.lawStausFlag1] === fieldMapping.notStarted1)  ?
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "LAW", "Not Started", "N/A", "N/A", "N", "N/A")}`
        )
        :
        (
            template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "LAW", "N/A", "N/A", "N/A", "N", "N/A")}`
        )
   )
    return template;
    
    
}
export const baselineSSN = (participant) => {
    let template = ``;
    (
        (participant[fieldMapping.ssnFullflag] === fieldMapping.yes) ?
        (
        template += `
                ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "SSN", "All Digits", 
                (participant[fieldMapping.ssnFulldate] !== undefined ? humanReadableMDY(participant[fieldMapping.ssnFulldate]) : `N/A`), "N/A", "N", "N/A")}`
        ) : (participant[fieldMapping.ssnPartialFlag] === fieldMapping.yes) ? 
        ( template += `
            ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "SSN", "4 Digits", 
            (participant[fieldMapping.ssnPartialDate] !== undefined ? humanReadableMDY(participant[fieldMapping.ssnPartialDate]) : `N/A`), "N/A", "N", "N/A")}`
        ): (
            template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "SSN", "None", "N/A", "N/A", "N", "N/A")}`
            ))
    return template;
}


export const baselineBiospecSurvey = (participant) => {
    let combinedBoodUrineMouthwashSurvey = participant[fieldMapping.combinedBoodUrineMouthwashSurvey] && participant[fieldMapping.combinedBoodUrineMouthwashSurvey]
    let refusedSpecimenOption = participant[fieldMapping.refusalOptions] && participant[fieldMapping.refusalOptions][fieldMapping.refusedSpecimenSurevys]
    let template = ``;

    refusedSpecimenOption === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Blood/Urine/Mouthwash", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    !combinedBoodUrineMouthwashSurvey ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Blood/Urine/Mouthwash", "N/A", "N/A", "N/A", "N", "N/A")}`
    ) : 
    (
        (participant[fieldMapping.combinedBoodUrineMouthwashSurvey] === fieldMapping.submitted1)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "Blood/Urine/Mouthwash", "Submitted",
                    humanReadableMDY(participant[fieldMapping.combinedBoodUrineMouthwashSurveyCompleteDate]), "N/A", "N", "N/A")}`

        ) :
        (participant[fieldMapping.combinedBoodUrineMouthwashSurvey] === fieldMapping.started1)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "Blood/Urine/Mouthwash", "Started",
                    humanReadableMDY(participant[fieldMapping.combinedBoodUrineMouthwashSurveyStartDate]), "N/A", "N", "N/A")}`
        ) : 
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Blood/Urine/Mouthwash", "Not Started", "N/A", "N/A", "N", "N/A")}`
        )
    )
    return template;
}

export const baselineBloodUrineSurvey = (participant) => {
    let participantModule = participant[fieldMapping.bloodUrineSurvey]
    let refusedSpecimenOption = participant[fieldMapping.refusalOptions] && participant[fieldMapping.refusalOptions][fieldMapping.refusedSpecimenSurevys]
    let template = ``;

    refusedSpecimenOption === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Clinical Blood/Urine", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    !participantModule ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Clinical Blood/Urine", "N/A", "N/A", "N/A", "N", "N/A")}`
    ) : 
    (
        (participantModule[fieldMapping.bloodUrineSurveyFlag] === fieldMapping.submitted1)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "Clinical Blood/Urine", "Submitted",
                    humanReadableMDY(participantModule[fieldMapping.bloodUrineSurveyCompletedDate]), "N/A", "N", "N/A")}`

        ) :
        (participantModule[fieldMapping.bloodUrineSurveyFlag] === fieldMapping.started1)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "Clinical Blood/Urine", "Started",
                    humanReadableMDY(participantModule[fieldMapping.bloodUrineSurveyStartedDate]), "N/A", "N", "N/A")}`
        ) : 
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Clinical Blood/Urine", "Not Started", "N/A", "N/A", "N", "N/A")}`
        ))
    return template;
    
}

export const baselineMouthwashSurvey = (participant) => {
    let participantModule = participant[fieldMapping.mouthwashSurvey]
    let refusedSpecimenOption = participant[fieldMapping.refusalOptions] && participant[fieldMapping.refusalOptions][fieldMapping.refusedSpecimenSurevys]
    let template = ``;
    refusedSpecimenOption === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Home Mouthwash", "N/A", "N/A", "N/A", "Y", "N/A")}`
    ) :
    !participantModule ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Home Mouthwash", "N/A", "N/A", "N/A", "N", "N/A")}`
    ) : 
    (
        (participantModule[fieldMapping.mouthwashSurveyFlag] === fieldMapping.submitted1)  ?
        (
            template += `
                    ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Survey", "Home Mouthwash", "Submitted",
                    humanReadableMDY(participantModule[fieldMapping.mouthwashSurveyCompletedDate]), "N/A", "N", "N/A")}`

        ) :
        (participantModule[fieldMapping.mouthwashSurveyFlag] === fieldMapping.started1) ?
        (
            template += `
                    ${getTemplateRow("fa fa-hashtag fa-2x", "color: orange", "Baseline", "Survey", "Home Mouthwash", "Started",
                    humanReadableMDY(participantModule[fieldMapping.mouthwashSurveyStartedDate]), "N/A", "N", "N/A")}`
        ) : 
        ( template += `
                    ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Survey", "Home Mouthwash", "Not Started", "N/A", "N/A", "N", "N/A")}`
        ))
    return template;
    
    
}


export const baselineEMR = (participantModule) => {
    let template = ``;
    !(participantModule) ?  
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "EMR", "N/A", "Not Pushed", "N/A", "N/A", "N", "N/A")}`
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
                 ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Payment", "N/A", "N/A", "N/A", "N/A", "N", "N/A")}
                `
    ) : 
    participantModule[fieldMapping.refusedBaselinePayment] === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Payment", "N/A", "N/A", 
                humanReadableMDY(participantModule[fieldMapping.refusedBaselinePaymentDate]), "N/A", "Y", "N/A")}`
    )
    :
    participantModule[fieldMapping.issuePayment] === (fieldMapping.yes) ?
    (
        template += `
                ${getTemplateRow("fa fa-check fa-2x", "color: green", "Baseline", "Payment", "N/A", "Issued", 
                humanReadableMDY(participantModule[fieldMapping.baselinePaymentDate]), "N/A", "N", checkEligibilty(participantModule[fieldMapping.eligiblePayment]))}`
    ) :
    (
        template += `
                ${getTemplateRow("fa fa-times fa-2x", "color: red", "Baseline", "Payment", "N/A", "Not Issued", 
                "N/A", "N/A", "N", checkEligibilty(participantModule[fieldMapping.eligiblePayment]))}`
    )
    return template;
}

const checkEligibilty = (eligiblePayment) => {
    return eligiblePayment === (fieldMapping.yes) ? 'Eligible' : 'Not Eligible'
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
        ) :  
        (biospecimenRow[fieldMapping.biospecimenFlag]) === (fieldMapping.biospecimenHome) ?
        (
            template += `Home`
        ) : (
            template += `N/A`
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