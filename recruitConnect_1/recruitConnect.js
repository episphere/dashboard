console.log('recruitConnect.js loaded')

recruit={}
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
        <br><b style="font-size:xx-large;color:maroon;white-space:nowrap">Recruitment Dashboard</b>
        <a href="https://github.com/episphere/dashboard/tree/master/recruitConnect_1" target="_blank">
        <svg id="githubIcon" style="fill:navy;height:22" class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></a>
        <a href="https://documenter.getpostman.com/view/3282203/S1LsXq2E" target="_blank"><img height=22 src="https://assets.getpostman.com/common-share/postman-logo-horizontal-white.svg"></a>
        <div id="recruitDash">
        <p>Site Key: <input size=30 type="password" id="key" value="${recruit.store.key}"><button id="connectKey" onclick="recruit.withKey()">Connect</button><input type="checkbox" id="checkSave"><span style="font-size:small;color:black">save</span></p>
        </div>
        `
        //connectKey.click()
    }
}

recruit.api='https://episphere-connect.herokuapp.com'

recruit.withKey=function(){
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
        })).json()
        recruit.dashUI(files)
    } catch(e){
        recruit.dash.innerHTML='<p style="color:red">login failed - invalid key?</p>'
        setTimeout(function(){
            location.reload()
        },1000)
    }
}

recruit.dashUI=async function(files){
    let h = ''
    h += `<pre>${JSON.stringify(files,null,3)}</pre>`
    h += '<table><tr><td></td><td></td></tr>'
    h += '<tr><td id="fileList"></td><td id="datatd">...</td></tr></table>'
    recruit.dash.innerHTML=h
    // file list
    h=''
    h += `<p id="filesListHeader">File submissions <span style="color:blue;cursor:hand" id="numFiles">(${files.result.length})</span></p>`
    h += `<p id="fileListBody"></p>`
    fileList.innerHTML=h
    numFiles.onclick=function(){
        h=''
        files.result.forEach(f=>{
            debugger
        })

        
    }
    numFiles.onclick()

}


window.onload=_=>{recruit.ui()}