import { Card, Grid, Typography } from "@mui/material";
import RecruiterDashboard from "./RecruiterDashboard";

const Welcome = (props) => {
  return (
    <Card
      container
      item
      direction="column"
      alignitems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h4">Welcome to NRIDA Job Portal </Typography>
      </Grid>

      <RecruiterDashboard/>
    </Card>
  );
};

export const ErrorPage = (props) => {
  return (
    <Card
      container
      item
      direction="column"
      alignitems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Card>
  );
};

export default Welcome;
