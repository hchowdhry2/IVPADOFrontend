import { apiConfig, apiConfigDevops } from "./apiConfig";

export const fetchAdo = {
    getProjects: async () => {
        try {
            const response = await apiConfigDevops.get('/devops-projects');
            return response.data.value; // Return the list of projects
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    },
    getTeams : async (projectId) => {
        try {
            console.log('Fetching teams for project:', projectId);
            const response = await apiConfigDevops.get(`/devops-teams/${projectId}`);
            return response.data; // Return the list of teams
        } catch (error) {
            console.error('Error fetching teams:', error);
            return [];
        }
    },
    getIterationStats : async ({projectId, teamId, areaPath, lastNSprints}) => {
        try {
            // Encode the areaPath to handle spaces and special characters safely
            const safeAreaPath = encodeURIComponent(areaPath); 
            const response = await apiConfigDevops.get(
                `/devops-iteration-stats/${projectId}/${teamId}/${safeAreaPath}?lastNSprints=${lastNSprints}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching iteration stats:', error);
            return null;
        }
    },
    getSpillageData : async ({projectId, teamId, timeframe, lastN}) => {
        try {
            if (timeframe) {
                const response = await apiConfig.get(
                `?projectId=${projectId}&teamId=${teamId}&timeframe=${timeframe}&n=${lastN}`
                );
                return response.data;
            }
            const response = await apiConfig.get(
                `?projectId=${projectId}&teamId=${teamId}&n=${lastN}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching spillage data:', error);
            return null;
        }
    }
}