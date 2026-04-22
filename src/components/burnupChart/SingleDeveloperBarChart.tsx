import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { aggregateStats, DeveloperStat, EffortVariance, normalize } from '../../utils/statsHelper';
import LoadingSkeleton from '../LoadingSkeleton';
import VisualizationInfoDialog from '../VisualizationInfoDialog';

interface Props {
  stats: DeveloperStat[] | EffortVariance[];
  selectedDev: string;
  loading?: boolean;
  variant: 'tasks' | 'effort';
  allSprints: string[]; // List of all sprints for consistent x-axis
}

const SingleDeveloperBarChart: React.FC<Props> = ({ stats, selectedDev, loading = false, variant, allSprints }) => {
  if (loading || !stats || stats.length === 0) {
    return <LoadingSkeleton type="chart" height="450px" />;
  }

  const chartOptions = useMemo(() => {
  const isEffort = variant === 'effort';
  const filtered = stats.filter(s => s.developer === selectedDev);

  const sprintDateMap = new Map();
  stats.forEach(s => {
    // Both DeveloperSprintStatDto (tasks) and EffortVarianceDto have a date field
    const date = (s as any).sprintStartDate || (s as any).sortDate;
    if (date) {
      sprintDateMap.set(s.sprint, new Date(date).getTime());
    }
  });

  // 2. Sort the master list chronologically (Oldest -> Newest)
  const masterSprintList = [...allSprints].sort((a, b) => {
    const dateA = sprintDateMap.get(a) || 0;
    const dateB = sprintDateMap.get(b) || 0;
    return dateA - dateB;
  });

  const categories = masterSprintList.map(s => normalize(s));

  let seriesData = [];

  if (isEffort) {
      const typedStats = stats as EffortVariance[];
      return {
        chart: { type: 'column', height: 450 },
        title: { text: `Effort Variance` },
        xAxis: { categories, labels: { rotation: 0 } },
        yAxis: { min: 0, title: { text: 'Hours' } },
        // ENABLE dataLabels for Effort
        plotOptions: { column: { borderRadius: 4, dataLabels: { enabled: true } } },
        series: [
          { name: 'Committed', data: masterSprintList.map(s => typedStats.find(t => normalize(t.sprint) === normalize(s))?.committedEffort || 0), color: '#a5b4fc' },
          { name: 'Actual', data: masterSprintList.map(s => typedStats.find(t => normalize(t.sprint) === normalize(s))?.actualEffort || 0), color: '#54a371ff' }
        ],
        credits: { enabled: false }
      };
    } else {
      const aggStats = aggregateStats(filtered as DeveloperStat[]);
      return {
        chart: { type: 'column', height: 450 },
        title: { text: `Sprint Progress: ${selectedDev}` },
        xAxis: { categories, labels: { rotation: 0 } },
        // ENABLE stackLabels (the total on top) for Tasks
        yAxis: { min: 0, title: { text: 'Tasks' }, stackLabels: { enabled: true } },
        // DISABLE dataLabels (inside segments) for Tasks
        plotOptions: { column: { stacking: 'normal', borderRadius: 4, dataLabels: { enabled: false } } },
        series: [
          { 
            name: 'Tasks Remaining', 
            data: masterSprintList.map(s => {
              const item = aggStats.find(a => normalize(a.sprint) === normalize(s));
              return item ? Math.max(0, item.totalTasksAssigned - item.totalTasksCompleted) : 0;
            }), 
            color: '#a5b4fc' 
          },
          { 
            name: 'Tasks Completed', 
            data: masterSprintList.map(s => aggStats.find(a => normalize(a.sprint) === normalize(s))?.totalTasksCompleted || 0), 
            color: '#54a371ff' 
          }
        ],
        credits: { enabled: false }
      };
    }
  }, [stats, selectedDev, variant, allSprints]);

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}></h3>
        <VisualizationInfoDialog visualizationKey={variant === 'effort' ? 'effortVariance' : 'sprintProgressDev'} title={variant === 'effort' ? 'Effort Variance Logic' : 'Sprint Progress Logic'} />
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default SingleDeveloperBarChart;