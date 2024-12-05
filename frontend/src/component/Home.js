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
  } from "@mui/material";
  import { makeStyles } from "@mui/styles";
  import axios from "axios";
  import Rating from "@mui/lab/Rating";
  import SearchIcon from "@mui/icons-material/Search";
  import FilterListIcon from "@mui/icons-material/FilterList";
  import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
  import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

  import { SetPopupContext } from "../App";

  import apiList from "../lib/apiList";
  import { useNavigate } from "react-router-dom";

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
    jobCard: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: theme.spacing(8)
    },
    statusBadge: {
      position: "absolute",
      top: "10px",
      right: "10px",
    }
  }));

  
  const JobTile = (props) => {
    const classes = useStyles();
    const { job } = props;
    const setPopup = useContext(SetPopupContext);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [sop, setSop] = useState("");
    const [applicationStatus, setApplicationStatus] = useState(null);

    useEffect(() => {
      const fetchApplicationStatus = async () => {
        try {
          const response = await axios.get(
            `${apiList.jobs}/${job._id}/application-status`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setApplicationStatus(response.data.status);
        } catch (error) {
          console.log("Error fetching application status:", error);
        }
      };

      fetchApplicationStatus();
    }, [job._id]);

    const getStatusBadgeProps = () => {
      switch (applicationStatus) {
        case 'applied':
          return { color: "primary", label: "Applied" };
        case 'shortlisted':
          return { color: "success", label: "Shortlisted" };
        case 'rejected':
          return { color: "error", label: "Rejected" };
        default:
          return { color: "default", label: "Not Applied" };
      }
    };

    const handleClose = () => {
      setOpen(false);
      setSop("");
    };

    const handleApply = () => {
      axios
        .post(
          `${apiList.jobs}/${job._id}/applications`,
          {
            sop: sop,
          },
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
          setApplicationStatus('applied');
          handleClose();
        })
        .catch((err) => {
          console.log(err.response);
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          handleClose();
        });
    };

    const deadline = new Date(job.deadline).toLocaleDateString();
    const statusBadge = getStatusBadgeProps();

    return (
      <Paper className={classes.jobTileOuter} elevation={3}>
        {applicationStatus && (
          <Chip
            label={statusBadge.label}
            color={statusBadge.color}
            className={classes.statusBadge}
          />
        )}

        <Grid container direction="column">
          <Grid item>
            <Typography variant="h5" textTransform="capitalize">
              {job.title}
            </Typography>
          </Grid>
          <Grid item>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
          </Grid>
          <Grid item>Role: {job.jobType}</Grid>
          <Grid item>Salary: &#8377; {job.salary} per month</Grid>
          <Grid item>
            Duration: {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
          </Grid>
          <Grid item textTransform="capitalize">Posted By: {job.recruiter.name}</Grid>
          <Grid item>Application Deadline: {deadline}</Grid>

          <Grid item style={{ marginBlock: "10px" }}>
            {job.skillsets.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                style={{
                  marginRight: "8px",
                  textTransform: "uppercase"
                }}
              />
            ))}
          </Grid>

          <Grid item style={{ marginTop: "16px" }}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                navigate(`/job-details/${job._id}`);
              }}
            >
              View Job Details
            </Button>
          </Grid>
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
                label="Write SOP (upto 250 words)"
              multiline
              rows={8}
              style={{ width: "100%", marginBottom: "30px" }}
              variant="outlined"
              value={sop}
              onChange={(event) => {
                if (
                  event.target.value.split(" ").filter(function (n) {
                    return n != "";
                  }).length <= 250
                ) {
                  setSop(event.target.value);
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => handleApply()}
            >
              Submit
            </Button>
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
          }}
        >
          <Grid container direction="column" alignItems="center" spacing={3}>
            <Grid container item alignItems="center">
              <Grid item xs={3}>
                Job Type
              </Grid>
              <Grid container item xs={9} justifyContent="space-around">
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
                  justifyContent="space-around"
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
                    <label htmlFor="salary">
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
                  justifyContent="space-around"
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
                    <label htmlFor="duration">
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
                  justifyContent="space-around"
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
                    <label htmlFor="rating">
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
                color="primary"
                style={{ padding: "10px 50px" }}
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

  const Home = (props) => {
    const classes = useStyles();
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
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
    const [userType, setUserType] = useState(null);

    const setPopup = useContext(SetPopupContext);

    useEffect(() => {
      getData();
      const storedUserType = localStorage.getItem('type');
      if (storedUserType) {
          setUserType(storedUserType);
      }
    }, []);

    const getData = () => {
      let searchParams = [];
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

      axios
        .get(address, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setJobs(
            response.data.filter((obj) => {
              const today = new Date();
              const deadline = new Date(obj.deadline);
              return deadline > today;
            })
          );
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

    return (
      <Card sx={{ width: "100%", marginTop: '30px' }}>
        <Card
          style={{ padding: "30px", minHeight: "93vh" }}
        >
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item xs padding="0 0 20px" width="100%">
              <Typography variant="h4">
                {userType === "recruiter" ? "Jobs Created" : "Jobs for You"}
              </Typography>
            </Grid>
            <Grid item xs display="flex" justifyContent="space-between" width="100%">
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
                      <InputAdornment position="end">
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
              <Grid item style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                <Typography variant="body1" pr={1}>Filter</Typography>
                <IconButton onClick={() => setFilterOpen(true)}>
                  <FilterListIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>

          <Grid className={classes.jobCard} >
            {jobs.length > 0 ? (
              jobs.map((job) => {
                return <JobTile key={job._id} job={job} />;
              })
            ) : (
              <Typography variant="h5" style={{ textAlign: "center" }}>
                No jobs found
              </Typography>
            )}
          </Grid>
        </Card>

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

  export default Home;