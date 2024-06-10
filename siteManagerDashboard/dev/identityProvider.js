export const SSOConfig = (inputValue) => {
    const ssoConfigs = [
        { tenantID: 'NIH-SSO-qfszp', provider: 'saml.nih-sso', regexes: [/nih.gov/i] },
        { tenantID: 'HP-SSO-wb1zb', provider: 'saml.healthpartner', regexes: [/healthpartners.com/i] },
        { tenantID: 'HFHS-SSO-ay0iz', provider: 'saml.connect-hfhs', regexes: [/hfhs.org/i] },
        { tenantID: 'SFH-SSO-cgzpj', provider: 'saml.connect-sanford', regexes: [/sanfordhealth.org/i] },
        { tenantID: 'UCM-SSO-tovai', provider: 'saml.connect-uchicago', regexes: [/uchicago.edu/i] },
        { tenantID: 'NORC-SSO-dilvf', provider: 'saml.connect-norc', regexes: [/norc.org/i] },
        { tenantID: 'KP-SSO-wulix', provider: 'saml.connect-kp', regexes: [/kp.org/i] },
        { tenantID: 'MFC-SSO-fljvd', provider: 'saml.connect-mfc', regexes: [/marshfieldresearch.org/i, /marshfieldclinic.org/i] },
        { tenantID: 'BSWH-SSO-y2jj3', provider: 'saml.connect-bswh', regexes: [/bswhealth.org/i] },
    ]

    for (const ssoConfig of ssoConfigs) {
        if (ssoConfig.regexes.some(regex => regex.test(inputValue))) {
            return { tenantID: ssoConfig.tenantID, provider: ssoConfig.provider }
        }
    }

    return { tenantID: '', provider: ''}
}


