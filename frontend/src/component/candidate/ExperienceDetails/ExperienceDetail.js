import React, { useState } from 'react';
import { Card, TextField, Typography, Grid, MenuItem, InputAdornment, Chip, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const useStyles = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(4),
        margin: theme.spacing(4),
        marginTop: theme.spacing(8),
    },
    section: {
        marginBottom: theme.spacing(4),
    },
    labelInput: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    addButton: {
        marginTop: theme.spacing(2),
    },
}));

const employmentTypes = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Contract', label: 'Contract' },
];

const EducationDetail = ({ formData, setFormData }) => {
    const classes = useStyles();

    const handleChange = (index, name, value) => {
        const updatedExperiences = [...formData];
        updatedExperiences[index][name] = value;
        setFormData(updatedExperiences);
    };

    const handleAddSkill = (index, e) => {
        const newSkill = e.target.value.trim();
        if (e.key === 'Enter' && newSkill !== '') {
            const updatedExperiences = [...formData];
            const skillList = newSkill.split(',').map((skill) => skill.trim()).filter(Boolean);
            updatedExperiences[index].skills = [
                ...new Set([...updatedExperiences[index].skills, ...skillList]),
            ];
            setFormData(updatedExperiences);
            e.target.value = ''; 
        }
    };

    const handleRemoveSkill = (index, skill) => {
        const updatedExperiences = [...formData];
        updatedExperiences[index].skills = updatedExperiences[index].skills.filter((s) => s !== skill);
        setFormData(updatedExperiences);
    };

    const handleAddJobExperience = () => {
        setFormData([
            ...formData,
            { jobTitle: '', companyName: '', employmentType: '', startDate: null, endDate: null, location: '', skills: [] },
        ]);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card className={classes.card}>
            <Typography variant="h5" gutterBottom>3. Experience Details</Typography>

                {formData.map((experience, index) => (
                    <Grid container spacing={2} className={classes.section} key={index}>
                        {/* Title */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                Title <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                required
                                value={experience.jobTitle || ''}
                                onChange={(e) => handleChange(index, 'jobTitle', e.target.value)}
                            />
                        </Grid>

                        {/* Company */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                Company <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                required
                                value={experience.companyName || ''}
                                onChange={(e) => handleChange(index, 'companyName', e.target.value)}
                            />
                        </Grid>

                        {/* Employment Type */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                Employment Type <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                select
                                required
                                value={experience.employmentType || ''}
                                onChange={(e) => handleChange(index, 'employmentType', e.target.value)}
                            >
                                <MenuItem value="" disabled>
                                    Select Employment Type
                                </MenuItem>
                                {employmentTypes.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Start Date */}
                        <Grid item xs={12} md={3}>
                            <Typography variant="body1">
                                Start Date <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <DatePicker
                                value={experience.startDate || null}
                                onChange={(date) => handleChange(index, 'startDate', date)}
                                renderInput={(params) => <TextField fullWidth required {...params} />}
                            />
                        </Grid>

                        {/* End Date */}
                        <Grid item xs={12} md={3}>
                            <Typography variant="body1">
                                End Date <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <DatePicker
                                value={experience.endDate || null}
                                onChange={(date) => handleChange(index, 'endDate', date)}
                                renderInput={(params) => <TextField fullWidth required {...params} />}
                            />
                        </Grid>

                        {/* Location */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                Location <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                required
                                value={experience.location || ''}
                                onChange={(e) => handleChange(index, 'location', e.target.value)}
                            />
                        </Grid>

                        {/* Skills */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                Skills <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                value={experience.skills.join(', ')}
                                onChange={(e) => handleAddSkill(index, e)}
                                onKeyDown={(e) => handleAddSkill(index, e)}
                                label="Enter Skill(s) and Press Enter"
                                variant="outlined"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {experience.skills.map((skill, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={skill}
                                                    className={classes.chip}
                                                    onDelete={() => handleRemoveSkill(index, skill)}
                                                    size="small"
                                                />
                                            ))}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                ))}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddJobExperience}
                    className={classes.addButton}
                >
                    Add More Job Experience
                </Button>
            </Card>
        </LocalizationProvider>
    );
};

export default EducationDetail;
