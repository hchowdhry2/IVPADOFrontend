import React, { useMemo } from 'react';
import { HistoryItem } from '../services/fetchService';
import LoadingSkeleton from './LoadingSkeleton';
import VisualizationInfoDialog from './VisualizationInfoDialog';

// 1. Define the Props interface
interface ImpactedFeaturesCardProps {
  features: HistoryItem[];
  loading?: boolean;
}

const ImpactedFeaturesCard: React.FC<ImpactedFeaturesCardProps> = ({ features, loading = false }) => {
  
  // Performance: Sort by the new Total Impact Score (Churn)
  const sortedFeatures = useMemo(() => {
    if (!Array.isArray(features)) return [];
    // TypeScript now knows 'totalImpactScore' is a number
    return [...features].sort((a, b) => 
      (b.totalImpactScore || 0) - (a.totalImpactScore || 0)
    );
  }, [features]);

  if (loading) {
    return <LoadingSkeleton type="grid" count={3} />;
  }

  // Aesthetic Logic: Color based on "Friction"
  const getImpactColor = (score: number, count: number): string => {
    if (score === 0) return 'status-stable';
    if (score > count * 3) return 'status-critical'; // Red: Average 3+ moves per story
    if (score > count) return 'status-warning';     // Amber: Significant spillage
    return 'status-info';                           // Blue: Normal movement
  };

  if (sortedFeatures.length === 0) {
    return <p className="no-data">No impacted features found.</p>;
  }

  return (
    <div className="dashboard-section modern-theme">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          <h3>Parent Impact Analysis ({sortedFeatures.length})</h3>
          <p className="subtitle">Ranking by total delivery friction (iteration transitions)</p>
        </div>
        <VisualizationInfoDialog visualizationKey="impactGrid" title="Impact Grid Logic" />
      </div>

      <div className="feature-list">
        {sortedFeatures.map((feature, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-main">
              <div className="feature-identity">
                <span className="parent-id">#{feature.parentId}</span>
                <span>{feature.parentTitle}</span>
                {/* Safe access to optional parentStatus */}
                <span className={`status-pill ${feature.parentStatus?.toLowerCase().replace(/\s+/g, '-')}`}>
                  {feature.parentStatus}
                </span>
              </div>
              
              <div className="feature-metrics">
                <div className="metric-group">
                  <span className="metric-label">Total Stories</span>
                  <span className="metric-value">{feature.totalStoryCount}</span>
                </div>
                <div className="metric-divider" />
                <div className="metric-group">
                  <span className="metric-label">Churn Score</span>
                  <span className={`metric-value impact-badge ${getImpactColor(feature.totalImpactScore, feature.totalStoryCount)}`}>
                    {feature.totalImpactScore}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactedFeaturesCard;