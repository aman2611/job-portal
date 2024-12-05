import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  Card,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputLabel: {
    marginBottom: "8px", 
  },
  inputBox: {
    marginBottom: "16px", 
  }
}));

const profilePicture = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [profilePictureDetails, setprofilePictureDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
    email: "",
  });

  const [phone, setPhone] = useState("");

  const handleInput = (key, value) => {
    setprofilePictureDetails({
      ...profilePictureDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setprofilePictureDetails(response.data);
        setPhone(response.data.contactNumber);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleUpdate = () => {
    let updatedDetails = {
      ...profilePictureDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...profilePictureDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...profilePictureDetails,
        contactNumber: "",
      };
    }

    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  return (
    <Card sx={{ width: "100%", marginTop:'30px' }}>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item>
          <Typography variant="h4">profilePicture</Typography>
        </Grid>
        <Grid item xs style={{ width: "100%" }}>
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <Typography className={classes.inputLabel}>Enter Your Name</Typography>
                <TextField
                  value={profilePictureDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  className={classes.inputBox}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>

              <Grid item>
                <Typography className={classes.inputLabel}>Bio (up to 250 words)</Typography>
                <TextField
                  label=""
                  multiline
                  rows={8}
                  variant="outlined"
                  value={profilePictureDetails.bio}
                  onChange={(event) => {
                    if (
                      event.target.value.split(" ").filter(function (n) {
                        return n !== "";
                      }).length <= 250
                    ) {
                      handleInput("bio", event.target.value);
                    }
                  }}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography className={classes.inputLabel}>Phone Number</Typography>
                  <PhoneInput
                    country={"in"}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    inputProps={{
                      required: true, 
                    }}
                    style={{ width: "100%" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography className={classes.inputLabel}>Email</Typography>
                  <TextField
                    label="Enter Your Email"
                    value={profilePictureDetails.email}
                    onChange={(event) => handleInput("email", event.target.value)}
                    className={classes.inputBox}
                    variant="outlined"
                    fullWidth
                    required
                    type="email"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={() => handleUpdate()}
            >
              Update Details
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Card>
  );
};

export default profilePicture;
