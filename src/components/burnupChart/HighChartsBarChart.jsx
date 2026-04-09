import React, { useState } from 'react'
import RenderChart from './RenderChart'
import RenderLineChart from './RenderLineChart'
import DailyScopeTrendChart from './DailyScopeTrendChart'
import { useDevOpsContext } from '../../context/DevOpsProvider'

export const sections = [
    { 
      key: 'all', 
      title: 'All', 
      barColor: '#6366f1' 
    },
    { 
      key: 'feature', 
      title: 'Feature', 
      barColor: '#65a30d' 
    },
    { 
      key: 'client', 
      title: 'Client Issues', 
      barColor: '#8b5cf6' 
    }
  ];


const HighChartsBarChart = ({ data }) => {
  // 1. Pull workType from context
  const { loading, workType } = useDevOpsContext(); 

  // 2. Determine the Label/Unit
  const unitLabel = workType === 'task' ? 'Count' : 'Points';

  if (loading || !data) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Dashboard Data...</div>;
  }

  return (
    <div className="dashboard-wrapper">

      {/* 3. Pass unitLabel to the Line Chart */}
      <RenderLineChart 
        title={`Spillage (${unitLabel})`} 
        data={data} 
        sections={sections} 
        workType={workType} // Pass this down!
      />

      {sections.map((section) => (
        <div key={section.key} className="section-container" style={{ marginBottom: '60px' }}>
          
          {/* 4. Pass unitLabel to the Summary Bar Chart */}
          <RenderChart 
            title={`${section.title} - ${unitLabel} Analysis`} 
            statsArray={data[section.key]?.stats || []} 
            barColor={section.barColor} 
            workType={workType} // Pass this down!
          />

          {/* 5. Pass unitLabel to the Daily Scope Trend */}
          <DailyScopeTrendChart 
            title={`${section.title} (${unitLabel})`}
            dailyTrends={data[section.key]?.dailyTrends || []} 
            workType={workType} // Pass this down!
          />
          
        </div>
      ))}
    </div>
  );
}

export default HighChartsBarChart;
