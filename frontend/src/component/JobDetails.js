import React, { useState, useEffect, useContext } from "react";
import {
    Typography,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Container,
    Box,
    Grid,
    Divider
} from "@mui/material";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import axios from "axios";
import { useParams } from "react-router-dom";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";
import { makeStyles } from "@mui/styles";
import { textTransform } from "@mui/system";

const useStyles = makeStyles((theme) => ({
    skillChip: {
      '& .MuiChip-label': {
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }
    }
  }));

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [sop, setSop] = useState("");
    const [open, setOpen] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const setPopup = useContext(SetPopupContext);
    const classes = useStyles();

    // Default job description if not provided
    const getDefaultDescription = (jobTitle) => {
        return `
We are seeking a motivated and skilled ${jobTitle} to join our dynamic team. 

Key Responsibilities:
- Contribute to the development and implementation of project goals
- Collaborate with cross-functional teams to deliver high-quality results
- Apply your expertise to solve complex challenges and drive innovation

Ideal Candidate:
- Strong problem-solving skills
- Excellent communication and teamwork abilities
- Passion for continuous learning and professional growth

This role offers an exciting opportunity to make a significant impact in a collaborative and innovative work environment. We value creativity, initiative, and a proactive approach to professional challenges.
    `.trim();
    };

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                // Fetch job details
                const jobResponse = await axios.get(`${apiList.jobs}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const jobData = jobResponse.data;

                // Add default description if not provided
                if (!jobData.description || jobData.description.trim() === '') {
                    jobData.description = getDefaultDescription(jobData.title);
                }

                setJob(jobData);

                // Check if user has already applied
                const applicationsResponse = await axios.get(apiList.applications, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    params: {
                        jobId: id
                    }
                });

                // Check if any application exists with status 'applied'
                const appliedApplication = applicationsResponse.data.find(
                    app => app.job._id === id && app.status === 'applied'
                );

                setHasApplied(!!appliedApplication);
            } catch (err) {
                setPopup({
                    open: true,
                    severity: "error",
                    message: "Error fetching job details.",
                });
            }
        };

        fetchJobDetails();
    }, [id, setPopup]);

    const handleClose = () => {
        setOpen(false);
        setSop("");
    };

    const handleApply = () => {
        axios
            .post(
                `${apiList.jobs}/${id}/applications`,
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
                setHasApplied(true);
                handleClose();
            })
            .catch((err) => {
                setPopup({
                    open: true,
                    severity: "error",
                    message: err.response.data.message,
                });
                handleClose();
            });
    };

    if (!job) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box
                sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 4,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff'
                }}
            >
                <Grid container spacing={3}>
                    {/* Job Title and Basic Info */}
                    <Grid item xs={12}>
                        <Typography variant="h4" fontWeight="bold" color="primary" textTransform="capitalize">
                            {job.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <WorkOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body1" color="text.secondary">
                                {job.jobType}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Job Details */}
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MonetizationOnOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body1">
                                        &#8377; {job.salary} per month
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTimeOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body1">
                                        {job.duration !== 0 ? `${job.duration} months` : "Flexible Duration"}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarTodayOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body1">
                                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Job Description */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <DescriptionOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="h6">Job Description</Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: 'pre-wrap',
                                color: 'text.secondary',
                                lineHeight: 1.6
                            }}
                        >
                            {job.description}
                        </Typography>
                    </Grid>

                    {/* Skills */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2 }}>Required Skills</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {job.skillsets.map((skill) => (
                                <Chip
                                    key={skill}
                                    label={skill}
                                    color="primary"
                                    variant="outlined"
                                    className={classes.skillChip}
                                />
                            ))}
                        </Box>
                    </Grid>

                    {/* Apply Button */}
                    {userType() !== "recruiter" && (

                        <Grid item xs={12}>
                            <Button
                                variant={hasApplied ? "outlined" : "contained"}
                                color="primary"
                                size="large"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={hasApplied}
                                onClick={() => setOpen(true)}
                            >
                                {hasApplied ? "Already Applied" : "Apply for this Job"}
                            </Button>
                        </Grid>
                    )}
                </Grid>

            </Box>

            {/* Application Modal */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Submit Statement of Purpose</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Write your Statement of Purpose (up to 250 words)"
                        multiline
                        rows={8}
                        fullWidth
                        variant="outlined"
                        value={sop}
                        onChange={(event) => {
                            if (
                                event.target.value.split(" ").filter((n) => n !== "").length <= 250
                            ) {
                                setSop(event.target.value);
                            }
                        }}
                        helperText={`${sop.split(" ").filter((n) => n !== "").length}/250 words`}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleApply} color="primary" variant="contained">
                        Submit Application
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default JobDetails;