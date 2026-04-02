// import React from 'react'
// import HighchartsReact from 'highcharts-react-official'
// import Highcharts from 'highcharts'
// import { useSpillageContext } from '../../context/SpillageProvider'

// // 1. Helper for Bar Charts (Sprint Velocity)
// const renderBarChart = (title, statsArray, barColor) => {
//   const getNumericValue = (obj, keys) => {
//     for (const k of keys) {
//       let v = obj?.[k]
//       if (v === undefined || v === null) continue
//       const n = typeof v === 'string' ? Number(v.replace(/[,\s]/g, '')) : v
//       if (!Number.isNaN(n)) return n
//     }
//     return 0
//   }

//   // Use PascalCase keys to match your C# DTO
//   const sprintNames = statsArray.map(item => item.IterationPath?.split('\\').pop() || 'Sprint')
//   const assignedData = statsArray.map(item => getNumericValue(item, ['TotalPointsAssigned']))
//   const completedData = statsArray.map(item => getNumericValue(item, ['TotalPointsCompleted']))

//   const options = {
//     chart: { type: 'column' },
//     title: { text: title },
//     xAxis: { categories: sprintNames },
//     yAxis: { title: { text: 'Story Points' } },
//     series: [
//       { name: 'Assigned Points', data: assignedData, color: barColor },
//       { name: 'Completed Points', data: completedData, color: '#82ca9d' }
//     ],
//     credits: { enabled: false }
//   }

//   return (
//     <div style={{ flex: 1, minWidth: '400px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//        <HighchartsReact highcharts={Highcharts} options={options} />
//     </div>
//   )
// }

// // 2. Helper for Line Charts (Spilled Points)
// const renderLineChart = (title, spillageArray, lineColor) => {
//   const sprintNames = spillageArray.map(item => item.IterationPath?.split('\\').pop() || 'Sprint')
  
//   // Calculate spilled points: Assigned - Completed
//   const spilledData = spillageArray.map(item => {
//     const assigned = item.TotalPointsAssigned || 0
//     const completed = item.TotalPointsCompleted || 0
//     return Math.max(0, assigned - completed) 
//   })

//   const options = {
//     chart: { type: 'line' },
//     title: { text: title },
//     xAxis: { categories: sprintNames },
//     yAxis: { title: { text: 'Spilled Points' } },
//     series: [
//       { name: 'Spilled Points', data: spilledData, color: lineColor }
//     ],
//     credits: { enabled: false }
//   }

//   return (
//     <div style={{ flex: 1, minWidth: '400px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//        <HighchartsReact highcharts={Highcharts} options={options} />
//     </div>
//   )
// }

// // 3. Main Dashboard Component
// const HighChartsBarChart = () => {
//   const { data, loading } = useSpillageContext()

//   if (loading || !data) {
//     return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Dashboard Data...</div>
//   }

//   return (
//     <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
//       {/* ALL SECTION */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
//         {renderBarChart("All Velocity", data.all?.stats || [], "#8884d8")}
//         {renderLineChart("All Spillage Trend", data.all?.spillage || [], "#ff4d4d")}
//       </div>

//       {/* FEATURE SECTION */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
//         {renderBarChart("Feature Velocity", data.feature?.stats || [], "#ffc658")}
//         {renderLineChart("Feature Spillage Trend", data.feature?.spillage || [], "#ff4d4d")}
//       </div>

//       {/* CLIENT SECTION */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
//         {renderBarChart("Client Velocity", data.client?.stats || [], "#ff8042")}
//         {renderLineChart("Client Spillage Trend", data.client?.spillage || [], "#ff4d4d")}
//       </div>
      
//     </div>
//   )
// }

// export default HighChartsBarChart

import React, { useState } from 'react'
import { useSpillageContext } from '../../context/SpillageProvider'
import RenderChart from './RenderChart'
import RenderLineChart from './RenderLineChart'
import UserStoryCard from '../UserStoryCard'
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

// const HighChartsBarChart = ({ data }) => {
//   const { loading } = useSpillageContext();

//   const [activeSection, setActiveSection] = useState('all');

//   if (loading || !data) {
//     return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Dashboard Data...</div>;
//   }

//   return (
//     <div className="dashboard-wrapper">

//       <div className="active-section">
//         <button className="set-spillage"></button>
//         <button className="set-stats"></button>
//       </div>
//       {/* Individual Bar Charts (Keeping your existing loop) */}
//       {/* Single Combined Line Chart */}
//       <RenderLineChart 
//         title="Spillage" 
//         data={data} 
//         sections={sections} 
//       />


//       {sections.map((section) => (
//         <div key={section.key} className="section-container" style={{ marginBottom: '60px' }}>
          
//           {/* 1. The Summary Bar Chart (Planned vs Completed) */}
//           <RenderChart 
//             title={`${section.title}`} 
//             statsArray={data[section.key]?.stats || []} 
//             barColor={section.barColor} 
//           />

//           {/* 2. The Daily Scope Trend (The Senior's Request) */}
//           <DailyScopeTrendChart 
//             title={section.title}
//             dailyTrends={data[section.key]?.dailyTrends || []} 
//           />
          
//         </div>
//       ))}
//     </div>
//   );
// }

const HighChartsBarChart = ({ data }) => {
  // 1. Pull workType from context
  const { loading, workType } = useDevOpsContext(); 

  const [activeSection, setActiveSection] = useState('all');

  // 2. Determine the Label/Unit
  const unitLabel = workType === 'task' ? 'Count' : 'Points';

  if (loading || !data) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Dashboard Data...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      <div className="active-section">
        <button className="set-spillage"></button>
        <button className="set-stats"></button>
      </div>

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
            title={`${section.title} Scope Change (${unitLabel})`}
            dailyTrends={data[section.key]?.dailyTrends || []} 
            workType={workType} // Pass this down!
          />
          
        </div>
      ))}
    </div>
  );
}

export default HighChartsBarChart;


// import React from 'react'
// import HighchartsReact from 'highcharts-react-official'
// import Highcharts from 'highcharts'
// import { useSpillageContext } from '../../context/SpillageProvider'

// const HighChartsBarChart = () => {
//   const { data } = useSpillageContext()

//   const allStats     = data?.All?.stats || [];
//   const featureStats = data?.Feature?.stats || [];
//   const clientStats  = data?.Client?.stats || [];

//   if (!data || data.length === 0) {
//     return (
//       <div style={{
//         width: '100%',
//         height: '400px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         border: '1px dashed #ccc',
//         borderRadius: '8px'
//       }}>
//         <p>Loading Sprint Data...</p>
//       </div>
//     )
//   }

//   // Helper to safely extract numeric values from different possible field names
//   const getNumericValue = (obj, keys) => {
//     for (const k of keys) {
//       let v = obj?.[k]
//       if (v === undefined || v === null) continue
//       if (typeof v === 'string') {
//         const cleaned = v.replace(/[,\s]/g, '')
//         const n = Number(cleaned)
//         if (!Number.isNaN(n)) return n
//       }
//       if (typeof v === 'number' && !Number.isNaN(v)) return v
//     }
//     return 0
//   }

//   // Transform context data into Highcharts format
//   const sprintNames = data.map(item => 
//     item.iterationPath?.split('\\').pop() || item.name || item.sprintName || 'Sprint'
//   )

//   const assignedData = data.map(item =>
//     getNumericValue(item, ['totalPointsAssigned', 'assigned', 'assignedPoints', 'totalAssigned', 'pointsAssigned'])
//   )

//   const completedData = data.map(item =>
//     getNumericValue(item, ['totalPointsCompleted', 'completed', 'completedPoints', 'totalCompleted', 'pointsCompleted'])
//   )

//   // Highcharts configuration
//   const options = {
//     chart: {
//       type: 'column',
//       style: {
//         fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
//       }
//     },
//     title: {
//       text: 'Sprint Velocity: Assigned vs Completed Points'
//     },
//     xAxis: {
//       categories: sprintNames,
//       title: {
//         text: 'Sprint'
//       },
//       labels: {
//         rotation: -45,
//         align: 'right',
//         style: {
//           fontSize: '12px'
//         }
//       }
//     },
//     yAxis: {
//       min: 0,
//       title: {
//         text: 'Story Points'
//       },
//       stackLabels: {
//         enabled: false
//       }
//     },
//     legend: {
//       reversed: false,
//       layout: 'horizontal',
//       align: 'center',
//       verticalAlign: 'bottom'
//     },
//     plotOptions: {
//       series: {
//         pointPadding: 0.2,
//         borderWidth: 0,
//         dataLabels: {
//           enabled: true
//         }
//       }
//     },
//     series: [
//       {
//         name: 'Assigned Points',
//         data: assignedData,
//         color: '#8884d8'
//       },
//       {
//         name: 'Completed Points',
//         data: completedData,
//         color: '#82ca9d'
//       }
//     ],
//     credits: {
//       enabled: false
//     },
//     responsive: {
//       rules: [
//         {
//           condition: {
//             maxWidth: 800
//           },
//           chartOptions: {
//             legend: {
//               layout: 'vertical',
//               align: 'bottom',
//               verticalAlign: 'bottom'
//             }
//           }
//         }
//       ]
//     }
//   }

//   return (
//     <div style={{
//       width: '100%',
//       padding: '20px',
//       backgroundColor: '#fff',
//       borderRadius: '8px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     }}>
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={options}
//       />
//       {console.log('HighChartsBarChart data:', { sprintNames, assignedData, completedData })}
//     </div>
//   )
// }

// export default HighChartsBarChart
