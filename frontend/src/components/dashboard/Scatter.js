import { useState } from 'react';
// import Plot from 'react-plotly.js';
import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
})

function Scatter(props) {
  const [title, setTitle] = useState("");
  return (
      <Plot
        data={[
          {
            x: props.xlist,
            y: props.ylist,
            type: 'scatter',
            mode: 'markers',
            marker: {
              color: '#5048E5',
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
            color: '#000000',
            family: 'Inter',
            size: 10
          },  
          paper_bgcolor: '#ffffff',
          plot_bgcolor: '#ffffff',
          xaxis: {
            uirevision: 'time',
            title: props.xtitle,
            titlefont: {
                // color: '#000000',
                // family: 'Inter',
                size: 17
            }
          },
          yaxis: {
            uirevision: 'time',
            title: props.ytitle,
            titlefont: {
                // color: '#000000',
                // family: 'Inter',
                size: 17
            }
          },
          title: {
            text: `<b>${props.ytitle} v/s ${props.xtitle}</b> <br> ${title}`,
            font: {
                color: '#5048E5',
                family: 'Inter',
                size: 24,
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

export default Scatter;