import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React from 'react'

const RenderChart = ({ title, statsArray, barColor }) => {
  const getNumericValue = (obj, keys) => {
    for (const k of keys) {
      let v = obj?.[k];
      if (v === undefined || v === null) continue;
      const n = typeof v === 'string' ? Number(v.replace(/[,\s]/g, '')) : v;
      if (!Number.isNaN(n)) return n;
    }
    return 0;
  };

  const sprintNames = statsArray.map(item => 
    item.iterationPath?.split('\\').pop() || item.name || 'Sprint'
  );

  // 1. Calculate the 'Initial' portion (Total minus Mid-Sprint)
  const initialAssignedData = statsArray.map(item => {
    const total = getNumericValue(item, ['totalPointsAssigned', 'assignedPoints', 'assigned']);
    const mid = getNumericValue(item, ['midSprintAddedPoints', 'midSprint']);
    return total - mid; // The base of the stack
  });

  // 2. Extract the Mid-Sprint portion
  const midSprintData = statsArray.map(item => 
    getNumericValue(item, ['midSprintAddedPoints', 'midSprint'])
  );

  // 3. Extract Completed Points
  const completedData = statsArray.map(item =>
    getNumericValue(item, ['totalPointsCompleted', 'completedPoints', 'completed'])
  );

  const options = {
    chart: { type: 'column' },
    title: { text: title },
    xAxis: { categories: sprintNames },
    yAxis: { title: { text: 'Story Points' }, stackLabels: { enabled: true } },
    plotOptions: {
      column: {
        stacking: 'normal', // This enables the stacking behavior
        dataLabels: { enabled: false }
      }
    },
    series: [
      { 
        name: 'Initial Assigned', 
        data: initialAssignedData, 
        stack: 'assignedGroup', // Groups 'Initial' and 'Mid' into one bar
        color: barColor 
      },
      { 
        name: 'Mid-Sprint Added', 
        data: midSprintData, 
        stack: 'assignedGroup', // Same stack name as above
        color: '#9bccfeff' // Different color to distinguish it
      },
      { 
        name: 'Completed Points', 
        data: completedData, 
        stack: 'completedGroup', // Different stack name makes it a separate bar
        color: '#82ca9d' 
      }
    ],
    tooltip: {
      shared: true,
      headerFormat: '<b>{point.x}</b><br/>'
    },
    credits: { enabled: false }
  };

  return (
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
       <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default RenderChart