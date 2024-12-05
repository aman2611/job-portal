import React, { createContext, useState, useContext, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Card,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PersonalDetail from "./PersonalDetails/PersonalDetail";
import EducationDetail from "./EducationDetails/EducationDetail";
import ExperienceDetail from "./ExperienceDetails/ExperienceDetail";
import axios from "axios";
import apiList from "../../lib/apiList";
import { SetPopupContext } from "../../App";
import { useNavigate } from "react-router-dom";
import FileUploadInput from "../../lib/FileUploadInput";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const FormDataContext = createContext();

export const useFormData = () => {
  return useContext(FormDataContext);
};

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(4),
    margin: theme.spacing(4),
    marginTop: theme.spacing(8),
  },
}));

const Profile = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [profilePictureUploaded, setprofilePictureUploaded] = useState(false);

  const steps = [
    "Personal Details",
    "Educational Details",
    "Experience Details",
    "Upload Documents",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    relationship: "",
    relationshipFirstName: "",
    relationshipMiddleName: "",
    relationshipLastName: "",
    dob: null,
    gender: "",
    belongsToCategory: "No",
    category: "",
    aadhar: "",
    belongsToPwBD: "No",
    pwBD: "",
    belongsToExServiceman: "No",
    religion: "Hinduism",
    email: "", // Initially empty but will be filled from the backend data
    alternateEmail: "",
    mobile: "",
    officeTelephone: "",
    permanentAddress: "",
    permanentCity: "",
    permanentState: "",
    permanentPincode: "",
    sameAddress: false,
    correspondenceAddress: "",
    correspondenceCity: "",
    correspondenceState: "",
    correspondencePincode: "",
    schoolName10th: "",
    boardName10th: "",
    yop10th: "",
    percenatage10th: "",
    schoolName12th: "",
    boardName12th: "",
    yop12th: "",
    percentage12th: "",
    universityGrad: "",
    degreeGrad: "",
    majorGrad: "",
    percentageGrad: "",
    yopGrad: "",
    universityPG: "",
    degreePG: "",
    majorPG: "",
    percentagePG: "",
    yopPG: "",
    jobExperience: {
      companyName: "",
      location: "",
      startDate: null,
      endDate: null,
      employmentType: "",
      skills: [],
    },
    personalSkills:[],
    resume: null,
    profilePicture: null,
  });

  const navigate = useNavigate();
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  useEffect(() => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const userData = response.data.userDetails;
        setFormData((prevData) => ({
          ...prevData,
          email: userData.email, 
          ...userData, 
        }));
        console.log("User data fetched:", userData);
        console.log(" data fetched:", response.data);
       
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      console.log("Final Submitted Data:", formData);
      handleSubmit();
      setTimeout(() => {
        navigate("./");
      }, 1500);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  const handleInput = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
    if (key === "resume") setResumeUploaded(true);
    if (key === "profilePicture") setprofilePictureUploaded(true);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <PersonalDetail
            formData={formData}
            handleInput={handleInput}
            readOnlyFields={{ email: true }} 
          />
        );
      case 1:
        return <EducationDetail />;
      case 2:
        return <ExperienceDetail />;
      case 3:
        return (
          <Card className={classes.card}>
            <Typography variant="h5" gutterBottom>
              Upload Your Resume and Profile Picture
            </Typography>
            <Grid container spacing={4}>
              {/* Resume Upload */}
              <Grid item xs={12} md={6}>
                <FileUploadInput
                  uploadTo={apiList.uploadResume}
                  identifier="resume"
                  handleInput={handleInput}
                  className={classes.uploadBox}
                  label="Resume"
                  icon={<UploadFileIcon />}
                />
              </Grid>

              {/* Profile Picture Upload */}
              <Grid item xs={12} md={6}>
                <FileUploadInput
                  uploadTo={apiList.uploadprofilePictureImage}
                  identifier="profilePicture"
                  handleInput={handleInput}
                  className={classes.uploadBox}
                  label="Profile Picture"
                  icon={<UploadFileIcon />}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            {/* <Button
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
              onClick={handleNext}
              disabled={!resumeUploaded || !profilePictureUploaded}
            >
              Submit Resume and profilePicture profilePicture
            </Button> */}
          </Card>
        );
      default:
        return "Unknown Step";
    }
  };

  const handleSubmit = () => {
    axios
      .put(apiList.user, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleReset();
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      })
      .catch((error) => {
        const errorMessage = error.response
          ? error.response.data.message
          : "Error submitting Profile Picture data";
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  };

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      <Box sx={{ width: "100%", padding: 3, marginBottom: "20px" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? null : (
            <div>
              {getStepContent(activeStep)}
              <Box sx={{ marginTop: "20px", marginLeft:"48px" }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ marginRight: "10px" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{ marginRight: "10px" }}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </div>
          )}
        </div>
      </Box>

      {/* Snackbar for displaying messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </FormDataContext.Provider>
  );
};

export default Profile;
