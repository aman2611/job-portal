import { useContext, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { SetPopupContext } from "../App";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import logo from "../assets/goi-logo.png";

const useStyles = makeStyles(() => ({
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  },
  card: {
    width: "400px",
    padding: "40px 30px",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
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
  },
}));

const Login = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const navigate = useNavigate();

  const [loggedin, setLoggedin] = useState(isAuth());
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleLogin = () => {
    axios
      .post(apiList.login, loginDetails)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("type", response.data.type);
        setLoggedin(isAuth());
        setPopup({
          open: true,
          severity: "success",
          message: "Logged in successfully!",
        });
        navigate("/home");
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || "Login failed!",
        });
      });
  };

  return loggedin ? (
    <Navigate to="/" />
  ) : (
    <Box className={classes.mainContainer}>
      <Paper elevation={3} className={classes.card}>
        <Box mb={2}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "40px",
              marginBottom: "10px",
            }}
          />
        </Box>

        <Box sx={{ marginBottom: "30px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            Login to NRIDA Job Portal
          </Typography>
          <Typography className={classes.subTitle}>
            Enter your email and password to access your account
          </Typography>
        </Box>

        <Box mb={2}>
        <Typography sx={{fontWeight:700, display:"flex", alignItems:"flex-start"}}>
            Email
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="m@example.com"
            value={loginDetails.email}
            onChange={(e) => handleInput("email", e.target.value)}
            sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white", // Always white background
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
          <Typography sx={{fontWeight:700, display:"flex", alignItems:"flex-start"}}>
            Password
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Enter your password"
            value={loginDetails.password}
            onChange={(e) => handleInput("password", e.target.value)}
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

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{ padding: "10px 50px", backgroundColor: "#f97316", "&:hover": { backgroundColor: "#ea580c" } }}

        >
          Sign In
        </Button>

        <Box className={classes.footerLinks}>
          <Typography>
            Don’t have an account?{" "}
            <span className={classes.link} onClick={() => navigate("/signup")}>
              Sign up
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
      </Paper>
    </Box>
  );
};

export default Login;
