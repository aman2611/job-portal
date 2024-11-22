import React, { useState, useEffect } from 'react';
import { Card, Typography, Grid, Button, Snackbar, Alert, Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import apiList from '../../../lib/apiList';
import FileUploadInput from '../../../lib/FileUploadInput';
import DescriptionIcon from "@mui/icons-material/Description";
import FaceIcon from "@mui/icons-material/Face";
import { useFormData } from '../Profile';

const useStyles = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(4),
        margin: theme.spacing(4),
        marginTop: theme.spacing(8),
    },
    avatar: {
        width: 100,
        height: 100,
        margin: '20px 0',
    }
}));

const UploadDocuments = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // Separate success state
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Track the submission state

    const { formData, setFormData } = useFormData(); // Use context to access formData and updateFormData

    const classes = useStyles();

    const handleFileChange = (key, file) => {
        if (key === "resume") {
            const fileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (file && fileTypes.includes(file.type)) {
                setFormData((prevData) => ({
                    ...prevData,
                    resume: file, 
                }));
                setError('');
            } else {
                setError('Please upload a valid resume (PDF or Word document)');
            }
        } else if (key === "profile") {
            const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (file && imageTypes.includes(file.type)) {
                setFormData((prevData) => ({
                    ...prevData,
                    profile: file, 
                }));
                setError('');
            } else {
                setError('Please upload a valid image (JPEG, PNG, or GIF)');
            }
        }
        setOpenSnackbar(true);
    };

    const handleSubmit = async () => {
        // Check if both resume and profile picture are uploaded
        if (!formData.resume || !formData.profile) {
            console.log(formData)
            setError('Please upload both resume and profile picture');
            setSuccess('');
            setOpenSnackbar(true);
            return;
        }

        // Disable the submit button while submitting
        setIsSubmitting(true);
        setError(''); // Clear previous error
        setSuccess(''); // Clear previous success message

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('resume', formData.resume);
        formDataToSubmit.append('profile', formData.profile);

        try {
            const response = await axios.post(apiList.user, formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle the response based on success
            if (response.status === 200) {
                setSuccess('Resume and profile picture uploaded successfully!');
                setError('');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to upload documents');
            setSuccess('');
        } finally {
            // Re-enable the submit button after the request finishes
            setIsSubmitting(false);
            setOpenSnackbar(true);
        }
    };

    return (
        <Grid container style={{ padding: '20px' }}>
            <Card className={classes.card}>
                <Typography variant="h5" gutterBottom>4. Upload Your Resume and Profile Picture</Typography>

                {/* Resume Upload */}
                <FileUploadInput
                    label="Resume (.pdf)"
                    icon={<DescriptionIcon />}
                    uploadTo={apiList.uploadResume}
                    handleInput={handleFileChange}
                    identifier={"resume"}
                />

                {/* Profile Picture Upload */}
                <FileUploadInput
                    label="Profile Picture (.jpg/.png)"
                    icon={<FaceIcon />}
                    uploadTo={apiList.uploadProfileImage}
                    handleInput={handleFileChange}
                    identifier={"profile"}
                />

                {/* Display Profile Picture */}
                {formData.profile && (
                    <Avatar src={URL.createObjectURL(formData.profile)} className={classes.avatar} />
                )}

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                    onClick={handleSubmit}
                    disabled={isSubmitting} // Disable the button while submitting
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Resume and Profile Picture'}
                </Button>

                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'}>
                        {error || success}
                    </Alert>
                </Snackbar>
            </Card>
        </Grid>
    );
};

export default UploadDocuments;
