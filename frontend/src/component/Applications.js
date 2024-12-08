import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
  Modal,
  Rating,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";

const useStyles = makeStyles(() => ({
  body: {
    height: "inherit",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
    position: "relative",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  skillChip: {
    "& .MuiChip-label": {
      fontWeight: "bold",
      textTransform: "uppercase",
    },
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application?.job?.rating || 0);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = application.dateOfJoining
    ? new Date(application.dateOfJoining)
    : null;

  const fetchRating = () => {
    if (!application?.job?._id) return;

    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating || 0);
      })
      .catch((err) => {
        console.error("Error fetching rating:", err.response?.data || err);
        setPopup({
          open: true,
          severity: "error",
          message: "Failed to fetch rating",
        });
      });
  };

  const changeRating = () => {
    if (!application?.job?._id) return;

    axios
      .put(
        apiList.rating,
        { rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        console.error("Error updating rating:", err.response?.data || err);
        setPopup({
          open: true,
          severity: "error",
          message: "Failed to update rating",
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => setOpen(false);

  const colorSet = {
    applied: "#f97316",
    accepted: "#28A745",
    shortlisted: "#FFB84D",
    rejected: "#FF6666",
    cancelled: "#9B59B6",
    finished: "#8B4513",
    selected: "#F1C40F",
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Chip
        label={application.status}
        style={{
          backgroundColor: colorSet[application.status] || "#cccccc",
          color: "#ffffff",
          position: "absolute",
          top: "10px",
          right: "10px",
          textTransform: "uppercase",
        }}
      />
      <Grid container>
        <Grid container item xs={12} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5" textTransform="capitalize">
              {application?.job?.title || "Unknown Job"}
            </Typography>
          </Grid>
          <Grid item textTransform="capitalize">
            Posted By: {application?.recruiterName || "Unknown"}
          </Grid>
          <Grid item>Role: {application?.job?.jobType || "Not Specified"}</Grid>
          <Grid item textTransform="capitalize">
            Salary: &#8377; {application?.job?.salary || 0} per month
          </Grid>
          <Grid item>
            Duration:{" "}
            {application?.job?.duration
              ? `${application.job.duration} month(s)`
              : "Flexible"}
          </Grid>
          <Grid item>
            Skills:{" "}
            {application?.job?.skillsets?.length
              ? application.job.skillsets.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  style={{ marginRight: "5px" }}
                  className={classes.skillChip}
                />
              ))
              : "Not Specified"}
          </Grid>
          <Grid item>Applied On: {appliedOn.toLocaleDateString()}</Grid>
          {joinedOn && (
            <Grid item>Joined On: {joinedOn.toLocaleDateString()}</Grid>
          )}
        </Grid>
        {["accepted", "finished"].includes(application.status) && (
          <Grid item style={{ marginTop: "10px" }}>
            <Button
              variant="contained"
             color="#f97316"              onClick={() => {
                fetchRating();
                setOpen(true);
              }}
            >
              Rate Job
            </Button>
          </Grid>
        )}
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Rating
            name="job-rating"
            style={{ marginBottom: "30px" }}
            value={rating || 0}
            onChange={(event, newValue) => setRating(newValue)}
          />
          <Button
            variant="contained"
           color="#f97316"            style={{ padding: "10px 50px" }}
            onClick={changeRating}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Applications = () => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data || []);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err.response?.data || err);
        setPopup({
          open: true,
          severity: "error",
          message: "Failed to load applications",
        });
      });
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Applications</Typography>
      </Grid>
      <Grid container spacing={3} style={{ width: "100%" }}>
        {applications.length ? (
          applications.map((application) => (
            <Grid item xs={12} sm={6} key={application._id}>
              <ApplicationTile application={application} />
            </Grid>
          ))
        ) : (
          <Typography variant="h5" style={{ textAlign: "center" }}>
            No Applications Found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
