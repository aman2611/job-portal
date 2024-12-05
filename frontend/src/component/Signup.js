import { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Card,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Navigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import goilogo from "../asset/goi-logo.png";
import { Box } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  mainCard: {
    width: "1200px",
    padding: theme.spacing(2),
    borderRadius: "8px",
  },
  logoBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  body: {
    padding: "20px 60px 40px",
    margin: "auto",
  },
  inputBox: {
    width: "300px",
  },
  submitButton: {
    width: "300px",
  },
}));

const Signup = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleSignup = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };

    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    }

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Signed up successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return loggedin ? (
    <Navigate to="/" />
  ) : (
    <Card className={classes.mainCard}>
      <Box className={classes.logoBox}>
        <img src={goilogo} alt="Govt of India Logo" style={{ width: "50px" }} />
        <Typography variant="h4">NRIDA Job Portal</Typography>
      </Box>
      <Card elevation={3} className={classes.body}>
        <Grid container direction="column" spacing={4} alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h2">
              Signup
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              select
              label="Category"
              variant="outlined"
              className={classes.inputBox}
              value={signupDetails.type}
              onChange={(event) => {
                handleInput("type", event.target.value);
              }}
            >
              <MenuItem value="applicant">Applicant</MenuItem>
              <MenuItem value="recruiter">Recruiter</MenuItem>
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              label="Name"
              value={signupDetails.name}
              onChange={(event) => handleInput("name", event.target.value)}
              className={classes.inputBox}
              error={inputErrorHandler.name.error}
              helperText={inputErrorHandler.name.message}
              onBlur={(event) => {
                if (event.target.value === "") {
                  handleInputError("name", true, "Name is required");
                } else {
                  handleInputError("name", false, "");
                }
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <EmailInput
              label="Email"
              value={signupDetails.email}
              onChange={(event) => handleInput("email", event.target.value)}
              inputErrorHandler={inputErrorHandler}
              handleInputError={handleInputError}
              className={classes.inputBox}
              required={true}
            />
          </Grid>
          <Grid item>
            <PasswordInput
              label="Password"
              value={signupDetails.password}
              onChange={(event) => handleInput("password", event.target.value)}
              className={classes.inputBox}
              error={inputErrorHandler.password.error}
              helperText={inputErrorHandler.password.message}
              onBlur={(event) => {
                if (event.target.value === "") {
                  handleInputError("password", true, "Password is required");
                } else {
                  handleInputError("password", false, "");
                }
              }}
            />
          </Grid>
          <Grid item >
            <TextField
              label="Bio (upto 250 words)"
              multiline
              rows={8}
              className={classes.inputBox}

              variant="outlined"
              value={signupDetails.bio}
              onChange={(event) => {
                if (
                  event.target.value.split(" ").filter(function (n) {
                    return n !== "";
                  }).length <= 250
                ) {
                  handleInput("bio", event.target.value);
                }
              }}
            />
          </Grid>
          <Grid item>
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignup}
              className={classes.submitButton}
            >
              Signup
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Card>
  );
};

export default Signup;
