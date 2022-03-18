export const renderAllCharts = (activeRecruitsFunnel, passiveRecruitsFunnel, totalRecruitsFunnel, activeCurrentWorkflow, passiveCurrentWorkflow, totalCurrentWorkflow,
    participantsGenderMetric, participantsRaceMetric, participantsAgeMetric, activeVerificationStatus, passiveVerificationStatus, denominatorVerificationStatus, recruitsCount, 
    modulesSurvey, ssnSurvey, optOuts, biospecimenMetrics  ) => {

   const row = document.createElement('div');
   row.classList = ['row'];

   let funnelChart = document.createElement('div');
   funnelChart.classList = ['col-lg-4 charts'];

   let subFunnelChart = document.createElement('div');
   subFunnelChart.classList = ['col-lg-12 sub-div-shadow viz-div'];
   subFunnelChart.innerHTML = renderLabel(recruitsCount.activeCount, 'Active');
   subFunnelChart.setAttribute('id', 'funnelChart');
   funnelChart.appendChild(subFunnelChart);

   let barChart = document.createElement('div');
   barChart.classList = ['col-lg-4 charts'];

   let subBarChart = document.createElement('div');
   subBarChart.classList = ['col-lg-12 sub-div-shadow viz-div'];
   subBarChart.innerHTML = renderLabel(recruitsCount.activeCount, 'Active');
   subBarChart.setAttribute('id', 'barChart');
   barChart.appendChild(subBarChart);

   let activeOptouts = document.createElement('div');
   activeOptouts.classList = ['col-lg-4 charts'];

   let subactiveOptouts = document.createElement('div');
   subactiveOptouts.classList = ['col-lg-12 sub-div-shadow viz-div'];
   subactiveOptouts.setAttribute('id', 'activeOptouts');
   activeOptouts.appendChild(subactiveOptouts);

   row.appendChild(funnelChart);
   row.appendChild(barChart);
   row.appendChild(activeOptouts);

   mainContent.appendChild(row); // active 

   const row1 = document.createElement('div');
   row1.classList = ['row'];

   let funnelChart1 = document.createElement('div');
   funnelChart1.classList = ['col-lg-4 charts'];

   let subFunnelChart1 = document.createElement('div');
   subFunnelChart1.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subFunnelChart1.innerHTML = renderLabel(recruitsCount.passiveCount, 'Passive');
   subFunnelChart1.setAttribute('id', 'passiveFunnelChart');
   funnelChart1.appendChild(subFunnelChart1);

   let barChart1 = document.createElement('div');
   barChart1.classList = ['col-lg-4 charts'];

   let subBarChart1 = document.createElement('div');
   subBarChart1.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subBarChart1.innerHTML = renderLabel(recruitsCount.passiveCount, 'Passive');
   subBarChart1.setAttribute('id', 'passiveBarChart');
   barChart1.appendChild(subBarChart1);

   let activeCounts1 = document.createElement('div');
   activeCounts1.classList = ['col-lg-4 charts'];
   let subActiveCounts1 = document.createElement('div');
   subActiveCounts1.classList = ['col-lg-12 viz-div sub-div-shadow'];
  // subActiveCounts1.innerHTML = renderLabel(recruitsCount.passiveCount, 'Passive');
   subActiveCounts1.setAttribute('id', 'passiveCounts');
   activeCounts1.appendChild(subActiveCounts1);


   row1.appendChild(funnelChart1);
   row1.appendChild(barChart1);
   row1.appendChild(activeCounts1);

   mainContent.appendChild(row1); // passive

   const row2 = document.createElement('div');
   row2.classList = ['row'];

   let funnelChart2 = document.createElement('div');
   funnelChart2.classList = ['col-lg-4 charts'];

   let subFunnelChart2 = document.createElement('div');
   subFunnelChart2.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subFunnelChart2.innerHTML = renderLabel(recruitsCount.activeCount + recruitsCount.passiveCount, 'Total');
   subFunnelChart2.setAttribute('id', 'totalFunnelChart');
   funnelChart2.appendChild(subFunnelChart2);
  

   let barChart2 = document.createElement('div');
   barChart2.classList = ['col-lg-4 charts'];

   let subBarChart2 = document.createElement('div');
   subBarChart2.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subBarChart2.innerHTML = renderLabel(recruitsCount.activeCount + recruitsCount.passiveCount, 'Total');;
   subBarChart2.setAttribute('id', 'totalBarChart');
   barChart2.appendChild(subBarChart2);


   let totalCounts = document.createElement('div');
   totalCounts.classList = ['col-lg-4 charts'];

   let subTotalCounts = document.createElement('div');
   subTotalCounts.classList = ['col-lg-12 sub-div-shadow viz-div'];
 //  subTotalCounts.innerHTML = renderLabel(recruitsCount.activeCount + recruitsCount.passiveCount, 'Total');;
   subTotalCounts.setAttribute('id', 'totalCounts');
   totalCounts.appendChild(subTotalCounts);

   row2.appendChild(funnelChart2)
   row2.appendChild(barChart2);
   row2.appendChild(totalCounts);

   mainContent.appendChild(row2); // total

   const row3 = document.createElement('div');
   row3.classList = ['row'];

   let pieChart = document.createElement('div');
   pieChart.classList = ['col-lg-4 charts'];

   let subPieChart = document.createElement('div');
   subPieChart.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subPieChart.setAttribute('id', 'activeVerificationStatus');
   pieChart.appendChild(subPieChart);
  
   let pieChart1 = document.createElement('div');
   pieChart1.classList = ['col-lg-4 charts'];

   let subPieChart1 = document.createElement('div');
   subPieChart1.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subPieChart1.setAttribute('id', 'passiveVerificationStatus');
   pieChart1.appendChild(subPieChart1);

   let placeHolder = document.createElement('div');
   placeHolder.classList = ['col-lg-4 charts'];
   let subPlaceHolder = document.createElement('div');
   subPlaceHolder.classList = ['col-lg-12 viz-div sub-div-shadow'];
  // subActiveCounts1.innerHTML = renderLabel(recruitsCount.passiveCount, 'Passive');
   subPlaceHolder.setAttribute('id', 'placeHolder');
   placeHolder.appendChild(subPlaceHolder);


   row3.appendChild(pieChart);
   row3.appendChild(pieChart1);
   row3.appendChild(placeHolder);

   mainContent.appendChild(row3); // Misc.

   const row4 = document.createElement('div');
   row4.classList = ['row'];

   let pieChartAge = document.createElement('div');
   pieChartAge.classList = ['col-lg-4 charts'];

   let subPieChartAge = document.createElement('div');
   subPieChartAge.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subPieChartAge.setAttribute('id', 'ageMetrics');
   pieChartAge.appendChild(subPieChartAge);
  
   let pieChartRace = document.createElement('div');
   pieChartRace.classList = ['col-lg-4 charts'];

   let subPieChartRace = document.createElement('div');
   subPieChartRace.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subPieChartRace.setAttribute('id', 'raceMetrics');
   pieChartRace.appendChild(subPieChartRace);


   let pieChartSex = document.createElement('div');
   pieChartSex.classList = ['col-lg-4 charts'];
   let subPieChartSex = document.createElement('div');
   subPieChartSex.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subPieChartSex.setAttribute('id', 'sexMetrics');
   pieChartSex.appendChild(subPieChartSex);


   row4.appendChild(pieChartAge);
   row4.appendChild(pieChartRace);
   row4.appendChild(pieChartSex);

   mainContent.appendChild(row4); // Misc.

   const row5 = document.createElement('div');
   row5.classList = ['row'];

   let pieChartModule = document.createElement('div');
   pieChartModule.classList = ['col-lg-4 charts'];

   let subPieChartModule = document.createElement('div');
   subPieChartModule.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subPieChartModule.setAttribute('id', 'moduleMetrics');
   pieChartModule.appendChild(subPieChartModule);
  
   let pieChartSsn = document.createElement('div');
   pieChartSsn.classList = ['col-lg-4 charts'];

   let subPieChartSsn = document.createElement('div');
   subPieChartSsn.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subPieChartSsn.setAttribute('id', 'ssnMetrics');
   pieChartSsn.appendChild(subPieChartSsn);

//    let pieChartBiopspecimen = document.createElement('div');
//    pieChartBiopspecimen.classList = ['col-lg-4 charts'];

//    let subPieChartBiopspecimen = document.createElement('div');
//    subPieChartBiopspecimen.classList = ['col-lg-12 viz-div sub-div-shadow'];
//    subPieChartBiopspecimen.setAttribute('id', 'biospecimenMetrics');
//    pieChartBiopspecimen.appendChild(subPieChartBiopspecimen);


   let barChartBiopspecimen = document.createElement('div');
   barChartBiopspecimen.classList = ['col-lg-4 charts'];

   let subBarChartBiopspecimen = document.createElement('div');
   subBarChartBiopspecimen.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subBarChartBiopspecimen.setAttribute('id', 'biospecimenMetrics');
   barChartBiopspecimen.appendChild(subBarChartBiopspecimen);

   

   row5.appendChild(pieChartModule);
   row5.appendChild(pieChartSsn);
   row5.appendChild(barChartBiopspecimen);

   mainContent.appendChild(row5); // Misc.

   //renderStackBarChart(participantsGenderMetric, participantsRaceMetric, participantsAgeMetric, 'metrics')
   renderAgeMetrics(participantsAgeMetric, 'ageMetrics');
   renderRaceMetrics(participantsRaceMetric, 'raceMetrics');
   renderSexMetrics(participantsGenderMetric, 'sexMetrics');

   renderActiveFunnelChart(activeRecruitsFunnel, 'funnelChart')
   renderActiveBarChart(activeCurrentWorkflow, 'barChart');
   renderActiveOptouts(optOuts, recruitsCount.activeCount, 'activeOptouts');

   renderPassiveFunnelChart(passiveRecruitsFunnel, 'passiveFunnelChart');
   renderPassiveBarChart(passiveCurrentWorkflow, 'passiveBarChart');

   renderTotalFunnelChart(totalRecruitsFunnel, 'totalFunnelChart');
   renderTotalCurrentWorkflow(totalCurrentWorkflow, 'totalBarChart');

   renderActiveVerificationStatus(activeVerificationStatus, denominatorVerificationStatus, 'activeVerificationStatus');
   renderPassiveVerificationStatus(passiveVerificationStatus, denominatorVerificationStatus, 'passiveVerificationStatus');
   renderModuleChart(modulesSurvey, 'moduleMetrics');
   renderSsnChart(ssnSurvey, 'ssnMetrics');
   const verifiedPts = ssnSurvey.verifiedParticipants
   renderBiospecimenChart(biospecimenMetrics, verifiedPts, 'biospecimenMetrics');
}

const renderLabel = (count, recruitType) => {
    let template = ``;
    (recruitType === 'Active') ?
        (template += `<span class="badge bg-primary" style="color:white"> ${recruitType} Recruits: ${count}</span>`)
        :
    (recruitType === 'Passive') ?
        (template += `<span class="badge bg-primary" style="color:white"> ${recruitType} Recruits: ${count}</span>`)
        :
    (recruitType === 'Total') ?
        (template += `<span class="badge bg-primary" style="color:white"> ${recruitType} Recruits: ${count}</span>`)
        :
        ''

    return template;

}

const renderActiveFunnelChart = (activeRecruitsFunnel, id) => {
    const signIn =  activeRecruitsFunnel.signedIn
    const consent = activeRecruitsFunnel.consented;
    const userProfile =  activeRecruitsFunnel.submittedProfile
    const verification = activeRecruitsFunnel.verification
    const verified = activeRecruitsFunnel.verified
    
        const data = [{
            x: [signIn, consent, userProfile, verification, verified],
            y: ['Signed In', 'Consented', 'Profile Done', 'Verification', 'Verified'],
            type: 'funnel',
            textinfo: 'hello ${23}', 
            marker: {
                color: ["#0C1368", "#242C8F", "#525DE9", '#008ECC', '#6593F5']
            }
        }];
    
        const layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            title: `Cumulative Status`
        };
    
        Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
    }


const renderActiveBarChart = (activeCurrentWorkflow, id) => {
    const notSignedIn = activeCurrentWorkflow.notSignedIn;
    const signedInNotConsented = activeCurrentWorkflow.signedIn;
    const consentedNotSubmitted = activeCurrentWorkflow.consented;
    const submittedVerificationNotCompleted = activeCurrentWorkflow.submittedProfile;
    const verificationCompleted = activeCurrentWorkflow.verification;
    const trace1 = {
        x: ['Never Signed In', 'Signed In, No Consent', 'Consented, No Profile', 'Profile, Verified Not Complete', 'Verification Complete'],
        y: [notSignedIn, signedInNotConsented, consentedNotSubmitted, submittedVerificationNotCompleted, verificationCompleted],
        name: 'Completed',
        type: 'bar'
    };

    const data = [trace1];

    const layout = {
        barmode: 'stack',
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
       // colorway: ['#7f7fcc', '#0C1368', '#525DE9', '#008ECC'],
        title: 'Current Status in Workflow'
    };

    Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
}

const renderPassiveFunnelChart = (passiveRecruitsFunnel, id) => {
    
    const signIn =  passiveRecruitsFunnel.signedIn
    const consent = passiveRecruitsFunnel.consented;
    const userProfile =  passiveRecruitsFunnel.submittedProfile
    const verification = passiveRecruitsFunnel.verification
    const verified = passiveRecruitsFunnel.verified

        const data = [{
            x: [signIn, consent, userProfile, verification, verified],
            y: ['Signed In', 'Consented', 'Profile Done', 'Verification', 'Verified'],
            type: 'funnel',
            marker: {
                color: ["#0C1368", "#242C8F", "#525DE9", '#008ECC', '#6593F5']
            }
        }];
    
        const layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };
    
        Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
};

const renderActiveOptouts = (optOuts, recruitsCount, id) => {
    let template = ``;
    template += `
        ${renderLabel(recruitsCount, 'Active')}
        <span style="text-align: center;"><h5>Opt Outs</h5></span>
        <center><h4><b>Total Opt Out: ${optOuts.totalOptOuts}</b></h4></center>`
    document.getElementById(id).innerHTML = template
}

const renderPassiveBarChart = (passiveCurrentWorkflow, id) => {
    const notSignedIn = passiveCurrentWorkflow.notSignedIn;
    const signedInNotConsented = passiveCurrentWorkflow.signedIn;
    const consentedNotSubmitted = passiveCurrentWorkflow.consented;
    const submittedVerificationNotCompleted = passiveCurrentWorkflow.submittedProfile;
    const verificationCompleted = passiveCurrentWorkflow.verification;
    const trace1 = {
        x: ['Never Signed In', 'Signed In, No Consent', 'Consented, No Profile', 'Profile, Verified Not Complete', 'Verification Complete'],
        y: [notSignedIn, signedInNotConsented, consentedNotSubmitted, submittedVerificationNotCompleted, verificationCompleted],
        name: 'Completed',
        type: 'bar'
    };

    const data = [trace1];

    const layout = {
        barmode: 'stack',
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
       // colorway: ['#7f7fcc', '#0C1368', '#525DE9', '#008ECC'],
    };

    Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });

}

const renderTotalFunnelChart = (totalRecruitsFunnel, id) => {
    const signIn =  totalRecruitsFunnel.signedIn
    const consent = totalRecruitsFunnel.consented;
    const userProfile =  totalRecruitsFunnel.submittedProfile
    const verified = totalRecruitsFunnel.verified
    const verification = totalRecruitsFunnel.verification
    
        const data = [{
            x: [signIn, consent, userProfile, verification, verified],
            y: ['Signed In', 'Consented', 'Profile Done', 'Verification', 'Verified'],
            type: 'funnel',
            marker: {
                color: ["#0C1368", "#242C8F", "#525DE9", '#008ECC', '#6593F5']
            }
        }];
    
        const layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
        };
    
        Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
};


const renderTotalCurrentWorkflow = (totalCurrentWorkflow, id) => {
    const notSignedIn = totalCurrentWorkflow.notSignedIn;
    const signedInNotConsented = totalCurrentWorkflow.signedIn;
    const consentedNotSubmitted = totalCurrentWorkflow.consented;
    const submittedVerificationNotCompleted = totalCurrentWorkflow.submittedProfile;
    const verificationCompleted = totalCurrentWorkflow.verification;
    const trace1 = {
        x: ['Never Signed In', 'Signed In, No Consent', 'Consented, No Profile', 'Profile, Verified Not Complete', 'Verification Complete'],
        y: [notSignedIn, signedInNotConsented, consentedNotSubmitted, submittedVerificationNotCompleted, verificationCompleted],
        name: 'Completed',
        type: 'bar'
    };

    const data = [trace1];

    const layout = {
        barmode: 'stack',
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
    };

    Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });

}

const renderAgeMetrics = (ageMetrics, id) => {
    const verifiedParticipants = ageMetrics.verifiedParticipants ? ageMetrics.verifiedParticipants : 0

    const participantAgeRange1 = ageMetrics['40-45'] !== undefined ? ageMetrics['40-45'] : 0;
    const participantAgeRange2 = ageMetrics['46-50'] !== undefined ? ageMetrics['46-50'] : 0;
    const participantAgeRange3 = ageMetrics['51-55'] !== undefined ? ageMetrics['51-55'] : 0;
    const participantAgeRange4 = ageMetrics['56-60'] !== undefined ? ageMetrics['56-60'] : 0;
    const participantAgeRange5 = ageMetrics['61-65'] !== undefined ? ageMetrics['61-65'] : 0;

    const participantAgeRangeResponse1 = ((participantAgeRange1)/(verifiedParticipants)*100).toFixed(1);
    const participantAgeRangeResponse2 = ((participantAgeRange2)/(verifiedParticipants)*100).toFixed(1);
    const participantAgeRangeResponse3 = ((participantAgeRange3)/(verifiedParticipants)*100).toFixed(1);
    const participantAgeRangeResponse4 = ((participantAgeRange4)/(verifiedParticipants)*100).toFixed(1);
    const participantAgeRangeResponse5 = ((participantAgeRange5)/(verifiedParticipants)*100).toFixed(1);

    let data = [{
        values: [participantAgeRangeResponse1, participantAgeRangeResponse2, participantAgeRangeResponse3, participantAgeRangeResponse4, participantAgeRangeResponse5],
        labels: [ `40-45: N = ${participantAgeRange1}`, 
                    `46-50: N = ${participantAgeRange2}`, 
                    `51-55: N = ${participantAgeRange3}`,
                    `56-60: N = ${participantAgeRange4}`, 
                    `61-65: N = ${participantAgeRange5}`],
        hoverinfo: 'label+value',
        type: 'pie'
      }];
      
      const layout = {
        showlegend: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: `Age of Verified Participants N = ${verifiedParticipants}`
    };

      Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
  }

  const renderRaceMetrics = (raceMetrics, id) => {
    const verifiedParticipants = raceMetrics.verifiedParticipants ? raceMetrics.verifiedParticipants : 0

    const participantW = raceMetrics['white'] !== undefined ? raceMetrics['white'] : 0
    const participantO = raceMetrics['other']  !== undefined ? raceMetrics['other'] : 0
    const participantU = raceMetrics['unavailable'] !== undefined ? raceMetrics['unavailable'] : 0
   
    const participantRaceResponse1 = ((participantW)/(verifiedParticipants)*100).toFixed(1)
    const participantRaceResponse2 = ((participantO)/(verifiedParticipants)*100).toFixed(1)
    const participantRaceResponse3 = ((participantU)/(verifiedParticipants)*100).toFixed(1)


    let data = [{
        values: [participantRaceResponse1, participantRaceResponse2, participantRaceResponse3],
        labels: [ `White/Non-Hispanic: N=${participantW}`, 
                    `Other: N=${participantO}`, 
                    `Unavailable: N=${participantU}`],
        hoverinfo: 'label+value',
        type: 'pie'
      }];
      
    const layout = {
        showlegend: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: `Race/Ethnicity of Verified Participants N = ${verifiedParticipants}`
    };

      Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
  }

  const renderSexMetrics = (sexMetrics, id) => {

    const verifiedParticipants = sexMetrics.verifiedParticipants ? sexMetrics.verifiedParticipants : 0

    const participantM = sexMetrics['male'] !== undefined ? sexMetrics['male'] : 0
    const participantF = sexMetrics['female'] !== undefined ? sexMetrics['female'] : 0
    const participantI = sexMetrics['intersex'] !== undefined ? sexMetrics['intersex'] : 0
    const participantU = sexMetrics['unavailable'] !== undefined ? sexMetrics['unavailable'] : 0

    const participantSexResponse1 = ((participantM)/(verifiedParticipants)*100).toFixed(1)
    const participantSexResponse2 = ((participantF)/(verifiedParticipants)*100).toFixed(1)
    const participantSexResponse3 = ((participantI)/(verifiedParticipants)*100).toFixed(1)
    const participantSexResponse4 = ((participantU)/(verifiedParticipants)*100).toFixed(1)

    let data = [{
        values: [participantSexResponse1, participantSexResponse2, participantSexResponse3, participantSexResponse4],
        labels: [   `Male: N=${participantM}`, 
                    `Female: N=${participantF}`, 
                    `Intersex or Other: N=${participantI}`,
                    `Unavailable: N=${participantU}`],
        hoverinfo: 'label+value',
        type: 'pie'
      }];
      
      const layout = {
        showlegend: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: `Sex of Verified Participants N = ${verifiedParticipants}`
    };

      Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
  }


const renderActiveVerificationStatus = (activeVerificationStatus, denominatorVerificationStatus, id) => {
    const notYetVerified =  activeVerificationStatus.notYetVerified 
                            ? ((activeVerificationStatus.notYetVerified)/(denominatorVerificationStatus.activeDenominator)*100).toFixed(1) : 0
    const verified = activeVerificationStatus.verified 
                        ? ((activeVerificationStatus.verified)/(denominatorVerificationStatus.activeDenominator)*100).toFixed(1) : 0
    const cannotBeVerified =  activeVerificationStatus.cannotBeVerified 
                        ? ((activeVerificationStatus.cannotBeVerified)/(denominatorVerificationStatus.activeDenominator)*100).toFixed(1) : 0
    const duplicate = activeVerificationStatus.duplicate 
                        ? ((activeVerificationStatus.duplicate)/(denominatorVerificationStatus.activeDenominator)*100).toFixed(1) : 0
    const outreachTimedOut = activeVerificationStatus.outreachTimedout 
                        ? ((activeVerificationStatus.outreachTimedout)/(denominatorVerificationStatus.activeDenominator)*100).toFixed(1) : 0
    let data = [{
        values: [notYetVerified, verified, cannotBeVerified, duplicate, outreachTimedOut],
        labels: [ `Not Yet Verified: N=${activeVerificationStatus.notYetVerified} `, 
                    `Verified: N=${activeVerificationStatus.verified }`, 
                    `Cannot be Verified: N=${activeVerificationStatus.cannotBeVerified }`,
                    `Duplicate: N=${activeVerificationStatus.duplicate }`, 
                    `Outreach Maxed Out: N=${activeVerificationStatus.outreachTimedout }`],
        hoverinfo: 'label+value',
        type: 'pie'
      }];
      
      const layout = {
        showlegend: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: `Active Recruits Verification Status among those with <br> Profile Completed N=${denominatorVerificationStatus.activeDenominator}`,
        text: 'among those with Profile Completed'
    };

      Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
  }

  const renderPassiveVerificationStatus = (passiveVerificationStatus, denominatorVerificationStatus, id) => {
    const notYetVerified =  passiveVerificationStatus.notYetVerified 
                            ? ((passiveVerificationStatus.notYetVerified)/(denominatorVerificationStatus.passiveDenominator)*100).toFixed(1) : 0
    const verified = passiveVerificationStatus.verified 
                        ? ((passiveVerificationStatus.verified)/(denominatorVerificationStatus.passiveDenominator)*100).toFixed(1) : 0           
    const cannotBeVerified =  passiveVerificationStatus.cannotBeVerified 
                        ? ((passiveVerificationStatus.cannotBeVerified)/(denominatorVerificationStatus.passiveDenominator)*100).toFixed(1) : 0
    const duplicate = passiveVerificationStatus.duplicate 
                        ? ((passiveVerificationStatus.duplicate)/(denominatorVerificationStatus.passiveDenominator)*100).toFixed(1) : 0
    const outreachTimedOut = passiveVerificationStatus.outreachTimedout 
                        ? ((passiveVerificationStatus.outreachTimedout)/(denominatorVerificationStatus.passiveDenominator)*100).toFixed(1) : 0
    let data = [{
        values: [notYetVerified, verified, cannotBeVerified, duplicate, outreachTimedOut],

        labels: [ `Not Yet Verified: N=${passiveVerificationStatus.notYetVerified }`, 
                `Verified: N=${passiveVerificationStatus.verified}`, 
                `Cannot be Verified: N=${passiveVerificationStatus.cannotBeVerified}`,
                `Duplicate: N=${passiveVerificationStatus.duplicate}`, 
                `Outreach Maxed Out: N=${passiveVerificationStatus.outreachTimedout }`],
        hoverinfo: 'label+value',
        type: 'pie'
      }];

      const layout = {
        showlegend: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: `Passive Recruits Verification Status among those with <br> Profile Completed N=${denominatorVerificationStatus.passiveDenominator}`
    };
      
      Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
  }

  const renderModuleChart = (modulesSurvey, id) => {
    const verifiedParticipants = modulesSurvey.verifiedParticipants ? modulesSurvey.verifiedParticipants : 0
    const noModulesSubmitted =  modulesSurvey.noModulesSubmitted ? ((modulesSurvey.noModulesSubmitted)/(verifiedParticipants)*100).toFixed(1) : 0
    const moduleOneSubmitted = modulesSurvey.moduleOneSubmitted ? ((modulesSurvey.moduleOneSubmitted)/(verifiedParticipants)*100).toFixed(1) : 0
    const modulesTwoThreeSubmitted =  modulesSurvey.modulesTwoThreeSubmitted ? ((modulesSurvey.modulesTwoThreeSubmitted)/(verifiedParticipants)*100).toFixed(1) : 0
    const modulesSubmitted = modulesSurvey.modulesSubmitted ? ((modulesSurvey.modulesSubmitted)/(verifiedParticipants)*100).toFixed(1) : 0
       let data = [{
        values: [noModulesSubmitted, moduleOneSubmitted, modulesTwoThreeSubmitted, modulesSubmitted],

        labels: [ `None: N=${modulesSurvey.noModulesSubmitted }`, 
                `BOH only: N=${modulesSurvey.moduleOneSubmitted}`, 
                `2 or 3 sections : N=${modulesSurvey.modulesTwoThreeSubmitted}`, 
                `All: N=${modulesSurvey.modulesSubmitted}`],
        hoverinfo: 'label+value',
        type: 'pie'
      }];

      const layout = {
        showlegend: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: `Completion of Initial Survey among verified participants N=${verifiedParticipants}`
    };
      
      Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
  }

  const renderSsnChart = (ssnSurvey, id) => {
    const verifiedParticipants = ssnSurvey.verifiedParticipants ? ssnSurvey.verifiedParticipants : 0
    const noSsnFlag =  ssnSurvey.ssnNoFlagCounter ? ((ssnSurvey.ssnNoFlagCounter)/(verifiedParticipants)*100).toFixed(1) : 0
    const ssnFullFlag = ssnSurvey.ssnFullFlagCounter ? ((ssnSurvey.ssnFullFlagCounter)/(verifiedParticipants)*100).toFixed(1) : 0
    const ssnHalfFlag =  ssnSurvey.ssnHalfFlagCounter ? ((ssnSurvey.ssnHalfFlagCounter)/(verifiedParticipants)*100).toFixed(1) : 0
    
       let data = [{
        values: [noSsnFlag, ssnFullFlag, ssnHalfFlag],

        labels: [ `0 digits given: N=${ssnSurvey.ssnNoFlagCounter}`, 
                `Full SSN given: N=${ssnSurvey.ssnFullFlagCounter}`, 
                `Partial digits: N=${ssnSurvey.ssnHalfFlagCounter}`],
        hoverinfo: 'label+value',
        type: 'pie'
      }];

      const layout = {
        showlegend: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: `Completion of SSN among verified participants N=${verifiedParticipants}`
    };
      
    Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
  }
 
  const renderBiospecimenChart = (biospecimenMetrics, verifiedPts, id) => {
    const verifiedParticipants =  verifiedPts ? verifiedPts : 0

    const all =  biospecimenMetrics.all
    const none =  biospecimenMetrics.none
    const bloodUrine = biospecimenMetrics.bloodUrine
    const bloodMouthwash =  biospecimenMetrics.bloodMouthwash
    const urineMouthwash =  biospecimenMetrics.urineMouthwash
    const blood = biospecimenMetrics.blood
    const mouthwash =  biospecimenMetrics.mouthwash
    const urine =  biospecimenMetrics.urine

    const trace1 = {
        x: ['None', 'Blood only', 'Urine only', 'Mouthwash only', 'Blood/Urine only', 'Urine/Mouthwash only', 'Blood/Mouthwash only', 'All'],
        y: [none, blood, urine, mouthwash, bloodUrine, urineMouthwash, bloodMouthwash, all],
        type: 'bar',
    };
    
    const data = [trace1];
    

    const layout = {
        barmode: 'stack',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
        title: `Baseline biospecimens collected <br> among verified participants N=${verifiedParticipants}`
    };
      
    Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
  }