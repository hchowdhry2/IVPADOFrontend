import React, { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { DeveloperStat, aggregateStats, normalize } from '../../utils/statsHelper';

interface Props {
  stats: DeveloperStat[];
}

const SingleDeveloperBarChart: React.FC<Props> = ({ stats }) => {
  const aggregatedStats = useMemo(() => aggregateStats(stats), [stats]);

  const developers = useMemo(
    () => Array.from(new Set(aggregatedStats.map(s => s.developer))).sort(),
    [aggregatedStats]
  );

  const [selectedDev, setSelectedDev] = useState<string>(developers[0] || '');

  const chartOptions = useMemo(() => {
    const devStats = aggregatedStats.filter(s => s.developer === selectedDev);

    const sorted = [...devStats].sort(
      (a, b) =>
        new Date(a.sprintStartDate || 0).getTime() -
        new Date(b.sprintStartDate || 0).getTime()
    );

    const categories = sorted.map(s => normalize(s.sprint)).reverse();
    const assigned = sorted.map(s => s.totalTasksAssigned).reverse();
    const completed = sorted.map(s => s.totalTasksCompleted).reverse();

    return {
      chart: { type: 'column', height: 450 },
      xAxis: {
        categories,
        labels: { rotation: -45 }
      },
      series: [
        { name: 'Tasks Assigned', data: assigned, color: '#a5b4fc' },
        { name: 'Tasks Completed', data: completed, color: '#22c55e' }
      ],
      plotOptions: {
        column: {
          borderRadius: 4,
          dataLabels: { enabled: true }
        }
      },
      credits: { enabled: false }
    };
  }, [aggregatedStats, selectedDev]);

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px' }}>
      <select
        value={selectedDev}
        onChange={(e) => setSelectedDev(e.target.value)}
      >
        {developers.map(dev => (
          <option key={dev} value={dev}>{dev}</option>
        ))}
      </select>

      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default SingleDeveloperBarChart;