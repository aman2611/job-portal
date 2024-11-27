import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Alert,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const UploadDocument = () => {
  const [resume, setResume] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  // Handle file selection and update state
  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      if (fileType === "resume") {
        setResume(file);
      } else if (fileType === "profilePicture") {
        setProfilePicture(file);
      }
      setSuccessMessage(true); // Indicate that files have been uploaded
    }
  };

  // Delete the existing file (resume or profile picture)
  const handleDeleteFile = (fileType) => {
    if (fileType === "resume") {
      setResume(null);
    } else if (fileType === "profilePicture") {
      setProfilePicture(null);
    }
  };

  return (
    <Box maxWidth="md" mx="auto" p={3}>
      <Card>
        <CardHeader title={<Typography variant="h6">Upload Your Documents</Typography>} />
        <CardContent>
          {/* Resume Upload Section */}
          <Box mb={4}>
            <Typography variant="subtitle1" gutterBottom>
              Resume Upload
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={120}
              px={2}
              border="2px dashed"
              borderColor="grey.400"
              borderRadius={2}
              sx={{
                cursor: "pointer",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Box textAlign="center">
                <UploadFileIcon fontSize="large" color="action" />
                <Typography variant="body2" color="textSecondary">
                  Drop your resume here or click to browse
                </Typography>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e, "resume")}
                />
              </Box>
            </Box>
            {resume && (
              <Box mt={2} p={2} display="flex" alignItems="center" bgcolor="grey.100" borderRadius={1}>
                <InsertDriveFileIcon color="primary" />
                <Typography variant="body2" ml={1}>
                  {resume.name}
                </Typography>
                <IconButton
                  onClick={() => handleDeleteFile("resume")}
                  size="small"
                  sx={{ ml: 2, color: "error.main" }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Profile Picture Upload Section */}
          <Box mb={4}>
            <Typography variant="subtitle1" gutterBottom>
              Profile Picture
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={120}
              px={2}
              border="2px dashed"
              borderColor="grey.400"
              borderRadius={2}
              sx={{
                cursor: "pointer",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Box textAlign="center">
                <AccountCircleIcon fontSize="large" color="action" />
                <Typography variant="body2" color="textSecondary">
                  Upload your profile picture
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e, "profilePicture")}
                />
              </Box>
            </Box>
            {profilePicture && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Avatar
                  src={URL.createObjectURL(profilePicture)}
                  alt="Profile preview"
                  sx={{
                    width: 96,
                    height: 96,
                    border: "4px solid",
                    borderColor: "grey.300",
                  }}
                />
                <IconButton
                  onClick={() => handleDeleteFile("profilePicture")}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  <DeleteOutlineIcon color="error" />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<CloudUploadIcon />}
            onClick={() => setSuccessMessage(true)} // Simulate file upload completion
          >
            Upload Documents
          </Button>

          {/* Success Alert */}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Documents uploaded successfully!
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadDocument;
