export function table(files) {
    return `
        <table class="table table-bordered table-striped">
            <thead class="thead-dark">
                <tr>
                    <th>Submission ID</th>
                    <th>Submission File Name</th>
                    <th>Submission Time Stamp</th>
                    <th>Version</th>
                    <th>View Submission</th>
                    <th>Download Submission</th>
                </tr>
            </thead>
            <tbody>
            ${files.result.map((value) => `
                <tr>
                    <td>${value.id}</td>
                    <td>${value.submissionFileName}</td>
                    <td>${new Date(value.submissionTimestamp).toLocaleString()}</td>
                    <td>${value.version}</td>
                    <td class="td-align"><a class="viewSubmission" data-submission-id="${value.id}" href="#" title="View Submission"><i class="fas fa-file-alt"></i></a></td>
                    <td class="td-align"><a class="downloadSubmission" data-submission-id="${value.id}" href="#" title="Download Submission"><i class="fas fa-file-download"></i></a></td>
                </tr>
            `.trim()).join('')}
            </tbody>
        <table>
    `;
}


export function submissionTable(data){
    return `<table id="dtBasicExample" class="table table-striped table-bordered table-sm" cellspacing="0" width="100%">
    <thead>
        <tr>
        ${data.map((value) => `
        
            <th>${value.id}</th>
       
        `.trim()).join('')}
        </tr>
    </thead>
    <tbody>
    </tbody>
    
  </table>`;
}

const getObjectKeys = (data) => {
    let keys = [];
    data.forEach((dt, index) => {
        if(index === 0) {
            for(let key in dt){
                keys.push(key);
            }
        }
    });
    return keys;
}