

export const renderAllCharts = (activeRecruitsFunnel, passiveRecruitsFunnel, totalRecruitsFunnel, activeCurrentWorkflow, passiveCurrentWorkflow, totalCurrentWorkflow,
    participantsGenderMetric, participantsRaceMetric, participantsAgeMetric, activeVerificationStatus, passiveVerificationStatus, denominatorVerificationStatus, recruitsCount ) => {

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
//    activeOptouts.innerHTML = renderLabel(recruitsCount.activeCount, 'Active')
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

   let stackedBarChart = document.createElement('div');
   stackedBarChart.classList = ['col-lg-12 charts'];

   let subStackedBarChart = document.createElement('div');
   subStackedBarChart.classList = ['col-lg-12 viz-div sub-div-shadow'];
   subStackedBarChart.setAttribute('id', 'metrics');
   stackedBarChart.appendChild(subStackedBarChart);

   row3.appendChild(stackedBarChart);

   mainContent.appendChild(row3); // Misc.

   const row4 = document.createElement('div');
   row4.classList = ['row'];

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


   row4.appendChild(pieChart);
   row4.appendChild(pieChart1);
   row4.appendChild(placeHolder);

   mainContent.appendChild(row4); // Misc.


   renderStackBarChart(participantsGenderMetric, participantsRaceMetric, participantsAgeMetric, 'metrics')

   renderActiveFunnelChart(activeRecruitsFunnel, 'funnelChart')
   renderActiveBarChart(activeCurrentWorkflow, 'barChart');
   renderActiveOptouts('activeOptouts');

   renderPassiveFunnelChart(passiveRecruitsFunnel, 'passiveFunnelChart');
   renderPassiveBarChart(passiveCurrentWorkflow, 'passiveBarChart');

   renderTotalFunnelChart(totalRecruitsFunnel, 'totalFunnelChart');
   renderTotalCurrentWorkflow(totalCurrentWorkflow, 'totalBarChart');

   renderActiveVerificationStatus(activeVerificationStatus, denominatorVerificationStatus, 'activeVerificationStatus');
   renderPassiveVerificationStatus(passiveVerificationStatus, denominatorVerificationStatus, 'passiveVerificationStatus');
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

const renderActiveOptouts = (id) => {
    let template = ``;
    template += `
        <span style="text-align: center;"><h5>Opt Outs</h5></span>`
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
        yaxis: {
            'title': 'National Emissions (Megatons CO2)'
        },
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
       // textinfo: 'value',
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

const renderStackBarChart = (participantGenderResponse, participantRaceResponse, participantAgeRangeResponse, id) => {

    const participantGenderResponseF = participantGenderResponse.female;
    const participantGenderResponseM = participantGenderResponse.male;
    const participantGenderResponseI = participantGenderResponse.intersex;
    const participantGenderResponseU = participantGenderResponse.unknown;
 
    const totalGenderResponse = participantGenderResponseF + participantGenderResponseM + participantGenderResponseI + participantGenderResponseU

    const participantRaceResponseAI = participantRaceResponse.americanIndian;
    const participantRaceResponseA = participantRaceResponse.asian;
    const participantRaceResponseAA = participantRaceResponse.africanAmerican;
    const participantRaceResponseL = participantRaceResponse.latino;
    const participantRaceResponseME = participantRaceResponse.middleEastern;
    const participantRaceResponseNH = participantRaceResponse.nativeHawaiian;
    const participantRaceResponseW = participantRaceResponse.white;
    const participantRaceResponseO = participantRaceResponse.none;
    const participantRaceResponseU = participantRaceResponse.other;
        
    const totalRaceResponse = participantRaceResponseAI + participantRaceResponseA + participantRaceResponseAA +
                                participantRaceResponseL + participantRaceResponseME + participantRaceResponseNH +
                            participantRaceResponseW + participantRaceResponseO + participantRaceResponseU
                            

    const participantAgeRangeResponse1 = participantAgeRangeResponse['40-45'];
    const participantAgeRangeResponse2 = participantAgeRangeResponse['46-50'];
    const participantAgeRangeResponse3 = participantAgeRangeResponse['51-55'];
    const participantAgeRangeResponse4 = participantAgeRangeResponse['56-60'];
    const participantAgeRangeResponse5 = participantAgeRangeResponse['61-65'];

    const totalAgeRangeResponse = participantAgeRangeResponse1 + participantAgeRangeResponse2 + participantAgeRangeResponse3 + participantAgeRangeResponse4 + participantAgeRangeResponse5
    const totalVerifiedParticipants = totalGenderResponse + totalRaceResponse + totalAgeRangeResponse

    const genderPercent = Math.round((totalGenderResponse / totalVerifiedParticipants) * 100)
    const racePercent = Math.round((totalRaceResponse / totalVerifiedParticipants) * 100)
    const ageRangePercent = Math.round((totalAgeRangeResponse / totalVerifiedParticipants) * 100)


    let ageTrace1 = {
        y: ['Age'],
        x: [participantAgeRangeResponse1],
        type: 'bar',
        name: '40-45',
        text: `Total: ${ageRangePercent}%`,
        orientation: 'h'
    };

    let ageTrace11 = {
        y: ['Age'],
        x: [participantAgeRangeResponse2],
        type: 'bar',
        name: '46-50',
        text: `Total: ${ageRangePercent}%`,
        orientation: 'h'
    };

    let ageTrace12 = {
        y: ['Age'],
        x: [participantAgeRangeResponse3],
        type: 'bar',
        name: '51-55',
        text: `Total: ${ageRangePercent}%`,
        orientation: 'h'
    };

    let ageTrace13 = {
        y: ['Age'],
        x: [participantAgeRangeResponse4],
        type: 'bar',
        name: '56-60',
        text: `Total: ${ageRangePercent}%`,
        orientation: 'h'
    };

    let ageTrace14 = {
        y: ['Age'],
        x: [participantAgeRangeResponse5],
        type: 'bar',
        name: '61-66',
        text: `Total: ${ageRangePercent}%`,
        orientation: 'h'
    };

    let raceTrace = {
        y: ['Race Binary'],
        x: [participantRaceResponseAI],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'American Indian',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace1 = {
        y: ['Race Binary'],
        x: [participantRaceResponseA],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Asian',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace2 = {
        y: ['Race Binary'],
        x: [participantRaceResponseAA],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'African American',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace3 = {
        y: ['Race Binary'],
        x: [participantRaceResponseL],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Latino',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace4 = {
        y: ['Race Binary'],
        x: [participantRaceResponseME],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Middle Eastern',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace5 = {
        y: ['Race Binary'],
        x: [participantRaceResponseNH],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Native Hawaiian',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };


    let raceTrace6 = {
        y: ['Race Binary'],
        x: [participantRaceResponseW],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'White',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };

    let raceTrace7 = {
        y: ['Race Binary'],
        x: [participantRaceResponseO],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Other',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };
    let raceTrace8 = {
        y: ['Race Binary'],
        x: [participantRaceResponseU],
        xaxis: 'x2',
        yaxis: 'y2',
        type: 'bar',
        name: 'Unknown',
        text: `Total: ${racePercent}%`,
        orientation: 'h'
    };

    let genderTrace = {
        y: ['Sex'],
        x: [participantGenderResponseF],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'bar',
        name: 'Female',
        text: `Total: ${genderPercent}%`,
        orientation: 'h'
    };

    let genderTrace2 = {
        y: ['Sex'],
        x: [participantGenderResponseM],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'bar',
        name: 'Male',
        text: `Total: ${genderPercent}%`,
        orientation: 'h'
    };

    let genderTrace3 = {
        y: ['Sex'],
        x: [participantGenderResponseI],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'bar',
        name: 'Intersex',
        text: `Total: ${genderPercent}%`,
        orientation: 'h'
    };

    let genderTrace4 = {
        y: ['Sex'],
        x: [participantGenderResponseU],
        xaxis: 'x3',
        yaxis: 'y3',
        type: 'bar',
        name: 'Unknown',
        text: `Total: ${genderPercent}%`,
        orientation: 'h'
    };

    let data = [
        ageTrace1, ageTrace11, ageTrace12, ageTrace13, ageTrace14,
        raceTrace, raceTrace1, raceTrace2, raceTrace3, raceTrace4, raceTrace5, raceTrace6, raceTrace7, raceTrace8,
        genderTrace, genderTrace2, genderTrace3, genderTrace4
    ];


    let layout = {
        barmode: 'stack',
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',

        autosize: true,
        width: 1750,
        height: 350,
        title: 'Demographics of Verified Participants',
        yaxis: { domain: [0, 0.266], automargin: true },
        xaxis: { showgrid: false, automargin: true, showticklabels: false, title: { text: `Total number of verified participants: ${totalVerifiedParticipants}` } },
        xaxis3: { anchor: 'y3', showticklabels: false, automargin: true },
        xaxis2: { anchor: 'y2', showticklabels: false, automargin: true },
        yaxis2: { domain: [0.366, 0.633], automargin: true },
        yaxis3: { domain: [0.733, 1], automargin: true },

    };

    Plotly.newPlot(id, data, layout, { responsive: true, displayModeBar: false });
}