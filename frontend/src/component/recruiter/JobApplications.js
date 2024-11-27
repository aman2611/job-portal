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
  Email as EmailIcon
} from '@mui/icons-material';
import axios from "axios";
import { useParams } from "react-router-dom";
import { SetPopupContext } from "../../App";
import apiList, { server } from "../../lib/apiList";

// Styled Components
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
  margin: '0 auto',
  padding: theme.spacing(4, 3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 1), // Adjusts padding for smaller screens
  },
}));

const ApplicationCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3),
  marginLeft: theme.spacing(1), // Adds side spacing
  marginRight: theme.spacing(1),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const StatusButton = styled(Button)(({ theme, status }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  backgroundColor: {
    applied: '#3454D1',
    shortlisted: '#DC851F',
    accepted: '#09BC8A',
    rejected: '#D1345B',
  }[status],
  color: 'white',
  '&:hover': {
    opacity: 0.9,
    backgroundColor: {
      applied: '#3454D1',
      shortlisted: '#DC851F',
      accepted: '#09BC8A',
      rejected: '#D1345B',
    }[status],
  },
}));

const FilterModal = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: theme.spacing(3),
  }
}));

// Main Component
const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    status: { applied: false, shortlisted: false, rejected: false },
    sort: {
      "jobApplicant.name": { status: false, desc: false },
      dateOfApplication: { status: true, desc: true },
      "jobApplicant.rating": { status: false, desc: false },
    }
  });
  const { jobId } = useParams();
  const setPopup = useContext(SetPopupContext);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    let searchParams = [];
    if (searchOptions.status.rejected) searchParams.push(`status=rejected`);
    if (searchOptions.status.applied) searchParams.push(`status=applied`);
    if (searchOptions.status.shortlisted) searchParams.push(`status=shortlisted`);

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
      .get(address, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then((response) => {
        setApplications(response.data);
        console.log(response.data)
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

  const updateStatus = (applicationId, newStatus) => {
    axios
      .put(`${apiList.updateApplicationStatus}/${applicationId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        fetchApplications();
        setPopup({
          open: true,
          severity: "success",
          message: `${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} successfully`,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Error updating status",
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

    return (
      <ApplicationCard>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar 
              src={application.jobApplicant?.profile ? `${server}${application.jobApplicant.profile}` : "/path/to/placeholder.jpg"}
              sx={{ width: 120, height: 120, border: '3px solid white', boxShadow: 2 }}
            />
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
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
              
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                Statement of Purpose: {application.sop || "No SOP submitted"}
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
                <Tooltip title="Shortlist Applicant">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AcceptIcon />}
                    onClick={() => updateStatus(application._id, 'shortlisted')}
                  >
                    Shortlist
                  </Button>
                </Tooltip>
                <Tooltip title="Reject Applicant">
                  <Button 
                    variant="contained" 
                    color="error" 
                    startIcon={<RejectIcon />}
                    onClick={() => updateStatus(application._id, 'rejected')}
                  >
                    Reject
                  </Button>
                </Tooltip>
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

        <FilterModal 
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
                  {['applied', 'shortlisted', 'rejected'].map(status => (
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
                            }))
                          }
                        />
                      }
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                    />
                  ))}
                </FormGroup>
              </Box>
            </Box>
          </DialogContent>
        </FilterModal>
      </ContentWrapper>
    </PageContainer>
  );
};

export default JobApplications;
