import React from 'react';
import { Card, TextField, Typography, Grid, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useFormData } from '../Profile'; // Import the custom hook to access context

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(4),
    margin: theme.spacing(4),
    marginTop: theme.spacing(8),
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  heading: {
    marginBottom: theme.spacing(4),
  },
  labelInput: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const EducationDetail = () => {
  const classes = useStyles();
  const { formData, setFormData } = useFormData();

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const yearOptions = Array.from({ length: 2024 - 1924 + 1 }, (_, i) => 2024 - i);

  return (
    <Card className={classes.card}>
      <Typography variant="h5" gutterBottom>2. Education Details</Typography>

      {/* Class X */}
      <Card className={classes.card}>
        <Grid container spacing={2} className={classes.section}>
          <Grid item xs={12} style={{ paddingLeft: '0px' }} sx={{ backgroundColor: '#f5f5f5', padding: 1 }}>
            <Typography variant="h6" className={classes.heading}>
              Class X
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">School <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                required
                value={formData.schoolName10th}
                onChange={(e) => handleChange('schoolName10th', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Board <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                required
                value={formData.boardName10th}
                onChange={(e) => handleChange('boardName10th', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Year of Passing <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                select
                required
                value={formData.yop10th || ''}
                onChange={(e) => handleChange('yop10th', e.target.value)}
              >
                <MenuItem value="" disabled>
                  Year
                </MenuItem>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Percentage/CGPA <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                value={formData.percentage10th}
                onChange={(e) => handleChange('percentage10th', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>

      {/* Class XII */}
      <Card className={classes.card}>
        <Grid container spacing={2} className={classes.section}>
          <Grid item xs={12} style={{ paddingLeft: '0px' }} sx={{ backgroundColor: '#f5f5f5', padding: 1 }}>
            <Typography variant="h6" className={classes.heading}>
              Class XII
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">School <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                required
                value={formData.schoolName12th}
                onChange={(e) => handleChange('schoolName12th', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Board <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                required
                value={formData.boardName12th}
                onChange={(e) => handleChange('boardName12th', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Year of Passing <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                select
                required
                value={formData.yop12th || ''}
                onChange={(e) => handleChange('yop12th', e.target.value)}
              >
                <MenuItem value="" disabled>
                  Year
                </MenuItem>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Percentage/CGPA <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                value={formData.percentage12th}
                onChange={(e) => handleChange('percentage12th', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>

      {/* Graduation */}
      <Card className={classes.card}>
        <Grid container spacing={2} className={classes.section}>
          <Grid item xs={12} style={{ paddingLeft: '0px' }} sx={{ backgroundColor: '#f5f5f5', padding: 1 }}>
            <Typography variant="h6" className={classes.heading}>
              Graduation
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">University <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                required
                value={formData.universityGrad}
                onChange={(e) => handleChange('universityGrad', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Degree <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                required
                value={formData.degreeGrad}
                onChange={(e) => handleChange('degreeGrad', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Major <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                value={formData.majorGrad}
                onChange={(e) => handleChange('majorGrad', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Year of Passing <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                select
                required
                value={formData.yopGrad || ''}
                onChange={(e) => handleChange('yopGrad', e.target.value)}
              >
                <MenuItem value="" disabled>
                  Year
                </MenuItem>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Percentage/CGPA <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                value={formData.percentageGrad}
                onChange={(e) => handleChange('percentageGrad', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>

      {/* Post Graduation */}
      <Card className={classes.card}>
        <Grid container spacing={2} className={classes.section}>
          <Grid item xs={12} style={{ paddingLeft: '0px' }} sx={{ backgroundColor: '#f5f5f5', padding: 1 }}>
            <Typography variant="h6" className={classes.heading}>
              Post Graduation
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">University <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                value={formData.universityPG}
                onChange={(e) => handleChange('universityPG', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Degree <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                value={formData.degreePG}
                onChange={(e) => handleChange('degreePG', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Major <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                value={formData.majorPG}
                onChange={(e) => handleChange('majorPG', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Year of Passing <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                select
                required
                value={formData.yopPG || ''}
                onChange={(e) => handleChange('yopPG', e.target.value)}
              >
                <MenuItem value="" disabled>
                  Year
                </MenuItem>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Percentage/CGPA <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                fullWidth
                value={formData.percentagePG}
                onChange={(e) => handleChange('percentagePG', e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Card>
  );
};

export default EducationDetail;
