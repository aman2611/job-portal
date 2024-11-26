import React from "react";
import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { useFormData } from "../Profile";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
    margin: theme.spacing(4),
    marginTop: theme.spacing(8),
  },
  section: {
    marginBottom: theme.spacing(2),
  },
  labelContainer: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  inputGroup: {
    display: "flex",
    gap: theme.spacing(2),
    width: "100%",
  },
  wrappingLabel: {
    display: "flex",
    alignItems: "flex-start",
    minHeight: "100%",
    paddingTop: theme.spacing(1),
  },
  requiredStar: {
    color: "red",
    marginLeft: "4px",
  },
}));

const PersonalDetailsForm = () => {
  const classes = useStyles();
  const { formData, setFormData } = useFormData();

  console.log(formData)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      dob: newValue,
    }));
  };

  return (
    <Card className={classes.card}>
      <Typography variant="h5" gutterBottom>
        1. Personal Details
      </Typography>

      {/* Name Section */}
      <Grid container spacing={2} className={classes.section}>
        <Grid item xs={12} md={3}>
          <div className={classes.labelContainer}>
            <Typography>
              Name of the Candidate:
              <span className={classes.requiredStar}>*</span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={9}>
          <div className={classes.inputGroup}>
            <TextField
              label="First Name"
              fullWidth
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <TextField
              label="Middle Name"
              fullWidth
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
            />
            <TextField
              label="Last Name"
              fullWidth
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
        </Grid>
      </Grid>

      {/* Relationship Section */}
      <Grid container spacing={2} className={classes.section}>
        <Grid item xs={12} md={3}>
          <div className={classes.labelContainer}>
            <Typography>
              Relationship:
              <span className={classes.requiredStar}>*</span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="relationship">Select</InputLabel>
            <Select
              labelId="relationship"
              id="relationship"
              label="Relationship"
              name="relationship"
              required
              value={formData.relationship}
              onChange={handleInputChange}
            >
              <MenuItem value="father">Father</MenuItem>
              <MenuItem value="husband">Husband</MenuItem>
              <MenuItem value="mother">Mother</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={7}>
          <div className={classes.inputGroup}>
            <TextField
              label="First Name"
              fullWidth
              name="relationshipFirstName"
              required
              value={formData.relationshipFirstName}
              onChange={handleInputChange}
            />
            <TextField
              label="Middle Name"
              fullWidth
              name="relationshipMiddleName"
              value={formData.relationshipMiddleName}
              onChange={handleInputChange}
            />
            <TextField
              label="Last Name"
              fullWidth
              name="relationshipLastName"
              required
              value={formData.relationshipLastName}
              onChange={handleInputChange}
            />
          </div>
        </Grid>
      </Grid>

      {/* Date of Birth Section */}
      <Grid container spacing={2} className={classes.section}>
        <Grid item xs={12} md={3}>
          <div className={classes.labelContainer}>
            <Typography>
              Date of Birth:
              <span className={classes.requiredStar}>*</span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <DatePicker
            disableFuture
            label=""
            openTo="year"
            views={["year", "month", "day"]}
            value={formData.dob}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <div className={classes.labelContainer}>
            <Typography>
              Gender:
              <span className={classes.requiredStar}>*</span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Select</InputLabel>
            <Select
              label="Select"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Card>
  );
};

export default PersonalDetailsForm;
