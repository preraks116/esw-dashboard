import { Box, Card, CardContent, CardHeader, Divider, useTheme, Typography } from "@mui/material";
import Graph from "./graph";

export const Sales = (props) => {
  const theme = useTheme();

  const devices = [
    {
      title: 'Desktop',
      value: 63,
      // icon: LaptopMacIcon,
      color: '#3F51B5'
    },
    {
      title: 'Tablet',
      value: 15,
      // icon: TabletIcon,
      color: '#E53935'
    },
    {
      title: 'Mobile',
      value: 23,
      // icon: PhoneIcon,
      color: '#FB8C00'
    }
  ];

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
        {/* <Box
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
                63
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
                63
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
                Mode
              </Typography>
              <Typography
                style={{ color: theme.palette.primary.main }}
                variant="h6"
              >
                63
              </Typography>
            </Box>
          {devices.map(({
            color,
            title,
            value
          }) => (
            <Box
              key={title}
              sx={{
                p: 2,
                textAlign: 'center'
              }}
            >
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h6"
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box> */}
      </CardContent>
    </Card>
  );
};
