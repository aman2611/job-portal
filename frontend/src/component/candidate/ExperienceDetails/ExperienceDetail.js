import React, { useState, useEffect } from "react";
import {
  Card,
  TextField,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { makeStyles } from "@mui/styles";
import { useFormData } from "../Profile";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
    margin: theme.spacing(4),
    marginTop: theme.spacing(8),
    position: "relative",
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  labelContainer: {
    display: "flex",
    alignItems: "center",
  },
  inputGroup: {
    display: "flex",
    gap: theme.spacing(2),
    width: "100%",
  },
  requiredStar: {
    color: "red",
    marginLeft: "4px",
  },
  removeContainer: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
  removeText: {
    color: theme.palette.error.main,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  skillInput: {
    display: "flex",
    alignItems: "center",
  },
  skillContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  skillChip: {
    marginBottom: theme.spacing(1),
  },
  personalSkillsContainer: {
    marginTop: theme.spacing(3),
  },
  inputSpacing: {
    marginTop: theme.spacing(1),
  },
  skillText: {
    marginBottom: theme.spacing(2), 
  },
  skillCard:{
    padding: theme.spacing(3),
    marginDown: theme.spacing(4),
    marginTop: theme.spacing(8),
    marginInline: theme.spacing(0),
    position: "relative",
  }
}));

const createEmptyExperience = () => ({
  companyName: "",
  location: "",
  startDate: null,
  endDate: null,
  employmentType: "",
  skills: [],
});

const employmentTypes = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Internship", label: "Internship" },
  { value: "Freelance", label: "Freelance" },
  { value: "Contract", label: "Contract" },
];

const ExperienceDetail = () => {
  const classes = useStyles();
  const { formData, setFormData } = useFormData();

  const [experiences, setExperiences] = useState([createEmptyExperience()]);
  const [personalSkills, setPersonalSkills] = useState([]);

  useEffect(() => {
    setExperiences(formData.experience || [createEmptyExperience()]);
    setPersonalSkills(formData.personalSkills || []);
  }, [formData]);

  const handleExperienceChange = (index, field, value) => {
    const updated = experiences.map((exp, idx) =>
      idx === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updated);
    setFormData({ ...formData, experience: updated });
  };

  const handleAddExperience = () => {
    const updated = [...experiences, createEmptyExperience()];
    setExperiences(updated);
    setFormData({ ...formData, experience: updated });
  };

  const handleRemoveExperience = (index) => {
    if (experiences.length > 1) {
      const updated = experiences.filter((_, idx) => idx !== index);
      setExperiences(updated);
      setFormData({ ...formData, experience: updated });
    }
  };

  const handleAddSkill = (index, e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const skill = e.target.value.trim();
      const updated = experiences.map((exp, idx) =>
        idx === index
          ? { ...exp, skills: [...new Set([...exp.skills, skill])] }
          : exp
      );
      setExperiences(updated);
      setFormData({ ...formData, experience: updated });
      e.target.value = "";
    }
  };

  const handleRemoveSkill = (index, skill) => {
    const updated = experiences.map((exp, idx) =>
      idx === index
        ? { ...exp, skills: exp.skills.filter((s) => s !== skill) }
        : exp
    );
    setExperiences(updated);
    setFormData({ ...formData, experience: updated });
  };

  const handleAddPersonalSkill = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const skill = e.target.value.trim();
      const updated = [...new Set([...personalSkills, skill])];
      setPersonalSkills(updated);
      setFormData({ ...formData, personalSkills: updated });
      e.target.value = "";
    }
  };

  const handleRemovePersonalSkill = (skill) => {
    const updated = personalSkills.filter((s) => s !== skill);
    setPersonalSkills(updated);
    setFormData({ ...formData, personalSkills: updated });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card className={classes.card}>
        <Typography variant="h5" gutterBottom>
          Experience Details
        </Typography>

        {experiences.map((experience, index) => (
          <Card
            key={index}
            style={{
              margin: "20px 0",
              padding: "20px",
              border: "1px solid #ccc",
              position: "relative",
            }}
          >
            <Typography
              variant="h6"
              style={{
                marginBottom: "20px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Experience {index + 1}
            </Typography>

            <Grid container spacing={2} className={classes.section}>
              <Grid item xs={12} md={3}>
                <Typography>
                  Company Name:
                  <span className={classes.requiredStar}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  label="Company Name"
                  fullWidth
                  value={experience.companyName}
                  onChange={(e) =>
                    handleExperienceChange(index, "companyName", e.target.value)
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} className={classes.section}>
              <Grid item xs={12} md={3}>
                <Typography>
                  Location:
                  <span className={classes.requiredStar}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  label="Location"
                  fullWidth
                  value={experience.location}
                  onChange={(e) =>
                    handleExperienceChange(index, "location", e.target.value)
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} className={classes.section}>
              <Grid item xs={12} md={3}>
                <Typography>Start Date:</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Start Date"
                  value={experience.startDate}
                  onChange={(newValue) =>
                    handleExperienceChange(index, "startDate", newValue)
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} className={classes.section}>
              <Grid item xs={12} md={3}>
                <Typography>End Date:</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="End Date"
                  value={experience.endDate}
                  onChange={(newValue) =>
                    handleExperienceChange(index, "endDate", newValue)
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} className={classes.section}>
              <Grid item xs={12} md={3}>
                <Typography>
                  Employment Type:
                  <span className={classes.requiredStar}>*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  select
                  label="Employment Type"
                  fullWidth
                  value={experience.employmentType}
                  onChange={(e) =>
                    handleExperienceChange(index, "employmentType", e.target.value)
                  }
                >
                  {employmentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2} className={classes.section}>
              <Grid item xs={12} md={3}>
                <Typography>Skills:</Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  label="Add Skill (Press Enter)"
                  fullWidth
                  onKeyDown={(e) => handleAddSkill(index, e)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {experience.skills.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            onDelete={() => handleRemoveSkill(index, skill)}
                            size="small"
                            style={{ margin: "5px" }}
                          />
                        ))}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <div className={classes.removeContainer}>
              <div
                className={classes.removeText}
                onClick={() => handleRemoveExperience(index)}
              >
                <DeleteOutlineIcon />
                Remove Experience
              </div>
            </div>
          </Card>
        ))}

        <Button
          variant="contained"
         color="#f97316"          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddExperience}
          style={{ marginTop: "20px" }}
        >
          Add Experience
        </Button>

        <Card className={classes.skillCard}> 
          <Typography variant="h5" gutterBottom className={classes.skillText}>
            Personal Skills
          </Typography>

          <div className={classes.skillContainer}>
            {personalSkills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                onDelete={() => handleRemovePersonalSkill(skill)}
                size="small"
                className={classes.skillChip}
              />
            ))}
          </div>

          <Grid container spacing={2} className={classes.section}>
            <Grid item xs={12}>
              <TextField
                label="Add Personal Skill (Press Enter)"
                fullWidth
                onKeyDown={handleAddPersonalSkill}
                className={classes.inputSpacing}
              />
            </Grid>
          </Grid>
        </Card>
      </Card>
    </LocalizationProvider>
  );
};

export default ExperienceDetail;
