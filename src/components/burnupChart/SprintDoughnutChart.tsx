import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface DoughnutProps {
  sprintName: string;
  featureCount: number;
  clientCount: number;
  type: 'Assigned' | 'Completed';
}

const SprintDoughnutChart: React.FC<DoughnutProps> = ({ sprintName, featureCount, clientCount, type }) => {
  const chartOptions = useMemo(() => {
    return {
      chart: { type: 'pie', height: 200, backgroundColor: 'transparent' },
      title: { text: null },
      tooltip: { pointFormat: '{series.name}: <b>{point.y}</b>' },
      plotOptions: {
        pie: {
          innerSize: '60%', // Makes it a doughnut
          dataLabels: { enabled: false },
          showInLegend: true
        }
      },
      series: [{
        name: type,
        data: [
          { name: 'Feature', y: featureCount, color: '#6366f1' },
          { name: 'Client', y: clientCount, color: '#f59e0b' }
        ]
      }],
      credits: { enabled: false }
    };
  }, [featureCount, clientCount, type]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default SprintDoughnutChart;