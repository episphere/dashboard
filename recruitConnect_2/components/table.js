export function table(files) {
    return `
        <table class="table table-bordered table-striped">
            <thead class="thead-dark">
                <tr>
                    <th>Submission ID</th>
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
                    <td>${value.submissionTimestamp}</td>
                    <td>${value.version}</td>
                    <td><a class="viewSubmission" data-submission-id="${value.id}" href="#">View Submisson</a></td>
                    <td><a class="downloadSubmission" data-submission-id="${value.id}" href="#">Download Submission</a></td>
                </tr>
            `.trim()).join('')}
            </tbody>
        <table>
    `;
}
