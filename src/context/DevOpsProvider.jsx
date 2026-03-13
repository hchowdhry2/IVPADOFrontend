import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAdo } from '../services/fetchService';
import { use } from 'react';

export const DevOpsContext = createContext();

const DevOpsProvider = ({ children }) => {

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [areaPaths, setAreaPaths] = useState([]);
    const [selectedAreaPath, setSelectedAreaPath] = useState(null);

    useEffect(() => {
        fetchProjects();
    },[]);

    useEffect(() => {
        if(selectedProject) {
            fetchTeams();
        }
    }, [selectedProject]);

    useEffect(() => {
        if(selectedProject && selectedTeam) {
            console.log(selectedTeam);
            fetchAreaPaths({selectedProject, selectedTeam});
        }
    }, [selectedTeam]);

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

    const fetchAreaPaths = async ({selectedProject, selectedTeam}) => {
        try {
            const areaPaths = await fetchAdo.getAreaPaths({projectId: selectedProject, teamId:  selectedTeam});
            setAreaPaths(areaPaths);
            console.log('Fetched area paths:', areaPaths);
        } catch (error) {
            console.error('Error fetching area paths:', error);
        }
    }
  return (
    <DevOpsContext.Provider value={{
        projects,
        selectedProject, setSelectedProject,
        teams,
        selectedTeam, setSelectedTeam,
        areaPaths,
        selectedAreaPath, setSelectedAreaPath
        }}>
      {children}
    </DevOpsContext.Provider>
  )
}

export const useDevOpsContext = () => {
    return useContext(DevOpsContext);
}

export default DevOpsProvider;

