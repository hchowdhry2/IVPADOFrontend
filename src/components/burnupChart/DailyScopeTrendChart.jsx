import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DailyScopeTrendChart = ({ title, dailyTrends }) => {
  if (!dailyTrends || dailyTrends.length === 0) return null;

  let flatCategories = [];
  let flatData = [];

  // 1. Flatten the data: S1 Day 1-14, then S2 Day 1-14...
  [...dailyTrends].reverse().forEach((sprint, sprintIndex) => {
    const sprintName = sprint.iterationPath.split('\\').pop();
    const shortName = `S${sprintIndex + 1}`; // e.g., S1, S2

    sprint.dayByDayPoints.forEach((point, dayIndex) => {
      // Create labels like "S1-D1", "S1-D2"
      flatCategories.push(`${shortName}-D${dayIndex + 1}`);
      
      flatData.push({
        y: point.totalPoints,
        fullSprintName: sprintName,
        actualDate: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        displayDay: `Day ${dayIndex + 1}`
      });
    });
  });

  const options = {
    chart: { type: 'area', height: 400 },
    title: { text: `${title} - Sequential Daily Scope` },
    xAxis: { 
      categories: flatCategories,
      labels: {
        rotation: -45,
        style: { fontSize: '9px' }
      },
      // Optional: Add plotBands to visually separate sprints
      plotBands: dailyTrends.reduce((acc, sprint, i) => {
          const start = acc.length > 0 ? acc[acc.length - 1].to : 0;
          const end = start + sprint.dayByDayPoints.length;
          acc.push({
              from: start,
              to: end,
              color: i % 2 === 0 ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.03)',
              label: { text: `Sprint ${i+1}`, align: 'center', verticalAlign: 'top', y: 15 }
          });
          return acc;
      }, [])
    },
    yAxis: { title: { text: 'Story Points' } },
    tooltip: {
      formatter: function () {
        return `<b>${this.point.fullSprintName}</b><br/>` +
               `<b>${this.point.displayDay}</b> (${this.point.actualDate})<br/>` +
               `Total Points: <b>${this.y}</b>`;
      }
    },
    series: [{
      name: 'Scope Trend',
      data: flatData,
      step: 'left', // Keeps the line flat between changes
      color: '#8884d8',
      fillOpacity: 0.2,
      marker: { enabled: false }
    }],
    credits: { enabled: false }
  };

  return (
    <div className="trend-chart-wrapper" style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DailyScopeTrendChart;