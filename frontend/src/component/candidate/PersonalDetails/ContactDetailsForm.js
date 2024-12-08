import React from 'react';
import { Card, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { makeStyles } from '@mui/styles';

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

const ContactDetailsForm = ({ formData, setFormData }) => {
    const classes = useStyles();

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSameAddressChange = (event) => {
        const checked = event.target.checked;
        setFormData(prev => ({
            ...prev,
            sameCorrespondenceAddress: checked,
            correspondenceAddress: checked ? prev.permanentAddress : '',
            correspondenceCity: checked ? prev.permanentCity : '',
            correspondenceState: checked ? prev.permanentState : '',
            correspondencePincode: checked ? prev.permanentPincode : ''
        }));
    };

    const states = [
        "Andaman & Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli", "Daman & Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Pondicherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "Uttaranchal", "West Bengal"
    ];

    return (
        <Card className={classes.card}>
            <Typography variant="h6" gutterBottom>Contact Details</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">Email <span style={{ color: 'red' }}>*</span></Typography>
                    <TextField
                        fullWidth
                        required
                        value={formData.email}
                        disabled 
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">Mobile <span style={{ color: 'red' }}>*</span></Typography>
                    <TextField
                        fullWidth
                        required
                        value={formData.mobile}
                        onChange={(e) => handleChange('mobile', e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">Alternate Email</Typography>
                    <TextField
                        fullWidth
                        value={formData.alternateCandidateEmail}
                        onChange={(e) => handleChange('alternateCandidateEmail', e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">Office Telephone No</Typography>
                    <TextField
                        fullWidth
                        value={formData.officeTelephone}
                        onChange={(e) => handleChange('officeTelephone', e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} className="col-span-full">
                    <Typography variant="h6" sx={{ backgroundColor: '#fff7ed', padding: 1 }}>
                        Permanent Address
                    </Typography>
                </Grid>
                <Grid item xs={12} className="col-span-full">
                    <Typography variant="body1">Address <span style={{ color: 'red' }}>*</span></Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        required
                        value={formData.permanentAddress}
                        onChange={(e) => handleChange('permanentAddress', e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">City <span style={{ color: 'red' }}>*</span></Typography>
                    <TextField
                        fullWidth
                        required
                        value={formData.permanentCity}
                        onChange={(e) => handleChange('permanentCity', e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                        State <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <FormControl fullWidth>
                        {formData.permanentState === '' && (
                            <InputLabel>State</InputLabel>
                        )}
                        <Select
                            required
                            value={formData.permanentState}
                            onChange={(e) => handleChange('permanentState', e.target.value)}
                            disabled={formData.sameCorrespondenceAddress}
                            label="State"
                        >
                            {states.map((state) => (
                                <MenuItem key={state} value={state}>
                                    {state}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="body1">Pincode <span style={{ color: 'red' }}>*</span></Typography>
                    <TextField
                        fullWidth
                        required
                        value={formData.permanentPincode}
                        onChange={(e) => handleChange('permanentPincode', e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} className="col-span-full">
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ backgroundColor: '#fff7ed', padding: 1 }}>
                        <Typography variant="h6">Correspondence Address</Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    required
                                    checked={formData.sameCorrespondenceAddress}
                                    onChange={handleSameAddressChange}
                                    name="sameCorrespondenceAddress"
                                />
                            }
                            label="Same Address"
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} className="col-span-full">
                    <Typography variant="body1">Address <span style={{ color: 'red' }}>*</span></Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={formData.correspondenceAddress}
                        onChange={(e) => handleChange('correspondenceAddress', e.target.value)}
                        disabled={formData.sameCorrespondenceAddress}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">City <span style={{ color: 'red' }}>*</span></Typography>
                    <TextField
                        fullWidth
                        required
                        value={formData.correspondenceCity}
                        onChange={(e) => handleChange('correspondenceCity', e.target.value)}
                        disabled={formData.sameCorrespondenceAddress}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                        State <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <FormControl fullWidth>
                        {formData.correspondenceState === '' && (
                            <InputLabel>State</InputLabel>
                        )}
                        <Select
                            value={formData.correspondenceState}
                            onChange={(e) => handleChange('correspondenceState', e.target.value)}
                            disabled={formData.sameCorrespondenceAddress}
                            label="State"  
                        >
                            {states.map((state) => (
                                <MenuItem key={state} value={state}>
                                    {state}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="body1">Pincode <span style={{ color: 'red' }}>*</span></Typography>
                    <TextField
                        fullWidth
                        required
                        value={formData.correspondencePincode}
                        onChange={(e) => handleChange('correspondencePincode', e.target.value)}
                        disabled={formData.sameCorrespondenceAddress}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default ContactDetailsForm;
