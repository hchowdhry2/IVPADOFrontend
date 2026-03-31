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

  // 1. Initial Portion (Matches your backend 'InitialPoints')
  const initialAssignedData = statsArray.map(item => 
    getNumericValue(item, ['initialPoints', 'initial'])
  );

  // 2. Mid-Sprint Portion (Matches your backend 'MidSprintAddedPoints')
  const midSprintData = statsArray.map(item => 
    getNumericValue(item, ['midSprintAddedPoints', 'midSprint'])
  );

  // 3. NEW: Timely Completed (Matches backend 'ClosedTimely')
  const completedTimelyData = statsArray.map(item =>
    getNumericValue(item, ['closedTimely', 'completedTimely'])
  );

  // 4. NEW: Late Completed (Matches backend 'ClosedLate')
  const completedLateData = statsArray.map(item =>
    getNumericValue(item, ['closedLate', 'completedLate'])
  );

  const options = {
    chart: { type: 'column' },
    title: { text: title },
    xAxis: { categories: sprintNames },
    yAxis: { 
      title: { text: 'Story Points' }, 
      stackLabels: { 
        enabled: true,
      } 
    },
    plotOptions: {
      column: {
        stacking: 'normal', 
        dataLabels: { enabled: false }
      }
    },
    series: [
      { 
        name: 'Planned', 
        data: initialAssignedData, 
        stack: 'assignedGroup', 
        color: '#8884d8'
      },
      { 
        name: 'Mid-Sprint Added', 
        data: midSprintData, 
        stack: 'assignedGroup', 
        color: '#9bccfeff' 
      },
      { 
        name: 'Completed within sprint', 
        data: completedTimelyData, 
        stack: 'completedGroup', 
        color: '#82ca9d' 
      },
      { 
        name: 'Completed post sprint', 
        data: completedLateData, 
        stack: 'completedGroup', 
        color: '#2e7d32' 
      }
    ],
    tooltip: {
      shared: true,
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br/>'
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