import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { SprintStat } from '../../services/fetchService';
import LoadingSkeleton from '../LoadingSkeleton';
import VisualizationInfoDialog from '../VisualizationInfoDialog';

// 1. Define the Props Interface
interface RenderChartProps {
  title: string;
  statsArray: SprintStat[];
  barColor: string;
  workType: 'story' | 'task';
  loading?: boolean;
}

const RenderChart: React.FC<RenderChartProps> = ({ title, statsArray, barColor, workType, loading = false }) => {
  if (loading || statsArray.length === 0) {
    return <LoadingSkeleton type="chart" height="350px" />;
  }

  const isTask = workType === 'task';

  // 2. Type-safe helper for numeric values
  // It accepts the object and an array of keys (which must be keys of SprintStat)
  const getNumericValue = (obj: SprintStat, keys: string[]): number => {
    for (const k of keys) {
      // Cast 'k' as any to allow flexible lookup, or use keyof SprintStat if keys are exact
      let v = (obj as any)?.[k];
      if (v === undefined || v === null) continue;
      
      const n = typeof v === 'string' ? Number(v.replace(/[,\s]/g, '')) : v;
      if (!Number.isNaN(n)) return n;
    }
    return 0;
  };
  const sprintNames = statsArray.map(item => 
    item.iterationPath?.split('\\').pop() || 'Sprint'
  );

  const initialAssignedData = statsArray.map(item => getNumericValue(item, ['initialPoints', 'initial']));
  const midSprintData = statsArray.map(item => getNumericValue(item, ['midSprintAddedPoints', 'midSprint']));
  const completedTimelyData = statsArray.map(item => getNumericValue(item, ['closedTimely', 'completedTimely']));
  const completedLateData = statsArray.map(item => getNumericValue(item, ['closedLate', 'completedLate']));
  const totalCompletedData = statsArray.map(item => getNumericValue(item, ['totalPointsCompleted', 'completed']));
  
  const averageVelocityValue = totalCompletedData.length > 0 
    ? Number((totalCompletedData.reduce((a, b) => a + b, 0) / totalCompletedData.length).toFixed(0))
    : 0;

  // 3. Annotate Highcharts options
  const options: Highcharts.Options = {
    chart: { 
      type: 'column',
      spacingRight: 20 
    },
    title: { text: title },
    xAxis: { categories: sprintNames },
    yAxis: { 
      title: { text: isTask ? 'Number of Tasks' : 'Story Points' },
      stackLabels: { enabled: true },
      plotLines: averageVelocityValue > 0 ? [{
        color: '#ff4d4d',
        width: 3,
        value: averageVelocityValue,
        zIndex: 5, 
        dashStyle: 'ShortDash' as Highcharts.DashStyleValue,
        label: {
          text: `${isTask ? 'Avg Throughput' : 'Avg Velocity'}: ${averageVelocityValue}`,
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
      { type: 'column', name: 'Planned', data: initialAssignedData, stack: 'assignedGroup', color: '#6366f1' },
      { type: 'column', name: 'Mid-Sprint Added', data: midSprintData, stack: 'assignedGroup', color: '#a5b4fc' },
      { type: 'column', name: 'Completed within sprint', data: completedTimelyData, stack: 'completedGroup', color: '#86efac' },
      { type: 'column', name: 'Completed post sprint', data: completedLateData, stack: 'completedGroup', color: '#22c55e' },
      {
        type: 'spline',
        name: `${isTask ? 'Avg Throughput' : 'Avg Velocity'} (${averageVelocityValue})`,
        data: [], 
        color: '#f43f5e',
        dashStyle: 'ShortDash' as Highcharts.DashStyleValue,
        marker: { enabled: false },
        showInLegend: true 
      }
    ],
    tooltip: { 
      shared: true,
      footerFormat: `<br/><b>${isTask ? 'Avg Throughput' : 'Avg Velocity'}: ${averageVelocityValue}</b>`,
      pointFormat: `<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b> ${isTask ? 'items' : 'pts'}<br/>`
    },
    credits: { enabled: false }
  };

  return (
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}></h3>
        <VisualizationInfoDialog visualizationKey="stats" title="Sprint Metrics Logic" />
      </div>
       <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default RenderChart;