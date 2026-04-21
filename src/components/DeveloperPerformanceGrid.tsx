import React, { useMemo } from 'react';
import { aggregateStats, DeveloperStat, normalize } from '../utils/statsHelper';
import SprintDoughnutChart from './burnupChart/SprintDoughnutChart';
import LoadingSkeleton from './LoadingSkeleton';
import VisualizationInfoDialog from './VisualizationInfoDialog';

interface DeveloperPerformanceGridProps {
  stats: DeveloperStat[];
  selectedDev: string;
  fullData: any;
  loading?: boolean;
}

const DeveloperPerformanceGrid: React.FC<DeveloperPerformanceGridProps> = ({ stats, selectedDev, fullData, loading = false }) => {
  const aggregatedStats = useMemo(() => aggregateStats(stats), [stats]);

  if (loading || !stats || stats.length === 0) {
    return <LoadingSkeleton type="grid" count={4} />;
  }


  console.log(fullData);
  const groupedData = useMemo(() => {
    // Filter the stats before reducing into sprint groups
    const filteredStats = selectedDev 
        ? aggregatedStats.filter(s => s.developer === selectedDev)
        : aggregatedStats;

    return filteredStats.reduce((acc, curr) => {
      if (!acc[curr.sprint]) acc[curr.sprint] = [];
      acc[curr.sprint].push(curr);
      return acc;
    }, {} as Record<string, DeveloperStat[]>);
  }, [aggregatedStats, selectedDev]);

  const sortedSprintNames = useMemo(() => {
    return Object.keys(groupedData).sort(
      (a, b) =>
        new Date(groupedData[b][0].sprintStartDate || 0).getTime() -
        new Date(groupedData[a][0].sprintStartDate || 0).getTime()
    );
  }, [groupedData]);

  if (sortedSprintNames.length === 0) {
    return <p className="no-data">No developer metrics found.</p>;
  }

  return (
    <div className="dashboard-section modern-theme">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          <h3>Developer Performance by Sprint</h3>
          <p className="subtitle">Individual contributions per iteration</p>
        </div>
        <VisualizationInfoDialog visualizationKey="sprintProgressDev" title="Developer Performance Logic" />
      </div>

      {/* 🔥 YOUR ORIGINAL HEADER CSS KEPT */}
      <div className="grouped-list-container">
        {/* 🔥 STICKY HEADER (UNCHANGED CSS) */}
        <div className="sticky-sprint-header" style={{
            position: 'sticky',
            top: '0',
            zIndex: 10,
            padding: '12px 20px',
            backgroundColor: '#f1f5f9',
            borderRadius: '8px',
            marginBottom: '10px',
            borderLeft: '5px solid #6366f1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <h4>{selectedDev}</h4>
        </div>
        {sortedSprintNames.map((sprintName) => {

            const targetKey = normalize(sprintName);

            // FIX 1: Use 's.sprint' instead of 's.iterationPath'
            const featSprint = fullData.feature.developerStats.find(
                (s: any) => normalize(s.sprint) === targetKey && s.developer === selectedDev
            );
            
            const clientSprint = fullData.client.developerStats.find(
                (s: any) => normalize(s.sprint) === targetKey && s.developer === selectedDev
            );
            return(
                <div key={sprintName} className="sprint-group" style={{ marginBottom: '20px' }}>

                    {/* CARDS (UNCHANGED STRUCTURE) */}
                    <div className="feature-list" style={{ padding: '0 5px' }}>
                    {groupedData[sprintName]
                        .sort((a, b) => b.totalTasksCompleted - a.totalTasksCompleted)
                        .map((dev, idx) => (
                        <div key={`${sprintName}-${idx}`} className="feature-card">

                            <div className="feature-main">
                            <div className="feature-identity">

                                <span>{sprintName}</span>

                                <span className="status-pill">
                                {dev.totalTasksCompleted} / {dev.totalTasksAssigned} Tasks
                                </span>
                            </div>

                            <div className="feature-metrics">
                                <div className="metric-group">
                                <span className="metric-label">Assigned</span>
                                <span className="metric-value">{dev.totalTasksAssigned}</span>
                                </div>

                                <div className="metric-divider" />

                                <div className="metric-group">
                                <span className="metric-label">Completed</span>
                                <span className="metric-value">{dev.totalTasksCompleted}</span>
                                </div>

                                <div className="metric-divider" />

                                <div className="metric-group">
                                <span className="metric-label">Total Hours</span>
                                <span className="metric-value impact-badge status-info">
                                    {dev.totalHours.toFixed(1)}h
                                </span>
                                </div>
                            </div>
                            </div>

                        </div>
                        ))}
                    </div>
                    {/* <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>Work Distribution (Assigned)</p>
                        <SprintDoughnutChart 
                            sprintName={sprintName}
                            featureCount={featSprint?.totalTasksAssigned || 0}
                            clientCount={clientSprint?.totalTasksAssigned || 0}
                            type="Assigned"
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>Work Distribution (Completed)</p>
                        <SprintDoughnutChart 
                            sprintName={sprintName}
                            featureCount={featSprint?.totalTasksCompleted || 0}
                            clientCount={clientSprint?.totalTasksCompleted || 0}
                            type="Completed"
                        />
                    </div>
                    </div> */}
                </div>

                
            );
          
        })}
      </div>
    </div>
  );
};

export default DeveloperPerformanceGrid;