import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAdo } from '../services/fetchService';
import { use } from 'react';

export const DevOpsContext = createContext();

const DevOpsProvider = ({ children }) => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [lastN, setLastN] = useState(6);
    const [timeFrame, setTimeFrame] = useState(null);
    const [data, setData] = useState(null);
    const [workType, setWorkType] = useState('story'); // Default to story

    useEffect(() => {
        fetchProjects();
    },[]);

    useEffect(() => {
        if(selectedProject) {
            fetchTeams();
        }
    }, [selectedProject]);

    useEffect(() => {
        if(selectedProject && selectedTeam && lastN > 0) {
            fetchData();
        }
    }, [selectedProject, selectedTeam, timeFrame, lastN, workType]);


    const fetchProjects = async () => {
        try {
            const projects = await fetchAdo.getProjects();
            setProjects(projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    const fetchTeams = async () => {
        try {
            const teams = await fetchAdo.getTeams(selectedProject);
            setTeams(teams);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    }

    const fetchData = async () => {
    setLoading(true); 
    try {
        const res = await fetchAdo.getSpillageData({
            projectId: selectedProject, 
            teamId: selectedTeam, 
            timeframe: timeFrame, 
            lastN: lastN,
            workType: workType
        });
        
        console.log('Fetched spillage data for:', workType, res);
        setData(res); 
        setError(null);
    } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
}

    const fetchIterationsStats = async ({selectedProject, selectedTeam, selectedAreaPath}) => {
        try {
            const stats = await fetchAdo.getIterationStats({projectId: selectedProject, teamId:  selectedTeam, areaPath: selectedAreaPath, lastN: lastN});
            console.log('Fetched iteration stats:', stats);
        } catch (error) {
            console.error('Error fetching iteration stats:', error);
            return null;
        }   
    }
  return (
    <DevOpsContext.Provider value={{
        data,
        projects,
        selectedProject, setSelectedProject,
        teams,
        selectedTeam, setSelectedTeam,
        lastN, setLastN,
        timeFrame, setTimeFrame,
        workType, setWorkType,
        }}>
      {children}
    </DevOpsContext.Provider>
  )
}

export const useDevOpsContext = () => {
    return useContext(DevOpsContext);
}

export default DevOpsProvider;

