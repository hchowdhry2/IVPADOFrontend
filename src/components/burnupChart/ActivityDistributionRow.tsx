import React, { useMemo } from 'react';
import ActivityDoughnutChart from './ActivityDoughnutChart';
import { normalize } from '../../utils/statsHelper';

interface Props {
  data: any;           // The full data object from context
  selectedDev: string;
  activeSection: string; 
  sprintNames: string[]; // Master list of sprint keys
}

const ActivityDistributionRow: React.FC<Props> = ({ data, selectedDev, activeSection }) => {
  
  // 1. Memoize the sorted records to ensure the UI stays chronological
  const sortedStats = useMemo(() => {
    const sectionData = data[activeSection] || data['all'];
    const stats = sectionData?.developerActivityStats || [];

    // Filter for the selected developer and sort by sortDate
    return stats
      .filter((s: any) => s.developer === selectedDev)
      .sort((a: any, b: any) => {
        return new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime();
      });
  }, [data, selectedDev, activeSection]);

  if (!sortedStats || sortedStats.length === 0) return null;

  return (
    <div className="dashboard-section" style={{ marginTop: '30px' }}>
      <h3 style={{ paddingLeft: '10px' }}>Activity Breakdown: {selectedDev.split('<')[0]}</h3>
      
      <div style={{ 
          display: 'flex', 
          gap: '20px', 
          overflowX: 'auto', 
          padding: '20px 10px',
          scrollbarWidth: 'thin'
      }}>
        {/* 2. Map over the already sorted stats instead of sprintNames */}
        {sortedStats.map((record: any) => {
          const activities = record?.activities || [];
          const displayName = record.periodLabel; // Use the label from the backend record

          return (
            <div key={record.periodLabel} style={{ 
                minWidth: '430px', 
                flex: '0 0 auto' 
            }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px' }}>
                  {displayName}
                </p>
                
                <div style={{ 
                    background: '#fff', 
                    borderRadius: '12px', 
                    padding: '10px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
                }}>
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