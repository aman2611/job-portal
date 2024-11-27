import React, { useState, useEffect } from 'react';
import {
    Card,
    TextField,
    Typography,
    Grid,
    MenuItem,
    InputAdornment,
    Chip,
    IconButton,
    CardContent,
    Button
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { makeStyles } from '@mui/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormData } from '../Profile';

const useStyles = makeStyles((theme) => ({
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBlock: theme.spacing(3),
    },
    card: {
        padding: theme.spacing(3),
        margin: theme.spacing(4),
    },
    experienceHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
    },
    section: {
        marginBottom: theme.spacing(4),
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    buttonGroup: {
        display: 'flex',
        gap: theme.spacing(1),
    },
    deleteButton: {
        color: theme.palette.error.main,
    }
}));

const employmentTypes = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Contract', label: 'Contract' },
];

const emptyExperience = {
    companyName: '',
    employmentType: '',
    startDate: null,
    endDate: null,
    location: '',
    skills: [],
};

const ExperienceDetail = () => {
    const classes = useStyles();
    const { formData, setFormData } = useFormData();
    const [experiences, setExperiences] = useState([]);

    // Update experiences based on formData when it is loaded
    useEffect(() => {
        if (formData.experiences) {
            setExperiences(formData.experiences);
        } else {
            setExperiences([emptyExperience]); // Fallback to empty experience if no data
        }
    }, [formData]);

    const handleChange = (index, name, value) => {
        const updatedExperiences = [...experiences];
        updatedExperiences[index] = {
            ...updatedExperiences[index],
            [name]: value,
        };
        setFormData({ ...formData, experiences: updatedExperiences });
    };

    const handleAddSkill = (index, e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            const updatedExperiences = [...experiences];
            const newSkill = e.target.value.trim();
            updatedExperiences[index] = {
                ...updatedExperiences[index],
                skills: [...new Set([...updatedExperiences[index].skills, newSkill])],
            };
            setFormData({ ...formData, experiences: updatedExperiences });
            e.target.value = '';
        }
    };

    const handleRemoveSkill = (index, skillToRemove) => {
        const updatedExperiences = [...experiences];
        updatedExperiences[index] = {
            ...updatedExperiences[index],
            skills: updatedExperiences[index].skills.filter((skill) => skill !== skillToRemove),
        };
        setFormData({ ...formData, experiences: updatedExperiences });
    };

    const addNewExperience = () => {
        setExperiences([...experiences, { ...emptyExperience }]);
    };

    const removeExperience = (indexToRemove) => {
        if (experiences.length > 1) {
            const updatedExperiences = experiences.filter((_, index) => index !== indexToRemove);
            setExperiences(updatedExperiences);
            setFormData({ ...formData, experiences: updatedExperiences });
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card>
                <CardContent className={classes.headerContainer}>
                    <Typography variant="h5">3. Experience Details</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={addNewExperience}
                    >
                        <AddCircleOutlineIcon />
                    </Button>
                </CardContent>

                {experiences.map((experience, index) => (
                    <Card key={index} className={classes.card}>
                        <div className={classes.experienceHeader}>
                            <Typography variant="h6">Experience {index + 1}</Typography>
                            {experiences.length > 1 && (
                                <IconButton
                                    className={classes.deleteButton}
                                    onClick={() => removeExperience(index)}
                                    size="small"
                                >
                                    <DeleteOutlineIcon />
                                </IconButton>
                            )}
                        </div>

                        <Grid container spacing={3}>
                            {/* Company Name */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Company Name"
                                    required
                                    fullWidth
                                    value={experience.companyName}
                                    onChange={(e) => handleChange(index, 'companyName', e.target.value)}
                                />
                            </Grid>

                            {/* Employment Type */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    label="Employment Type"
                                    required
                                    fullWidth
                                    value={experience.employmentType}
                                    onChange={(e) => handleChange(index, 'employmentType', e.target.value)}
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
                                <DatePicker
                                    label="Start Date"
                                    value={experience.startDate}
                                    onChange={(date) => handleChange(index, 'startDate', date)}
                                    renderInput={(params) => (
                                        <TextField {...params} required fullWidth />
                                    )}
                                />
                            </Grid>

                            {/* End Date */}
                            <Grid item xs={12} md={6}>
                                <DatePicker
                                    label="End Date"
                                    value={experience.endDate}
                                    onChange={(date) => handleChange(index, 'endDate', date)}
                                    renderInput={(params) => (
                                        <TextField {...params} required fullWidth />
                                    )}
                                />
                            </Grid>

                            {/* Location */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Location"
                                    required
                                    fullWidth
                                    value={experience.location}
                                    onChange={(e) => handleChange(index, 'location', e.target.value)}
                                />
                            </Grid>

                            {/* Skills */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Skills (Press Enter to add)"
                                    fullWidth
                                    onKeyDown={(e) => handleAddSkill(index, e)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {experience.skills.map((skill, skillIndex) => (
                                                    <Chip
                                                        key={skillIndex}
                                                        label={skill}
                                                        onDelete={() => handleRemoveSkill(index, skill)}
                                                        size="small"
                                                        className={classes.chip}
                                                    />
                                                ))}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Card>
                ))}
            </Card>
        </LocalizationProvider>
    );
};

export default ExperienceDetail;
