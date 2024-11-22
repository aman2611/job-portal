import React from 'react';
import { Card, TextField, Typography, Grid, MenuItem, InputAdornment, Chip, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormData } from '../Profile';  // Importing the custom hook

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

const ExperienceDetail = () => {
    const classes = useStyles();
    const { formData, setFormData } = useFormData(); 

    const handleChange = (name, value) => {
        setFormData({ ...formData, experience: { ...formData.experience, [name]: value } });
    };

    const handleAddSkill = (e) => {
        const newSkill = e.target.value.trim();
        if (e.key === 'Enter' && newSkill !== '') {
            setFormData({
                ...formData,
                experience: {
                    ...formData.experience,
                    skills: [...new Set([...formData.experience.skills, newSkill])],
                },
            });
            e.target.value = '';
        }
    };

    const handleRemoveSkill = (skill) => {
        setFormData({
            ...formData,
            experience: {
                ...formData.experience,
                skills: formData.experience.skills.filter((s) => s !== skill),
            },
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card className={classes.card}>
                <Typography variant="h5" gutterBottom>3. Experience Details</Typography>

                {/* Company Name */}
                <Grid container spacing={2} className={classes.section}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                            Company Name <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            required
                            value={formData.experience.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
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
                            value={formData.experience.employmentType}
                            onChange={(e) => handleChange('employmentType', e.target.value)}
                        >
                            <MenuItem value="" disabled>Select Employment Type</MenuItem>
                            {employmentTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Start Date */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                            Start Date <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <DatePicker
                            value={formData.experience.startDate || null}
                            onChange={(date) => handleChange('startDate', date)}
                            renderInput={(params) => <TextField fullWidth required {...params} />}
                        />
                    </Grid>

                    {/* End Date */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                            End Date <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <DatePicker
                            value={formData.experience.endDate || null}
                            onChange={(date) => handleChange('endDate', date)}
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
                            value={formData.experience.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                        />
                    </Grid>

                    {/* Skills */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                            Skills <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            value={formData.experience.skills.join(', ')}
                            onChange={handleAddSkill}
                            onKeyDown={handleAddSkill}
                            label="Enter Skill(s) and Press Enter"
                            variant="outlined"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {formData.experience.skills.map((skill, idx) => (
                                            <Chip
                                                key={idx}
                                                label={skill}
                                                className={classes.chip}
                                                onDelete={() => handleRemoveSkill(skill)}
                                                size="small"
                                            />
                                        ))}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </Card>
        </LocalizationProvider>
    );
};

export default ExperienceDetail;
