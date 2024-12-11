import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

import logo from "../assets/pmgsy-logo.png";
import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles({
  appBar: {
    backgroundColor: "#fff !important",
    borderBottom: "1px solid #e0e0e0",
    paddingInline: "140px",
    zIndex: 1100,
  },
  button: {
    color: "#000 !important",
    textTransform: "none",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#fff7ed",
    },
  },
  title: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  logo: {
    height: 40,
    marginRight: "16px",
    cursor: "pointer",
  },
  typography: {
    color: "#000",
    fontWeight: 700,
  },
});

const Navbar = () => {
  const classes = useStyles();
  let navigate = useNavigate();

  const handleClick = (location) => {
    console.log(location);
    navigate(location);
  };

  return (
    <AppBar position="fixed" className={classes.appBar} elevation={0}>
      <Toolbar>
        <Box className={classes.title} onClick={() => handleClick("/home")}>
          <img src={logo} alt="Logo" className={classes.logo} />
          <Typography variant="h6" className={classes.typography}>
            NRIDA 
          </Typography>
        </Box>
        {isAuth() ? (
          userType() === "recruiter" ? (
            <>
              <Button className={classes.button} onClick={() => handleClick("/home")}>
                Home
              </Button>
              <Button className={classes.button} onClick={() => handleClick("/addjob")}>
                Add Jobs
              </Button>
              <Button className={classes.button} onClick={() => handleClick("/myjobs")}>
                My Jobs
              </Button>
              <Button className={classes.button} onClick={() => handleClick("/profile")}>
                Profile
              </Button>
              <Button className={classes.button} onClick={() => handleClick("/logout")}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button className={classes.button} onClick={() => handleClick("/home")}>
                Home
              </Button>
              <Button className={classes.button} onClick={() => handleClick("/applications")}>
                Applications
              </Button>
              <Button className={classes.button} onClick={() => handleClick("/profile")}>
                Profile
              </Button>
              <Button className={classes.button} onClick={() => handleClick("/logout")}>
                Logout
              </Button>
            </>
          )
        ) : (
          <>
            <Button className={classes.button} onClick={() => handleClick("/login")}>
              Login
            </Button>
            <Button className={classes.button} onClick={() => handleClick("/signup")}>
              Signup
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
