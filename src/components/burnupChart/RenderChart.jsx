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

  const initialAssignedData = statsArray.map(item => getNumericValue(item, ['initialPoints', 'initial']));
  const midSprintData = statsArray.map(item => getNumericValue(item, ['midSprintAddedPoints', 'midSprint']));
  const completedTimelyData = statsArray.map(item => getNumericValue(item, ['closedTimely', 'completedTimely']));
  const completedLateData = statsArray.map(item => getNumericValue(item, ['closedLate', 'completedLate']));

  // --- VELOCITY CALCULATIONS ---
  const totalCompletedData = statsArray.map(item => getNumericValue(item, ['totalPointsCompleted', 'completed']));
  
  // Calculate average, defaulting to 0 if no data
  const averageVelocityValue = totalCompletedData.length > 0 
    ? Number((totalCompletedData.reduce((a, b) => a + b, 0) / totalCompletedData.length).toFixed(0))
    : 0;

  // Create the line data array
  const averageVelocitySeries = new Array(sprintNames.length).fill(averageVelocityValue);

const options = {
  chart: { 
    type: 'column',
    // Adding spacing ensure the label on the right isn't cut off
    spacingRight: 20 
  },
  title: { text: title },
  xAxis: { categories: sprintNames },
  yAxis: { 
    title: { text: 'Story Points' }, 
    stackLabels: { enabled: true },
    // 1. USE PLOTLINES FOR THE EDGE-TO-EDGE VISUAL
    plotLines: averageVelocityValue > 0 ? [{
      color: '#ff4d4d',
      width: 2,
      value: averageVelocityValue,
      zIndex: 5, 
      dashStyle: 'ShortDash',
      label: {
        text: `Avg: ${averageVelocityValue}`,
        align: 'right',
        verticalAlign: 'bottom',
        textAlign: 'right',
        y: -5,
        style: { color: '#ff4d4d', fontWeight: 'bold' }
      }
    }] : []
  },
  plotOptions: {
    column: {
      stacking: 'normal', 
      dataLabels: { enabled: false }
    }
  },
  series: [
    { name: 'Planned', data: initialAssignedData, stack: 'assignedGroup', color: '#6366f1' },
    { name: 'Mid-Sprint Added', data: midSprintData, stack: 'assignedGroup', color: '#a5b4fc' },
    { name: 'Completed within sprint', data: completedTimelyData, stack: 'completedGroup', color: '#86efac' },
    { name: 'Completed post sprint', data: completedLateData, stack: 'completedGroup', color: '#22c55e' },
    
    // 2. USE A "DUMMY" SERIES JUST FOR THE LEGEND
    // We set data to null or empty so it doesn't draw a second line
    {
      type: 'spline',
      name: `Avg Velocity (${averageVelocityValue})`,
      data: [], 
      color: '#f43f5e',
      dashStyle: 'ShortDash',
      marker: { enabled: false },
      showInLegend: true 
    }
  ],
  tooltip: { 
    shared: true,
    // Custom tooltip to show average value even if not hovering on the line
    footerFormat: `<br/><b>Avg Velocity: ${averageVelocityValue}</b>`
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