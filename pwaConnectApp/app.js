window.onload = () => {
    router();
    main();
}

window.onhashchange = () => {
    router();
}

const api = 'https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/';

const main = () => {
    if('serviceWorker' in navigator){
        try {
            navigator.serviceWorker.register('./serviceWorker.js');
        }
        catch (error) {
            console.log(error);
        }
    }
}

const router = () => {
    const mainContent = document.getElementById('root');
    const hash = decodeURIComponent(window.location.hash);
    const index = hash.indexOf('?');
    const parameters = index !== -1 ? getparameters(hash.slice(index+1, hash.length)) : {};
    if(parameters.token){
        if(localStorage.connectApp){
            localStorage.connectApp = JSON.stringify(JSON.parse(localStorage.connectApp).token = parameters.token);
        }
        else{
            let obj = {};
            obj["token"] = parameters.token;
            localStorage.connectApp = JSON.stringify(obj);
        }
    }
    else{
        getKey();
    }
    const route =  index !== -1 ? hash.slice(0, index) : hash || '#';
    const routes = allRoutes();
    mainContent.innerHTML = routes[route];
}

const allRoutes = () => {
    return {
        '#': homePage(),
        '#eligibility_screener': eligibilityScreener(),
        '#eligible': eligibleParticipant(),
        "#ineligible": ineligible(),
        "#ineligible_site": ineligibleSite()
    }
}

const homePage = () => {
    return `
        <h1>Welcome to Connect Cohort Study!</h1>
        <a class="btn btn-primary" href="#eligibility_screener">Join Now</a>
    `;
}

const sites = () => {
    return {
        1: 'Health Partners',
        2: 'Henry Ford Health System',
        3: 'Kaiser Permanente Colorado',
        4: 'Kaiser Permanente Georgia',
        5: 'Kaiser Permanente Hawaii',
        6: 'Kaiser Permanente Northwest',
        7: 'Marshfield Clinic',
        8: 'Sanford Health',
        9: 'University of Chicago Medicine',
        13: 'Natiocal Cancer Institute',
        88: 'None of these'
    }
}

const eligibilityScreener = () => {
    return `
    <div class="col">
        <label>Are you between the ages of 40-65?<span class="required"> *</span></label>
        <div class="form-group">
            <div class="radio">
                <label><input type="radio" id="radio1" name="RcrtES_AgeQualify_v1r0" value=1 checked> Yes</label>
            </div>
            <div class="radio">
                <label><input type="radio" id="radio2" name="RcrtES_AgeQualify_v1r0" value=0> No</label>
            </div>
        </div>

        <label>Have you ever had cancer (other than non-melanoma skin cancer)?<span class="required"> *</span></label>
        <div class="form-group">
            <div class="radio">
                <label><input type="radio" name="RcrtES_CancerHist_v1r0" id="radio3" checked value=1> Yes</label>
            </div>
            <div class="radio">
                <label><input type="radio" id="radio4" name="RcrtES_CancerHist_v1r0" value=0> No</label>
            </div>
        </div>

        <div class="form-group">
            <label for="RcrtES_Site_v1r0">Who is your healthcare provider?<span class="required"> *</span></label>
            <select class="form-control" id="RcrtES_Site_v1r0">
                <option value=1>Health Partners</option>
                <option value=2>Henry Ford Health System</option>
                <option value=3>Kaiser Permanente Colorado</option>
                <option value=4>Kaiser Permanente Georgia</option>
                <option value=5>Kaiser Permanente Hawaii</option>
                <option value=6>Kaiser Permanente Northwest</option>
                <option value=7>Marshfield Clinic</option>
                <option value=8>Sanford Health</option>
                <option value=9>University of Chicago Medicine</option>
                <option value=13>Natiocal Cancer Institute</option>
                <option value=88>None of these</option>
            </select>
        </div>

        <label>How did you hear about this study?</label>
        <div class="form-group">
            <div class="checkbox">
                <label><input type="checkbox" id="checkbox1"> Physician or other medical staff</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="checkbox2"> Email or text from my healthcare provider</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="checkbox3"> Postcard or mail</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="checkbox4"> News article or website</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="checkbox5"> Social media</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="checkbox6"> MyChart invitation</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="checkbox7"> Family or friend</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="checkbox8"> Another Connect participant</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="checkbox9"> Poster, brochure, or flyer</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox" id="checkbox10"> Study table at public event</label>
            </div>
            <div class="checkbox">
                <label><input type="checkbox"  id="checkbox11"> Other</label>
            </div>
        </div>
        <button onclick="eligibilityQuestionnaire()" class="btn btn-primary">Submit</button>
    </div>
    `;
}

const eligibleParticipant = () => {
    return `
        <div class="col">
            <h1>You are eligible! Thank you for joining Connect.</h1>
            <button class="btn btn-primary">Create Account</button>
        </div>
    `;
}

const eligibilityQuestionnaire = () => {
    let formData = {};
    formData["RcrtES_AgeQualify_v1r0"] = document.getElementById('radio1').checked ? 1 : document.getElementById('radio2').checked ? 0 : 0;
    formData["RcrtES_CancerHist_v1r0"] = document.getElementById('radio3').checked ? 1 : document.getElementById('radio4').checked ? 0 : 0;
    formData["RcrtES_Site_v1r0"] = parseInt(document.getElementById('RcrtES_Site_v1r0').value);
    formData["RcrtES_Aware_v1r0"] = {};
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_phys"] = document.getElementById('checkbox1').checked ? 1 : 0;
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_Email"] = document.getElementById('checkbox2').checked ? 1 : 0;
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_Post"] = document.getElementById('checkbox3').checked ? 1 : 0;
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_News"] = document.getElementById('checkbox4').checked ? 1 : 0;
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_Social"] = document.getElementById('checkbox5').checked ? 1 : 0;
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_Invite"] = document.getElementById('checkbox6').checked ? 1 : 0;
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_Family"] = document.getElementById('checkbox7').checked ? 1 : 0;
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_Member"] = document.getElementById('checkbox8').checked ? 1 : 0;
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_Poster"] = document.getElementById('checkbox9').checked ? 1 : 0;
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_Table"] = document.getElementById('checkbox10').checked ? 1 : 0;
    formData["RcrtES_Aware_v1r0"]["RcrtES_Aware_v1r0_Other"] = document.getElementById('checkbox11').checked ? 1 : 0;
    
    localStorage.eligibilityQuestionnaire = JSON.stringify(formData);
    if(formData.RcrtES_AgeQualify_v1r0 === 1 && formData.RcrtES_CancerHist_v1r0 === 0 && formData.RcrtES_Site_v1r0 !== 88){
        storeResponse(formData);
        window.location.hash = '#eligible';
    }
    else if(formData.RcrtES_AgeQualify_v1r0 === 1 && formData.RcrtES_CancerHist_v1r0 === 0 && formData.RcrtES_Site_v1r0 === 88){
        window.location.hash = "#ineligible_site";
    }
    else{
        window.location.hash = '#ineligible';
    }
}

const ineligible = () => {
    return `
        <h4>Thank you for your interest, but you are not eligible for the Connect study.</h4>
        <h4>Would you like us to let ${ localStorage.eligibilityQuestionnaire ? sites()[JSON.parse(localStorage.eligibilityQuestionnaire).RcrtES_Site_v1r0] : ''} know that you are not eligible? We will not use this information for any other purpose.</h4>

        </br></br>
        <button class="btn btn-primary">Yes</button>  <button class="btn btn-primary">No</button>
    `;
}

const ineligibleSite = () => {
    return `
        <h4>Thank you for your interest, but you are not eligible for the Connect study as the study is only being conducted through these institutions at this time.</h4>
        <h4>Please check back in the future as we add more study sites. If you have any questions, please contact the Connect help desk.</h4>
    `
}

const getparameters = (query) => {
    const array = query.split('&');
    let obj = {};
    array.forEach(value => {
        obj[value.split('=')[0]] = value.split('=')[1];
    });
    return obj;
}

const getKey = async () => {
    const response = await fetch(api+'getKey');
    const data = await response.json();
    if(data.code === 200) {
        let obj = { access_token: data.access_token, token: data.token };
        localStorage.connectApp = JSON.stringify(obj);
    }
}

const storeResponse = async (formData) => {
    formData.token = JSON.parse(localStorage.connectApp).token;
    const response = await fetch(api+'recruit/submit',
    {
        method: 'POST',
        headers:{
            Authorization:"Bearer "+JSON.parse(localStorage.connectApp).access_token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
}