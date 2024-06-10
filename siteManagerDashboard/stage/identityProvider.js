export const SSOConfig = (inputValue) => { 
    const ssoConfigs = [ 
        { tenantID: 'NIH-SSO-9q2ao', provider: 'saml.nih-sso', regexes: [/nih.gov/i] }, 
        { tenantID: 'HP-SSO-1elez', provider: 'saml.healthpartner', regexes: [/healthpartners.com/i] }, 
        { tenantID: 'HFHS-SSO-eq1fj', provider: 'saml.connect-hfhs', regexes: [/hfhs.org/i] }, 
        { tenantID: 'SFH-SSO-uetfo', provider: 'saml.connect-sanford', regexes: [/sanfordhealth.org/i] }, 
        { tenantID: 'UCM-SSO-lrjsp', provider: 'saml.connect-uchicago', regexes: [/uchicago.edu/i] }, 
        { tenantID: 'NORC-SSO-l80az', provider: 'saml.connect-norc', regexes: [/norc.org/i] }, 
        { tenantID: 'KP-SSO-ssj7c', provider: 'saml.connect-kp', regexes: [/kp.org/i] }, 
        { tenantID: 'MFC-SSO-6x4zy', provider: 'saml.connect-mfc', regexes: [/marshfieldresearch.org/i, /marshfieldclinic.org/i] }, 
        { tenantID: 'BSWH-SSO-k4cat', provider: 'saml.connect-bswh', regexes: [/bswhealth.org/i] }, 
    ] 

    for (const ssoConfig of ssoConfigs) { 
        if (ssoConfig.regexes.some(regex => regex.test(inputValue))) { 
            return { tenantID: ssoConfig.tenantID, provider: ssoConfig.provider } 
        } 
    } 

    return { tenantID: '', provider: '' }
}
