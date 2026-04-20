import React, { useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import LoadingSkeleton from '../LoadingSkeleton';

interface Stat {
    sprint: string;
    developer: string;
    totalTasksAssigned: number;
    totalTasksCompleted: number;
    totalHours: number;
}

interface DeveloperTrendChartProps {
    stats: Stat[];
    loading?: boolean;
}

const DeveloperTrendChart: React.FC<DeveloperTrendChartProps> = ({ stats, loading = false }) => {
    // 1. Get unique developers for the dropdown
    const developers = useMemo(() => 
        Array.from(new Set(stats.map(s => s.developer))).sort(), 
    [stats]);

    if (loading || !stats || stats.length === 0) {
        return <LoadingSkeleton type="chart" height="400px" />;
    }

    const [selectedDev, setSelectedDev] = useState(developers[0] || "");

    const chartData = useMemo(() => {
        // 2. Filter data for the selected developer and sort by sprint
        const devStats = stats
            .filter(s => s.developer === selectedDev)
            .sort((a, b) => a.sprint.localeCompare(b.sprint)); // Basic sort, adjust if sprint names need custom logic

        const categories = devStats.map(s => s.sprint.split('\\').pop() || s.sprint);
        const assigned = devStats.map(s => s.totalTasksAssigned);
        const completed = devStats.map(s => s.totalTasksCompleted);
        const efficiency = devStats.map(s => 
            s.totalTasksAssigned > 0 ? Math.round((s.totalTasksCompleted / s.totalTasksAssigned) * 100) : 0
        );

        return { categories, assigned, completed, efficiency };
    }, [stats, selectedDev]);

    const options: Highcharts.Options = {
        chart: { type: 'line', height: 400 },
        title: { text: `Performance Trend: ${selectedDev}` },
        xAxis: { categories: chartData.categories },
        yAxis: [{
            title: { text: 'Number of Tasks' },
            min: 0
        }, {
            title: { text: 'Completion %' },
            opposite: true,
            max: 100,
            min: 0
        }],
        series: [
            {
                name: 'Tasks Assigned',
                type: 'line',
                data: chartData.assigned,
                color: '#64748b',
                dashStyle: 'Dash'
            },
            {
                name: 'Tasks Completed',
                type: 'area',
                data: chartData.completed,
                color: '#22c55e',
                fillOpacity: 0.1
            },
            {
                name: 'Completion Rate',
                type: 'spline',
                yAxis: 1,
                data: chartData.efficiency,
                color: '#3b82f6',
                tooltip: { valueSuffix: '%' }
            }
        ],
        tooltip: { shared: true },
        credits: { enabled: false }
    };

    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontWeight: '600', color: '#475569' }}>Select Developer:</label>
                <select 
                    value={selectedDev} 
                    onChange={(e) => setSelectedDev(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', minWidth: '200px' }}
                >
                    {developers.map(dev => <option key={dev} value={dev}>{dev}</option>)}
                </select>
            </div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default DeveloperTrendChart;