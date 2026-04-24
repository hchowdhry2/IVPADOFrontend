import React, { useMemo } from 'react';
import { aggregateStats, DeveloperStat } from '../utils/statsHelper';
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

  const groupedData = useMemo(() => {
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

      <div className="grouped-list-container">
        {/* Sticky Header */}
        <div className="sticky-sprint-header" style={{ position: 'sticky', top: '0', zIndex: 10, padding: '12px 20px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '10px', borderLeft: '5px solid #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h4>{selectedDev}</h4>
        </div>

        {/* Feature List Section */}
        {sortedSprintNames.map((sprintName) => (
            <div key={sprintName} className="sprint-group" style={{ marginBottom: '20px' }}>
                <div className="feature-list" style={{ padding: '0 5px' }}>
                {groupedData[sprintName]
                    .sort((a, b) => b.totalTasksCompleted - a.totalTasksCompleted)
                    .map((dev, idx) => (
                    <div key={`${sprintName}-${idx}`} className="feature-card">
                        <div className="feature-main">
                            <div className="feature-identity">
                                <span>{sprintName}</span>
                                <span className="status-pill">{dev.totalTasksCompleted} / {dev.totalTasksAssigned} Tasks</span>
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
                                    <span className="metric-value impact-badge status-info">{dev.totalHours.toFixed(1)}h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperPerformanceGrid;