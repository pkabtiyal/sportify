import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import "./membership.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import Stack from '@mui/material/Stack';
import { getBackendUrl } from '../../components/getUrl';
import { getUser } from '../../components/getLocalStorage';


const steps = ['Billing Information', 'Review your order'];


const theme = createTheme();

export default function Checkout() {
  
  const user = getUser();
  const userId = user._id;

  const domain = getBackendUrl();
  const location = useLocation();
  const product = location.state.product;
  const [activeStep, setActiveStep] = React.useState(0);
  const navigate = useNavigate();
  const handleNext = () => {
    if (error === true || isEmptyForm() === true) {
      alert("Please fill the details to proceed.");
    }
    else {
      if (activeStep == 0) {
        setActiveStep(activeStep + 1);
      }
      if (activeStep === 1) {
        let is_bill_existing = location.state.is_bill_existing;
        const reqBody = {
          id:userId,
          first_name: firstName,
          last_name: lastName,
          address: address,
          city: city,
          zip_code: zip,
          country: country,
          state: state
        };
        let url = domain + "/api/membership/create-billing-info";
        let method = "post"
        if (is_bill_existing) {
          url = domain + '/api/membership/update-billing-info/'+userId;
          method = 'put'
        }
        let backendReqBody = [{
          'total_cost': +totalCost,
          'plan_name': product.name,
          'start_date': startDate,
          'end_date': endDate,
          'status': 'Ongoing'
        }]
        console.log("backendReqBody:");
        console.log(backendReqBody);
        localStorage.setItem('backendReqBody', JSON.stringify(backendReqBody))
        axios({
          method: method,
          url: url,
          data: reqBody
        }).then(res => {
          axios.post(domain + '/api/stripe/create-checkout-session', {
            backendReqBody,
            userId
          }).then((response) => {
            if (response.data.url) {
              window.location.href = response.data.url
            }
          }).catch((error) => console.log(error.message))
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/membership');
    }

    setActiveStep(activeStep - 1);
  };

  // start of billing

  const billing_info = location.state.billing_info;
  const [firstName, setFirstName] = useState(billing_info.first_name);
  const [lastName, setLastName] = useState(billing_info.last_name);
  const [address, setAddress] = useState(billing_info.address);
  const [zip, setZip] = useState(billing_info.zip_code);
  const [country, setCountry] = useState(billing_info.country);
  const [city, setCity] = useState(billing_info.city);
  const [state, setState] = useState(billing_info.state);

  const [error, setError] = useState(location.state.billing_error);

  const [formErrors, setFormErrors] = useState({ firstName: '', lastName: '', address: '', zip: '', city: '', state: '', country: '' });

  const handleValueChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    validateField(name, value);
  }

  const isEmptyForm = () => {
    return (
      firstName === undefined ||
      lastName === undefined ||
      address === undefined ||
      zip === undefined ||
      city === undefined ||
      state === undefined ||
      country === undefined)
  }

  const validateField = (fieldName, value) => {

    let updatedFormErrors = formErrors
    switch (fieldName) {
      case 'firstName':
        setFirstName(value);
        updatedFormErrors.firstName = '';
        if (value === '' || value == null) {
          updatedFormErrors.firstName = "Please provide first name";
        }
        else {
          let isNameValid = value.match(/^(?![\s.]+$)[a-zA-Z\s.]*$/i);
          updatedFormErrors.firstName = isNameValid ? '' : 'Invalid characters';
        }
        break;
      case 'lastName':
        setLastName(value);
        updatedFormErrors.lastName = '';
        if (value === '' || value == null) {
          updatedFormErrors.lastName = "Please provide last name";
        }
        else {
          let isNameValid = value.match(/^(?![\s.]+$)[a-zA-Z\s.]*$/i);
          updatedFormErrors.lastName = isNameValid ? '' : 'Invalid characters';
        }
        break;
      case 'address':
        setAddress(value);
        updatedFormErrors.address = '';
        if (value === '' || value == null) {
          updatedFormErrors.address = "Please provide address";
        }
        else {
          let isNameValid = value.match(/^\d+\s[A-z]+\s[A-z]+/g);
          updatedFormErrors.address = isNameValid ? '' : 'Invalid address';
        }
        break;
      case 'zip':
        setZip(value);
        updatedFormErrors.zip = '';
        if (value === '' || value == null) {
          updatedFormErrors.zip = "Please provide zip";
        }
        else {
          let isNameValid = value.match(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i);
          updatedFormErrors.zip = isNameValid ? '' : 'Invalid characters';
        }
        break;
      case 'city':
        setCity(value);
        updatedFormErrors.city = '';
        if (value === '' || value == null) {
          updatedFormErrors.city = "Please provide city";
        }
        else {
          let isNameValid = value.match(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/i);
          updatedFormErrors.city = isNameValid ? '' : 'Invalid characters';
        }
        break;
      case 'state':
        setState(value);
        updatedFormErrors.state = '';
        if (value === '' || value == null) {
          updatedFormErrors.state = "Please provide state";
        }
        else {
          let isNameValid = value.match(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/i);
          updatedFormErrors.state = isNameValid ? '' : 'Invalid characters';
        }
        break;
      case 'country':
        setCountry(value);
        updatedFormErrors.country = '';
        if (value === '' || value == null) {
          updatedFormErrors.country = "Please provide country";
        }
        break;
      default:
        break;
    }
    setFormErrors(updatedFormErrors);
    setError(false);
    for (let x in updatedFormErrors) {
      if (updatedFormErrors[x] !== '') {
        setError(true);
      }
    }
  }
  //end of billing

  //billing dates
  const getNumberOfDays = (start, end) => {

    const date1 = new Date(start);
    const date2 = new Date(end);

    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.round(diffInTime / oneDay) + 2;
    return diffInDays;
  }
  const calculateCost = (days) => {
    return ((product.price / 30) * 1.15 * days).toFixed(2);

  }

  const current = new Date();
  const [startDate, setStartDate] = React.useState(current);
  const [endDate, setEndDate] = React.useState(new Date(current.getFullYear(), current.getMonth() + 1, 0));
  const [days, setDays] = React.useState(getNumberOfDays(startDate, endDate));
  const [totalCost, setTotalCost] = React.useState(calculateCost(days));
  const handleStartDateChange = (val) => {
    let diff = getNumberOfDays(val, endDate);
    if (diff > 0) {
      setStartDate(val);
      setDays(diff);
      setTotalCost(calculateCost(diff));
    }
    else {
      alert("Start date cannot be after end date.");
      return false;
    }

  }
  const handleEndDateChange = (val) => {
    let diff = getNumberOfDays(startDate, val);
    if (diff > 0) {
      setEndDate(val);
      setDays(diff);
      setTotalCost(calculateCost(diff));
    }
    else {
      alert("End date cannot be before start date.");
      return false;
    }
  }

  //end

  return (
    <div className="backgroundClassPricing">
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your purchase.
                  </Typography>
                  <Typography variant="subtitle1">
                    Your order number is #2001539. We have emailed your membership
                    confirmation.
                  </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {activeStep === 0 ?
                    <React.Fragment>
                      <Typography variant="h6" gutterBottom>
                        Billing Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            id="firstName"
                            name="firstName"
                            label="First name"
                            fullWidth
                            autoComplete="given-name"
                            variant="standard"
                            value={firstName}
                            onChange={handleValueChange}
                          />
                          <span className='spanText' id='firstNameSpan'>{formErrors.firstName}</span>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            id="lastName"
                            name="lastName"
                            label="Last name"
                            fullWidth
                            autoComplete="family-name"
                            variant="standard"
                            value={lastName}
                            onChange={handleValueChange}
                          />
                          <span className='spanText' id='lastNameSpan'>{formErrors.lastName}</span>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            id="address"
                            name="address"
                            label="Address"
                            fullWidth
                            autoComplete="shipping address-line1"
                            variant="standard"
                            value={address}
                            onChange={handleValueChange}
                          />
                          <span className='spanText' id='addressSpan'>{formErrors.address}</span>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            id="city"
                            name="city"
                            label="City"
                            fullWidth
                            autoComplete="shipping address-level2"
                            variant="standard"
                            value={city}
                            onChange={handleValueChange}
                          />
                          <span className='spanText' id='citySpan'>{formErrors.city}</span>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            id="state"
                            name="state"
                            label="State/Province/Region"
                            fullWidth
                            variant="standard"
                            value={state}
                            onChange={handleValueChange}
                          />
                          <span className='spanText' id='stateSpan'>{formErrors.state}</span>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            id="zip"
                            name="zip"
                            label="Zip / Postal code"
                            fullWidth
                            autoComplete="shipping postal-code"
                            variant="standard"
                            value={zip}
                            onChange={handleValueChange}
                          />
                          <span className='spanText' id='zipSpan'>{formErrors.zip}</span>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            id="country"
                            name="country"
                            label="Country"
                            fullWidth
                            autoComplete="shipping country"
                            variant="standard"
                            value={country}
                            onChange={handleValueChange}
                          />
                          <span className='spanText' id='countrySpan'>{formErrors.country}</span>
                        </Grid>
                        {/* <Grid item xs={12}>
                              <FormControlLabel
                                  control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
                                  label="Use this address for payment details"
                              />
                              </Grid> */}
                      </Grid>
                    </React.Fragment>
                    :
                    <React.Fragment>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack spacing={2}>
                          <DesktopDatePicker
                            label="Start Date"
                            inputFormat="MM/dd/yyyy"
                            value={startDate}
                            onChange={handleStartDateChange}
                            renderInput={(params) => <TextField {...params} />}
                          />
                          <DesktopDatePicker
                            label="End Date"
                            inputFormat="MM/dd/yyyy"
                            value={endDate}
                            onChange={handleEndDateChange}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Stack>

                      </LocalizationProvider>
                      <br />
                      <Typography variant="h6" gutterBottom>
                        Order Summary
                      </Typography>
                      <List disablePadding>
                        <ListItem key={product.name} maxWidth="sm" >
                          <ListItemText primary={product.name} maxWidth="xs" secondary={product.desc} />
                          <Typography variant="body2">${product.price}/mo</Typography>
                        </ListItem>

                        <ListItem >
                          <ListItemText primary="Total Amount" />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {totalCost}
                          </Typography>
                        </ListItem>
                      </List>
                      <br />
                      <Typography variant="h6" >
                        Billing Details
                      </Typography>
                      <List disablePadding>
                        <ListItem key={firstName + " " + lastName} maxWidth="sm" >
                          <ListItemText primary={firstName + " " + lastName} maxWidth="sm" secondary={address + ", " + city + ", " + state + ", " + country + ", " + zip} />
                        </ListItem>
                      </List>
                      {/* // <Grid container spacing={2}>
                      //     <Grid item xs={12} sm={6}>
                          
                      //     <Typography gutterBottom>{firstName} {lastName}</Typography>
                      //     <Typography gutterBottom>{address} {city} {state} {country} {zip}</Typography>
                      //     </Grid>
                      // </Grid> */}



                    </React.Fragment>
                  }


                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {activeStep >= 0 && (
                      <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                        Back
                      </Button>
                    )}

                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 3, ml: 1 }}
                    >
                      {activeStep === steps.length - 1 ? 'Proceed to pay' : 'Proceed to review'}
                    </Button>
                  </Box>
                </React.Fragment>
              )}
            </React.Fragment>
          </Paper>
        </Container>
      </ThemeProvider>
    </div>

  );
}