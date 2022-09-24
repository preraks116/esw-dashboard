import { Box, Card, CardContent, CardHeader, Divider, useTheme, Typography } from "@mui/material";
import Graph from "./graph";

export const Sales2 = (props) => {
  const theme = useTheme();

  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            height: 410,
            position: "relative",
            padding: 0,
          }}
        >
          <Graph
            xlist={props.xlist}
            ylist={props.ylist}
            xtitle={props.xtitle}
            ytitle={props.ytitle}
          />
        </Box>
        {/* <Box>
          <h1>Hello</h1>
        </Box> */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          <Box
              sx={{
                p: 2,
                textAlign: 'center'
              }}
            >
              <Typography
                color="textPrimary"
                variant="body1"
              >
                Mean
              </Typography>
              <Typography
                style={{ color: theme.palette.primary.main }}
                variant="h6"
              >
                {props.val.measure.mean.toFixed(2)}
              </Typography>
          </Box>
          <Box
              sx={{
                p: 2,
                textAlign: 'center'
              }}
            >
              <Typography
                color="textPrimary"
                variant="body1"
              >
                Median
              </Typography>
              <Typography
                style={{ color: theme.palette.primary.main }}
                variant="h6"
              >
                {props.val.measure.median.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                textAlign: 'center'
              }}
            >
              <Typography
                color="textPrimary"
                variant="body1"
              >
                Std
              </Typography>
              <Typography
                style={{ color: theme.palette.primary.main }}
                variant="h6"
              >
                {props.val.measure.std.toFixed(2)}
              </Typography>
            </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
