import { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Card,
  InputAdornment,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import goilogo from "../assets/goi-logo.png";
import { Box, minWidth } from "@mui/system";

const useStyles = makeStyles(() => ({
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    flexDirection: "column",
  },
  card: {
    width: "400px",
    padding: "40px 30px",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: "20px",
  },
  logo: {
    width: "80px",
    marginBottom: "20px",
  },
  subTitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
  },
  signInButton: {
    marginTop: "10px",
    backgroundColor: "#000",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#333",
    },
  },
  footerLinks: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    fontWeight: "500",
    cursor: "pointer",
    color: "#000",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  inputBox: {
    marginBottom: "20px",
    width: "100%",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#f97316",
    "&:hover": {
      backgroundColor: "#ea580c",
    },
    marginTop: "20px",
  },
}));

const Signup = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const navigate = useNavigate();


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
    <Paper elevation={3} className={classes.card}>
      <Box>
        <img
          src={goilogo}
          alt="Govt of India Logo"
          className={classes.logo}
        />
      </Box>

      <Box sx={{ marginBottom: "30px" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", marginBottom: "10px" }}
        >
          Create an account
        </Typography>
        <Typography className={classes.subTitle}>
          Enter your details to create your account
        </Typography>
      </Box>

      <Box item sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
          <Typography sx={{ fontWeight: 700 }}>Name</Typography>
          <TextField
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
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
          <Typography sx={{ fontWeight: 700 }}>Email</Typography>
          <EmailInput
            value={signupDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            className={classes.inputBox}
            required={true}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#999",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f97316",
                },
              },
              "& .MuiOutlinedInput-input": {
                color: "black",
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-start", width: '100%' }}>
          <Typography sx={{ fontWeight: 700, display: "flex", alignItems: "flex-start" }}>
            Password
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Enter your password"
            value={signupDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#999",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f97316",
                },
              },
              "& .MuiOutlinedInput-input": {
                color: "black",
              },
            }}
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


        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
          <Typography sx={{ fontWeight: 700 }}>I am a</Typography>
          <TextField
            placeholder="Select User Type"
            select
            value={signupDetails.type}
            onChange={(event) => {
              handleInput("type", event.target.value);
            }}
            className={classes.inputBox}
            variant="outlined"
          >
            <MenuItem value="applicant">Applicant</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
          </TextField>
        </Box>

        {signupDetails.type === "recruiter" && (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
              <Typography sx={{ fontWeight: 700 }}>Bio</Typography>
              <TextField
                multiline
                rows={8}
                className={classes.inputBox}
                variant="outlined"
                value={signupDetails.bio}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter((n) => n !== "")
                      .length <= 250
                  ) {
                    handleInput("bio", event.target.value);
                  }
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-start" }}>
              <Typography sx={{ fontWeight: 700 }}>Phone Number</Typography>
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={setPhone}
              />
            </Box>

          </>
        )}

        <Box>
          <Button
            variant="contained"
            className={classes.submitButton}
            sx={{ padding: "10px 50px", backgroundColor: "#f97316", "&:hover": { backgroundColor: "#ea580c" } }}
            onClick={handleSignup}
          >
            Sign up
          </Button>
        </Box>

        <Box className={classes.footerLinks}>
          <Typography>
            Already have an account?{" "}
            <span className={classes.link} onClick={() => navigate("/login")}>
              Login
            </span>
          </Typography>
          {/* <Typography>
            <span
              className={classes.link}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </span>
          </Typography> */}
        </Box>

      </Box>
    </Paper>
  );
};

export default Signup;
