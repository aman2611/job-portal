import React from 'react';
import { Card, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormData } from '../Profile';

const useStyles = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(3),
        margin: theme.spacing(4),
        marginTop: theme.spacing(8)
    },
    section: {
        marginBottom: theme.spacing(2),
    },
    labelContainer: {
        display: 'flex',
        alignItems: 'center',
        height: '100%'
    },
    inputGroup: {
        display: 'flex',
        gap: theme.spacing(2),
        width: '100%'
    }
}));

const PersonalDetailsForm = () => {
    const classes = useStyles();
    const { formData, setFormData } = useFormData();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDateChange = (newValue) => {
        setFormData((prevData) => ({
            ...prevData,
            dob: newValue
        }));
    };

    const handleBelongsToCategoryChange = (event) => {
        const { value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            belongsToCategory: value,
            category: value === 'Yes' ? prevData.category : ''
        }));
    };

    const handleBelongsToPwBDChange = (event) => {
        const { value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            belongsToPwBD: value,
            pwBD: value === 'Yes' ? prevData.pwBD : ''
        }));
    };

    return (
        <Card className={classes.card}>
            <Typography variant="h5" gutterBottom>1. Personal Details</Typography>

            {/* Name */}
            <Grid container spacing={2} className={classes.section}>
                <Grid item xs={12} md={3}>
                    <div className={classes.labelContainer}>
                        <Typography>Name of the Candidate:</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} md={9}>
                    <div className={classes.inputGroup}>
                        <TextField
                            label="First Name"
                            fullWidth
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Middle Name"
                            fullWidth
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                </Grid>
            </Grid>

            {/* Relationship */}
            <Grid container spacing={2} className={classes.section}>
                <Grid item xs={12} md={3}>
                    <div className={classes.labelContainer}>
                        <Typography>Relationship:</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="relationship">Select</InputLabel>
                        <Select
                            labelId="relationship"
                            id="relationship"
                            label="Relationship"
                            name="relationship"
                            required
                            value={formData.relationship}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="father">Father</MenuItem>
                            <MenuItem value="husband">Husband</MenuItem>
                            <MenuItem value="mother">Mother</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={7}>
                    <div className={classes.inputGroup}>
                        <TextField
                            label="First Name"
                            fullWidth
                            name="relationshipFirstName"
                            required
                            value={formData.relationshipFirstName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Middle Name"
                            fullWidth
                            name="relationshipMiddleName"
                            value={formData.relationshipMiddleName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            name="relationshipLastName"
                            required
                            value={formData.relationshipLastName}
                            onChange={handleInputChange}
                        />
                    </div>
                </Grid>
            </Grid>

            {/* Date of Birth */}
            <Grid container spacing={2} className={classes.section}>
                <Grid item xs={12} md={3}>
                    <div className={classes.labelContainer}>
                        <Typography>Date of Birth:</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} md={9}>
                    <DatePicker
                        disableFuture
                        label=""
                        openTo="year"
                        views={['year', 'month', 'day']}
                        format="DD-MM-YYYY"
                        required
                        value={formData.dob}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </Grid>
            </Grid>

            {/* Gender */}
            <Grid container spacing={4} className={classes.section}>
                <Grid item xs={12} md={3}>
                    <div className={classes.labelContainer}>
                        <Typography>Gender:</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="gender">--Select--</InputLabel>
                        <Select
                            labelId="gender"
                            id="gender"
                            label="--Select--"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Category */}
            <Grid container spacing={2} className={classes.section}>
                <Grid item xs={12} md={4}>
                    <Typography>
                        Category to which belongs (If Yes, Please Specify){" "}
                        <span style={{ color: "red" }}>*</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Select</InputLabel>
                        <Select
                            label="Select"
                            name="belongsToCategory"
                            value={formData.belongsToCategory}
                            onChange={handleBelongsToCategoryChange}
                        >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <Select
                            value={formData.category}
                            label="Category"
                            onChange={handleInputChange}
                            name="category"
                            disabled={formData.belongsToCategory !== "Yes"}
                            sx={{
                                backgroundColor: formData.belongsToCategory === "Yes" ? "white" : "lightgray",
                            }}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="OBC">OBC</MenuItem>
                            <MenuItem value="SC">SC</MenuItem>
                            <MenuItem value="ST">ST</MenuItem>
                            <MenuItem value="EWS">EWS</MenuItem>
                            <MenuItem value="UR">UR</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Aadhar */}
            <Grid container spacing={2} className={classes.section}>
                <Grid item xs={12} md={3}>
                    <div className={classes.labelContainer}>
                        <Typography>Aadhar:</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} md={2}>
                    <div className={classes.inputGroup}>
                        <TextField
                            label="Adhar Number"
                            fullWidth
                            name="aadhar"
                            value={formData.aadhar}
                            onChange={handleInputChange}
                        />
                    </div>
                </Grid>
            </Grid>

            {/* PwBD */}
            <Grid container spacing={2} className={classes.section}>
                <Grid item xs={12} md={4}>
                    <Typography>
                        PwBD (Persons with Benchmark Disabilities){" "}
                        <span style={{ color: "red" }}>*</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Select</InputLabel>
                        <Select
                            label="Select"
                            name="belongsToPwBD"
                            value={formData.belongsToPwBD}
                            onChange={handleBelongsToPwBDChange}
                        >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <Select
                            value={formData.pwBD}
                            label="Disability Type"
                            onChange={handleInputChange}
                            name="pwBD"
                            disabled={formData.belongsToPwBD !== "Yes"}
                            sx={{
                                backgroundColor: formData.belongsToPwBD === "Yes" ? "white" : "lightgray",
                            }}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Blind">Blind</MenuItem>
                            <MenuItem value="Deaf">Deaf</MenuItem>
                            <MenuItem value="Orthopedic">Orthopedic</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Card>
    );
};

export default PersonalDetailsForm;
