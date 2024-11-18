import React, { useState } from 'react';
import { Card, TextField, Typography, Button, Grid, Snackbar, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(4),
        margin: theme.spacing(4),
        marginTop: theme.spacing(8),
    },
})
)

const UploadDocuments = () => {
    const [resume, setResume] = useState(null);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const classes = useStyles();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const fileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (fileTypes.includes(file.type)) {
                setResume(file);
                setFileName(file.name);
                setError('');
                setOpenSnackbar(true);
            } else {
                setError('Please upload a valid resume (PDF or Word document)');
                setFileName('');
                setResume(null);
                setOpenSnackbar(true);
            }
        }
    };

    const handleSubmit = () => {
        if (!resume) {
            setError('Please upload a resume');
            setOpenSnackbar(true);
            return;
        }
        console.log('Uploading resume: ', resume);
    };

    return (
        <Grid container style={{ padding: '20px' }}>
            <Card className={classes.card}>
            <Typography variant="h5" gutterBottom>4. Upload Your Resume</Typography>

                <TextField
                    fullWidth
                    label="Resume"
                    variant="outlined"
                    type="file"
                    inputProps={{
                        accept: '.pdf,.doc,.docx',
                    }}
                    onChange={handleFileChange}
                    required
                />
                <Grid container justifyContent="space-between" alignItems="center" style={{ marginTop: '10px' }}>
                    <Typography variant="body1">{fileName || 'No file chosen'}</Typography>
                    <Button variant="text" color="secondary" onClick={() => setResume(null) && setFileName('')}>
                        Remove
                    </Button>
                </Grid>

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                    onClick={handleSubmit}
                >
                    Submit Resume
                </Button>

                {/* Snackbar for error or success messages */}
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'}>
                        {error || 'Resume uploaded successfully!'}
                    </Alert>
                </Snackbar>
            </Card>
        </Grid>
    );
};

export default UploadDocuments;
