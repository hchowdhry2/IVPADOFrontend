import React, { useState } from 'react';
// Note: Ensure HighChartsBarChart is converted to .tsx for the 'sections' import to be typed
import HighChartsBarChart, { sections } from '../components/burnupChart/HighChartsBarChart';
import { useDevOpsContext } from '../context/DevOpsProvider';
import Selector from '../components/Selector';
import ImpactedFeaturesCard from '../components/ImpactedFeaturesCard';

const DashboardPage: React.FC = () => {
    const {
        data, 
        projects, 
        selectedProject, setSelectedProject, 
        teams, 
        selectedTeam, setSelectedTeam, 
        lastN, setLastN, 
        timeFrame, setTimeFrame,
        workType, setWorkType 
    } = useDevOpsContext();

    // activeSection is one of the keys in our data response (all, feature, client, etc.)
    const [activeSection, setActiveSection] = useState<string>('feature');
    
    const currentSection = sections.find(s => s.key === activeSection);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Dashboard Page</h1>
            </div>

            <div className="filter-row">
                <Selector
                    value={selectedProject}
                    options={projects} // Typed as AdoProject[]
                    setValue={setSelectedProject}
                    title="Project"
                />

                {selectedProject && (
                    <Selector
                        value={selectedTeam}
                        options={teams} // Typed as AdoTeam[]
                        setValue={setSelectedTeam}
                        title="Team"
                    />
                )}

                <div className="work-type-toggle-container" style={{ margin: '0px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div className="workItem" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button 
                            style={{ backgroundColor: workType === 'story' ? '#a5b4fc' : '', border: workType === 'story' ? '2px solid #6366f1' : '' }}
                            className={`toggle-btn ${workType === 'story' ? 'active' : ''}`}
                            onClick={() => setWorkType('story')}
                        >
                            User Stories
                        </button>
                        <button 
                            style={{ backgroundColor: workType === 'task' ? '#a5b4fc' : '', border: workType === 'task' ? '2px solid #6366f1' : '' }}
                            className={`toggle-btn ${workType === 'task' ? 'active' : ''}`}
                            onClick={() => setWorkType('task')}
                        >
                            Tasks
                        </button>
                    </div>
                </div>

                <div className="controls-container">
                    <div className="filter-group">
                        <label>Show last </label>
                        <input 
                            type="number" 
                            className="sprint-input"
                            value={lastN} 
                            min="1"
                            // Handle event typing: cast e.target.value to number
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastN(parseInt(e.target.value) || 0)}
                        />
                    </div>

                    <div className="filter-group">
                        <select 
                            className="select-dropdown"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimeFrame(e.target.value === "null" ? null : e.target.value)}
                            value={timeFrame === null ? "null" : timeFrame}
                        >
                            <option value="null">sprint-wise</option>
                            <option value="monthly">monthly</option>
                            <option value="quarterly">quarterly</option>
                            <option value="yearly">yearly</option>
                        </select>
                    </div>
                </div>
            </div>

            {data ? (
                <div className="chart-container">
                    <HighChartsBarChart 
                        key={`${workType}-${timeFrame}`} 
                        data={data} // Typed as SpillageDataResponse
                        workType={workType}
                    />

                    <div className="tab-container">
                        {sections.filter(section => section.key !== 'all').map(section => (
                            <button
                                key={section.key}
                                className={`tab-button ${activeSection === section.key ? 'active' : ''}`}
                                onClick={() => setActiveSection(section.key)}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div>

                    {currentSection && (
                        <div className="active-view-container">
                            <h2 style={{ color: currentSection.barColor }}>
                                {currentSection.title} {workType === 'task' ? 'Tasks' : 'Stories'}
                            </h2>
                            
                            <ImpactedFeaturesCard 
                                // Safe access using optional chaining because data is SpillageDataResponse
                                features={data[currentSection.key]?.history || []} 
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-state" style={{ alignContent: 'center', height: '50vh' }}>
                    <p>Please select a project and team to load {workType === 'task' ? 'task' : 'story'} data.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;