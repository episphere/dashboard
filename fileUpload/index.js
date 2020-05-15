window.onload = () => {
    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const span = document.getElementById('responseMessage');
        span.innerHTML = 'Uploading';
        const formData = new FormData();
        const fileField = document.getElementById("fileRecords");
        const siteKey = document.getElementById("siteKey").value;
        formData.append('file', fileField.files[0]);
        
        const response = await fetch('https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/uploadHealthRecords', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization:"Bearer "+siteKey
            }
        });
        const responseJson = await response.json();
        if(responseJson.code === 200) {
            span.innerHTML = 'File uploaded!';
            span.style.color = 'green';
        }
        else {
            span.innerHTML = `${responseJson.message}`
            span.style.color = 'red';
        }
    })
}