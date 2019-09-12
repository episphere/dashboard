console.log('AoUconnect.js started')

AoUconnect=function(){ // ini
    // check env and initialize UI is fitting
    // ...
}

AoUconnect.check=function(el){
    if(el.checked){
        connectEnrolled.innerText='enrolled, thank you!'
        connectEnrolled.style.color='green'
    }else{
        connectEnrolled.innerText='not enrolled'
        connectEnrolled.style.color='orange'
    }
    //debugger
}
