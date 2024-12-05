import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Check as AcceptIcon,
  Close as RejectIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import axios from "axios";
import { useParams } from "react-router-dom";
import { SetPopupContext } from "../../App";
import apiList, { server } from "../../lib/apiList";

// Helper function to rank applicants based on skills match
const rankBySkillsMatch = (jobSkills, applicantSkills) => {
  const jobSkillsMap = new Map();
  jobSkills.forEach(skill => jobSkillsMap.set(skill.toLowerCase(), true));

  let matchCount = 0;
  applicantSkills.forEach(skill => {
    if (jobSkillsMap.has(skill.toLowerCase())) {
      matchCount++;
    }
  });

  return matchCount;
};

// Styled Components (keep existing styling from previous implementation)
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(4),
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  // margin: '0 auto',
  padding: theme.spacing(4, 3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 1),
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  fontWeight: 600,
  textTransform: 'capitalize',
  backgroundColor: {
    applied: theme.palette.info.main,
    shortlisted: theme.palette.warning.main,
    accepted: theme.palette.success.main,
    rejected: theme.palette.error.main,
    finished: theme.palette.text.secondary,
    cancelled: theme.palette.text.disabled
  }[status],
  color: 'white',
}));

const ApplicationCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3),
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  transition: 'transform 0.3s ease-in-out',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    status: {
      applied: false,
      shortlisted: false,
      rejected: false,
      accepted: false,
      finished: false
    },
    sort: {
      "jobApplicant.name": { status: false, desc: false },
      dateOfApplication: { status: true, desc: true },
      "jobApplicant.rating": { status: false, desc: false },
    }
  });
  const { jobId } = useParams();
  const setPopup = useContext(SetPopupContext);

  useEffect(() => {
    fetchJobDetails();
    fetchApplications();
  }, []);

  const fetchJobDetails = () => {
    axios
      .get(`${apiList.jobs}/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((response) => {
        setJobDetails(response.data);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching job details"
        });
      });
  };

  const fetchApplications = () => {
    let searchParams = [];
    Object.keys(searchOptions.status).forEach(status => {
      if (searchOptions.status[status]) {
        searchParams.push(`status=${status}`);
      }
    });

    let asc = [], desc = [];
    Object.keys(searchOptions.sort).forEach((key) => {
      const item = searchOptions.sort[key];
      if (item.status) {
        item.desc ? desc.push(`desc=${key}`) : asc.push(`asc=${key}`);
      }
    });

    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    let address = `${apiList.applicants}?jobId=${jobId}`;
    if (queryString) address += `&${queryString}`;

    axios
      .get(address, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((response) => {
        console.log(response.data)
        const rankedApplications = response.data.map(app => {
          const jobSkills = jobDetails?.skillsets || [];
          const applicantSkills = app.jobApplicant?.personalSkills || [];
          const skillMatchCount = rankBySkillsMatch(jobSkills, applicantSkills);
          return { ...app, skillMatchCount };
        });

        rankedApplications.sort((a, b) => b.skillMatchCount - a.skillMatchCount);
        setApplications(rankedApplications);
      })
      .catch((err) => {
        setApplications([]);
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error fetching data"
        });
      });
  };

  const updateStatus = (application, newStatus) => {
    // Placeholder for the new updateStatus implementation
    // You'll need to replace this with the full implementation you want
    const payload = {
      status: newStatus,
      // Add any additional fields required by your backend
    };

    axios
      .put(
        `${apiList.applications}/${application._id}`, 
        payload,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          },
        }
      )
      .then((response) => {
        // Refresh the applications list after successful status update
        fetchApplications();
        
        // Show success popup
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message || `Application ${newStatus} successfully`,
        });
      })
      .catch((err) => {
        // Show error popup
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error updating application status",
        });
      });
  };

  const ApplicationTile = ({ application }) => {
    const getResume = () => {
      if (application.jobApplicant?.resume) {
        const address = `${server}${application.jobApplicant.resume}`;
        axios(address, { method: "GET", responseType: "blob" })
          .then((response) => {
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          })
          .catch(() => {
            setPopup({
              open: true,
              severity: "error",
              message: "Error fetching resume",
            });
          });
      }
    };

    const jobSkills = jobDetails?.skillsets || [];
    const applicantSkills = application.jobApplicant?.personalSkills || [];
    const skillMatchCount = rankBySkillsMatch(jobSkills, applicantSkills);

    // Define possible actions based on current status
    const statusActions = {
      applied: [
        {
          label: 'Shortlist',
          status: 'shortlisted',
          color: 'primary',
          icon: <AcceptIcon />
        },
        {
          label: 'Reject',
          status: 'rejected',
          color: 'error',
          icon: <RejectIcon />
        }
      ],
      shortlisted: [
        {
          label: 'Accept',
          status: 'accepted',
          color: 'success',
          icon: <AcceptIcon />
        },
        {
          label: 'Reject',
          status: 'rejected',
          color: 'error',
          icon: <RejectIcon />
        }
      ],
      rejected: [],
      accepted: [
        {
          label: 'Finish',
          status: 'finished',
          color: 'secondary',
          icon: <CheckIcon />
        }
      ],
      cancelled: [],
      finished: []
    };

    return (
      <ApplicationCard>
        <StatusChip
          label={application.status || 'applied'}
          status={application.status || 'applied'}
        />
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              src={application.jobApplicant?.profilePicture ? `${server}${application.jobApplicant.profilePicture}` : "/path/to/placeholder.jpg"}
              sx={{ width: 120, height: 120, border: '3px solid white', boxShadow: 2 }}
            />

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold" textTransform="capitalize" gutterBottom>
                {application.jobApplicant?.firstName || "Unknown Applicant"}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                {application.jobApplicant?.candidateEmail && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="action" />
                    <Typography variant="body2" color="textSecondary">
                      {application.jobApplicant.candidateEmail}
                    </Typography>
                  </Box>
                )}
                {application.jobApplicant?.mobile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" />
                    <Typography variant="body2" color="textSecondary">
                      {application.jobApplicant.mobile}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }} textTransform="capitalize">
                Statement of Purpose: {application.sop || "No SOP submitted"}
              </Typography>

              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Matching Skills: {skillMatchCount} out of {jobSkills.length}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Tooltip title="Download Resume">
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={getResume}
                    color="secondary"
                  >
                    Resume
                  </Button>
                </Tooltip>

                {statusActions[application.status || 'applied'].map((action) => (
                  <Tooltip key={action.status} title={`${action.label} Applicant`}>
                    <Button
                      variant="contained"
                      color={action.color}
                      startIcon={action.icon}
                      onClick={() => updateStatus(application, action.status)}
                    >
                      {action.label}
                    </Button>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </ApplicationCard>
    );
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Typography
            variant="h3"
            sx={{
              mb: 0,
              color: 'text.primary'
            }}
          >
            Job Applications
          </Typography>

          <Tooltip title="Filter Applications">
            <IconButton
              onClick={() => setFilterOpen(true)}
              color="primary"
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {applications.length > 0 ? (
          applications.map((app) => (
            <ApplicationTile key={app._id} application={app} />
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            No Applications Found
          </Typography>
        )}

        <Dialog
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Filter Applications</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>Application Status</Typography>
                <FormGroup row>
                  {['applied', 'shortlisted', 'rejected', 'accepted', 'finished'].map(status => (
                    <FormControlLabel
                      key={status}
                      control={
                        <Checkbox
                          checked={searchOptions.status[status]}
                          onChange={(e) =>
                            setSearchOptions(prev => ({
                              ...prev,
                              status: {
                                ...prev.status,
                                [status]: e.target.checked,
                              }
                            }))}
                        />
                      }
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                    />
                  ))}
                </FormGroup>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </ContentWrapper>
    </PageContainer>
  );
};

export default JobApplications;