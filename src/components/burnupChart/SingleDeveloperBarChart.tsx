import React, { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const SingleDeveloperBarChart: React.FC<{ stats: any[] }> = ({ stats }) => {
    // 1. Extract unique developers for the dropdown menu
    const developers = useMemo(() => 
        Array.from(new Set(stats.map(s => s.developer))).sort(), 
    [stats]);

    // 2. State to store the currently selected developer
    const [selectedDev, setSelectedDev] = useState(developers[0] || "");

    // 3. Prepare Chart Data for the selected developer
    const chartOptions = useMemo(() => {
        // Filter history for the selected dev and sort chronologically
        const devHistory = stats
            .filter(s => s.developer === selectedDev)
            .sort((a, b) => a.sprint.localeCompare(b.sprint));

        return {
            chart: { type: 'column', height: 450 },
            title: { 
                text: `Sprint Performance: ${selectedDev}`,
                style: { fontSize: '16px', fontWeight: '600' }
            },
            xAxis: {
                categories: devHistory.map(s => s.sprint.split('\\').pop() || s.sprint),
                title: { text: 'Sprints' }
            },
            yAxis: {
                min: 0,
                title: { text: 'Number of Tasks' },
                stackLabels: { enabled: true }
            },
            legend: { align: 'center', verticalAlign: 'bottom' },
            // Two bars per sprint: Assigned vs Completed
            series: [
                {
                    name: 'Tasks Assigned',
                    data: devHistory.map(s => s.totalTasksAssigned),
                    color: '#a5b4fc' // Slate grey
                },
                {
                    name: 'Tasks Completed',
                    data: devHistory.map(s => s.totalTasksCompleted),
                    color: '#22c55e' // Success green
                }
            ],
            plotOptions: {
                column: {
                    borderRadius: 4,
                    dataLabels: { enabled: true }
                }
            },
            credits: { enabled: false }
        };
    }, [stats, selectedDev]);

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            {/* THE DROPDOWN SECTION */}
            <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
                    Select Developer to View Trend
                </label>
                <select 
                    value={selectedDev} 
                    onChange={(e) => setSelectedDev(e.target.value)}
                    style={{ 
                        padding: '10px', 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0', 
                        width: '300px',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {developers.map(dev => (
                        <option key={dev} value={dev}>{dev}</option>
                    ))}
                </select>
            </div>

            {/* THE CHART SECTION */}
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};

export default SingleDeveloperBarChart;