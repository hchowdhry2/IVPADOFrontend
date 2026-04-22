import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface ActivityDetail {
  activityType: string;
  total: number;
  completed: number;
}

interface Props {
  activities: ActivityDetail[];
}

const ActivityDoughnutChart: React.FC<Props> = ({ activities }) => {
  const chartOptions = useMemo(() => ({
    chart: { type: 'pie', height: 220, backgroundColor: 'transparent' },
    title: { text: null },
    tooltip: { 
      pointFormat: '<b>{point.name}</b>: {point.completed} out of {point.y} completed' 
    },
    colors: [
  '#60a5fa', // Muted Sky Blue (Desaturated)
  '#818cf8', // Muted Periwinkle
  '#9ca3af', // Medium Gray
  '#a78bfa', // Dusty Purple
  '#4382cfff', // Dark Slate
  '#276aadff'  // Ghost White
],
    plotOptions: {
      pie: {
        innerSize: '65%',
        // 1. Enable and configure Data Labels
        dataLabels: { 
          enabled: true,
          format: '<b>{point.name} ({point.completed}/{point.y} completed)</b>', // Shows the activityType
          distance: 15, // Distance from the slice
          style: {
            fontSize: '12px',
            color: '#64748b'
          }
        },
        showInLegend: false // Keeps the legend below for easy reading
      }
    },
    // 2. Formatting the Legend
    // legend: {
    //     align: 'center',
    //     verticalAlign: 'bottom',
    //     layout: 'horizontal',
    //     itemStyle: { fontSize: '10px' }
    // },
    series: [{
      name: 'Activity',
      colorByPoint: true,
      data: activities.map(a => ({
        name: a.activityType,
        y: a.total, 
        completed: a.completed 
      }))
    }],
    credits: { enabled: false }
  }), [activities]);

  // Handle empty state (if activities are empty, show a grey placeholder)
  if (!activities || activities.length === 0) {
      return (
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              No Data
          </div>
      );
  }

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default ActivityDoughnutChart;