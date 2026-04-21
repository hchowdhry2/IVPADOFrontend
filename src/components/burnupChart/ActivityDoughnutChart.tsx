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
      // This creates your "2 out of 5 completed" requirement
      pointFormat: '<b>{point.name}</b>: {point.completed} out of {point.y} completed' 
    },
    plotOptions: {
      pie: {
        innerSize: '65%', // Makes it a donut
        dataLabels: { enabled: false },
        showInLegend: true
      }
    },
    series: [{
      name: 'Activity',
      colorByPoint: true,
      data: activities.map(a => ({
        name: a.activityType,
        y: a.total,           // Segment size
        completed: a.completed // Extra value for tooltip
      }))
    }],
    credits: { enabled: false }
  }), [activities]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default ActivityDoughnutChart;