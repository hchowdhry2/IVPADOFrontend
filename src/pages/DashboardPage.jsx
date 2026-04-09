import React, { useState } from 'react'
import HighChartsBarChart, { sections } from '../components/burnupChart/HighChartsBarChart';
import { useDevOpsContext } from '../context/DevOpsProvider';
import Selector from '../components/Selector';
import ImpactedFeaturesCard from '../components/ImpactedFeaturesCard';

const DashboardPage = () => {
    // 1. Pull workType and setWorkType from your Context
    const {
        data, projects, selectedProject, setSelectedProject, 
        teams, selectedTeam, setSelectedTeam, 
        lastN, setLastN, timeFrame, setTimeFrame,
        workType, setWorkType // Ensure these are exported from your Provider
    } = useDevOpsContext();

    const [activeSection, setActiveSection] = useState('feature');
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

                <div 
                  className="work-type-toggle-container" 
                  style={{ margin: '0px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                    <div className="workItem" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button 
                      style={{backgroundColor : workType === 'story' ? '#a5b4fc' : '', border : workType === 'story' ? '2px solid #6366f1' : ''}}
                          className={`toggle-btn ${workType === 'story' ? 'active' : ''}`}
                          onClick={() => setWorkType('story')}
                      >
                          User Stories
                      </button>
                      <button 
                      style={{backgroundColor : workType === 'task' ? '#a5b4fc' : '', border : workType === 'task' ? '2px solid #6366f1' : ''}}
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
                            onChange={(e) => setLastN(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <select 
                            className="select-dropdown"
                            onChange={e => setTimeFrame(e.target.value === "null" ? null : e.target.value)}
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

            

            {/* 3. DYNAMIC CHART DISPLAY */}
            {data ? (
              <div className="chart-container">
                  
                  
                  {/* ADD THE KEY PROP HERE */}
                  <HighChartsBarChart 
                      key={`${workType}-${timeFrame}`} 
                      data={data} 
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

                  {data && currentSection && (
                      <div className="active-view-container">
                      <h2 style={{ color: currentSection.barColor }}>
                          {currentSection.title} Stories
                      </h2>
                      
                      <ImpactedFeaturesCard 
                          features={data[currentSection.key]?.history || []} 
                      />
                      </div>
                  )}
              </div>
          ) : (
              <div className="empty-state" style={{alignContent : 'center', height : '50vh'}}>
                  <p>Please select a project and team to load {workType === 'task' ? 'task' : 'story'} data.</p>
              </div>
          )}
        </div>
    );
}

export default DashboardPage;
