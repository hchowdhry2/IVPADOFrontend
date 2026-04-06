import React, { useMemo } from 'react';

const ImpactedFeaturesCard = ({ features }) => {
  // Performance: Sort by the new Total Impact Score (Churn)
  const sortedFeatures = useMemo(() => {
    if (!Array.isArray(features)) return [];
    return [...features].sort((a, b) => 
      (b.totalImpactScore || 0) - (a.totalImpactScore || 0)
    );
  }, [features]);

  // Aesthetic Logic: Color based on "Friction"
  // Friction is high if impact score is significantly higher than story count
  const getImpactColor = (score, count) => {
    if (score === 0) return 'status-stable';
    if (score > count * 3) return 'status-critical'; // Red: Average 3+ moves per story
    if (score > count) return 'status-warning';     // Amber: Significant spillage
    return 'status-info';                           // Blue: Normal movement
  };

  if (sortedFeatures.length === 0) return <p className="no-data">No impacted features found.</p>;

  return (
    <div className="dashboard-section modern-theme">
      <div className="section-header">
        <h3>Feature Impact Analysis ({sortedFeatures.length})</h3>
        <p className="subtitle">Ranking by total delivery friction (iteration transitions)</p>
      </div>

      <div className="feature-list">
        {sortedFeatures.map((feature, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-main">
              <div className="feature-identity">
                <span className="parent-id">#{feature.parentId}</span>
                <span>{feature.parentTitle}</span>
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
            
            {/* Aesthetic Progress Indicator */}
            {/* <div className="friction-bar-container">
               <div 
                 className="friction-bar-fill" 
                 style={{ 
                   width: `${Math.min((feature.totalImpactScore / (feature.totalStoryCount || 1)) * 20, 100)}%`,
                   backgroundColor: feature.totalImpactScore > feature.totalStoryCount * 3 ? '#ef4444' : '#6366f1'
                 }} 
               />
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactedFeaturesCard;