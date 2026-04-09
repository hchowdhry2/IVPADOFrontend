import React from 'react';
import RenderChart from './RenderChart';
import RenderLineChart from './RenderLineChart';
import DailyScopeTrendChart from './DailyScopeTrendChart';
import { useDevOpsContext } from '../../context/DevOpsProvider';
import { SpillageDataResponse } from '../../services/fetchService';

// 1. Define the Section interface
export interface Section {
  key: string;
  title: string;
  barColor: string;
}

export const sections: Section[] = [
  { key: 'all', title: 'All', barColor: '#6366f1' },
  { key: 'feature', title: 'Feature', barColor: '#65a30d' },
  { key: 'client', title: 'Client Issues', barColor: '#8b5cf6' }
];

// 2. Define Props Interface
interface HighChartsBarChartProps {
  data: SpillageDataResponse | null;
  workType: 'story' | 'task';
}

const HighChartsBarChart: React.FC<HighChartsBarChartProps> = ({ data }) => {
  // 3. Pull workType and loading from context
  const { loading, workType } = useDevOpsContext(); 

  // 4. Determine the Label/Unit
  const unitLabel = workType === 'task' ? 'Count' : 'Points';

  if (loading || !data) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Dashboard Data...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      <RenderLineChart 
        title={`Spillage (${unitLabel})`} 
        data={data} 
        sections={sections} 
        workType={workType} 
      />

      {sections.map((section) => (
        <div key={section.key} className="section-container" style={{ marginBottom: '60px' }}>
          
          <RenderChart 
            title={`${section.title} - ${unitLabel} Analysis`} 
            statsArray={data[section.key]?.stats || []} 
            barColor={section.barColor} 
            workType={workType} 
          />

          <DailyScopeTrendChart 
            title={`${section.title} (${unitLabel})`}
            // This is now perfectly typed!
            dailyTrends={data[section.key]?.dailyTrends || []} 
            workType={workType} 
          />
          
        </div>
      ))}
    </div>
  );
}

export default HighChartsBarChart;