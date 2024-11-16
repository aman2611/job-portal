import React, { createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Welcome from "./component/Welcome";
// import ErrorPage from "./component/ErrorPage";
import Navbar from "./component/Navbar";
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

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    paddingTop: "64px",
    boxSizing: "border-box",
    width: "100%",
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
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/home" element={<Home />} />
              <Route path="/applications" element={<Applications />} />
              <Route
                path="/profile"
                element={
                  userType() === "recruiter" ? (
                    <RecruiterProfile />
                  ) : (
                    <CandidateProfile />
                  )
                }
              />
              <Route path="/addjob" element={<CreateJobs />} />
              <Route path="/myjobs" element={<MyJobs />} />
              <Route path="/job/applications/:jobId" element={<JobApplications />} />
              <Route path="/employees" element={<AcceptedApplicants />} />
              {/* <Route path="*" element={<ErrorPage />} /> */}
            </Routes>
          </Grid>
        </Grid>

        {/* Message Popup */}
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
