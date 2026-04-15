import React, { useMemo } from 'react';
import { DeveloperStat } from '../services/fetchService';

interface DeveloperPerformanceGridProps {
    stats: DeveloperStat[];
}

const DeveloperPerformanceGrid: React.FC<DeveloperPerformanceGridProps> = ({ stats }) => {
    
    // 1. Group the data by Sprint Name
    const groupedData = useMemo(() => {
        if (!Array.isArray(stats)) return {};
        
        return stats.reduce((acc, current) => {
            const sprintName = current.sprint;
            if (!acc[sprintName]) {
                acc[sprintName] = [];
            }
            acc[sprintName].push(current);
            return acc;
        }, {} as Record<string, DeveloperStat[]>);
    }, [stats]);

    // 2. Sort the sprint keys (Most recent first)
    const sortedSprintNames = useMemo(() => {
        return Object.keys(groupedData).sort((a, b) => b.localeCompare(a));
    }, [groupedData]);

    const getPerformanceStatus = (completed: number, assigned: number) => {
        if (assigned === 0) return 'status-stable';
        const ratio = completed / assigned;
        return ratio >= 1 ? 'status-stable' : ratio >= 0.7 ? 'status-info' : 'status-warning';
    };

    if (sortedSprintNames.length === 0) {
        return <p className="no-data">No developer metrics found.</p>;
    }

    return (
        <div className="dashboard-section modern-theme">
            <div className="section-header">
                <h3>Developer Performance by Sprint</h3>
                <p className="subtitle">Individual contributions per iteration</p>
            </div>

            <div className="grouped-list-container">
                {sortedSprintNames.map((sprintName) => (
                    <div key={sprintName} className="sprint-group" style={{ marginBottom: '20px' }}>
                        
                        {/* --- STICKY SPRINT HEADER --- */}
                        <div className="sticky-sprint-header" style={{ 
                            position: 'sticky',
                            top: '0',              // Anchors to the top of the container
                            zIndex: 10,            // Keeps it above the cards
                            padding: '12px 20px', 
                            backgroundColor: '#f1f5f9', // Slightly darker than white to stand out
                            borderRadius: '8px', 
                            marginBottom: '10px',
                            borderLeft: '5px solid #6366f1',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>
                                {sprintName}
                            </h4>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                {groupedData[sprintName].length} Developers
                            </span>
                        </div>

                        <div className="feature-list" style={{ padding: '0 5px' }}>
                            {groupedData[sprintName]
                                .sort((a, b) => b.totalTasksCompleted - a.totalTasksCompleted)
                                .map((dev, idx) => (
                                    <div key={`${sprintName}-${idx}`} className="feature-card">
                                        <div className="feature-main">
                                            <div className="feature-identity">
                                                <span style={{ fontWeight: 600 }}>{dev.developer}</span>
                                                <span className={`status-pill ${getPerformanceStatus(dev.totalTasksCompleted, dev.totalTasksAssigned)}`}>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeveloperPerformanceGrid;