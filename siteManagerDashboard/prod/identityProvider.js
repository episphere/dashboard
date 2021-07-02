export const SSOConfig = (inputValue) => {
    let tenantID = '';
    let provider = '';
    if(/nih.gov/i.test(inputValue)) {
        tenantID = 'NIH-SSO-9q2ao';
        provider = 'saml.nih-sso';
    };
    if(/healthpartners.com/i.test(inputValue)) {
        tenantID = 'HP-SSO-1elez';
        provider = 'saml.healthpartner';
    };
    if(/sanfordhealth.org/i.test(inputValue)) {
        tenantID = 'SFH-SSO-uetfo';
        provider = 'saml.connect-sanford';
    };
    if(/norc.org/i.test(inputValue)) {
        tenantID = 'NORC-SSO-l80az';
        provider = 'saml.connect-norc';
    };
    return {tenantID, provider}
}