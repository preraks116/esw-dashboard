import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
var xlist = [0];
var ylist = [0];
var length = 0;
function App() {
  const [settings, setSettings] = useState(0);
  useEffect(() => {
    setInterval(() => {
      console.log("changing xlist and ylist");
      // choose a random number between 0 and 100
      const y = Math.random() * 100;
      ylist = [...ylist, y];
      length++;
      xlist = [...xlist, length];

      if (ylist.length > 10) {
        ylist.shift();
        xlist.shift();
      }
      console.log("xlist is", xlist);
      console.log("ylist is", ylist);
      setSettings(settings => settings + 1);
    }, 1000);
  }, []);



  return (
    <div className="App">
      <h1>ESW DashBoard</h1>
      <div id='graph'>
      <Plot
        data={[
          {
            x: xlist,
            y: ylist,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {
              color: 'red',
              size: 12
            }
          }
        ]}
        layout={{
          width: 1000,
          height: 400,
          autosize: true,
          l: 0, r: 0, b: 0, t: 0, pad: 0,
          showlegend: false,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          xaxis: {
            uirevision: 'time',
          },
          yaxis: {
            uirevision: 'time',
          },
        }}
      />
      </div>
    </div>
  );
}


export default App;