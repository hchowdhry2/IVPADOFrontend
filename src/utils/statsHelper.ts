export interface DeveloperStat {
  sprint: string;
  developer: string;
  totalTasksAssigned: number;
  totalTasksCompleted: number;
  totalHours: number;
  sprintStartDate?: string | Date;
}

export const normalize = (val?: string): string => {
  return val?.toLowerCase().split('\\').pop()?.trim() || '';
};

export const aggregateStats = (stats: DeveloperStat[]): DeveloperStat[] => {
  const map: Record<string, DeveloperStat> = {};

  stats.forEach((s) => {
    const sprintKey = normalize(s.sprint);
    const key = `${sprintKey}__${s.developer}`;

    if (!map[key]) {
      map[key] = {
        sprint: s.sprint,
        developer: s.developer,
        totalTasksAssigned: 0,
        totalTasksCompleted: 0,
        totalHours: 0,
        sprintStartDate: s.sprintStartDate
      };
    }

    map[key].totalTasksAssigned += s.totalTasksAssigned ?? 0;
    map[key].totalTasksCompleted += s.totalTasksCompleted ?? 0;
    map[key].totalHours += s.totalHours ?? 0;
  });

  return Object.values(map);
};