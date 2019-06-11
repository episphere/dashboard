export function template(site_logo) {
    return `
        <div class="row">
            <div class="col"><img class="site-specific-logo" src="../../connect.png" alt=""></div>
            <div class="col align-right"><img class="site-specific-logo" src="${site_logo}" alt=""></div>
        </div>
    `;
}