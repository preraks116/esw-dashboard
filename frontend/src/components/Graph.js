import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function Graph(props) {
  const [title, setTitle] = useState("");
  const [mean, setMean] = useState(0);
  const [median, setMedian] = useState(0);
  const [std, setStd] = useState(0);
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
          width: undefined,
          height: undefined,
          autosize: true,
          // dragmode: 'select',
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
            title: props.title,
          },
          title: {
            text: `${props.title} <br> ${title}`,
            font: {
                color: '#ffffff',
                family: 'Courier New',
                size: 24
            }
          },
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
        onSelected={(event) => {
          // console.log(event);
          let x = [];
          let y = []
          if(event && event.points) {
            for(var i = 0; i < event.points.length; i++) {
              x.push(event.points[i].x);
              y.push(event.points[i].y);
            }
            // calculate mean, median, and standard deviation
            let mean = 0;
            let median = 0;
            let std = 0;
            for(var i = 0; i < y.length; i++) {
              mean += y[i];
            }
            mean /= y.length;
  
            if(y.length % 2 === 0) {
              median = (y[y.length/2] + y[y.length/2 - 1])/2;
            }
            else {
              median = y[Math.floor(y.length/2)];
            }
  
            for(var i = 0; i < y.length; i++) {
              std += Math.pow(y[i] - mean, 2);
            }
            std /= y.length;
            std = Math.sqrt(std);
            // check if any are nan
            if(!isNaN(mean) && !isNaN(median) && isNaN(std)) {
              setTitle(`Mean: ${mean.toFixed(2)} Median: ${median.toFixed(2)} Std: ${std.toFixed(2)}`);
            }
            console.log("Mean: " + mean.toFixed(2));
            console.log("Median: " + median.toFixed(2));
            console.log("Standard Deviation: " + std.toFixed(2));
          }
        }}
      />
  );
}

export default Graph;