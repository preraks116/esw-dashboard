import React, { useState,useEffect } from 'react';
import Plot from 'react-plotly.js';
var xlist = [0];
var ylist = [0];
function App () {
  const [settings, setSettings] = useState(0);
  useEffect(() => {
  setInterval(() => {
    console.log("changing xlist and ylist");
    // choose a random number between 0 and 100
    const y = Math.random() * 100;
    ylist = [...ylist, y];
    xlist = [...xlist, xlist.length];
    console.log("xlist is", xlist);
    console.log("ylist is", ylist);
    setSettings(settings => settings+1);
  }, 1000);
  }, []);
      
    

  return (
    <div className="App">
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
        layout={ {width: 400, height: 400} }
      />
    </div>
  );
}


export default App;
