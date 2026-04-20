import React, { useEffect, useMemo, useState } from 'react';
import HighChartsBarChart, { sections } from '../components/burnupChart/HighChartsBarChart';
import { useDevOpsContext } from '../context/DevOpsProvider';
import Selector from '../components/Selector';
import ImpactedFeaturesCard from '../components/ImpactedFeaturesCard';
import DeveloperPerformanceGrid from '../components/DeveloperPerformanceGrid'; // Updated name for clarity
import DeveloperBarChart from '../components/burnupChart/DeveloperBarChart'; // Added this import
import DeveloperTrendChart from '../components/burnupChart/DeveloperTrendChart';
import SingleDeveloperBarChart from '../components/burnupChart/SingleDeveloperBarChart';
import LoadingSkeleton from '../components/LoadingSkeleton';
import LoadingOverlay from '../components/LoadingOverlay';

const DashboardPage: React.FC = () => {
    const {
        data, 
        loading,
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
    const [selectedDev, setSelectedDev] = useState<string>('');

    const developers = useMemo(() => {
        if (!data?.all?.developerStats) return [];
        return Array.from(new Set(data.all.developerStats.map(s => s.developer))).sort();
    }, [data]);

    // Set initial developer when data loads
    useEffect(() => {
        if (developers.length > 0 && !selectedDev) {
            setSelectedDev(developers[0]);
        }
    }, [developers, selectedDev]);

    return (
        <div className="dashboard-container">
            <LoadingOverlay isLoading={loading && !data} message="Fetching data..." />
            
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Dashboard Page</h1>
            </div>

            <div className="filter-row">
                <Selector
                    value={selectedProject}
                    options={projects}
                    setValue={setSelectedProject}
                    title="Project"
                    loading={loading}
                />

                {selectedProject && (
                    <Selector
                        value={selectedTeam}
                        options={teams}
                        setValue={setSelectedTeam}
                        title="Team"
                        loading={loading}
                    />
                )}

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
                        onClick={() => {setActiveView('Developer');setWorkType('task');}} // Force 'Tasks' when switching to Developer View
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
                            <option value="quarterly">quarterly</option>
                        </select>
                    </div>
                </div>
            </div>

            {data ? (
                <div className="chart-container">
                    {/* --- PROJECT VIEW SECTION --- */}
                    {activeView === 'Project' && (
                        <div className="project-view-content">
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
                            {/* Move the Main Project Chart here */}
                            <HighChartsBarChart 
                                key={`${workType}-${timeFrame}`} 
                                data={data} 
                                workType={workType}
                            />

                            

                            {/* Move the Section Tabs (Feature, Spillage, etc.) here */}
                            <div className="tab-container" style={{ marginTop: '20px', display: 'flex', gap: '10px'}}>
                                {sections.filter(section => section.key !== 'all').map(section => (
                                    <button 
                                        key={section.key}
                                        style={{ backgroundColor: activeSection === section.key ? '#a5b4fc' : '', border: activeSection === section.key ? '2px solid #6366f1' : '' }}
                                        className={`tab-button ${activeSection === section.key ? 'active' : ''}`}
                                        onClick={() => setActiveSection(section.key)}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </div>

                            {/* Impacted Features List for the specific section */}
                            {currentSection && data && data[currentSection.key] && (
                                <div className="active-view-container">
                                    <h2 style={{ color: currentSection.barColor, marginBottom: '20px' }}>
                                        {currentSection.title} {workType === 'task' ? 'Tasks' : 'Stories'}
                                    </h2>
                                    {(data[currentSection.key] as any)?.developerStats && (data[currentSection.key] as any)?.developerStats.length > 0 ? 
                                        <DeveloperBarChart loading={loading} stats={(data[currentSection.key] as any).developerStats || []} /> 
                                        : <></>
                                    }

                                    <div style={{ marginBottom: '30px' }}>
                                        <ImpactedFeaturesCard 
                                            loading={loading}
                                            features={(data[currentSection.key] as any)?.history || []} 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- DEVELOPER VIEW SECTION --- */}
                    {activeView === 'Developer' && (
                        <div className="active-dev-container">
                            {data['all']?.developerStats ? (
                                <>
                                    {/* Move the Section Tabs (Feature, Spillage, etc.) here */}
                                    <div className="tab-container" style={{ marginTop: '20px', display: 'flex', gap: '10px'}}>
                                        {sections.map(section => (
                                            <button 
                                                key={section.key}
                                                style={{ backgroundColor: activeSection === section.key ? '#a5b4fc' : '', border: activeSection === section.key ? '2px solid #6366f1' : '' }}
                                                className={`tab-button ${activeSection === section.key ? 'active' : ''}`}
                                                onClick={() => setActiveSection(section.key)}
                                            >
                                                {section.title}
                                            </button>
                                        ))}
                                    </div>

                                    <br />

                                    {/* GLOBAL DEVELOPER SELECTOR */}
                                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <label style={{ fontWeight: 600 }}>Filter by Developer:</label>
                                        <select
                                            className="select-dropdown"
                                            style={{ width: 'auto', minWidth: '250px' }}
                                            value={selectedDev}
                                            onChange={(e) => setSelectedDev(e.target.value)}
                                        >
                                            {developers.map(dev => (
                                                <option key={dev} value={dev}>{dev}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <SingleDeveloperBarChart 
                                            loading={loading}
                                            stats={data[currentSection?.key || 'all']?.developerStats || []} 
                                            selectedDev={selectedDev} // Pass state as prop
                                        />
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <DeveloperPerformanceGrid 
                                            loading={loading}
                                            stats={data[currentSection?.key || 'all']?.developerStats || []} 
                                            selectedDev={selectedDev} // Pass state as prop
                                            fullData={data}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="empty-state">
                                    <p>Developer stats are only available for "Tasks" work type.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div> 
            ) : (
                <div className="empty-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <p>Please select a project and team to load {workType === 'task' ? 'task' : 'story'} data.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;