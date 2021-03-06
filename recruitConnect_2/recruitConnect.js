import { table } from './components/table.js'
import { template } from './components/siteSpecificLogos.js';

let recruit={}
recruit.gitIcon=document.createElement('span').innerHTML='<svg class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>'
recruit.ui=function(div){ // build user interface if 
    recruit.div=div||document.getElementById('recruitmentDiv')
    if(recruit.div){ // if a target div exists, build
        if(!localStorage.recruit){localStorage.recruit='{}'}
        recruit.store=JSON.parse(localStorage.recruit)
        recruit.store.key=recruit.store.key||''
        // login UI, borrowing stored key is available
        recruit.div.innerHTML=`
        <a href="https://dceg.cancer.gov/research/who-we-study/cohorts/connect" target="_blank">
        <image height="40px" src="../connect.png"></a>
        <br><b style="font-size:xx-large;color:maroon;white-space:nowrap">Connect Dashboard</b>
        <a href="https://github.com/episphere/dashboard/tree/master/recruitConnect_2" target="_blank">
        <svg id="githubIcon" style="fill:navy;height:22" class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></a>
        <a href="https://documenter.getpostman.com/view/3282203/S1LsXq2E" target="_blank"><img height=22 src="https://assets.getpostman.com/common-share/postman-logo-horizontal-white.svg"></a>
        <div id="recruitDash">
        <p>Site Key: <input size=30 type="password" id="key" value="${recruit.store.key}">&nbsp;
        <button class="btn btn-primary" id="connectKey">Connect</button>&nbsp;
        <input type="checkbox" id="checkSave"><span style="font-size:small;color:black">save</span></p>
        </div>
        `;
        document.getElementById('connectKey').addEventListener('click', withKey);
    }
}

recruit.api=location.origin.indexOf('localhost') !== -1 ? 'http://localhost:3000' : 'https://episphere-connect.herokuapp.com';

const withKey=function(){
    let siteInfoElement = document.getElementById('siteInfo');
    siteInfoElement.innerHTML = '';
    recruit.dash=recruit.div.querySelector('#recruitDash')
    // login with key and display dashboard
    recruit.key=recruit.div.querySelector('#key').value
    if(recruit.div.querySelector('#checkSave').checked){ // store key for future sessions if requested
        let st=JSON.parse(localStorage.recruit)
        st.key=recruit.key
        localStorage.recruit=JSON.stringify(st)
    }
    recruit.dash=recruit.div.querySelector('#recruitDash') // <-- this is where the dynamic interaction happens
    recruit.dashLogin()
}

recruit.dashLogin=async function(){ // build the dashboard after logged with key
    // check that key is valid
    try {
        let files = await (await fetch(`${recruit.api}/files`,{
            headers:{
                "Authorization":`Bearer ${recruit.key}`
            }
        })).json();
        let siteLogoPath = '';
        if(recruit.key === 'FHYFHORxImxG6nlbfpfj'){
            siteLogoPath = './images/Chicago_Logo.png';
        }
        else if(recruit.key === 'AaJSCDZqGLqIxYxsjiob'){
            siteLogoPath = './images/HP_Logo_png.png';
        }
        else if(recruit.key === 'lSP3Sz6FnyfV7imOlvjF'){
            siteLogoPath = './images/Henry_Ford_Logo.png';
        }
        else if(recruit.key === 'Rd69wieaphftOeTRiQJQ'){
            siteLogoPath = './images/Kaiser_Logo.png';
        }
        else if(recruit.key === 'dZD798U6AJU7cphyKc7H'){
            siteLogoPath = './images/Marshfield_Logo.png';
        }
        else if(recruit.key === 'oXAG9rlxKEUChnarQqtj'){
            siteLogoPath = './images/Norc_Logo.png';
        }
        else if(recruit.key === 'ac6i1hk9tMH4oNZO3KJM'){
            siteLogoPath = './images/Sanford_Logo.png';
        }
        else{
            siteLogoPath = './images/nci_logo.jpg';
        }
        document.getElementById('siteSpecificLogos').innerHTML = template(siteLogoPath)
        recruit.dashUI(files)
    } catch(e){
        recruit.dash.innerHTML='<p style="color:red">login failed - invalid key?</p>'
        setTimeout(function(){
            location.reload()
        },1000)
    }
}

recruit.dashUI=async function(files){
    document.getElementById('recruitDash').hidden=true;
    let fileList = document.getElementById('fileList');
    if(files.result.length !== 0){
        fileList.innerHTML=table(files); 
    }
    else{
        fileList.innerHTML = 'No Submission Found!';
    }

    let viewSubmissionElement = document.getElementsByClassName('viewSubmission');
    let downloadSubmissionElement = document.getElementsByClassName('downloadSubmission');

    Array.from(viewSubmissionElement).forEach(element => {
        element.addEventListener('click', () => {
            removeActiveClass('viewSubmission');
            element.classList.add('active');
            const submissionId = element.dataset.submissionId;
            const result = getSubmissionData(submissionId);
            result.then(data => {
                let finalData = preProcessData(data);
                displayTable(finalData);
            });
        });
    });

    Array.from(downloadSubmissionElement).forEach(element => {
        element.addEventListener('click', () => {
            removeActiveClass('downloadSubmission');
            element.classList.add('active');
            const submissionId = element.dataset.submissionId;
            const result = getSubmissionData(submissionId);
            result.then(data => {
                const csv = convertToCSV(preProcessData(data));
                downloadCSVFile(csv);
            });
        });
    });
}

const getSubmissionData = async (submissionId) => {
    let files = await (await fetch(`${recruit.api}/files/${submissionId}`,{
        headers:{
            "Authorization":`Bearer ${recruit.key}`
        }
    })).json();
    return files.result;
}

const removeActiveClass = (className) => {
    let fileIconElement = document.getElementsByClassName(className);
    Array.from(fileIconElement).forEach(elm => {
        elm.classList.remove('active');
    });
}

const preProcessData = data => {
    data.forEach(obj => {
        for (let key in obj){
            if(key === 'Connect_ID'){
                obj['Connect_ID (Internal)'] = obj[key];
                obj[key] = generateHumanReadableID();
            }
        }
    });
    return data;
}

const generateHumanReadableID = () => {
    let ID = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    if(ID.indexOf('0') !== 0) return ID;
}

const displayTable = (tableData) => {
    var table = new Tabulator('#viewSubmission', {
        data:tableData,
        layout:"fitColumns",
        autoColumns:true,
        height:"600px",
        pagination:"local",
        paginationSize:30,
        paginationSizeSelector:[30, 40, 50, 60],
        movableColumns:true,
    });
};

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var header = '';
        var line = '';
        if(i === 0){
            const tmp_arr = Object.keys(array[i]);
            tmp_arr.forEach((h, index) => {
                if(index !== 0) header += ',';
                header += h;
            })
            header += '\n';
        }
        
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }

        str += header+line + '\r\n';
    }
    return str;
};

function downloadCSVFile(csv){
    let csvData = new Blob([csv], { type: 'data:text/csv;charset=utf-8,' });
    let csvUrl = URL.createObjectURL(csvData);
    let link = document.createElement('a');
    link.href = csvUrl;
    link.target = '_blank';
    link.download = 'submission_data.csv';
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.onload=_=>{recruit.ui()}