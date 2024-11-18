import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Chip,
} from "@mui/material";

const CreateJobs2 = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    workplaceType: "Remote",
    location: "",
    jobType: "Full Time",
    duration: 0,
    salary: 0,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    maxApplicants: 100,
    maxPositions: 30,
    description: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");

  const handleInput = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSkillAdd = () => {
    if (skillInput && !formData.skills.includes(skillInput)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  return (
    <Grid container spacing={2} style={{ padding: "30px", minHeight: "93vh" }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Fill a New Job Description
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          label="Job Title"
          value={formData.jobTitle}
          onChange={(e) => handleInput("jobTitle", e.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Company"
          value={formData.company}
          onChange={(e) => handleInput("company", e.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Workplace Type"
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
      <Grid item xs={12} md={6}>
        <TextField
          label="Employee Location"
          value={formData.location}
          onChange={(e) => handleInput("location", e.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Description"
          value={formData.description}
          onChange={(e) => handleInput("description", e.target.value)}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Salary (USD)"
          type="number"
          value={formData.salary}
          onChange={(e) => handleInput("salary", e.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Application Deadline"
          type="datetime-local"
          value={formData.deadline}
          onChange={(e) => handleInput("deadline", e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Maximum Number of Applicants"
          type="number"
          value={formData.maxApplicants}
          onChange={(e) => handleInput("maxApplicants", e.target.value)}
          InputProps={{ inputProps: { min: 1 } }}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Positions Available"
          type="number"
          value={formData.maxPositions}
          onChange={(e) => handleInput("maxPositions", e.target.value)}
          InputProps={{ inputProps: { min: 1 } }}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          label="Job Type"
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
        <TextField
          select
          label="Duration"
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
        <Paper style={{ padding: "10px" }}>
          <Typography variant="subtitle1" gutterBottom>
            Skills
          </Typography>
          <div>
            {formData.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => removeSkill(skill)}
                style={{ margin: "5px" }}
              />
            ))}
          </div>
          <TextField
            label="Add Skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSkillAdd();
              }
            }}
            variant="outlined"
            fullWidth
          />
        </Paper>
      </Grid>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log(formData)}
        >
          Create Job
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateJobs2;
