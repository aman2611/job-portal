import React, { useState } from "react";
import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { useFormData } from "../Profile";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
    margin: theme.spacing(4),
    marginTop: theme.spacing(8),
  },
  section: {
    marginBottom: theme.spacing(3),
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
  requiredStar: {
    color: "red",
    marginLeft: "4px",
  },
  radioGroup: {
    flexDirection: "row",
  },
  disabledField: {
    backgroundColor: "#f0f0f0", 
    "& .MuiInputBase-root": {
      color: "gray",
    },
  },
  fieldInline: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
}));

const PersonalDetailsForm = () => {
  const classes = useStyles();
  const { formData, setFormData } = useFormData();

  const [categorySelected, setCategorySelected] = useState(formData.categorySelected || false);
  const [pwdSelected, setPwdSelected] = useState(formData.pwdSelected || false);

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

  const handleCategoryChange = (event) => {
    setCategorySelected(event.target.value === "Yes");
    if (event.target.value !== "Yes") {
      setFormData((prevData) => ({ ...prevData, category: "" })); 
    }
  };

  const handlePwdChange = (event) => {
    setPwdSelected(event.target.value === "Yes");
    if (event.target.value !== "Yes") {
      setFormData((prevData) => ({ ...prevData, disabilityType: "" }));
    }
  };

  return (
    <Card className={classes.card}>
      <Typography variant="h5" gutterBottom>
        1. Personal Details
      </Typography>

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
            required
            disableFuture
            label="Date of Birth"
            openTo="year"
            views={["year", "month", "day"]}
            value={formData.dob ? dayjs(formData.dob) : null}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
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
              required
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

      <Grid container spacing={2} className={classes.section}>
        <Grid item xs={12} md={3}>
          <div className={classes.labelContainer}>
            <Typography>
              Belongs to a Category:
              <span className={classes.requiredStar}>*</span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={9} className={classes.fieldInline}>
          <FormControl fullWidth>
            <InputLabel>Yes/No</InputLabel>
            <Select
              required

              label="Yes/No"
              name="categorySelected"
              value={categorySelected ? "Yes" : "No"}
              onChange={handleCategoryChange}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="category">Select Category</InputLabel>
            <Select
              labelId="category"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={!categorySelected}
              className={categorySelected ? "" : classes.disabledField}
            >
              <MenuItem value="OBC">Other Backward Class (OBC)</MenuItem>
              <MenuItem value="SC">Scheduled Caste (SC)</MenuItem>
              <MenuItem value="ST">Scheduled Tribe (ST)</MenuItem>
              <MenuItem value="EWS">Economic Weaker Section (EWS)</MenuItem>
              <MenuItem value="UR">Unreserved (UR)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.section}>
        <Grid item xs={12} md={3}>
          <div className={classes.labelContainer}>
            <Typography>
              Person with Disability (PWD):
              <span className={classes.requiredStar}>*</span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={9} className={classes.fieldInline}>
          <FormControl fullWidth>
            <InputLabel>Yes/No</InputLabel>
            <Select
              label="Yes/No"
              name="pwdSelected"
              value={pwdSelected ? "Yes" : "No"}
              onChange={handlePwdChange}
              required
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="disabilityType">Select Disability Type</InputLabel>
            <Select
              labelId="disabilityType"
              id="disabilityType"
              name="disabilityType"
              value={formData.disabilityType}
              onChange={handleInputChange}
              disabled={!pwdSelected}
              className={pwdSelected ? "" : classes.disabledField}
            >
              <MenuItem value="Visual">(a) Blindness or low vision</MenuItem>
              <MenuItem value="Hearing">(b) Deaf and hard of hearing</MenuItem>
              <MenuItem value="Locomotor">(c) Locomotor disability including cerebral palsy, leprosy cured, dwarfism, acid attack victims and muscular dystrophy</MenuItem>
              <MenuItem value="Mental">(d) Autism, intellectual disability, specific learning disability and mental illness</MenuItem>
              <MenuItem value="All">(e) Multiple disabilities from amongst persons under clauses (a) to (d) including deaf-blindness</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.section}>
        <Grid item xs={12} md={3}>
          <div className={classes.labelContainer}>
            <Typography>
              Religion:
              <span className={classes.requiredStar}>*</span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={9}>
          <FormControl fullWidth>
            <InputLabel id="religion">Select Religion</InputLabel>
            <Select
              labelId="religion"
              id="religion"
              name="religion"
              required
              value={formData.religion}
              onChange={handleInputChange}
            >
              <MenuItem value="Hindu">Hindu</MenuItem>
              <MenuItem value="Muslim">Muslim</MenuItem>
              <MenuItem value="Christian">Christian</MenuItem>
              <MenuItem value="Sikh">Sikh</MenuItem>
              <MenuItem value="Jain">Jain</MenuItem>
              <MenuItem value="Budhist">Budhist</MenuItem>
              <MenuItem value="Parsi">Parsi</MenuItem>
              <MenuItem value="Jews">Jews</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Card>
  );
};

export default PersonalDetailsForm;
