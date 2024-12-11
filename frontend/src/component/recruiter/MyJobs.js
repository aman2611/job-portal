import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
  Card,
  CardContent,
  Dialog, DialogActions, DialogContent, DialogTitle, Switch,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/lab/Rating";
import Pagination from "@mui/lab/Pagination";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "100%",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  skillChip: {
    '& .MuiChip-label': {
      fontWeight: 'bold',
      textTransform: 'uppercase'
    }
  }
}));




const JobTile = (props) => {
  const { job, getData } = props;
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const navigate = useNavigate();

  const [jobStatus, setJobStatus] = useState(job.jobStatus || "open");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [jobDetails, setJobDetails] = useState(job);

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleClick = (location) => {
    navigate(location);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleDelete = () => {
    axios
      .delete(`${apiList.jobs}/${job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
        handleCloseDelete();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseDelete();
      });
  };

  const handleJobUpdate = () => {
    axios
      .put(`${apiList.jobs}/${job._id}`, jobDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
        handleCloseUpdate();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const handleSwitchChange = (e) => {
    const newStatus = e.target.checked ? "open" : "closed";

    if (newStatus === "closed" && jobStatus !== "closed") {
      // Show confirmation modal if changing to closed
      setOpenConfirmation(true);
    } else if (newStatus === "open" && jobStatus !== "open") {
      // Show confirmation modal if changing to open
      setOpenConfirmation(true);
    } else {
      // Update job status directly if it's already the same
      setJobStatus(newStatus);
    }
  };

  const confirmStatusChange = () => {
    // If status is closed, confirm to close; if open, confirm to open
    const newStatus = jobStatus === "open" ? "closed" : "open";

    axios
      .put(
        `${apiList.jobs}/${job._id}`,
        { jobStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setJobStatus(newStatus); // Update UI after successful response
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
        handleCloseConfirmation(); // Close the confirmation modal
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Update failed",
        });
      });
  };

  const postedOn = new Date(job.dateOfPosting);

  return (
    <Paper elevation={3} style={{ padding: "16px" }}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Typography variant="h5" textTransform="capitalize">{job.title}</Typography>
          <Typography variant="body1">Role: {job.jobType}</Typography>
          <Typography variant="body1">Salary: ₹ {job.salary} per month</Typography>
          <Typography variant="body1">
            Duration: {job.duration !== 0 ? `${job.duration} months` : "Flexible"}
          </Typography>
          <Typography variant="body1">
            Date Of Posting: {postedOn.toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            Number of Applicants: {job.maxApplicants}
          </Typography>
          <Typography variant="body1">
            Remaining Positions: {job.maxPositions - job.acceptedCandidates}
          </Typography>
          <Grid container spacing={1}>
            {job.skillsets.map((skill, index) => (
              <Grid item key={index}>
                <Chip label={skill} className={classes.skillChip} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={3} container direction="column" spacing={2} >
          <Grid item >
            <FormControlLabel
              sx={{ marginLeft: 8 }}
              labelPlacement="start"
              label={
                <span style={{ opacity: 0.7, paddingRight: '10px' }}>
                  {jobStatus === "open" ? "Open Applications" : "Close Applications"}
                </span>
              }
              control={
                <Switch
                  checked={jobStatus === "open"}
                  onChange={handleSwitchChange}
                  name="jobStatus"
                  sx={{
                    width: 48,
                    height: 28,
                    padding: 0,
                    "& .MuiSwitch-switchBase": {
                      padding: 0.4,
                      "&.Mui-checked": {
                        transform: "translateX(20px)",
                        "& + .MuiSwitch-track": {
                          backgroundColor: "green",
                          opacity: 1,
                        },
                      },
                    },
                    "& .MuiSwitch-thumb": {
                      width: 22,
                      height: 22,
                      boxShadow: "none",
                      backgroundColor: "#fff",
                    },
                    "& .MuiSwitch-track": {
                      borderRadius: 14, // Rounded track
                      backgroundColor: "red", // Red track when unchecked
                      opacity: 1,
                    },
                  }}
                />
              }
            />


          </Grid>

          <Grid item>
            <Button
              variant="contained"
              className={classes.button}
              sx={{ backgroundColor: "#f97316", "&:hover": { backgroundColor: "#ea580c" } }}
              onClick={() => handleClick(`/job/applications/${job._id}`)}
            >
              View Applications
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={() => setOpenUpdate(true)}
            >
              Update Details
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              className={classes.button}
              onClick={() => setOpenDelete(true)}
            >
              Delete Job
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {jobStatus !== "closed"
              ? "You are about to close applications for this job posting. This will prevent new applications from being submitted."
              : "You are about to reopen applications for this job posting. This will allow new applications to be submitted."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="primary" variant="outlined"
          >
            Cancel
          </Button>
          <Button onClick={confirmStatusChange} color="error" variant="contained"
          >
            {jobStatus !== "closed" ? "Confirm Close" : "Confirm Open"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You are about to delete this job. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={openUpdate} onClose={handleCloseUpdate}>
        <Paper style={{ padding: "20px", outline: "none" }}>
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Update Details
          </Typography>
          <Grid container direction="column" spacing={3} style={{ margin: "10px" }}>
            <Grid item>
              <TextField
                label="Application Deadline"
                type="datetime-local"
                value={jobDetails.deadline.substr(0, 16)}
                onChange={(event) => handleInput("deadline", event.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                label="Maximum Number Of Applicants"
                type="number"
                variant="outlined"
                value={jobDetails.maxApplicants}
                onChange={(event) => handleInput("maxApplicants", event.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Positions Available"
                type="number"
                variant="outlined"
                value={jobDetails.maxPositions}
                onChange={(event) => handleInput("maxPositions", event.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleJobUpdate} color="primary">
              Update
            </Button>
            <Button onClick={handleCloseUpdate} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Paper>
      </Modal>
    </Paper>
  );
};


const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper
        style={{
          padding: "50px",
          outline: "none",
          minWidth: "50%",
          alignItems: "flex-end"
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Job Type
            </Grid>
            <Grid
              container
              item
              xs={9}
              justify="space-around"
            // alignItems="center"
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={searchOptions.jobType.fullTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Full Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={searchOptions.jobType.partTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Part Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wfh"
                      checked={searchOptions.jobType.wfh}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Work From Home"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Salary
            </Grid>
            <Grid item xs={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => {
                  return value * (100000 / 100);
                }}
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "100000" },
                ]}
                value={searchOptions.salary}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    salary: value,
                  })
                }
              />
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Duration
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Duration"
                variant="outlined"
                fullWidth
                value={searchOptions.duration}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    duration: event.target.value,
                  })
                }
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sort
            </Grid>
            <Grid item container direction="row" xs={9}>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="salary"
                    checked={searchOptions.sort.salary.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="salary"
                  />
                </Grid>
                <Grid item>
                  <label for="salary">
                    <Typography>Salary</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.salary.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            desc: !searchOptions.sort.salary.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.salary.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="duration"
                    checked={searchOptions.sort.duration.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="duration"
                  />
                </Grid>
                <Grid item>
                  <label for="duration">
                    <Typography>Duration</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.duration.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            desc: !searchOptions.sort.duration.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.duration.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="rating"
                    checked={searchOptions.sort.rating.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="rating"
                  />
                </Grid>
                <Grid item>
                  <label for="rating">
                    <Typography>Rating</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.rating.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            desc: !searchOptions.sort.rating.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.rating.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="#f97316" style={{ padding: "10px 50px" }}
              onClick={() => getData()}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const MyJobs = (props) => {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const [page, setPage] = useState(1);
  const jobsPerPage = 5; // Number of jobs per page

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [`myjobs=1`];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary[0] != 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] != 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    console.log(address);
    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setJobs(response.data.sort((a, b) => new Date(b.dateOfPosting) - new Date(a.dateOfPosting)));
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedJobs = jobs.slice(
    (page - 1) * jobsPerPage,
    page * jobsPerPage
  );

  return (
    <Card sx={{ width: "100%", margin: "2rem" }}>
      <CardContent
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item container direction="column">
          <Grid item xs display="flex" >
            <Typography variant="h3" fontWeight={700} marginBottom="20px">My Jobs</Typography>
          </Grid>
          <Grid item xs display="flex" justifyContent="space-between" style={{ marginBottom: "20px", alignItems: "center" }}>
            <Grid item xs>
              <TextField
                label="Search Jobs"
                value={searchOptions.query}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    query: event.target.value,
                  })
                }
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    getData();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton onClick={() => getData()}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{ width: "500px" }}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <IconButton onClick={() => setFilterOpen(true)}>
                <Typography variant="body1" pr={1}>Filter</Typography>
                <FilterListIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          item
          direction="column"
          alignItems="stretch"
          justify="center"
        >


          <Grid container spacing={3} justifyContent="center">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <Grid item xs={12} key={job._id}>
                  <JobTile job={job} getData={getData} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h5" style={{ textAlign: "center" }}>
                  No jobs found
                </Typography>
              </Grid>
            )}
          </Grid>



          <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
            <Pagination
              count={Math.ceil(jobs.length / jobsPerPage)}
              page={page}
              onChange={handlePageChange}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#f97316',
                },
                '& .Mui-selected': {
                  backgroundColor: '#f97316',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#ea580c',
                  },
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: '#f97316', 
                },
              }} />
          </Grid>

        </Grid>
      </CardContent>


      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </Card>

  );
};

export default MyJobs;
