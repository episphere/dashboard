console.log('enrolConnect.js loaded')

enrol={}
enrol.ui=function(div){ // build user interface if 
    enrol.div=div||document.getElementById('enrolmentDiv')
    if(enrol.div){ // if a target div exists, build 
        enrol.div.innerHTML=`<a href="https://dceg.cancer.gov/research/who-we-study/cohorts/connect" target="_blank">
        <image height="40px" src="../connect.png"></a>
        <span style="font-size:xx-large;color:maroon">Enrolment Dashboard</span>`
    }
}


window.onload=_=>{enrol.ui()}

h = '<a href="https://dceg.cancer.gov/research/who-we-study/cohorts/connect" target="_blank"><image height="50px" src="../connect.png"></a>'