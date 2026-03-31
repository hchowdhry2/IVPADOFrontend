import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
import React from 'react'

const RenderLineChart = ({ title, data, sections }) => {
  // 1. Get categories from the 'all' section to define the X-Axis
  const categories = (data.all?.spillage || []).map(item => 
    item.iterationPath?.split('\\').pop() || 'Sprint'
  );

  // 2. Map through the global 'sections' array to create multiple series
  const series = sections.map(section => ({
    name: section.title,
    // Accessing the specific spillageArray for this section
    data: (data[section.key]?.spillage || []).map(item => item.spillagePoints || 0),
    color: section.barColor, // Matches the Bar Chart color for consistency
    marker: { enabled: true, radius: 5 },
    lineWidth: 3
  }));

  const options = {
    chart: { 
      type: 'line',
      style: { fontFamily: 'Roboto, Arial, sans-serif' }
    },
    title: { text: title },
    xAxis: { 
      categories: categories,
    },
    yAxis: { 
      title: { text: 'Spilled Points' },
      min: 0 
    },
    // Allows user to see All, Feature, and Client values in one popup
    tooltip: {
      shared: true,
      crosshairs: true
    },
    series: series, 
    credits: { enabled: false }
  };

  return (
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '20px' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default RenderLineChart