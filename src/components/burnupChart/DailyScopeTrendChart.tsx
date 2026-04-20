import React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { SprintTrend } from '../../services/fetchService';
import LoadingSkeleton from '../LoadingSkeleton';

// 1. Define Props Interface
interface DailyScopeTrendChartProps {
  title: string;
  dailyTrends: SprintTrend[];
  workType: 'story' | 'task';
  loading?: boolean;
}

// 2. Define an interface for our custom point properties 
// This prevents TS errors when accessing 'fullSprintName' inside the tooltip
interface ExtendedPoint extends Highcharts.Point {
  fullSprintName?: string;
  actualDate?: string;
  displayDay?: string;
}

const DailyScopeTrendChart: React.FC<DailyScopeTrendChartProps> = ({ title, dailyTrends, workType, loading = false }) => {
  if (loading || !dailyTrends || dailyTrends.length === 0) {
    return <LoadingSkeleton type="chart" height="300px" />;
  }

  const isTask = workType === 'task';

  // 3. Fix Date subtraction for TypeScript
  const sortedSprints = [...dailyTrends].sort((a, b) => 
    new Date(a.dayByDayPoints[0].date).getTime() - new Date(b.dayByDayPoints[0].date).getTime()
  );

  let flatCategories: string[] = [];
  let flatData: any[] = []; 
  let bands: Highcharts.XAxisPlotBandsOptions[] = [];
  let currentOffset = 0;

  sortedSprints.forEach((sprint, sprintIndex) => {
    const sprintName = sprint.iterationPath.split('\\').pop() || 'Sprint';
    const shortName = `S${sprintIndex + 1}`;
    const sprintLength = sprint.dayByDayPoints.length;

    bands.push({
      from: currentOffset - 0.5,
      to: currentOffset + sprintLength - 0.5,
      color: sprintIndex % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
      label: { 
        text: `Sprint ${sprintIndex + 1}`, 
        align: 'center', 
        verticalAlign: 'top', 
        y: 20,
        style: { color: '#666', fontWeight: 'bold' }
      }
    });

    sprint.dayByDayPoints.forEach((point, dayIndex) => {
      flatCategories.push(`${shortName}-D${dayIndex + 1}`);
      flatData.push({
        y: point.totalPoints,
        fullSprintName: sprintName,
        actualDate: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        displayDay: `Day ${dayIndex + 1}`
      });
    });

    currentOffset += sprintLength;
  });

  const options: Highcharts.Options = {
    chart: { type: 'area', height: 400 },
    title: { text: `${title} - Daily Scope` },
    xAxis: { 
      categories: flatCategories,
      plotBands: bands,
      labels: { rotation: -45, style: { fontSize: '9px' } }
    },
    yAxis: { 
      title: { text: isTask ? 'Number of Tasks' : 'Story Points' }, 
      gridLineDashStyle: 'Dash' as Highcharts.DashStyleValue 
    },
    tooltip: {
      shared: true,
      formatter: function (this: any) {
        // Highcharts Tooltip context 'this' contains 'points' when shared is true
        const p = this.points?.[0]?.point as ExtendedPoint;
        
        if (!p) return '';

        return `<b>${p.fullSprintName}</b><br/>` +
               `<b>${p.displayDay}</b> (${p.actualDate})<br/>` +
               `Total Points: <b>${p.y}</b>`;
      }
    },
    series: [{
      type: 'area',
      name: 'Scope Trend',
      data: flatData,
      step: 'left',
      color: '#6366f1',
      fillOpacity: 0.1,
      marker: { enabled: false }
    }],
    credits: { enabled: false }
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DailyScopeTrendChart;