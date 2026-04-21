import React from 'react';
import infoHolder from '../utils/infoHolder';
import './VisualizationInfoBox.css';

interface VisualizationInfoBoxProps {
  visualizationKey: keyof typeof infoHolder.visualizationLogicRegistry;
  title?: string;
}

const VisualizationInfoBox: React.FC<VisualizationInfoBoxProps> = ({ visualizationKey, title }) => {
  const info = infoHolder.visualizationLogicRegistry[visualizationKey];

  if (!info) {
    return null;
  }

  return (
    <div className="visualization-info-box">
      <div className="visualization-info-header">
        <h4>{title || info.title}</h4>
      </div>
      
      <div className="visualization-info-row">
        <strong>Description:</strong>
        <p>{info.description}</p>
      </div>

      <div className="visualization-info-row">
        <strong>Formula:</strong>
        <p>{info.formula}</p>
      </div>

      <div className="visualization-info-row">
        <strong>Rules:</strong>
        <ul>
          {info.rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VisualizationInfoBox;