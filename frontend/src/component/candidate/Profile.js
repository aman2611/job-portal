import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box, Typography } from '@mui/material';
import PersonalDetail from './PersonalDetail';

const Profile = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Personal Details', 'Educational Details', 'Experience Detais', 'Upload Documents', 'Declaration'];
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
    religion: '',
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
    correspondencePincode: ''
});

  // Handle next step
  const handleNext = () => {
    console.log('Form Data on Step', formData); // Log the data here before moving to the next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  // Handle previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle reset (optional)
  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <PersonalDetail formData={formData} setFormData={setFormData} />;
      case 1:
        return <PersonalDetail formData={formData} setFormData={setFormData} />;
      case 2:
        return <PersonalDetail formData={formData} setFormData={setFormData} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 3, marginBottom:'20px' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography variant="h6">All steps completed</Typography>
            <Button onClick={handleReset} variant="contained" color="primary">
              Reset
            </Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <Box sx={{ margintop: '20px', display:'flex', justifyContent:'center', alignItems:'center', gap:'20px'  }}>
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ display:'flex', alignItems:'center' }}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Save & Next'}
              </Button>
            </Box>
          </div>
        )}
      </div>
    </Box>
  );
};

export default Profile;
