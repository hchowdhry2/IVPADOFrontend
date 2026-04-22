import React from 'react';
import ActivityDoughnutChart from './ActivityDoughnutChart';
import { normalize } from '../../utils/statsHelper';

interface Props {
  data: any;           // The full data object from context
  selectedDev: string;
  activeSection: string; 
  sprintNames: string[]; // These are the sprint keys (e.g. "Sprint 1")
}

const ActivityDistributionRow: React.FC<Props> = ({ data, selectedDev, activeSection, sprintNames }) => {
  
  if (!sprintNames || sprintNames.length === 0) return null;

  return (
    <div className="dashboard-section modern-theme" style={{ marginTop: '30px' }}>
      <h3 style={{ paddingLeft: '10px' }}>Activity Breakdown: {selectedDev.split('<')[0]}</h3>
      
      <div style={{ 
          display: 'flex', 
          gap: '20px', 
          overflowX: 'auto', 
          padding: '20px 10px',
          scrollbarWidth: 'thin'
      }}>
        {sprintNames.map((sprintName) => {
          const targetKey = normalize(sprintName);

          // Use the activeSection ('all', 'feature', or 'client')
          const sectionData = data[activeSection] || data['all'];

          // MATCHING LOGIC BASED ON YOUR NEW BACKEND DTO:
          // Developer -> group.Key.AssignedTo
          // PeriodLabel -> group.Key.IterationPath
          const record = sectionData.developerActivityStats?.find((s: any) => 
            s.developer === selectedDev && normalize(s.periodLabel) === targetKey
          );

          const activities = record?.activities || [];

          // Inside ActivityDistributionRow.tsx map function
            return (
            <div key={sprintName} style={{ 
                minWidth: '430px', // Increased from 320px
                flex: '0 0 auto' 
            }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px' }}>
                {sprintName}
                </p>
                
                <div style={{ 
                    background: '#fff', 
                    borderRadius: '12px', 
                    padding: '10px', // Increased padding
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
                }}>
                {/* Chart will now fill this wider space */}
                <ActivityDoughnutChart activities={activities} />
                </div>
            </div>
            );
        })}
        
      </div>
    </div>
  );
};

export default ActivityDistributionRow;