import React, { useState } from 'react';
import HighChartsBarChart, { sections } from '../components/burnupChart/HighChartsBarChart';
import { useDevOpsContext } from '../context/DevOpsProvider';
import Selector from '../components/Selector';
import ImpactedFeaturesCard from '../components/ImpactedFeaturesCard';
import DeveloperPerformanceGrid from '../components/DeveloperPerformanceGrid'; // Updated name for clarity
import DeveloperBarChart from '../components/burnupChart/DeveloperBarChart'; // Added this import
import DeveloperTrendChart from '../components/burnupChart/DeveloperTrendChart';
import SingleDeveloperBarChart from '../components/burnupChart/SingleDeveloperBarChart';

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

    const [activeSection, setActiveSection] = useState<string>('feature');
    const [activeView, setActiveView] = useState<string>('Project'); 
    const currentSection = sections.find(s => s.key === activeSection);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Dashboard Page</h1>
            </div>

            <div className="filter-row">
                <Selector
                    value={selectedProject}
                    options={projects}
                    setValue={setSelectedProject}
                    title="Project"
                />

                {selectedProject && (
                    <Selector
                        value={selectedTeam}
                        options={teams}
                        setValue={setSelectedTeam}
                        title="Team"
                    />
                )}

                <div className="work-type-toggle-container" style={{ display: 'flex', gap: '10px' }}>
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

                <div className="view-level-container">
                    <button 
                        className={`view-btn ${activeView === 'Project' ? 'active' : ''}`} 
                        style={{backgroundColor : activeView === 'Project' ? '#a5b4fc' : '', border: activeView === 'Project' ? '2px solid #6366f1' : ''}}
                        onClick={() => setActiveView('Project')}
                    >
                        Project View
                    </button>
                    <button 
                        className={`view-btn ${activeView === 'Developer' ? 'active' : ''}`} 
                        style={{backgroundColor : activeView === 'Developer' ? '#a5b4fc' : '', border: activeView === 'Developer' ? '2px solid #6366f1' : ''}}
                        onClick={() => setActiveView('Developer')}
                    >
                        Developer View
                    </button>
                </div>

                <div className="controls-container">
                    <div className="filter-group">
                        <label>Show last </label>
                        <input 
                            type="number" 
                            className="sprint-input"
                            value={lastN} 
                            min="1"
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
                        data={data} 
                        workType={workType}
                    />

                    {/* <div className="tab-container" style={{ marginTop: '20px' }}>
                        {sections.filter(section => section.key !== 'all').map(section => (
                            <button
                                key={section.key}
                                className={`tab-button ${activeSection === section.key ? 'active' : ''}`}
                                onClick={() => setActiveSection(section.key)}
                            >
                                {section.title}
                            </button>
                        ))}
                    </div> */}

                    {currentSection && activeView === 'Project' && (
                        <div className="active-view-container">
                            {/* <h2 style={{ color: currentSection.barColor, marginBottom: '20px' }}>
                                {currentSection.title} {workType === 'task' ? 'Tasks' : 'Stories'}
                            </h2> */}

                            {/* 1. Developer Bar Chart - Visual Distribution */}
                            {/* {workType === 'task' && data[currentSection.key]?.developerStats && (
                                <div style={{ marginBottom: '30px' }}>
                                    <DeveloperBarChart stats={data[currentSection.key].developerStats ?? []} />
                                </div>
                            )} */}

                            <div className="tab-container" style={{ marginTop: '20px' }}>
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
                            <h2 style={{ color: currentSection.barColor, marginBottom: '20px' }}>
                                {currentSection.title} {workType === 'task' ? 'Tasks' : 'Stories'}
                            </h2>

                            {/* 2. Impacted Features Card - First in stack */}
                            <div style={{ marginBottom: '30px' }}>
                                <ImpactedFeaturesCard 
                                    features={data[currentSection.key]?.history || []} 
                                />
                            </div>

                            {/* {workType === 'task' && data['all']?.developerStats && (
                                <div style={{ marginBottom: '30px' }}>
                                    <DeveloperBarChart stats={data['all'].developerStats} />
                                </div>
                            )} */}
                        </div>
                    )}

                    {currentSection && activeView === 'Developer' && workType === 'task' && data['all']?.developerStats && (
                        <div className="active-dev-container">
                            <div style={{ marginBottom: '30px' }}>
                                    <DeveloperBarChart stats={data['all'].developerStats} />
                                    {/* <DeveloperTrendChart stats={data['all'].developerStats} /> */}
                                    <SingleDeveloperBarChart stats={data['all'].developerStats} />
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                    <DeveloperPerformanceGrid 
                                        stats={data[currentSection.key]?.developerStats || []} 
                                    />
                            </div>
                        </div>
                    )}
                </div> /* Closed chart-container */
            ) : (
                <div className="empty-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <p>Please select a project and team to load {workType === 'task' ? 'task' : 'story'} data.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;