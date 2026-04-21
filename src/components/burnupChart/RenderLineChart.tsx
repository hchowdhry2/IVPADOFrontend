import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { SpillageDataResponse } from '../../services/fetchService';
import { Section } from './HighChartsBarChart'; // Import the interface we made earlier
import LoadingSkeleton from '../LoadingSkeleton';
import VisualizationInfoDialog from '../VisualizationInfoDialog';

// 1. Define the Props Interface
interface RenderLineChartProps {
  title: string;
  data: SpillageDataResponse;
  sections: Section[];
  workType: 'story' | 'task';
  loading?: boolean;
}

const RenderLineChart: React.FC<RenderLineChartProps> = ({ title, data, sections, workType, loading = false }) => {
  if (loading) {
    return <LoadingSkeleton type="chart" height="400px" />;
  }

  const isTask = workType === 'task';

  // 2. Get categories from the 'all' section to define the X-Axis
  // We use data['all'] because 'all' is a key in our Record
  const categories = (data['all']?.spillage || []).map(item => 
    item.iterationPath?.split('\\').pop() || 'Sprint'
  );

  // 3. Map through the sections to create series
  // TypeScript now knows exactly what section.key and item.spillagePoints are
  const series: Highcharts.SeriesOptionsType[] = sections.map(section => ({
    type: 'line', // Required for SeriesOptionsType
    name: section.title,
    data: (data[section.key]?.spillage || []).map(item => item.spillagePoints || 0),
    color: section.barColor,
    marker: { enabled: true, radius: 5 },
    lineWidth: 3
  }));

  const options: Highcharts.Options = {
    chart: { 
      type: 'line',
      style: { fontFamily: 'Roboto, Arial, sans-serif' }
    },
    title: { text: title },
    xAxis: { 
      categories: categories,
      crosshair: true,
    },
    yAxis: { 
      title: { text: isTask ? 'Spilled Tasks' : 'Spilled Points' },
      min: 0 
    },
    tooltip: {
      shared: true,
      // crosshair: true,
      valueSuffix: isTask ? ' items' : ' pts'
    },
    series: series, 
    credits: { enabled: false }
  };

  return (
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}></h3>
        <VisualizationInfoDialog visualizationKey="spillage" title="Spillage Logic" />
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default RenderLineChart;