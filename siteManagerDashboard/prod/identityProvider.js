export const SSOConfig = (inputValue) => { 
    const ssoConfigs = [ 
        { tenantID: 'NIH-SSO-wthvn', provider: 'saml.nih-sso', regexes: [/nih.gov/i] }, 
        { tenantID: 'HP-SSO-252sf', provider: 'saml.healthpartner', regexes: [/healthpartners.com/i] }, 
        { tenantID: 'SFH-SSO-pb390', provider: 'saml.connect-sanford', regexes: [/sanfordhealth.org/i] }, 
        { tenantID: 'NORC-SSO-nwvau', provider: 'saml.connect-norc-prod', regexes: [/norc.org/i] }, 
        { tenantID: 'KP-SSO-ii9sr', provider: 'saml.connect-kp', regexes: [/kp.org/i] }, 
        { tenantID: 'UCM-SSO-p4f5m', provider: 'saml.connect-uchicago', regexes: [/uchicago.edu/i] }, 
        { tenantID: 'HFHS-SSO-lo99j', provider: 'saml.connect-hfhs', regexes: [/hfhs.org/i] }, 
        { tenantID: 'MFC-SSO-tdj17', provider: 'saml.connect-mfc', regexes: [/marshfieldresearch.org/i, /marshfieldclinic.org/i] }, 
        { tenantID: 'BSWH-SSO-dcoos', provider: 'saml.connect-bswh', regexes: [/bswhealth.org/i] }, 
    ]

    for (const ssoConfig of ssoConfigs) { 
        if (ssoConfig.regexes.some(regex => regex.test(inputValue))) { 
            return { tenantID: ssoConfig.tenantID, provider: ssoConfig.provider } 
        } 
    }

    return { tenantID: '', provider: '' }
}