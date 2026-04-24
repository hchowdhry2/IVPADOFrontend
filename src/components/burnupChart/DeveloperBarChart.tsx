import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { DeveloperStat } from '../../services/fetchService';
import LoadingSkeleton from '../LoadingSkeleton';
import VisualizationInfoDialog from '../VisualizationInfoDialog';

interface DeveloperBarChartProps {
    stats: DeveloperStat[];
    loading?: boolean;
}

const DeveloperBarChart: React.FC<DeveloperBarChartProps> = ({ stats, loading = false }) => {
    
    if (loading || !stats || stats.length === 0) {
        return <LoadingSkeleton type="chart" height="500px" />;
    }

    // const { categories, seriesData, plotBands, plotLines } = useMemo(() => {
    //     // 1. Get unique sprints sorted
    //     // const sprints = Array.from(new Set(stats.map(s => s.sprint))).sort();
    //     const sprints: string[] = [];
    //     stats.forEach(s => {
    //         if (!sprints.includes(s.sprint)) {
    //             sprints.push(s.sprint);
    //         }
    //     });
    //     sprints.reverse();

    //     // 2. Get unique developers in a consistent order (Alphabetical)
    //     const masterDevList = Array.from(new Set(stats.map(s => s.developer))).sort();
        
    //     const categories: string[] = [];
    //     const plotBands: Highcharts.XAxisPlotBandsOptions[] = [];
    //     const plotLines: Highcharts.XAxisPlotLinesOptions[] = [];
    //     const completedData: number[] = [];
    //     const pendingData: number[] = [];
        
    //     let currentPos = 0;

    //     sprints.forEach((sprint, idx) => {
    //         const startPos = currentPos;

    //         // Use the masterDevList to ensure the order is identical in every sprint bucket
    //         masterDevList.forEach(devName => {
    //             const devStat = stats.find(s => s.sprint === sprint && s.developer === devName);
                
    //             categories.push(devName);
    //             // If dev didn't work in this specific sprint, push 0
    //             completedData.push(devStat ? devStat.totalTasksCompleted : 0);
    //             pendingData.push(devStat ? Math.max(0, devStat.totalTasksAssigned - devStat.totalTasksCompleted) : 0);
                
    //             currentPos++;
    //         });

    //         // 3. Shaded backgrounds for sprints
    //         plotBands.push({
    //             from: startPos - 0.5,
    //             to: currentPos - 0.5,
    //             color: idx % 2 === 0 ? 'transparent' : 'rgba(248, 250, 252, 0.5)',
    //             label: {
    //                 text: sprint.split('\\').pop() || sprint,
    //                 align: 'center',
    //                 verticalAlign: 'top',
    //                 y: -40, // Adjusted for extra margin
    //                 style: { color: '#64748b', fontWeight: 'bold' }
    //             }
    //         });

    //         // 4. Vertical divider lines between sprints
    //         if (idx < sprints.length - 1) {
    //             plotLines.push({
    //                 value: currentPos - 0.5,
    //                 color: '#e2e8f0', // Light grey line
    //                 width: 2,
    //                 zIndex: 3
    //             });
    //         }
    //     });

    //     return { 
    //         categories, 
    //         plotBands, 
    //         plotLines,
    //         seriesData: [
    //             { name: 'Completed', data: completedData, color: '#54a371ff' },
    //             { name: 'Pending', data: pendingData, color: '#e2e8f0' }
    //         ]
    //     };
    // }, [stats]);

    const { categories, seriesData, plotBands, plotLines } = useMemo(() => {
        // 1. Get unique sprints sorted chronologically
        const sprints: string[] = [];
        stats.forEach(s => {
            if (!sprints.includes(s.sprint)) {
                sprints.push(s.sprint);
            }
        });
        sprints.reverse();

        const categories: string[] = [];
        const plotBands: Highcharts.XAxisPlotBandsOptions[] = [];
        const plotLines: Highcharts.XAxisPlotLinesOptions[] = [];
        const completedData: number[] = [];
        const pendingData: number[] = [];
        
        let currentPos = 0;

        sprints.forEach((sprint, idx) => {
            const startPos = currentPos;
            let sprintHasWork = false;

            // 2. Filter stats for this sprint AND sort them alphabetically by developer
            const sprintStats = stats
                .filter(s => s.sprint === sprint)
                .sort((a, b) => a.developer.localeCompare(b.developer));

            sprintStats.forEach(devStat => {
                // Only push to chart if assigned tasks > 0
                if (devStat.totalTasksAssigned > 0) {
                    categories.push(devStat.developer);
                    completedData.push(devStat.totalTasksCompleted);
                    pendingData.push(Math.max(0, devStat.totalTasksAssigned - devStat.totalTasksCompleted));
                    
                    currentPos++;
                    sprintHasWork = true;
                }
            });

            // 3. Shaded backgrounds for sprints (only if developers were added)
            if (sprintHasWork) {
                plotBands.push({
                    from: startPos - 0.5,
                    to: currentPos - 0.5,
                    color: idx % 2 === 0 ? 'transparent' : 'rgba(248, 250, 252, 0.5)',
                    label: {
                        text: sprint.split('\\').pop() || sprint,
                        align: 'center',
                        verticalAlign: 'top',
                        y: -40,
                        style: { color: '#64748b', fontWeight: 'bold' }
                    }
                });

                // 4. Vertical divider lines
                if (idx < sprints.length - 1) {
                    plotLines.push({
                        value: currentPos - 0.5,
                        color: '#e2e8f0',
                        width: 2,
                        zIndex: 3
                    });
                }
            }
        });

        return { 
            categories, 
            plotBands, 
            plotLines,
            seriesData: [
                { name: 'Completed', data: completedData, color: '#54a371ff' },
                { name: 'Pending', data: pendingData, color: '#e2e8f0' }
            ]
        };
    }, [stats]);

    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            marginTop: 120, // Increased to fit labels and padding
            height: 500
        },
        title: {
            text: 'Developer Workload Completion per Sprint',
            align: 'left',
            style: { fontWeight: '600' }
        },
        xAxis: {
            categories: categories,
            plotBands: plotBands,
            plotLines: plotLines, // Added dividers
            labels: {
                rotation: -45,
                style: { fontSize: '10px' },
                autoRotation: [0, -45, -90],
                step: 1,             // Forces Highcharts to show every label
                padding: 0
        },
            tickInterval: 1,
            tickLength: 0,
            gridLineWidth: 0
        } ,
        yAxis: {
            min: 0,
            title: { text: 'Total Tasks Assigned' },
            gridLineColor: '#f1f5f9',
            stackLabels: {
                enabled: true,
                style: { fontWeight: 'bold', color: '#475569' }
            }
        },
        legend: {
            enabled: true,
            verticalAlign: 'bottom',
            align: 'center',
        },
        tooltip: {
            shared: true,
            headerFormat: '<b>{point.key}</b><br/>'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                borderWidth: 0,
                pointPadding: 0.1,
                groupPadding: 0.1
            }
        },
        series: seriesData.map(s => ({ ...s, type: 'column' })),
        credits: { enabled: false }
    };

    return (
        <div className="dashboard-section" style={{ padding: '30px 20px 20px 20px', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}></h3>
                    <VisualizationInfoDialog visualizationKey="sprintProgressDev" title="Sprint Progress Logic" />
                </div>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
    );
};

export default DeveloperBarChart;