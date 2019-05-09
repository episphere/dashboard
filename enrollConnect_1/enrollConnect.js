console.log('enrollConnect.js loaded')

enroll={}
enroll.ui=function(div){ // build user interface if 
    enroll.div=div||document.getElementById('enrollmentDiv')
    if(enroll.div){ // if a target div exists, build
        if(!localStorage.enroll){localStorage.enroll='{}'}
        enroll.store=JSON.parse(localStorage.enroll)
        enroll.store.key=enroll.store.key||''
        // login UI, borrowing stored key is available
        enroll.div.innerHTML=`
        <a href="https://dceg.cancer.gov/research/who-we-study/cohorts/connect" target="_blank">
        <image height="40px" src="../connect.png"></a>
        <b style="font-size:xx-large;color:maroon;white-space:nowrap">Recruitment Dashboard</b>
        <div id="enrollDash">
        <p>Site Key: <input size=30 type="password" id="key" value="${enroll.store.key}"><button id="connectKey" onclick="enroll.withKey()">Connect</button><input type="checkbox" id="checkSave"><span style="font-size:small;color:black">save</span></p>
        </div>
        `
    }
}

enroll.withKey=function(){
    enroll.dash=enroll.div.querySelector('#enrollDash')
    // login with key and display dashboard
    enroll.key=enroll.div.querySelector('#key').value
    if(enroll.div.querySelector('#checkSave').checked){ // store key for future sessions if requested
        let st=JSON.parse(localStorage.enroll)
        st.key=enroll.key
        localStorage.enroll=JSON.stringify(st)
    }
    enroll.dash=enroll.div.querySelector('#enrollDash')
    enroll.dashFun()
}

enroll.dashFun=function(){ // build the dashboard after logged with key
    enroll.dash.innerHTML=`
    <p>logged in, ready to call Praful ...</p>
    `
}


window.onload=_=>{enroll.ui()}