import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Graph from './Graph';
import styles from './style.module.css';

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

      // if (ylist.length > 10) {
      //   ylist.shift();
      //   xlist.shift();
      // }
      console.log("xlist is", xlist);
      console.log("ylist is", ylist);
      setSettings(settings => settings + 1);
    }, 1000);
  }, []);



  return (
    <div className="App">
      <h1 className={styles.bigblue}>ESW DashBoard</h1>
      <div id='graph' className={styles.graph}>
      <Graph
        xlist={xlist}
        ylist={ylist}
      />
      </div>
    </div>
  );
}


export default App;