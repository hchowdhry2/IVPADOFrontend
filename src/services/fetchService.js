import { apiConfig, apiConfigDevops } from "./apiConfig";

export const fetchAdo = {
    getProjects: async () => {
        try {
            const response = await apiConfigDevops.get('/devops-projects');
            return response.data.value; 
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    },

    getTeams: async (projectId) => {
        try {
            const response = await apiConfigDevops.get(`/devops-teams/${projectId}`);
            return response.data; 
        } catch (error) {
            console.error('Error fetching teams:', error);
            return [];
        }
    },

    getIterationStats: async ({ projectId, teamId, areaPath, lastNSprints }) => {
        try {
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

    getSpillageData: async ({ projectId, teamId, timeframe, lastN, workType }) => {
        try {
            // Encode teamId because it usually contains spaces (e.g., "IVP-SRM Team")
            const safeTeamId = encodeURIComponent(teamId);
            
            let url = `?projectId=${projectId}&teamId=${safeTeamId}&n=${lastN}`;
            
            if (timeframe) {
                url += `&timeframe=${timeframe}`;
            }
            
            if (workType) {
                url += `&workType=${workType}`;
            }

            const response = await apiConfig.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching spillage data:', error);
            return null;
        }
    } // This brace closes getSpillageData
}; // This brace closes the fetchAdo object