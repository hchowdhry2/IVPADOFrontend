import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DailyScopeTrendChart = ({ title, dailyTrends }) => {
  if (!dailyTrends || dailyTrends.length === 0) return null;

  // 1. Sort/Reverse once so the whole component is in sync (Oldest Sprint first)
  const sortedSprints = [...dailyTrends].sort((a, b) => 
    new Date(a.dayByDayPoints[0].date) - new Date(b.dayByDayPoints[0].date)
  );

  let flatCategories = [];
  let flatData = [];
  let bands = [];
  let currentOffset = 0;

  // 2. Process data and plotBands in the same loop
  sortedSprints.forEach((sprint, sprintIndex) => {
    const sprintName = sprint.iterationPath.split('\\').pop();
    const shortName = `S${sprintIndex + 1}`;
    const sprintLength = sprint.dayByDayPoints.length;

    // Create the background band for this sprint
    bands.push({
      from: currentOffset - 0.5, // Center the band
      to: currentOffset + sprintLength - 0.5,
      color: sprintIndex % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
      label: { 
        text: `Sprint ${sprintIndex + 1}`, 
        align: 'center', 
        verticalAlign: 'top', 
        y: 20,
        style: { color: '#666', fontWeight: 'bold' }
      }
    });

    // Flatten points
    sprint.dayByDayPoints.forEach((point, dayIndex) => {
      flatCategories.push(`${shortName}-D${dayIndex + 1}`);
      flatData.push({
        y: point.totalPoints,
        fullSprintName: sprintName,
        actualDate: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        displayDay: `Day ${dayIndex + 1}`
      });
    });

    currentOffset += sprintLength;
  });

  const options = {
    chart: { type: 'area', height: 400 },
    title: { text: `${title} - Sequential Daily Scope` },
    xAxis: { 
      categories: flatCategories,
      plotBands: bands, // Use the calculated bands
      labels: { rotation: -45, style: { fontSize: '9px' } }
    },
    yAxis: { title: { text: 'Story Points' }, gridLineDashStyle: 'Dash' },
    tooltip: {
      shared: true,
      formatter: function () {
        const p = this.points[0].point;
        return `<b>${p.fullSprintName}</b><br/>` +
               `<b>${p.displayDay}</b> (${p.actualDate})<br/>` +
               `Total Points: <b>${p.y}</b>`;
      }
    },
    series: [{
      name: 'Scope Trend',
      data: flatData,
      step: 'left',
      color: '#6366f1', // Modern Indigo
      fillOpacity: 0.1,
      marker: { enabled: false }
    }],
    credits: { enabled: false }
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DailyScopeTrendChart;