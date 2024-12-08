import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Chip,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
  Rating,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  button: {
    width: "100%",
    height: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    marginRight: "2px",
  },
}));

const JobTile = ({ job, appliedJobs }) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (appliedJobs?.some((appliedJob) => appliedJob.job._id === job._id)) {
      setIsApplied(true);
    }
  }, [appliedJobs, job._id]);

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        { sop },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        setIsApplied(true);
        handleClose();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "An error occurred",
        });
        handleClose();
      });
  };

  const deadline = new Date(job.deadline).toLocaleDateString();

  const renderSkills = () => {
    if (!job.skillsets || job.skillsets.length === 0) return null;
    return job.skillsets.map((skill) => (
      <Chip key={skill} label={skill} className={classes.chip} />
    ));
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid
          container
          item
          xs={userType() === "recruiter" ? 12 : 9}
          spacing={1}
          direction="column"
        >
          <Grid item>
            <Typography variant="h5">{job.title}</Typography>
          </Grid>
          <Grid item>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
          </Grid>
          <Grid item>Role: {job.jobType}</Grid>
          <Grid item>Salary: &#8377; {job.salary} per month</Grid>
          <Grid item>
            Duration: {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
          </Grid>
          <Grid item>Posted By: {job.recruiter.name}</Grid>
          <Grid item>Application Deadline: {deadline} 12:00 PM</Grid>
          <Grid item>{renderSkills()}</Grid>
        </Grid>
        {userType() !== "recruiter" && (
          <Grid item xs={3}>
            <Button
              variant="contained"
              color={isApplied ? "default" : "primary"}
              className={classes.button}
              disabled={isApplied}
              onClick={() => setOpen(true)}
            >
              {isApplied ? "Applied" : "Apply"}
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
            minWidth: "50%",
            alignItems: "center",
          }}
        >
          <TextField
            label="Write SOP (up to 250 words)"
            multiline
            rows={8}
            variant="outlined"
            style={{ width: "100%", marginBottom: "30px" }}
            value={sop}
            onChange={(event) => {
              const wordCount = event.target.value.split(" ").filter(Boolean).length;
              if (wordCount <= 250) {
                setSop(event.target.value);
              }
            }}
          />
          <Button
            variant="contained"
            color="#f97316" style={{ padding: "10px 50px" }}
            onClick={handleApply}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

export default JobTile;
