import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';


const theme = createTheme();

export default function Checkout() {

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [error, setError] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phonenumber: "",
    country: "",
    emailid: ""
  })


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [open, setOpen] = useState(false)

  const handleClick = (e) => {
    const tempError = validate(formData)
    setError(tempError)
    if (Object.keys(tempError).length === 0) {
      setOpen(true)
    }
  };



  const handleClose = (e) => {
    setOpen(false)
  }

  const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const regex_phonenumber = /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const regex_zip = /[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
  const regex_name = /^[A-Z]{2,}$/i

  const validate = (values) => {
    const Formerrors = {};
    if (!values.firstName) {
      Formerrors.firstName = "First Name cannot be empty!";
    }
    else if (!regex_name.test(values.firstName)) {
      Formerrors.firstName = "Enter a valid First Name!"
    }
    if (!values.lastName) {
      Formerrors.lastName = "Last Name cannot be empty!";
    }
    else if (!regex_name.test(values.lastName)) {
      Formerrors.lastName = "Enter a valid Last Name!"
    }
    if (!values.address1) {
      Formerrors.address1 = "Address cannot be empty!";
    }
    if (!values.lastName) {
      Formerrors.city = "City cannot be empty!";
    }
    if (!values.state) {
      Formerrors.state = "State cannot be empty!";
    }
    if (!values.zip) {
      Formerrors.zip = "Zip code cannot be empty!";
    }
    else if (!regex_zip.test(values.zip)) {
      Formerrors.zip = "Enter a valid zip code!"
    }
    if (!values.phonenumber) {
      Formerrors.phonenumber = "Phone Number cannot be empty!";
    }
    else if (!regex_phonenumber.test(values.phonenumber)) {
      Formerrors.phonenumber = "Enter a valid phone number!";
    }
    if (!values.country) {
      Formerrors.country = "Country cannot be empty!";
    }
    if (!values.emailid) {
      Formerrors.emailid = "Email id cannot be empty!";
    }
    else if (!regex_email.test(values.emailid)) {
      Formerrors.emailid = "Enter a valid email format!";
    }
    return Formerrors;
  };

  return (
    <div style={{
      backgroundImage: `url(${process.env.PUBLIC_URL + '/background.jpeg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed'
    }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
          position="absolute"
          color="default"
          elevation={0}
          sx={{
            position: 'relative',
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              SPORTSIUM
            </Typography>
          </Toolbar>
        </AppBar>
        <form onSubmit={handleClick}>
          <Container component="main" maxWidth="md">
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
              <Typography component="h1" variant="h4" align="center">
                Checkout
              </Typography>
              <React.Fragment>
                <Typography variant="h4" gutterBottom>
                  Shipping address
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="firstName"
                      name="firstName"
                      label="First name"
                      fullWidth
                      variant="outlined"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{error.firstName}</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="lastName"
                      name="lastName"
                      label="Last name"
                      fullWidth
                      variant="outlined"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{error.lastName}</p>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="address1"
                      name="address1"
                      label="Address line 1"
                      fullWidth
                      variant="outlined"
                      value={formData.address1}
                      onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{error.address1}</p>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="address2"
                      name="address2"
                      label="Address line 2"
                      fullWidth
                      variant="outlined"
                      value={formData.address2}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="city"
                      name="city"
                      label="City"
                      fullWidth
                      variant="outlined"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{error.city}</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="state"
                      name="state"
                      label="State/Province/Region"
                      fullWidth
                      variant="outlined"
                      value={formData.state}
                      onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{error.state}</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="zip"
                      name="zip"
                      label="Zip / Postal code"
                      fullWidth
                      variant="outlined"
                      value={formData.zip}
                      onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{error.zip}</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="country"
                      name="country"
                      label="Country"
                      fullWidth
                      variant="outlined"
                      value={formData.country}
                      onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{error.country}</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="phonenumber"
                      name="phonenumber"
                      label="Phone number (xxx)xxx-xxxx "
                      fullWidth
                      variant="outlined"
                      value={formData.phonenumber}
                      onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{error.phonenumber}</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="emailid"
                      name="emailid"
                      label="Email id"
                      fullWidth
                      variant="outlined"
                      value={formData.emailid}
                      onChange={handleChange}
                    />
                    <p style={{ color: "red" }}>{error.emailid}</p>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
                      label="Use this address for payment details"
                    />
                  </Grid>
                </Grid>
              </React.Fragment>
              <Button
                variant="contained"
                onClick={handleClick}
                sx={{ mt: 3, ml: 1 }}
              >Submit
              </Button>
            </Paper>
          </Container>
        </form>
      </ThemeProvider>


      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog"
      >
        <DialogTitle>{"Shipping Details Submitted"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="shipping-alert">
            Success
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}