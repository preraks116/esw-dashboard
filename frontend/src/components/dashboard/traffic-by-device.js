import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme, Slider, Input, Button } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import DoneIcon from '@mui/icons-material/Done';
import PhoneIcon from '@mui/icons-material/Phone';
import TabletIcon from '@mui/icons-material/Tablet';
import { alignProperty } from '@mui/material/styles/cssUtils';
import Canvas from '../canvas';

export const TrafficByDevice = (props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [63, 15, 22],
        backgroundColor: ['#3F51B5', '#e53935', '#FB8C00'],
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: ['Desktop', 'Tablet', 'Mobile']
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const [value, setValue] = useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };



  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [
    {
      title: 'Desktop',
      value: 63,
      icon: LaptopMacIcon,
      color: '#3F51B5'
    },
    {
      title: 'Tablet',
      value: 15,
      icon: TabletIcon,
      color: '#E53935'
    },
    {
      title: 'Mobile',
      value: 23,
      icon: PhoneIcon,
      color: '#FB8C00'
    }
  ];

  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* <Doughnut
            data={data}
            options={options}
          /> */}
          <Canvas/>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 3
          }}
        >
          <Box
            sx={{
              width: '300px',
              p: 2,
              textAlign: 'center'
            }}
          >
            Duty Cycle
            <Slider
              style={{ alignContent: "center" }}
              value={typeof value === "number" ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
            />
          </Box>
          <Box
            sx={{
              width: '250px',
              p: 3,
              textAlign: 'center'
            }}
          >
            <Input
              style={{
                width: '60px',
                // backgroundColor: "black",
                textAlign: "center",
                // color: "white",
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
            <Button onClick={props.handleChange(value)}>
              <DoneIcon/>
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
