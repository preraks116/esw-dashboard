import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import styles from './style.module.css';

// make data cl

const rpm = {
  xlist: [0],
  ylist: [0],
  length : 0,
  stats: {
    mean: 0,
    median: 0,
    std: 0
  }
}

const voltage = {
  xlist: [0],
  ylist: [0],
  length : 0,
  stats: {
    mean: 0,
    median: 0,
    std: 0
  }
}

function getStats(data) {
  const mean = data.ylist.reduce((a, b) => a + b) / data.ylist.length;
  const median = data.ylist[Math.floor(data.length / 2)];
  const std = Math.sqrt(data.ylist.reduce((a, b) => a + Math.pow(b - mean, 2)) / data.length);
  // return {mean, median, mode, std};
  data.stats = {
    mean: mean,
    median: median,
    std: std
  }
}

function addVoltage(value) {
  const y = value;
  voltage.ylist = [...voltage.ylist, y];
  voltage.length++;
  voltage.xlist = [...voltage.xlist, voltage.length];
}

function addValue(data) {
  const y = Math.random() * 100;
  data.ylist = [...data.ylist, y];
  data.length++;
  data.xlist = [...data.xlist, data.length];
}

function App() {
  const [settings, setSettings] = useState(0);
  const [voltageValue, setVoltage] = useState(5);
  useEffect(() => {
    setInterval(() => {
      addValue(rpm);
      getStats(rpm);
      // add random value between -2 and 2 to voltage
      addVoltage(voltageValue + Math.random() * 4 - 2);
      getStats(voltage);
      // console.log(voltage);
      // console.log(voltageValue)
      setSettings(settings => settings + 1);
    }, 1000);
  }, []);



  return (
    <div className="App">
      <h1 className={styles.bigblue}>ESW DashBoard</h1>
      <div id='graph' className={styles.graph}>
        <Graph
          xlist={rpm.xlist}
          ylist={rpm.ylist}
          title='RPM'
        />
        <div className={styles.stats}>
          <ul>
            <li>Mean: {rpm.stats.mean.toFixed(2)}</li>
            <li>Median: {rpm.stats.median.toFixed(2)}</li>
            <li>Std: {rpm.stats.std.toFixed(2)}</li>
          </ul>
        </div>
      </div>
      <div id='graph' className={styles.graph}>
        <Graph
          xlist={voltage.xlist}
          ylist={voltage.ylist}
          title='Voltage'
        />
        <div className={styles.stats}>
          <ul>
            <li>Mean: {voltage.stats.mean.toFixed(2)}</li>
            <li>Median: {voltage.stats.median.toFixed(2)}</li>
            <li>Std: {voltage.stats.std.toFixed(2)}</li>
          </ul>
        </div>
        {/* <div className={styles.slider}>
          <input type="range" min="0" max="100" value={voltageValue} onChange={(e) => setVoltage(e.target.value)} />
        </div> */}
      </div>
    </div>
  );
}


export default App;