import { useState, useContext } from "react";
import { Grid, Button, TextField, LinearProgress } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import Axios from "axios";

import { SetPopupContext } from "../App";

const FileUploadInput = (props) => {
  const setPopup = useContext(SetPopupContext);

  const { uploadTo, identifier, handleInput } = props;

  const [file, setFile] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleUpload = () => {
    console.log(file);
    const data = new FormData();
    data.append("file", file);
    Axios.post(uploadTo, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
      },
    })
      .then((response) => {
        console.log(response.data);
        handleInput(identifier, response.data.url);
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
      })
      .catch((err) => {
        console.log(err)
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.statusText,
          //   message: err.response.data
          //     ? err.response.data.message
          //     : err.response.statusText,
        });
      });
  };

  return (
    <Grid container item xs={12} direction="column" className={props.className}>
      <Grid container item xs={12} spacing={0}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            component="label"
            sx={{
              width: "100%", height: "100%", backgroundColor: "#f97316",
            }}
          >
            {props.icon}
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(event) => {
                console.log(event.target.files);
                setUploadPercentage(0);
                setFile(event.target.files[0]);
              }}
            // onChange={onChange}
            // onChange={
            //   (e) => {}
            //   //   setSource({ ...source, place_img: e.target.files[0] })
            // }
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={props.label}
            value={file ? file.name || "" : ""}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            sx={{
              width: "100%", height: "100%",
              backgroundColor: "#4b5563",
              "&:hover": { backgroundColor: "#ea580c" },
              "&.Mui-disabled": {
                opacity: 0.5, 
                backgroundColor: "#4b5563", 
                color: "#fff", 
              },
            }}
            onClick={() => handleUpload()}
            disabled={file ? false : true}
          >
            <CloudUpload />
          </Button>
        </Grid>
      </Grid>
      {uploadPercentage !== 0 ? (
        <Grid item xs={12} style={{ marginTop: "10px" }}>
          <LinearProgress variant="determinate" value={uploadPercentage} />
        </Grid>
      ) : null}
    </Grid>
  );
};

export default FileUploadInput;
