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
    // Aggregation logic with debug fallback
    const aggregatedData = (data || []).reduce((acc, curr) => {
      // Handle both camelCase and PascalCase from C#
      const label = (curr.attribute || curr.Attribute || "Not Defined").trim();
      const value = curr.totalEffort || curr.TotalEffort || 0;

      const existing = acc.find(item => item.name === label);
      if (existing) {
        existing.y += value;
      } else {
        acc.push({ name: label, y: value });
      }
      return acc;
    }, [] as { name: string; y: number }[]);

    return {
      chart: { type: 'pie', height: 250, backgroundColor: 'transparent', margin: [0, 0, 0, 0] },
      title: { text: title, style: { fontSize: '14px', fontWeight: '600', color: '#334155' } },
      tooltip: { pointFormat: '<b>{point.name}</b>: {point.y:.1f} hrs' },
      plotOptions: {
        pie: {
          innerSize: '65%',
          dataLabels: { enabled: true, format: '{point.name}', style: { fontSize: '10px' } }
        }
      },
      series: [{ name: 'Effort', colorByPoint: true, data: aggregatedData }],
      credits: { enabled: false }
    };
  }, [data, title]);

  // DIAGNOSTIC: If data exists but chart is empty, log this
  if (data && data.length > 0 && !options.series[0].data.length) {
     console.warn("EffortDonut: Data found but aggregation resulted in empty list. Check property names:", data[0]);
  }

  if (!data || data.length === 0) {
    return <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Data Available</div>;
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default EffortDonut;