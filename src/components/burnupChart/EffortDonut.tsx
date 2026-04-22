import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface EffortBreakdown {
  attribute: string;
  totalEffort: number;
}

interface Props {
  data: EffortBreakdown[];
  title: string;
}

const EffortDonut: React.FC<Props> = ({ data, title }) => {
  const options = useMemo(() => {
    // 1. AGGREGATION LOGIC: Sum effort by attribute
    const aggregatedData = data.reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.attribute);
      if (existing) {
        existing.y += curr.totalEffort;
      } else {
        acc.push({ name: curr.attribute || "Not Defined", y: curr.totalEffort });
      }
      return acc;
    }, [] as { name: string; y: number }[]);

    return {
      chart: { 
        type: 'pie', 
        height: 250, 
        backgroundColor: 'transparent',
        margin: [0, 0, 0, 0]
      },
      title: { 
        text: title, 
        style: { fontSize: '14px', fontWeight: '600', color: '#334155' }
      },
      tooltip: { 
        pointFormat: '<b>{point.name}</b>: {point.y:.1f} hrs' 
      },
      plotOptions: {
        pie: {
          innerSize: '65%',
          borderWidth: 2,
          borderColor: '#ffffff',
          dataLabels: { 
            enabled: true, 
            format: '<b>{point.name}</b>: {point.y:.1f}h',
            style: { fontSize: '10px', color: '#64748b' }
          }
        }
      },
      series: [{
        name: 'Effort',
        colorByPoint: true,
        data: aggregatedData // 2. Use the aggregated list
      }],
      credits: { enabled: false }
    };
  }, [data, title]);

  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        color: '#94a3b8', fontSize: '13px', border: '1px dashed #e2e8f0', borderRadius: '12px' 
      }}>
        No Data Available
      </div>
    );
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default EffortDonut;