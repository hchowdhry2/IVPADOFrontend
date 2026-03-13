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
    getAreaPaths : async ({projectId, teamId}) => {
        try {
            const response = await apiConfigDevops.get(`/devops-area-paths/${projectId}/${teamId}`);
            return response.data.values; // Return the list of area paths
        } catch (error) {
            console.error('Error fetching area paths:', error);
            return [];
        }
    }
}