/* 
Target and return first element with specified id, assign value to content variable
*/
/**/
const headerContent = document.querySelector('#header-content')
const alertButton = document.querySelector('#alert-button')

/*
onload fires function when entire page is done loading
*/



window.onload = e => {
    headerContent.textContent = `Hello World!`
}


/* Add click event to alertButton, on click an interaction modal pops up*/
alertButton.addEventListener('click', e => alert(`Alert, much wow!`))

