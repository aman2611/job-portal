import React, { createContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Welcome from "./component/Welcome";
import Navbar from "./component/Navbar";
import Profile from "./component/Profile";
import Login from "./component/Login";
import Logout from "./component/Logout";
import Signup from "./component/Signup";
import Home from "./component/Home";
import Applications from "./component/Applications";
import CreateJobs from "./component/recruiter/CreateJobs";
import MyJobs from "./component/recruiter/MyJobs";
import JobApplications from "./component/recruiter/JobApplications";
import AcceptedApplicants from "./component/recruiter/AcceptedApplicants";
import RecruiterProfile from "./component/recruiter/Profile";
import MessagePopup from "./lib/MessagePopup";
import isAuth, { userType } from "./lib/isAuth";
import CandidateProfile from "./component/candidate/Profile";
import CreateJobs2 from "./component/recruiter/CreateJobs/CreateJobs2";
import ScreeningQuestions from "./component/recruiter/CreateJobs/ScreeningQuestions";
import JobDetails from "./component/JobDetails";
import ForgotPassword from "./component/ForgetPassword";
import ResetPassword from "./component/ResetPassword";
import PageNotFound from "./component/PageNotFound";

const useStyles = makeStyles(() => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    boxSizing: "border-box",
    width: "100%",
    padding: "64px 140px 0",
    backgroundColor: "#f9fafb",
    marginTop: "10px",
  },
}));

export const SetPopupContext = createContext();
const theme = createTheme();

function App() {
  const classes = useStyles();
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const isLoggedIn = isAuth();

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <SetPopupContext.Provider value={setPopup}>
          <Grid container direction="column">
            {/* Navbar */}
            <Grid item xs>
              <Navbar />
            </Grid>

            {/* Main Body */}
            <Grid item className={classes.body}>
              <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />

                {/* Public Routes */}
                <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/home" />} />
                <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/home" />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                {/* <Route path ="/reset-password" element={<ResetPassword/>}/> */}
                <Route path="*" element={<PageNotFound />} />


                {/* Protected Routes */}
                <Route path="/logout" element={isLoggedIn ? <Logout /> : <Navigate to="/login" />} />
                <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                <Route path="/applications" element={isLoggedIn ? <Applications /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isLoggedIn ? userType() === "recruiter" ? <RecruiterProfile /> : <CandidateProfile /> : <Navigate to="/login" />} />
                <Route path="/addjob" element={isLoggedIn ? <CreateJobs2 /> : <Navigate to="/login" />} />
                <Route path="/screening" element={isLoggedIn ? <ScreeningQuestions /> : <Navigate to="/login" />} />
                <Route path="/myjobs" element={isLoggedIn ? <MyJobs /> : <Navigate to="/login" />} />
                <Route path="/job/applications/:jobId" element={isLoggedIn ? <JobApplications /> : <Navigate to="/login" />} />
                <Route path="/job-details/:id" element={isLoggedIn ? <JobDetails /> : <Navigate to="/login" />} />
              </Routes>
            </Grid>
          </Grid>

          <MessagePopup
            open={popup.open}
            setOpen={(status) =>
              setPopup({
                ...popup,
                open: status,
              })
            }
            severity={popup.severity}
            message={popup.message}
          />
        </SetPopupContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
