console.log('recruitConnect.js loaded')

recruit={}
recruit.gitIcon=document.createElement('span').innerHTML='<svg class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>'
recruit.parms={}
// Site data from https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/getSiteDetails
// At some point this will be an asynchrnous call to a jsonfile or to the data service above
//recruit.sitesData=(await recruit.getLazyJSON('https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/getSiteDetails')).data
//recruit.sitesData=(await recruit.getLazyJSON('https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/getSiteDetails')).data
recruit.ui=async function(div){ // build user interface if 
    recruit.div=div||document.getElementById('recruitmentDiv')
    if(recruit.div){ // if a target div exists, build
        if(!localStorage.recruit){localStorage.recruit='{}'}
        recruit.store=JSON.parse(localStorage.recruit)
        recruit.store.key=recruit.store.key||''
        // login UI, borrowing stored key is available
        recruit.div.innerHTML=`
        <a href="https://dceg.cancer.gov/research/who-we-study/cohorts/connect" target="_blank">
        <image height="40px" src="../connect.png"></a>
        <br><b style="font-size:xx-large;color:maroon;white-space:nowrap">Participant Recruitment <span style="font-size:small">(towards an App)</span></b>
        <a href="https://github.com/episphere/dashboard/tree/master/recruitParticipant" target="_blank">
        <svg id="githubIcon" style="fill:navy;height:22" class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></a>
        <a href="https://documenter.getpostman.com/view/7490604/SVYnT26j" target="_blank"><img height=22 src="https://assets.getpostman.com/common-share/postman-logo-horizontal-white.svg"></a>
        <p style="color:gray">Use something with the form <a href="https://episphere.github.io/dashboard/recruitParticipant/#siteCode=1&token=abc" target="_blank">https://episphere.github.io/dashboard/recruitParticipant/#siteCode={siteCode}&token={participantToken}</a> for an example of a tokenized trajectory. The code accomodates search and hash (try the same link with # instead of ?), or a combination of the two. The preference for the hash is that it can be wiped from the URL and from prying eyes. If the page is then reloaded, or returned to later, the latest version of teh parameters, whicever they may be, is retrieved. Give it a try.</p>
        <div id="recruitDash">
        ...
        </div>
        <div id="msg"></div>
        <hr style="background-color:black">
        <button id="resetLocal" style="color:orange">RESET</button>
        `
        // check parameters in location.search
        if(location.search.length>2){
            location.search.slice(1).split('&').forEach(pp=>{
                pp = pp.split('=')
                recruit.parms[pp[0]]=pp[1]
                //debugger
            })
        }
        // check parameters in location.hash <-- note hash happens after search to we get precedence in parameter defenitions passed by hash
        if(location.hash.length>2){
            location.hash.slice(1).split('&').forEach(pp=>{
                pp = pp.split('=')
                recruit.parms[pp[0]]=pp[1]
                //debugger
            })
        }
        // update localStorage
        let parms={}
        if(localStorage.recruitParms){parms=JSON.parse(localStorage.recruitParms)}
        Object.keys(recruit.parms).forEach(p=>{
            parms[p]=recruit.parms[p]
        })
        localStorage.recruitParms=JSON.stringify(parms)
        recruit.parms=parms

        // clean hash
        location.hash=''
        
        // report parameters
        const liParms=document.createElement('li')
        recruitDash.appendChild(liParms)
        liParms.innerHTML=`Parameters: <pre>${JSON.stringify(recruit.parms,null,3)}</pre>`
        
        const liSite=document.createElement('li')
        liSite.innerHTML='Select Site: '
        recruitDash.appendChild(liSite)
        
        const liToken=document.createElement('li')
        recruitDash.appendChild(liToken)
        liToken.innerHTML='Token: <input id="inputToken" style="color:black" type="password" size=36> <button id="validateToken">validate</button> <button id="generateToken">generate</button> <button id="showToken">show</button>'

        // update parms
        function updateParms(){
            liParms.innerHTML=`Parameters: <pre>${JSON.stringify(recruit.parms,null,3)}</pre>`
            localStorage.recruitParms=JSON.stringify(recruit.parms)
        }
        recruit.updateParms=updateParms


        // Site selection/claim
        recruit.getLazyJSON('https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/getSiteDetails',24*60*60*1000).then(x=>{
            recruit.sitesData=x.data
            recruit.selectSite=document.createElement('select')
            liSite.appendChild(recruit.selectSite)
            recruit.sitesData.forEach((s,i)=>{
                let op = document.createElement('option')
                op.innerText=s.siteName
                op.value=s.siteCode
                op.i=i
                recruit.selectSite.appendChild(op)
            })
            recruit.selectSite.value=recruit.parms.siteCode
            recruit.selectSite.onchange=function(){
                recruit.parms.siteCode=this.selectedOptions[0].value
                updateParms()
            }
        })

        // Token
        if(recruit.parms.token){
            inputToken.value=recruit.parms.token
        }
        generateToken.onclick=async function(){
            tks = await (await fetch('https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/getKey')).json()
            recruit.parms.token=inputToken.value=tks.token
            recruit.parms.access_token=tks.access_token
            updateParms()
        }
        showToken.onclick=function(){
            inputToken.type="text"
            setTimeout(function(){
                inputToken.type="password"
            },5000)
        }
        validateToken.onclick=async function(){
            assTk = await (await fetch('https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/validateToken?token='+inputToken.value)).json()
            if(assTk.message){
                recruit.parms.access_token=validateToken.innerText=assTk.message
                validateToken.style.color='red'
            }else{
                recruit.parms.access_token=assTk.access_token||'bearer_'+Math.random().toString().slice(2)
                validateToken.innerText='valid'
                validateToken.style.color='green'
                recruit.educate()
            }
            updateParms()
        }
        
        inputToken.onkeyup=async function(evt){
            if(evt.keyCode==13){
                recruit.parms.token=this.value
                updateParms()
            }

            //debugger
        }



        //<p>Participant Key: <input size=30 type="password" id="key" value="${recruit.store.key}"><button id="connectKey" onclick="recruit.withKey()">Connect</button><input type="checkbox" id="checkSave"><span style="font-size:small;color:black">save</span></p>
        //<p id="newKeyP">If you are a new user you can also <button id="generateKey" onclick="recruit.generateKey()">Generate a new Key</button></p>
        
        //connectKey.click()

        resetLocal.onclick=function(){
            delete localStorage.recruitParms
            location.reload()
        }
    }
}

recruit.educate=function(id){
    id=id||'msg'
    let div = document.getElementById('msg')
    div.innerHTML=`
    <hr style="background-color:black">
    <p style="color:green">
    You could expose this to the participant being recruited in a number of ways:
    <ol>
    <li> Generic targeted recruitment (the prototype all others map back to):<br>
    <a href="${location.origin+location.pathname}#token=${recruit.parms.token}&siteCode=${recruit.parms.siteCode}" target="_blank">${location.origin+location.pathname}#token=${recruit.parms.token}&siteCode=${recruit.parms.siteCode}</a>
    </li>
    <li> Targeted recruitment with token only (under dev):<br>
    <a href="${location.origin+location.pathname}#${recruit.parms.token}" target="_blank">${location.origin+location.pathname}#${recruit.parms.token}</a>
    </li>
    <li> Site specific recruitment:<br>
    <a href="${location.origin+location.pathname}#token=${recruit.parms.siteCode}" target="_blank">${location.origin+location.pathname}#siteCode=${recruit.parms.siteCode}</a>
    </li>
    <li> Customized site specific recruitment - you could host it with a redirect with these parameters, or we could hosted for you as something like (your content would direct participant to the parameters in #1):<br>
    <a href="${location.origin+location.pathname}#token=${recruit.parms.token}&siteCode=${recruit.parms.siteCode}" target="_blank">${location.origin+location.pathname}/${recruit.selectSite.selectedOptions[0].innerText.replace(/\s/g,'')}</a>
    </li>
    <li> temporary link (1 hr default expiration) without participant token for data entry:<br>
    <a href="${location.origin+location.pathname}#access_token=${recruit.parms.access_token}" target="_blank">${location.origin+location.pathname}#access_token=${recruit.parms.access_token}</a>
    </li>

    </ol>


    </p>

    `

}


recruit.api='https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net'

recruit.getToken=async function(){
    return (await fetch(recruit.api+'/getKey')).json()
}


/*
recruit.withKey= async function(){
    recruit.dash=recruit.div.querySelector('#recruitDash')
    // login with key and display dashboard
    recruit.key=recruit.div.querySelector('#key').value
    if(recruit.div.querySelector('#checkSave').checked){ // store key for future sessions if requested
        let st=JSON.parse(localStorage.recruit)
        st.key=recruit.key
        localStorage.recruit=JSON.stringify(st)
    }
    recruit.dash=recruit.div.querySelector('#recruitDash') // <-- this is where the dynamic interaction happens
    recruit.div.querySelector('#newKeyP').innerHTML='<span style="color:red">validating key ...</span>'
    const res = await (await fetch(`${recruit.api}/validateToken?token=${recruit.key}`)).json()
    recruit.dash.innerHTML=`<pre style="color:blue">${JSON.stringify(res,null,3)}</pre>`
}

recruit.generateKey=async function(){
    recruit.dash=recruit.div.querySelector('#recruitDash')
    let res = await (await fetch(`${recruit.api}/getKey`)).json()
    recruit.div.querySelector('#key').value=res.token
    recruit.div.querySelector('#newKeyP').innerHTML=`Your Participant Key is <span style="color:red">${res.token}</span>. Please store it somewhere safe, you'll need it to start new sessions. This new key was also filled above, so you can now click on the connect button to start a session. If you check the save box, this key will also be stored in this machine and will be filled automatically. Do not use this option in devices that are not under your control at all times`
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
*/

recruit.getLazyJSON = async function(url,tw){ // lazily cashing url call within time window
    tw = tw || 10000 // default time window in miliseconds
    let cash = localStorage.lazyJSON || '{}'
    cash = JSON.parse(cash)
    async function getCash(url){ // note cash is being passed by scope 
        cash[url] = await (await fetch(url)).json()
        cash[url].retrieved_at=Date.now()
        localStorage.lazyJSON=JSON.stringify(cash) // update
        return cash[url] // for now good reason except debugging
    }
    if(!cash[url]){await getCash(url)} // first call to this url
    if((Date.now()-cash[url].retrieved_at)>tw){await getCash(url)} // updatign stale value
    return cash[url]
} 


window.onload=_=>{recruit.ui()}