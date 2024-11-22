import React, { useState, createContext } from 'react';
import { Box, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import JobDetails from './JobDetailsForm';
import ScreeningQuestions from './ScreeningQuestions';

// JobDataContext setup
// export const JobDataContext = createContext();

export const JobDataContext = createContext({
  jobData: {
    title: '',
    workplaceType: 'Remote',
    jobType: 'Full Time',
    duration: 0,
    salary: 0,
    deadline: new Date().toISOString().substr(0, 16),
    maxApplicants: 100,
    maxPositions: 30,
    description: '',
    skillsets: [],
    questions: []
  },
  setJobData: () => { }
});

export const JobDataProvider = ({ children }) => {
  const [jobData, setJobData] = useState({
    title: '',
    workplaceType: 'Remote',
    location: '',
    jobType: 'Full Time',
    duration: 0,
    salary: 0,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().substr(0, 16),
    maxApplicants: 100,
    maxPositions: 30,
    description: '',
    skillsets: [],
    questions: []
  });

  return (
    <JobDataContext.Provider value={{ jobData, setJobData }}>
      {children}
    </JobDataContext.Provider>
  );
};

const CreateJobs2 = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <JobDataProvider>
      <CardContent sx={{
        width: '100%', p: 0, backgroundColor: "#f5f5f5",
      }}>
        {currentStep === 1 ? (
          <JobDetails />
        ) : (
          <ScreeningQuestions />
        )}
      </CardContent>
    </JobDataProvider>
  );
};

export default CreateJobs2;
