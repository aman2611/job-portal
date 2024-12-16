import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import apiList from "../lib/apiList";
import { SetPopupContext } from "../App";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import goiLogo from "../assets/goi-logo.png";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  },
  content: {
    backgroundColor: "white",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "400px",
    textAlign: "center",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(4),
  },
  logo: {
    width: "40px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));

const ResetPassword = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const setPopup = useContext(SetPopupContext);

  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  useEffect(() => {
    console.log("ResetPassword Component mounted");
    if (!token) {
      setPopup({
        open: true,
        severity: "error",
        message: "Invalid or missing token.",
      });
    }
  }, [token]);

  const handleConfirmPasswordBlur = () => {
    if (newPassword !== confirmPassword && confirmPassword !== "") {
      setIsPasswordValid(false);
      setShowPasswordError(true);
    } else {
      setIsPasswordValid(true);
      setShowPasswordError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !isPasswordValid) {
      setPopup({
        open: true,
        severity: "error",
        message: "Passwords do not match or token is invalid.",
      });
      return;
    }

    try {
      const response = await axios.put(`${apiList.resetpassword}/${token}`, {
        password: newPassword,
      });

      setPopup({
        open: true,
        severity: "success",
        message: response.data.message,
      });

      const timerId = setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Error resetting password:", err);
      setPopup({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Error resetting password",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className={classes.container}>
        <Box className={classes.content}>
          <Box className={classes.header}>
            <img src={goiLogo} alt="NRIDA Logo" className={classes.logo} />
            <Typography variant="h4" component="h1" gutterBottom>
              Reset Password
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Enter your new password
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              type={showPassword ? "text" : "password"}
              label="New Password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              minLength="8"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              }}
            />

            <TextField
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={handleConfirmPasswordBlur}
              required
              fullWidth
              minLength="8"
              error={!isPasswordValid && showPasswordError}
              helperText={
                !isPasswordValid &&
                showPasswordError &&
                "Passwords do not match!"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                padding: "10px 50px",
                backgroundColor: "#f97316",
                "&:hover": { backgroundColor: "#ea580c" },
              }}
              disabled={!isPasswordValid}
            >
              Reset Password
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
