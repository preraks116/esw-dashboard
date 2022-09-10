import React, { useState, useEffect, startTransition } from "react";
import { styled } from "@mui/material/styles";
import Graph from "./Graph";
import Stats from "./Stats";
import styles from "./style.module.css";
import axios from "axios";
import { Col, Row } from "antd";
import Slider from "@mui/material/Slider";
import { Button } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import Typography from "@mui/material/Typography";
// import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import Toolbar from "@mui/material/Toolbar";
import MuiInput from "@mui/material/Input";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";

const Input = styled(MuiInput)`
  width: 42px;
`;

// make data cl
const channelid = "1825191";
const readAPIKey = "XVYQYXZQYXZQYXZQ";
const stats = {
  lastTime: "",
  rps: {
    val: [],
    xlist: [],
    measure: {
      mean: 0,
      median: 0,
      std: 0,
    },
  },
  voltage: {
    val: [],
    xlist: [],
    measure: {
      mean: 0,
      median: 0,
      std: 0,
    },
  },
  dutyCycle: {
    val: [],
    xlist: [],
    measure: {
      mean: 0,
      median: 0,
      std: 0,
    },
  },
};

const rpm = {
  xlist: [0],
  ylist: [0],
  length: 0,
  stats: {
    mean: 0,
    median: 0,
    std: 0,
  },
};

const voltage = {
  xlist: [0],
  ylist: [0],
  length: 0,
  stats: {
    mean: 0,
    median: 0,
    std: 0,
  },
};

function getStats(data) {
  const mean = data.ylist.reduce((a, b) => a + b) / data.ylist.length;
  const median = data.ylist[Math.floor(data.length / 2)];
  const std = Math.sqrt(
    data.ylist.reduce((a, b) => a + Math.pow(b - mean, 2)) / data.length
  );
  // return {mean, median, mode, std};
  data.stats = {
    mean: mean,
    median: median,
    std: std,
  };
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

function addStats(data, field) {
  if (field === "rps") {
    stats.rps.val = [...stats.rps.val, data];
    stats.rps.xlist = [...stats.rps.xlist, stats.rps.val.length];
    const rpslength = stats.rps.val.length;
    // console.log("rpslength is", rpslength);
    // console.log("sum of all elements in the array is",stats.rps.val.reduce((a, b) => a + b));
    const mean = stats.rps.val.reduce((a, b) => a + b) / stats.rps.val.length;
    // console.log("mean is", mean);
    const median = stats.rps.val[Math.floor(rpslength / 2)];
    const std = Math.sqrt(
      stats.rps.val.reduce((a, b) => a + Math.pow(b - mean, 2)) / rpslength
    );
    stats.rps.measure = {
      mean: mean,
      median: median,
      std: std,
    };
  }
  if (field === "voltage") {
    stats.voltage.val = [...stats.voltage.val, data];
    stats.voltage.xlist = [...stats.voltage.xlist, stats.voltage.val.length];
    const voltagelength = stats.voltage.val.length;
    const mean =
      stats.voltage.val.reduce((a, b) => a + b) / stats.voltage.val.length;
    const median = stats.voltage.val[Math.floor(voltagelength / 2)];
    const std = Math.sqrt(
      stats.voltage.val.reduce((a, b) => a + Math.pow(b - mean, 2)) /
        voltagelength
    );
    stats.voltage.measure = {
      mean: mean,
      median: median,
      std: std,
    };
  }
  if (field === "dutyCycle") {
    stats.dutyCycle.val = [...stats.dutyCycle.val, data];
    stats.dutyCycle.xlist = [
      ...stats.dutyCycle.xlist,
      stats.dutyCycle.val.length,
    ];
    const dutyCyclelength = stats.dutyCycle.val.length;
    const mean =
      stats.dutyCycle.val.reduce((a, b) => a + b) / stats.dutyCycle.val.length;
    const median = stats.dutyCycle.val[Math.floor(dutyCyclelength / 2)];
    const std = Math.sqrt(
      stats.dutyCycle.val.reduce((a, b) => a + Math.pow(b - mean, 2)) /
        dutyCyclelength
    );
    stats.dutyCycle.measure = {
      mean: mean,
      median: median,
      std: std,
    };
  }
}

function App() {
  const [settings, setSettings] = useState(0);
  const [voltageValue, setVoltage] = useState(5);

  const [value, setValue] = React.useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  useEffect(() => {
    //fetch from the thingspeak API every 10 secs
    setInterval(() => {
      axios
        .get(`https://api.thingspeak.com/channels/${channelid}/feed/last.json`)
        .then((res) => {
          const rpm = Number(res.data.field1);
          const voltage = Number(res.data.field2);
          const dutyCycle = Number(res.data.field3);
          const lastTime = res.data.created_at;
          if (lastTime !== stats.lastTime) {
            addStats(rpm, "rps");
            addStats(voltage, "voltage");
            addStats(dutyCycle, "dutyCycle");
            stats.lastTime = lastTime;
          }
        })
        .catch((err) => {
          console.log(err);
        });
            setSettings(settings => settings + 1);
    }, 1000);
  }, []);

  // useEffect(() => {
  //   setInterval(() => {
  //     addValue(rpm);
  //     getStats(rpm);
  //     // add random value between -2 and 2 to voltage
  //     getStats(voltage);
  //     // console.log(voltage);
  //     // console.log(voltageValue)
  //   }, 1000);
  // }, []);

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} fontFamily="Courier New">
              ESW DashBoard
            </Typography>
            <Button color="inherit">Plots</Button>
            <Button color="inherit">Specs</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div className={styles.graphs}>
        <Grid container spacing={2}>
          <Grid item style={{ height: "40%" }} xs={6}>
            <div id="graphrps" className={styles.graphrps}>
              <Graph
                xlist={stats.rps.xlist}
                ylist={stats.rps.val}
                title="RPM"
              />
              <Stats stat={stats.rps} style={styles.stats} />
            </div>
          </Grid>
          <Grid item style={{ height: "40%" }} xs={6}>
            <div id="camfeed" className={styles.img}>
              <img
                alt="Camera Not Connected"
                src={"http://192.168.145.2:81/stream"}
              ></img>
            </div>
          </Grid>
          <Grid item style={{ height: "40%" }} xs={6}>
            <div id="graphvolt" className={styles.graphvolt}>
              <Graph
                xlist={stats.voltage.xlist}
                ylist={stats.voltage.val}
                title="Current"
              />
              <Grid
                container
                spacing={2}
                alignItems="center"
                width="50%"
                style={{ margin: "auto" }}
              >
                <Grid item>
                  <BoltIcon style={{ color: "white", padding: "auto" }} />
                </Grid>
                <Grid item xs>
                  <Slider
                    style={{ alignContent: "center" }}
                    value={typeof value === "number" ? value : 0}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                  />
                </Grid>
                <Grid item>
                  <Input
                    style={{
                      backgroundColor: "black",
                      textAlign: "center",
                      color: "white",
                    }}
                    value={value}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 100,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </Grid>
              </Grid>
              <Stats stat={stats.voltage} style={styles.stats} />
            </div>
          </Grid>
          <Grid item style={{ height: "40%" }} xs={6}>
            <div id="graphdutyCycle" className={styles.graphdutyCycle}>
              <Graph
                xlist={stats.dutyCycle.xlist}
                ylist={stats.dutyCycle.val}
                title="dutyCycle"
              />
              <Stats stat={stats.dutyCycle} style={styles.dutyStats} />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
