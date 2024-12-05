import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { JobDataContext } from "./CreateJobs2";

const JobDetailsForm = () => {
  const { jobData, setJobData } = useContext(JobDataContext); 
  console.log(jobData)
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    title: jobData?.title || "",
    workplaceType: jobData?.workplaceType || "Remote",
    jobType: jobData?.jobType || "Full Time",
    duration: jobData?.duration || 0,
    salary: jobData?.salary || 0,
    deadline:
      jobData?.deadline ||
      new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().substr(0, 16),
    maxApplicants: jobData?.maxApplicants || 100,
    maxPositions: jobData?.maxPositions || 30,
    description: jobData?.description || "",
    skillsets: jobData?.skillsets || [],
  });

  useEffect(() => {
    if (jobData) {
      setFormData((prevData) => ({
        ...prevData,
        ...jobData, 
      }));
    }
  }, [jobData]);

  const handleInput = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSkillAdd = () => {
    if (skillInput && !formData.skillsets.includes(skillInput)) {
      setFormData((prev) => ({
        ...prev,
        skillsets: [...prev.skillsets, skillInput],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skillsets: prev.skillsets.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleProceedToScreening = () => {
    setJobData(formData); 
    console.log("Updated Context:", formData); 
    navigate("/screening", { state: { formData } }); 
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f3f2ee",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        width:'95%'
      }}
    >
      <Card
        sx={{
          // margin: "auto",
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardHeader
          title="1 of 2: Job Details"
          subheader={
            <Typography variant="body2" color="textSecondary">
              * Indicates required
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Enter Job Title *</Typography>
              <TextField
                placeholder="e.g., Software Developer"
                value={formData.title}
                onChange={(e) => handleInput("title", e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Select Workplace Type *</Typography>
              <TextField
                select
                value={formData.workplaceType}
                onChange={(e) => handleInput("workplaceType", e.target.value)}
                variant="outlined"
                fullWidth
              >
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
                <MenuItem value="On-site">On-site</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Job Description *</Typography>
              <TextField
                placeholder="Briefly describe the job responsibilities..."
                value={formData.description}
                onChange={(e) => handleInput("description", e.target.value)}
                variant="outlined"
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Salary Offered (INR)</Typography>
              <TextField
                placeholder="e.g., 50000"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInput("salary", e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Application Deadline *</Typography>
              <TextField
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => handleInput("deadline", e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                Maximum Number of Applicants *
              </Typography>
              <TextField
                placeholder="e.g., 100"
                type="number"
                value={formData.maxApplicants}
                onChange={(e) => handleInput("maxApplicants", e.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Positions Available *</Typography>
              <TextField
                placeholder="e.g., 5"
                type="number"
                value={formData.maxPositions}
                onChange={(e) => handleInput("maxPositions", e.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Job Type *</Typography>
              <TextField
                select
                value={formData.jobType}
                onChange={(e) => handleInput("jobType", e.target.value)}
                variant="outlined"
                fullWidth
              >
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Work From Home">Work From Home</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Job Duration</Typography>
              <TextField
                select
                value={formData.duration}
                onChange={(e) => handleInput("duration", e.target.value)}
                variant="outlined"
                fullWidth
              >
                <MenuItem value={0}>Flexible</MenuItem>
                {[1, 2, 3, 4, 5, 6].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month} Month{month > 1 ? "s" : ""}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="subtitle2">Required Skills</Typography>
                <div>
                  {formData.skillsets.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => removeSkill(skill)}
                      sx={{ margin: "5px" }}
                    />
                  ))}
                </div>
                <Typography variant="subtitle2">Add a Skill</Typography>
                <TextField
                  placeholder="e.g., JavaScript"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleSkillAdd();
                    }
                  }}
                  variant="outlined"
                  fullWidth
                />
              </Paper>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "end", marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleProceedToScreening}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default JobDetailsForm;
