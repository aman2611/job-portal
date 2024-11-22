import React, { createContext, useState, useContext, useEffect } from 'react';
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
  Avatar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FileUploadInput from '../../lib/FileUploadInput'; // Ensure correct import
import DescriptionIcon from '@mui/icons-material/Description';
import FaceIcon from '@mui/icons-material/Face';
import PersonalDetail from './PersonalDetails/PersonalDetail';
import EducationDetail from './EducationDetails/EducationDetail';
import ExperienceDetail from './ExperienceDetails/ExperienceDetail';
import axios from 'axios'; // Make sure axios is installed
import apiList from '../../lib/apiList'; // Adjust API endpoints
import { SetPopupContext } from '../../App';
import { Navigate, useNavigate } from 'react-router-dom';

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
  avatar: {
    width: 100,
    height: 100,
    margin: '20px 0',
  },
  inputBox: {
    marginBottom: theme.spacing(2),
  },
}));

const Profile = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Personal Details', 'Educational Details', 'Experience Details', 'Upload Documents'];

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    relationship: '',
    relationshipFirstName: '',
    relationshipMiddleName: '',
    relationshipLastName: '',
    dob: null,
    gender: '',
    belongsToCategory: 'No',
    category: '',
    aadhar: '',
    belongsToPwBD: 'No',
    pwBD: '',
    belongsToExServiceman: 'No',
    religion: 'Hinduism',
    email: '',
    alternateEmail: '',
    mobile: '',
    officeTelephone: '',
    permanentAddress: '',
    permanentCity: '',
    permanentState: '',
    permanentPincode: '',
    sameAddress: false,
    correspondenceAddress: '',
    correspondenceCity: '',
    correspondenceState: '',
    correspondencePincode: '',
    schoolName10th: '',
    boardName10th: '',
    yop10th: '',
    percenatage10th: '',
    schoolName12th: '',
    boardName12th: '',
    yop12th: '',
    percentage12th: '',
    universityGrad: '',
    degreeGrad: '',
    majorGrad: '',
    percentageGrad: '',
    yopGrad: '',
    universityPG: '',
    degreePG: '',
    majorPG: '',
    percentagePG: '',
    yopPG: '',
    experience: {
      companyName: '',
      location: '',
      startDate: null,
      endDate: null,
      employmentType: '',
      skills: [],
    },
    resume: null,
    profile: null,
  });

  const navigate = useNavigate();

  const classes = useStyles();

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      console.log(formData)
      setTimeout(() => {
        navigate('./'); // Navigate to your desired path
      }, 2000);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <PersonalDetail />;
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
            <FileUploadInput
              label="Resume (.pdf)"
              icon={<DescriptionIcon />}
              uploadTo={apiList.uploadResume}
              handleInput={(key, fileUrl) => setFormData(prev => ({ ...prev, [key]: fileUrl }))}
              identifier="resume"
            />
            <FileUploadInput
              label="Profile Picture (.jpg/.png)"
              icon={<FaceIcon />}
              uploadTo={apiList.uploadProfileImage}
              handleInput={(key, fileUrl) => setFormData(prev => ({ ...prev, [key]: fileUrl }))}
              identifier="profile"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
              onClick={handleSubmit}
            >
              Submit Resume and Profile Picture
            </Button>
          </Card>
        );
      default:
        return 'Unknown Step';
    }
  };

  const handleSubmit = () => {
    console.log(formData)
    axios
      .put(apiList.user, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      })
      .then((response) => {
        console.log(response)
        SetPopupContext({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        // setSuccess('Profile data submitted successfully');
        // setOpenSnackbar(true);
        handleReset();
      })
      .catch((error) => {
        if (error.response) {
          console.log('Response Error:', error.response.data);
        } else {
          console.log('Error:', error.message);
        // setError('Failed to submit profile data');
        // setOpenSnackbar(true);
      }})
  };

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      <Box sx={{ width: '100%', padding: 3, marginBottom: '20px' }}>
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
              <Box sx={{ marginTop: '20px' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ marginRight: '10px' }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                  sx={{ marginRight: '10px' }}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </div>
          )}
        </div>
      </Box>
    </FormDataContext.Provider>
  );
};

export default Profile;
