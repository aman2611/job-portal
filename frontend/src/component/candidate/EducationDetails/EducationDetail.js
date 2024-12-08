import React, { useState, useEffect } from "react";
import {
  Card,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useFormData } from "../Profile"; 
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(4),
    marginBlock: theme.spacing(4),
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  heading: {
    marginBottom: theme.spacing(4),
  },
  labelInput: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  degreeCard: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
  },
  sectionHeader: {
    backgroundColor: "#f9fafb",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  required: {
    color: theme.palette.error.main,
    marginLeft: "4px",
  },
  degreeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
}));

const EducationDetail = () => {
  const classes = useStyles();
  const { formData, setFormData } = useFormData();

  console.log(formData)

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const yearOptions = Array.from({ length: 2024 - 1924 + 1 }, (_, i) => 2024 - i);

  const [graduationDegrees, setGraduationDegrees] = useState([
    {
      id: 1,
      university: formData.universityGrad || "",
      degree: formData.degreeGrad || "",
      major: formData.majorGrad || "",
      yearOfPassing: formData.yopGrad || "",
      percentage: formData.percentageGrad || "",
    },
  ]);

  const [postGradDegrees, setPostGradDegrees] = useState([
    {
      id: 1,
      university: formData.universityPG || "",
      degree: formData.degreePG || "",
      major: formData.majorPG || "",
      yearOfPassing: formData.yopPG || "",
      percentage: formData.percentagePG || "",
    },
  ]);

  useEffect(() => {
    if (formData.education) {
      setGraduationDegrees((prev) => [
        {
          ...prev[0],
          university: formData.education.universityGrad,
          degree: formData.education.degreeGrad,
          major: formData.education.majorGrad,
          yearOfPassing: formData.education.yopGrad,
          percentage: formData.education.percentageGrad,
        },
      ]);
      setPostGradDegrees((prev) => [
        {
          ...prev[0],
          university: formData.education.universityPG,
          degree: formData.education.degreePG,
          major: formData.education.majorPG,
          yearOfPassing: formData.education.yopPG,
          percentage: formData.education.percentagePG,
        },
      ]);
    }
  }, [formData]);

  const handleGradChange = (id, field, value) => {
    setGraduationDegrees((prev) =>
      prev.map((degree) =>
        degree.id === id ? { ...degree, [field]: value } : degree
      )
    );

    if (id === 1) {
      const contextMapping = {
        university: "universityGrad",
        degree: "degreeGrad",
        major: "majorGrad",
        yearOfPassing: "yopGrad",
        percentage: "percentageGrad",
      };
      setFormData((prev) => ({
        ...prev,
        [contextMapping[field]]: value,
      }));
    }
  };

  const handlePostGradChange = (id, field, value) => {
    setPostGradDegrees((prev) =>
      prev.map((degree) =>
        degree.id === id ? { ...degree, [field]: value } : degree
      )
    );

    if (id === 1) {
      const contextMapping = {
        university: "universityPG",
        degree: "degreePG",
        major: "majorPG",
        yearOfPassing: "yopPG",
        percentage: "percentagePG",
      };
      setFormData((prev) => ({
        ...prev,
        [contextMapping[field]]: value,
      }));
    }
  };

  const addGraduationDegree = () => {
    setGraduationDegrees((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        university: "",
        degree: "",
        major: "",
        yearOfPassing: "",
        percentage: "",
      },
    ]);
  };

  const addPostGradDegree = () => {
    setPostGradDegrees((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        university: "",
        degree: "",
        major: "",
        yearOfPassing: "",
        percentage: "",
      },
    ]);
  };

  const removeGraduationDegree = (id) => {
    if (graduationDegrees.length > 1) {
      setGraduationDegrees((prev) => prev.filter((degree) => degree.id !== id));
    }
  };

  const removePostGradDegree = (id) => {
    if (postGradDegrees.length > 1) {
      setPostGradDegrees((prev) => prev.filter((degree) => degree.id !== id));
    }
  };

  return (
    <Card className={classes.card}>
      <Typography variant="h5" gutterBottom>
        2. Education Details
      </Typography>

      {/* Class X */}
      <Box className={classes.card}>
        <Grid container spacing={2} className={classes.section}>
          <Grid item xs={12} style={{ paddingLeft: "5px" }} sx={{ backgroundColor: "#f9fafb", padding: 1 }}>
            <Typography variant="h6">Class X</Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                School <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                required
                value={formData.schoolName10th}
                onChange={(e) => handleChange("schoolName10th", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                Board <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                required
                value={formData.boardName10th}
                onChange={(e) => handleChange("boardName10th", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                Year of Passing <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                select
                required
                value={formData.yop10th || ""}
                onChange={(e) => handleChange("yop10th", e.target.value)}
              >
                <MenuItem value="" disabled>
                  Year
                </MenuItem>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                Percentage/CGPA <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                value={formData.percentage10th}
                onChange={(e) => handleChange("percentage10th", e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Class XII */}
      <Box className={classes.card}>
        <Grid container spacing={2} className={classes.section}>
          <Grid item xs={12} style={{ paddingLeft: "5px" }} sx={{ backgroundColor: "#f9fafb", padding: 1 }}>
            <Typography variant="h6">Class XII</Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                School <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                required
                value={formData.schoolName12th}
                onChange={(e) => handleChange("schoolName12th", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                Board <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                required
                value={formData.boardName12th}
                onChange={(e) => handleChange("boardName12th", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                Year of Passing <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                select
                required
                value={formData.yop12th || ""}
                onChange={(e) => handleChange("yop12th", e.target.value)}
              >
                <MenuItem value="" disabled>
                  Year
                </MenuItem>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                Percentage/CGPA <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                value={formData.percentage12th}
                onChange={(e) => handleChange("percentage12th", e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Graduation Section */}
      <Box mt={4}>
        <Grid container justifyContent="space-between" alignItems="center" className={classes.sectionHeader}>
          <Grid item>
            <Typography variant="h6">Graduation</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={addGraduationDegree}>
              <AddCircleOutlineIcon />
            </Button>
          </Grid>
        </Grid>

        {graduationDegrees.map((degree) => (
          <Box key={degree.id} className={classes.degreeCard}>
            <div className={classes.degreeHeader}>
              <Typography variant="h6">Graduation Degree {degree.id}</Typography>
              {graduationDegrees.length > 1 && (
                <IconButton onClick={() => removeGraduationDegree(degree.id)} size="small">
                  <DeleteOutlineIcon />
                </IconButton>
              )}
            </div>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  University <span className={classes.required}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={degree.university}
                  onChange={(e) => handleGradChange(degree.id, "university", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Degree <span className={classes.required}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={degree.degree}
                  onChange={(e) => handleGradChange(degree.id, "degree", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Major <span className={classes.required}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={degree.major}
                  onChange={(e) => handleGradChange(degree.id, "major", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Year of Passing <span className={classes.required}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  select
                  required
                  value={degree.yearOfPassing}
                  onChange={(e) => handleGradChange(degree.id, "yearOfPassing", e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Year
                  </MenuItem>
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Percentage/CGPA <span className={classes.required}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={degree.percentage}
                  onChange={(e) => handleGradChange(degree.id, "percentage", e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>

      {/* Post Graduation Section */}
      <Box mt={4}>
        <Grid container justifyContent="space-between" alignItems="center" className={classes.sectionHeader}>
          <Grid item>
            <Typography variant="h6">Post Graduation</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={addPostGradDegree}>
              <AddCircleOutlineIcon />
            </Button>
          </Grid>
        </Grid>

        {postGradDegrees.map((degree) => (
          <Box key={degree.id} className={classes.degreeCard}>
            <div className={classes.degreeHeader}>
              <Typography variant="h6">Post Graduation Degree {degree.id}</Typography>
              {postGradDegrees.length > 1 && (
                <IconButton onClick={() => removePostGradDegree(degree.id)} size="small">
                  <DeleteOutlineIcon />
                </IconButton>
              )}
            </div>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  University
                </Typography>
                <TextField
                  fullWidth
                  value={degree.university}
                  onChange={(e) => handlePostGradChange(degree.id, "university", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Degree
                </Typography>
                <TextField
                  fullWidth

                  value={degree.degree}
                  onChange={(e) => handlePostGradChange(degree.id, "degree", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Major
                </Typography>
                <TextField
                  fullWidth
                  value={degree.major}
                  onChange={(e) => handlePostGradChange(degree.id, "major", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body1">Year of Passing </Typography>
                <TextField
                  fullWidth
                  select
                  value={degree.yearOfPassing}
                  onChange={(e) => handlePostGradChange(degree.id, "yearOfPassing", e.target.value)}
                >
                  <MenuItem value="" disabled>Year</MenuItem>
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  Percentage/CGPA
                </Typography>
                <TextField
                  fullWidth
                  value={degree.percentage}
                  onChange={(e) => handlePostGradChange(degree.id, "percentage", e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default EducationDetail;
