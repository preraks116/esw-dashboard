import React from "react";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";

const Specs = () => {
  return (
    <>
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
          <Button 
            color="inherit" 
            onClick={() => {
                window.location.href = "/dashboard";
            }}>
            Plots
          </Button>
          <Button
            color="inherit"
            onClick={() => {}}>
            Specs
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
    </>
  );
};

export default Specs;
