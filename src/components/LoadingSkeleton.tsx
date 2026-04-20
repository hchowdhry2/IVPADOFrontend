import React from 'react';
import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
  type?: 'chart' | 'card' | 'grid' | 'text';
  count?: number;
  height?: string;
  width?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'chart', 
  count = 1,
  height = '400px',
  width = '100%'
}) => {
  
  if (type === 'chart') {
    return (
      <div className="skeleton-container" style={{ height, width }}>
        <div className="skeleton-header skeleton-bar" style={{ marginBottom: '20px' }} />
        <div className="skeleton-content">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-chart-bar" style={{ marginBottom: '10px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-container" style={{ height: '200px', width }}>
        <div className="skeleton-header skeleton-bar" style={{ marginBottom: '15px', width: '70%' }} />
        <div className="skeleton-content">
          <div className="skeleton-bar" style={{ marginBottom: '10px', width: '100%' }} />
          <div className="skeleton-bar" style={{ marginBottom: '10px', width: '80%' }} />
          <div className="skeleton-bar" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="skeleton-grid" style={{ width }}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton-grid-item">
            <div className="skeleton-bar" style={{ marginBottom: '10px', height: '20px' }} />
            <div className="skeleton-bar" style={{ marginBottom: '10px', height: '20px', width: '80%' }} />
            <div className="skeleton-bar" style={{ height: '20px', width: '60%' }} />
          </div>
        ))}
      </div>
    );
  }

  // text type
  return (
    <div className="skeleton-container" style={{ width }}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-bar" style={{ marginBottom: '10px', width: i % 2 === 0 ? '100%' : '80%' }} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
