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
    Divider,
    Card
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
    const [applicationStatus, setApplicationStatus] = useState(null); // Track the application status
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [step, setStep] = useState(1);
    const setPopup = useContext(SetPopupContext);
    const classes = useStyles();

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
                const jobResponse = await axios.get(`${apiList.jobs}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const jobData = jobResponse.data;

                if (!jobData.description || jobData.description.trim() === '') {
                    jobData.description = getDefaultDescription(jobData.title);
                }

                setJob(jobData);
                setQuestions(jobData.questions || []);

                const applicationsResponse = await axios.get(apiList.applications, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    params: {
                        jobId: id
                    }
                });

                const appliedApplication = applicationsResponse.data.find(
                    app => app.job._id === id
                );

                if (appliedApplication) {
                    setHasApplied(true);
                    setApplicationStatus(appliedApplication.status);
                } else {
                    setHasApplied(false);
                    setApplicationStatus(null); // Reset if not applied
                }

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
        setAnswers({});
        setStep(1);
    };

    const handleApply = async () => {
        try {
            const payload = {
                sop,
                answers: questions.map((question, index) => ({
                    question: question.question,
                    answer: answers[index] || "",
                })),
            };

            // Apply for the job if the user has not applied yet
            if (!hasApplied) {
                const response = await axios.post(
                    `${apiList.jobs}/${id}/applications`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                setPopup({
                    open: true,
                    severity: "success",
                    message: response.data.message,
                });
            } else {
                // If the user has applied before and the status is rejected/canceled, allow reapplication
                if (applicationStatus === "rejected" || applicationStatus === "canceled") {
                    const response = await axios.put(
                        `${apiList.jobs}/${id}/applications`,
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    setPopup({
                        open: true,
                        severity: "success",
                        message: response.data.message,
                    });
                }
            }

            setHasApplied(true);
            handleClose();
        } catch (err) {
            console.log(err)
            setPopup({
                open: true,
                severity: "error",
                message: err.response?.data?.message || "Error submitting application.",
            });
            handleClose();
        }
    };

    const handleNext = () => {
        setStep(2);
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
                    <Grid item xs={12}>
                        <Typography variant="h4" fontWeight="bold" sx={{
                            textTransform: "capitalize",
                            color: "#f97316",

                        }}>
                            {job.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <WorkOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body1" color="text.secondary">
                                {job.jobType}
                            </Typography>
                        </Box>
                    </Grid>

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

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2 }}>Required Skills</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {job.skillsets.map((skill) => (
                                <Chip
                                    key={skill}
                                    label={skill}
                                    color="#f97316" variant="outlined"
                                    className={classes.skillChip}
                                />
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {hasApplied ? (
                                applicationStatus === 'rejected' || applicationStatus === 'canceled' ? (
                                    <Button variant="contained" fullWidth onClick={() => setOpen(true)}
                                        sx={{ backgroundColor: "#4b5563", color: "#fff", "&:hover": { backgroundColor: "#374151" } }}
                                    >
                                        Reapply
                                    </Button>
                                ) : (
                                    <Button variant="contained" fullWidth disabled
                                    sx={{
                                        backgroundColor: "#f97316",
                                        color: "#fff",
                                        "&.Mui-disabled": {
                                          opacity: 0.5, // Ensure opacity is still applied when disabled
                                          backgroundColor: "#f97316", // Keep the background color same
                                          color: "#fff", // Keep text color same
                                        },
                                      }}>
                                        Already Applied
                                    </Button>
                                )
                            ) : (
                                <Button variant="contained" fullWidth onClick={() => setOpen(true)}
                                    sx={{
                                        width: "300px",
                                        backgroundColor: "#f97316",
                                        "&:hover": { backgroundColor: "#ea580c" }
                                    }}
                                >
                                    Apply for this Job
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Application Form</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Statement of Purpose</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={sop}
                        onChange={(e) => setSop(e.target.value)}
                        label="Why do you want to apply?"
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />

                    {questions.map((question, index) => (
                        <TextField
                            key={index}
                            fullWidth
                            label={question.question}
                            value={answers[index] || ''}
                            onChange={(e) => {
                                const newAnswers = { ...answers, [index]: e.target.value };
                                setAnswers(newAnswers);
                            }}
                            sx={{ mb: 2 }}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" variant="outlined">Cancel</Button>
                    <Button onClick={handleApply} color="primary" variant="contained">Submit Application</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default JobDetails;
