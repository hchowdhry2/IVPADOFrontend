import React from 'react';
import { normalize } from '../utils/statsHelper';
import SprintDoughnutChart from './burnupChart/SprintDoughnutChart';
import ActivityDoughnutChart from './burnupChart/ActivityDoughnutChart';

interface SprintMetricCardProps {
  sprintName: string;
  selectedDev: string;
  fullData: any;
}

const SprintMetricCard: React.FC<SprintMetricCardProps> = ({ sprintName, selectedDev, fullData }) => {
  const targetKey = normalize(sprintName);

  // Get Activity Data
  const activityRecord = fullData.all.developerActivityStats.find((s: any) => {
    const [devName, sprintPath] = s.periodLabel.split('|');
    return devName === selectedDev && normalize(sprintPath) === targetKey;
  });
  const activities = activityRecord?.activities || [];

  // Get Feature/Client Data
  const featSprint = fullData.feature.developerStats.find(
    (s: any) => normalize(s.sprint) === targetKey && s.developer === selectedDev
  );
  const clientSprint = fullData.client.developerStats.find(
    (s: any) => normalize(s.sprint) === targetKey && s.developer === selectedDev
  );

  return (
    <div style={{ minWidth: '350px', flex: '0 0 auto', background: '#fff', borderRadius: '12px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Sprint Header */}
      <div style={{ textAlign: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>{sprintName}</span>
        <small style={{ color: '#666' }}>
          {(featSprint?.totalTasksCompleted || 0) + (clientSprint?.totalTasksCompleted || 0)} Tasks Completed
        </small>
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ borderBottom: '1px dashed #eee' }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#444', margin: '0' }}>Feature vs Client</p>
          <SprintDoughnutChart
            sprintName={sprintName}
            featureCount={featSprint?.totalTasksCompleted || 0}
            clientCount={clientSprint?.totalTasksCompleted || 0}
            type="Completed"
          />
        </div>

        <div>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#444', margin: '0' }}>Activity Types</p>
          {activities.length > 0 ? (
            <ActivityDoughnutChart activities={activities} />
          ) : (
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.8rem' }}>
              No data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SprintMetricCard;