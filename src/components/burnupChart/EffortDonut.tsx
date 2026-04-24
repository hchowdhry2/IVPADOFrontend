import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface EffortBreakdown {
  attribute?: string;
  Attribute?: string;
  totalEffort?: number;
  TotalEffort?: number;
}

interface Props {
  data: EffortBreakdown[];
  title: string;
}

const EffortDonut: React.FC<Props> = ({ data, title }) => {
  const options = useMemo(() => {
    const aggregatedData = (data || []).reduce((acc, curr) => {
      const label = (curr.attribute || curr.Attribute || "Not Defined").trim();
      const value = curr.totalEffort || curr.TotalEffort || 0;

      const existing = acc.find(item => item.name === label);
      if (existing) {
        existing.y += value;
      } else {
        acc.push({ name: label, y: value });
      }
      return acc;
    }, [] as { name: string; y: number }[])
    .sort((a, b) => b.y - a.y); // Sort descending to keep layout clean

    const total = aggregatedData.reduce((sum, item) => sum + item.y, 0);

    return {
      chart: { 
        type: 'pie', 
        height: 350, 
        backgroundColor: 'transparent',
      },
      // Centering the title in the donut hole
      title: { 
        text: `<span style="font-size: 20px; color: #64748b; font-weight: 600;">${title}</span><br/>` +
              `<span style="font-size: 18px; color: #1e293b; font-weight: 800;">${total.toFixed(1)}h</span>`,
        align: 'center',
        // verticalAlign: 'middle',
        y: 10,
        useHTML: true
      },
      tooltip: { 
        headerFormat: '',
        pointFormat: '<span style="color:{point.color}">●</span> <b>{point.name}</b>: {point.y:.1f} hrs ({point.percentage:.1f}%)' 
      },
      // give subtle colors:       colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#94a3b8'],
// colors: [
//   '#94a3b8', // Muted Blue-Gray (Slate 400)
//   '#a5b4fc', // Soft Indigo
//   '#cbd5e1', // Light Steel Blue
//   '#c4b5fd', // Muted Lavender
//   '#64748b', // Deep Slate Blue
//   '#e2e8f0'  // Neutral Background Gray
// ],      
colors: [
  '#60a5fa', // Muted Sky Blue (Desaturated)
  '#818cf8', // Muted Periwinkle
  '#9ca3af', // Medium Gray
  '#a78bfa', // Dusty Purple
  '#475569', // Dark Slate
  '#f1f5f9'  // Ghost White
],
      plotOptions: {
        pie: {
          innerSize: '60%',
          borderWidth: 3,
          borderColor: '#ffffff',
          dataLabels: { 
            enabled: true,
            useHTML: true,
            allowOverlap: true, // Forces display even if labels are close
            padding: 0,        // Removes extra space around labels to fit more
            distance: 30,      // Pushes labels further out to give them room to breathe
            crop: false,       // Prevents labels from being cut off at chart edges
            overflow: 'none',
            format: '<b>{point.name}</b><br/>{point.y:.1f}h', 
            connectorWidth: 1,
            style: { fontSize: '13px', color: '#475569', textOutline: 'none' }
          }
        }
      },
      series: [{ name: 'Effort', data: aggregatedData }],
      credits: { enabled: false }
    };
  }, [data, title]);

  if (!data || data.length === 0) {
    return (
      <div style={{ flex: 1, height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px dashed #e2e8f0', borderRadius: '12px', marginBottom: '20px' }}>
        No Data Available
      </div>
    );
  }

  return (
    <div style={{ flex: 1, background: '#fff', padding: '15px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default EffortDonut;