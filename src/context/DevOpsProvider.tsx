import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    fetchAdo, 
    AdoProject, 
    AdoTeam, 
    SpillageDataResponse 
} from '../services/fetchService';

// 1. Define the shape of the Context Value
interface DevOpsContextType {
    data: SpillageDataResponse | null;
    loading: boolean;
    projects: AdoProject[];
    selectedProject: string | null;
    setSelectedProject: (id: string | null) => void;
    teams: AdoTeam[];
    selectedTeam: string | null;
    setSelectedTeam: (id: string | null) => void;
    lastN: number;
    setLastN: (n: number) => void;
    timeFrame: string | null;
    setTimeFrame: (tf: string | null) => void;
    workType: 'story' | 'task';
    setWorkType: (wt: 'story' | 'task') => void;
}

// 2. Initialize context with an undefined default, but type it
export const DevOpsContext = createContext<DevOpsContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

const DevOpsProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Using the types we imported from the fetchService
    const [projects, setProjects] = useState<AdoProject[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [teams, setTeams] = useState<AdoTeam[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [lastN, setLastN] = useState<number>(6);
    const [timeFrame, setTimeFrame] = useState<string | null>(null);
    const [data, setData] = useState<SpillageDataResponse | null>(null);
    const [workType, setWorkType] = useState<'story' | 'task'>('story');

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchTeams();
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedProject && selectedTeam && lastN > 0) {
            fetchData();
        }
    }, [selectedProject, selectedTeam, timeFrame, lastN, workType]);

    const fetchProjects = async () => {
        const result = await fetchAdo.getProjects();
        setProjects(result);
    };

    const fetchTeams = async () => {
        if (!selectedProject) return;
        const result = await fetchAdo.getTeams(selectedProject);
        setTeams(result);
    };

    const fetchData = async () => {
        if (!selectedProject || !selectedTeam) return;
        
        setData(null); 
        setLoading(true); 
        
        try {
            const res = await fetchAdo.getSpillageData({
                projectId: selectedProject, 
                teamId: selectedTeam, 
                timeframe: timeFrame || undefined, 
                lastN: lastN,
                workType: workType 
            });
            setData(res); 
        } catch (err) {
            console.error(err);
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DevOpsContext.Provider value={{
            data,
            loading,
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
    );
};

// 3. Custom hook with a built-in safety check
export const useDevOpsContext = () => {
    const context = useContext(DevOpsContext);
    if (context === undefined) {
        throw new Error('useDevOpsContext must be used within a DevOpsProvider');
    }
    return context;
};

export default DevOpsProvider;