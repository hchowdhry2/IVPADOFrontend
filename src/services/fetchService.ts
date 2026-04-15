import { apiConfig, apiConfigDevops } from "./apiConfig";

// --- 1. DATA MODELS (Interfaces) ---

export interface AdoProject {
    id: string;
    name: string;
    description?: string;
}

export interface AdoTeam {
    id: string;
    name: string;
}

// Stats used in DailyScopeTrendChart
export interface DayByDayPoint {
    date: string;
    totalPoints: number;
}

export interface SprintTrend {
    iterationPath: string;
    dayByDayPoints: DayByDayPoint[];
}

// Spillage Data Structures (Matching your JSON)
export interface SprintStat {
    iterationPath: string;
    totalPointsAssigned: number;
    initialPoints: number;
    midSprintAddedPoints: number;
    totalPointsCompleted: number;
    closedTimely: number;
    closedLate: number;
    sortDate: string;
}

export interface SpillagePoint {
    iterationPath: string;
    spillagePoints: number;
    sortDate: string;
}

export interface HistoryItem {
    parentId: number;
    parentTitle: string;
    parentStatus: string;
    totalStoryCount: number;
    totalImpactScore: number;
}

export interface DeveloperStat {
    developer: string;
    sprint: string;
    totalTasksAssigned: number;
    totalTasksCompleted: number;
    totalHours: number;
}

export interface SpillageCategory {
    stats: SprintStat[];
    spillage: SpillagePoint[];
    history: HistoryItem[];
    dailyTrends?: SprintTrend[]; // optional
    developerStats?: DeveloperStat[]; // optional, will always be there in task data but not in story data
}

// The root response is a dictionary (e.g., "all", "Feature", "Client")
export type SpillageDataResponse = Record<string, SpillageCategory>;

// --- 2. PARAMETER TYPES ---

export interface IterationStatParams {
    projectId: string;
    teamId: string;
    areaPath: string;
    lastNSprints: number;
}

export interface SpillageParams {
    projectId: string;
    teamId: string;
    timeframe?: string;
    lastN: number;
    workType?: 'task' | 'story';
}

// --- 3. THE SERVICE ---

export const fetchAdo = {
    /**
     * Fetches all DevOps projects
     */
    getProjects: async (): Promise<AdoProject[]> => {
        try {
            const response = await apiConfigDevops.get<{ value: AdoProject[] }>('/devops-projects');
            return response.data.value; 
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    },

    /**
     * Fetches teams for a specific project
     */
    getTeams: async (projectId: string): Promise<AdoTeam[]> => {
        try {
            const response = await apiConfigDevops.get<AdoTeam[]>(`/devops-teams/${projectId}`);
            return response.data; 
        } catch (error) {
            console.error('Error fetching teams:', error);
            return [];
        }
    },

    /**
     * Fetches daily trend data for charts
     */
    getIterationStats: async ({ 
        projectId, 
        teamId, 
        areaPath, 
        lastNSprints 
    }: IterationStatParams): Promise<SprintTrend[] | null> => {
        try {
            const safeAreaPath = encodeURIComponent(areaPath); 
            const response = await apiConfigDevops.get<SprintTrend[]>(
                `/devops-iteration-stats/${projectId}/${teamId}/${safeAreaPath}?lastNSprints=${lastNSprints}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching iteration stats:', error);
            return null;
        }
    },

    /**
     * Fetches spillage, stats, and history categorized by type (all, feature, client)
     */
    getSpillageData: async ({ 
        projectId, 
        teamId, 
        timeframe, 
        lastN, 
        workType 
    }: SpillageParams): Promise<SpillageDataResponse | null> => {
        try {
            const safeTeamId = encodeURIComponent(teamId);
            
            const params = new URLSearchParams({
                projectId,
                teamId: safeTeamId,
                n: lastN.toString()
            });
            
            if (timeframe) params.append('timeframe', timeframe);
            if (workType) params.append('workType', workType);

            const response = await apiConfig.get<SpillageDataResponse>(`?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching spillage data:', error);
            return null;
        }
    }
};