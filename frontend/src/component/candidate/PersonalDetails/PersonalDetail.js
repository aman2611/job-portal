import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PersonalDetailsForm from './PersonalDetailsForm';
import ContactDetailsForm from './ContactDetailsForm';
import { useFormData } from '../Profile'; 

const PersonalDetail = () => {
  const { formData, setFormData } = useFormData(); 

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
      <PersonalDetailsForm formData={formData} setFormData={setFormData} />
      <ContactDetailsForm formData={formData} setFormData={setFormData} />
    </LocalizationProvider>
  );
};

export default PersonalDetail;
