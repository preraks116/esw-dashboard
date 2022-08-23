import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function Graph(props) {
  return (
      <Plot
        data={[
          {
            x: props.xlist,
            y: props.ylist,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {
              color: 'rgb(30, 144, 255)',
              size: 5
            }
          }
        ]}
        layout={{
          width: 1000,
          height: 400,
          autosize: true,
          l: 0, r: 0, b: 0, t: 0, pad: 0,   
          showlegend: false,
          font: {
            color: '#ffffff',
            family: 'Courier New',
            size: 12
          },  
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          xaxis: {
            uirevision: 'time',
            title: 'Time',
          },
          yaxis: {
            uirevision: 'time',
            title: 'RPM',
          },
          title: {
            text: 'RPM',
            font: {
                color: '#ffffff',
                family: 'Courier New',
                size: 24
            }
          },
        }}
      />
  );
}

export default Graph;