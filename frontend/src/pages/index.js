import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../components/dashboard/budget';
import io from "socket.io-client";
import axios from "axios";
import { LatestOrders } from '../components/dashboard/latest-orders';
import { LatestProducts } from '../components/dashboard/latest-products';
import { Sales } from '../components/dashboard/sales';
import { Sales2 } from '../components/dashboard/sales2'; 
import { TasksProgress } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { TotalProfit } from '../components/dashboard/total-profit';
import { TrafficByDevice } from '../components/dashboard/traffic-by-device';
import { DashboardLayout } from '../components/dashboard-layout';
import SpeedIcon from '@mui/icons-material/Speed';
import BoltIcon from '@mui/icons-material/Bolt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import Router from 'next/router';
import { logout } from "../firebase";

const channelid = "1825191";
const readAPIKey = "PQGEZA20RGHXTE68";
const stats = {
  lastTime: "",
  rps: {
    val: [2,3,5,4,3,7,6,5.6],
    xlist: [1,2,3,4,5,6,7,8],
    measure: {
      mean: 0,
      median: 0,
      std: 0,
    },
  },
  voltage: {
    val: [3,3.3,3.7,5,6,7,8,9,10.1],
    xlist: [1,2,3,4,5,6,7,8],
    measure: {
      mean: 0,
      median: 0,
      std: 0,
    },
  },
  current: {
    val: [0.01,0.02,0.03,0.04, 0.3, 0.44, 0.5],
    xlist: [1,2,3,4,5,6,7,8],
    measure: {
      mean: 0,
      median: 0,
      std: 0,
    }
  },
  dutyCycle: {
    val: [0,0,0,0,170,210,240,255],
    xlist: [1,2,3,4,5,6,7,8],
    measure: {
      mean: 0,
      median: 0,
      std: 0,
    },
  },
};



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


const socket = io("http://dcb.abhijnan.live");
console.log("socket is", socket);

function Page() {


  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      console.log("user is", user);
    } else {
      console.log("user is not logged in");
      Router.push("/login");
    }
  });

  useEffect(() => {
    setTimeout(() => {
      console.log("checking connection socket");
      if (socket.connected) {
        console.log("socket is connected");
      } else {
        console.log("socket not connected");
        Router.push('/error');
      }
    }, 2000);
  }, []);

  const [settings, setSettings] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const handleValueChange = (value) => {
    setTimeout(() => {
      socket.emit("dutyCycle", value);
    }, 1000);
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 10 * 1000);
  }

  useEffect(() => {
    setTimeout(() => {
      logout();
      alert("Session Timed Out")
      Router.push('/timeout');
    }, 10*60*1000);
  }, [])

  useEffect(() => {
    //fetch from the thingspeak API every 10 secs
    setInterval(() => {
      axios
        .get(`https://api.thingspeak.com/channels/${channelid}/feed/last.json?api_key=${readAPIKey}`)
        .then((res) => {
          const rpm = Number(res.data.field1);
          const voltage = Number(res.data.field2);
          const dutyCycle = Number(res.data.field3);
          const lastTime = res.data.created_at;
          if (lastTime !== stats.lastTime) {
            addStats(rpm, "rps");
            addStats((dutyCycle*100)/250, "voltage");
            addStats(dutyCycle, "dutyCycle");
            stats.lastTime = lastTime;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setSettings((settings) => settings + 1);
    }, 10 * 1000);
  }, []);

  return (
  <>
    <Head>
      <title>
        Remote Labs Dashboard
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget
              title="RPS"
              icon={<SpeedIcon />}
              color="primary.main"
              value={stats.rps.val.at(-1)}
            />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget
              title="Current"
              icon={<BoltIcon />}
              color="info.main"
              value={stats.current.val.at(-1)}
            />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget 
              title="Duty Cycle"
              icon={<RestartAltIcon />}
              color="error.main"
              value={stats.dutyCycle.val.at(-1)}
            />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget 
              title="Voltage"
              icon={<BoltIcon />}
              color="warning.main"
              value={stats.voltage.val.at(-1)}
            />
          </Grid>
          <Grid
            item
            lg={5}
            md={7}
            xl={5}
            xs={12}
          >
            <TrafficByDevice sx={{ height: '100%' }} handleChange={handleValueChange}/>
            {/* <img
                alt={"Camera not Connected"}
                src={"http://192.168.56.2:81/stream"}
                style={{ width: "50%", height: "50%" }}
              ></img> */}
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={7}
            xs={12}
          >
            <Sales
              xlist={stats.voltage.val}
              ylist={stats.rps.val}
              xtitle="Duty Cycle"
              ytitle="RPS"
            />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={6}
            xs={12}
          >
            <Sales
              xlist={stats.current.val}
              ylist={stats.rps.val}
              xtitle="Current"
              ytitle="RPS"
            />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={6}
            xs={12}
          >
            <Sales
              xlist={stats.dutyCycle.val}
              ylist={stats.current.val}
              xtitle="Duty Cycle"
              ytitle="Current"
            />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={4}
            xs={12}
          >
            <Sales2
              xlist={stats.voltage.xlist}
              ylist={stats.voltage.val}
              val={stats.voltage}
              xtitle="Time"
              ytitle="Current"
            />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={4}
            xs={12}
          >
            <Sales2
              xlist={stats.dutyCycle.xlist}
              ylist={stats.dutyCycle.val}
              val={stats.dutyCycle}
              xtitle="Time"
              ytitle="Duty Cycle"
            />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={4}
            xs={12}
          >
            <Sales2
              xlist={stats.rps.xlist}
              ylist={stats.rps.val}
              val={stats.rps}
              xtitle="Time"
              ytitle="RPS"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
