import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { aggregateStats, DeveloperStat, normalize } from '../../utils/statsHelper';
import LoadingSkeleton from '../LoadingSkeleton';

interface Props {
  stats: DeveloperStat[];
  selectedDev: string;
  loading?: boolean;
}

const SingleDeveloperBarChart: React.FC<Props> = ({ stats, selectedDev, loading = false }) => {
  if (loading || !stats || stats.length === 0) {
    return <LoadingSkeleton type="chart" height="450px" />;
  }

  const aggregatedStats = useMemo(() => aggregateStats(stats), [stats]);

  const chartOptions = useMemo(() => {
    // 1. Filter and Sort
    const devStats = aggregatedStats.filter(s => s.developer === selectedDev);
    
    const sorted = [...devStats].sort(
      (a, b) => new Date(a.sprintStartDate || 0).getTime() - new Date(b.sprintStartDate || 0).getTime()
    );

    // 2. Prepare Data
    const categories = sorted.map(s => normalize(s.sprint)).reverse();
    const completed = sorted.map(s => s.totalTasksCompleted).reverse();
    
    // Calculate the remaining (uncompleted) portion to stack on top/below
    const uncompleted = sorted.map(s => Math.max(0, s.totalTasksAssigned - s.totalTasksCompleted)).reverse();

    return {
      chart: { type: 'column', height: 450 },
      title: { text: `Sprint Progress: ${selectedDev}` },
      xAxis: { 
        categories,
        labels: { rotation: 0 }
      },
      yAxis: { 
        min: 0, 
        title: { text: 'Tasks' },
        stackLabels: { enabled: true } // Shows the total (Assigned) count on top of the bar
      },
      plotOptions: {
        column: {
          stacking: 'normal', // This forces the "one column" effect
          borderRadius: 4,
          dataLabels: { enabled: false }
        }
      },
      series: [
        { 
          name: 'Tasks Remaining', 
          data: uncompleted, 
          color: '#a5b4fc' // Light Purple
        },
        { 
          name: 'Tasks Completed', 
          data: completed, 
          color: '#22c55e' // Green
        }
      ],
      credits: { enabled: false }
    };
  }, [aggregatedStats, selectedDev]);

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px' }}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default SingleDeveloperBarChart;