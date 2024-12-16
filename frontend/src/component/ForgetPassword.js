import React, { useState, useContext } from 'react';
import axios from 'axios';
import apiList from '../lib/apiList';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import goiLogo from '../assets/goi-logo.png'
import { SetPopupContext } from "../App";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: "#f9f9f9",
  },
  content: {
    backgroundColor: 'white',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '400px',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  logo: {
    width: "40px",
    marginBottom: "10px",
  },
  form: {
    marginBottom: theme.spacing(2),
  },
}));

const ForgotPassword = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const setPopup = useContext(SetPopupContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiList.forgotpassword, { email });
      console.log(response)
      setPopup({
        open: true,
        severity: "success",
        message: response.data.message,
      });
    } catch (err) {
      setPopup({
        open: true,
        severity: "error",
        message: err.response.data.message || 'Error sending email',
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
              Forgot Password
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Enter your email to reset your password
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              sx={{
                marginBottom: 2,
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ padding: "10px 50px", backgroundColor: "#f97316", "&:hover": { backgroundColor: "#ea580c" } }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;