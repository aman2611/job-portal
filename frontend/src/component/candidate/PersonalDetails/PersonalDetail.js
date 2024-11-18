import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PersonalDetailsForm from './PersonalDetailsForm';
import ContactDetailsForm from './ContactDetailsForm';

const PersonalDetail = ({ formData, setFormData }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <PersonalDetailsForm formData={formData} setFormData={setFormData}/>
            <ContactDetailsForm formData={formData} setFormData={setFormData}/>
        </LocalizationProvider>
    );
};

export default PersonalDetail;
