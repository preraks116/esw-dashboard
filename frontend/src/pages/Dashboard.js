import React, { useState, useEffect, useRef, startTransition } from "react";
import { styled } from "@mui/material/styles";
import Graph from "../components/Graph";
import Stats from "../components/Stats";
import styles from "../components/style.module.css";
import axios from "axios";
import { Col, Row } from "antd";
import Slider from "@mui/material/Slider";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiInput from "@mui/material/Input";
import Grid from "@mui/material/Grid";
import { logout } from "../firebase";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import io from "socket.io-client";
import Canvas from "../components/Canvas";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const Input = styled(MuiInput)`
  width: 42px;
`;

// make data cl
const channelid = "1825191";
const readAPIKey = "PQGEZA20RGHXTE68";
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


function addStats(data, field) {
  if (field === "rps") {
    stats.rps.val = [...stats.rps.val, data];
    stats.rps.xlist = [...stats.rps.xlist, stats.rps.val.length];
    const rpslength = stats.rps.val.length;
    const mean = stats.rps.val.reduce((a, b) => a + b) / stats.rps.val.length;
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
const socket = io("http://localhost:3001");
console.log("socket is", socket);

function DashBoard() {


  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      console.log("user is", user);
    } else {
      console.log("user is not logged in");
      window.location.href = "/";
    }
  });
  useEffect(() => {
    setTimeout(() => {
      console.log("checking connection socket");
      if (socket.connected) {
        console.log("socket is connected");
      } else {
        console.log("socket not connected");
        window.location.href = "/error";
      }
    }, 2000);
  }, []);

  const [settings, setSettings] = useState(0);
  const [voltageValue, setVoltage] = useState(5);

  const [value, setValue] = React.useState(30);
  const [disabled, setDisabled] = React.useState(false);

  const handleValueChange = () => {
    console.log("sending shit");
    setTimeout(() => {
      socket.emit("dutyCycle", value);
    }, 1000);
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 10 * 1000);
  }

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    handleValueChange();
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
    handleValueChange();
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      logout();
      alert("Session Timed Out")
      window.location.href = "/";
    }, 60000);
  }, [])
  

  useEffect(() => {
    //fetch from the thingspeak API every 10 secs
    setInterval(() => {
      axios
        .get(`https://api.thingspeak.com/channels/${channelid}/feeds.json?api_key=${readAPIKey}&&results=15`)
        .then((res) => {
          console.log("res is ",res);
          //traverse through res.data.feeds array
          // check if the latest entry timestamp is more recent than stats.lastTime
          var num_results = res.data.feeds.length;
          if ( res.data.feeds[num_results-1].created_at !== stats.lastTime)
          {
            console.log("values upated on ThingSpeak channel")
            for ( var i = 0 ; i < num_results ;i++)
            {
              const rpm = Number(res.data.feeds[i].field1);
              const voltage = Number(res.data.feeds[i].field2);
              const dutyCycle = Number(res.data.feeds[i].field3);
              stats.lastTime = res.data.feeds[num_results-1].created_at;
              addStats(rpm, "rps");
              addStats(voltage, "voltage");
              addStats(dutyCycle, "dutyCycle");
            }
          } 
          else {
            console.log("not updated yet")
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setSettings((settings) => settings + 1);
    }, 1000);
  }, []);

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1 }}
              fontFamily="Courier New"
            >
              ESW DashBoard
            </Typography>
            <Button color="inherit" onClick={() => { }}>
              Plots
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                window.location.href = "/specs";
              }}
            >
              Specs
            </Button>
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
              {/* <img
                alt={"Camera not Connected"}
                src={"http://192.168.56.2:81/stream"}
                style={{ width: "50%", height: "50%" }}
              ></img> */}
              <Canvas></Canvas>
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
                    disabled={disabled}
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
                    disabled={disabled}
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
                title="Duty Cycle"
              />
              <Stats stat={stats.dutyCycle} style={styles.dutyStats} />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default DashBoard;
