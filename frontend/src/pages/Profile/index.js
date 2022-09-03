import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import * as Yup from "yup";

import { EditTextField, ReadOnlyTextField } from '../../components/TextfieldCustom';

import { getUser } from '../../components/getLocalStorage';
import { getBackendUrl } from '../../components/getUrl';
export default function Main() {
  const [userDetails, setUserDetails] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // console.log("user profile page");
    setUserDetails(getUser());

  }, []);

  const [open, setOpen] = React.useState(false);
  const handleOpenEditForm = () => {
    formik.values.firstName = userDetails.firstName;
    formik.values.lastName =  userDetails.lastName;
    formik.values.email = userDetails.email;
    formik.values.contactNo = userDetails.contactNo;
    formik.values.address = userDetails.address;
    // console.log(formik.values);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openDelete, setOpenDelete] = React.useState(false);
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const validations = Yup.object({
    firstName: Yup.string("Enter first name")
      .min(3, "Minimum 3 characters needed")
      .required("First name is required"),
    lastName: Yup.string("Enter first name")
      .min(3, "Minimum 3 characters needed")
      .required("First name is required"),
    email: Yup.string("Enter your email")
      .email("Enter valid email like abc@xyz.com")
      .required("Email is required"),
    contactNo: Yup.string("Enter your contact number")
      .matches(
        "^([+]{1}\\d{1}[\\s]|)\\d{3}[-]{1}\\d{3}[-]{1}\\d{4}$",
        "Enter valid contact number like 902-999-9999 or +1 902-999-9999"
      )
      .required("Contact number is required"),
    address: Yup.string("Enter address")
      .matches(
        "(([A-Za-z0-9 \\S]+),([A-Za-z0-9 ]+),([A-Za-z0-9 ]+),([A-Za-z0-9 ]+))",
        "Enter valid address like street name,City,Province,Canada"
      )
      .required("Address is required"),
  });

  // const notify = () => {
  //   toast.success("Your details updated successfully", {
  //     position: toast.POSITION.TOP_RIGHT,
  //   });
  // };

  const notify = (type, msg) => {
    if(type === 'success'){
        toast.success(
          msg,
          { position: toast.POSITION.TOP_RIGHT }
        );
        
    }else if(type === 'error'){
        toast.error(
          msg,
          { position: toast.POSITION.TOP_RIGHT }
        );

    }
  };

  const editProfileRequest = (values) => {
    // console.log(values);
    const editProfileUrl = getBackendUrl()+"/api/edit-profile";
    let body = {}
    body['_id'] = getUser()._id;
    body['user'] = values;
    // console.log(body);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json","access-token":localStorage.getItem("access-token") },
      body: JSON.stringify(body),
    };
    let statusCode;
    fetch(editProfileUrl, requestOptions)
      .then((response) => {
        statusCode = response.status;
        return response.json();
      })
      .then((result) => {
        if (statusCode === 500) {
          notify("error", result.message);
        } else {
          // console.log(result);
          localStorage.setItem('user',JSON.stringify(result.user));
          notify("success", result.message);
          window.location.replace("/my-account");
          handleClose();
        }
      })
      .catch((error) => console.log("error", error));
  };

  const deleteProfileRequest = (values) => {
    // console.log(values);
    const deleteProfileUrl = getBackendUrl()+"/api/delete-profile";
    let body = {}
    body['id'] = getUser()._id;
    // console.log(body);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json","access-token":localStorage.getItem("access-token") },
      body: JSON.stringify(body),
    };
    let statusCode;
    fetch(deleteProfileUrl, requestOptions)
      .then((response) => {
        statusCode = response.status;
        return response.json();
      })
      .then((result) => {
        if (statusCode === 500) {
          notify("error", result.message);
        } else {
          // console.log(result);
          localStorage.setItem('user',JSON.stringify(result.user));
          notify("success", result.message);
          localStorage.clear()
          localStorage.setItem("isLogin",false);
          window.location.replace("/");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const formik = useFormik({
    initialValues: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      contactNo: userDetails.contactNo,
      address: userDetails.address,
    },
    validationSchema: validations,
    onSubmit: (values) => {
      // alert(JSON.stringify(formik.values, null, 2));
      // console.log("Update profile");
      editProfileRequest(values);
    },
  });


  return (
    <Grid
      container
      maxWidth="lg"
      justifyContent="center"
      alignContent="center"
      sx={{ my: 4, mx: "auto" }}
      className="elevation-4"
    >
      <Grid item xs={12}>
        <Typography pt={2} align="center" variant="h5">
          User Profile
        </Typography>
        <hr className="hr-fancy1" />
      </Grid>
      <Grid item xl={4} lg={4} md={4} sm={4} xs={10} alignItems="center">
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Avatar alt={userDetails.firstName} src="#" className="profile-img" />
        </Box>
        {/*<img alt="complex" className="profile-img" src="https://source.unsplash.com/random/?portrait,men" />*/}
      </Grid>
      <Grid item xl={8} lg={8} md={8} sm={8} xs={10}>
        <Grid
          container
          rowSpacing={{ xs: 2, sm: 2, md: 0, lg: 0, xl: 0 }}
          columnSpacing={{ xs: 2, sm: 2, md: 0, lg: 0, xl: 0 }}
          sx={{ p: { xl: 2, lg: 2, md: 2, sm: 2, xs: "20px 0" } }}
        >
          <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
            <ReadOnlyTextField
              fullWidth
              label="First Name"
              variant="filled"
              defaultValue=" "
              value={userDetails.firstName}
            ></ReadOnlyTextField>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
            <ReadOnlyTextField
              fullWidth
              label="Last Name"
              variant="filled"
              defaultValue=" "
              value={userDetails.lastName}
            ></ReadOnlyTextField>
          </Grid>
          <Grid item xs={12}>
            <ReadOnlyTextField
              fullWidth
              label="Email"
              variant="filled"
              defaultValue=" "
              value={userDetails.email}
            ></ReadOnlyTextField>
          </Grid>
          <Grid item xs={12}>
            <ReadOnlyTextField
              fullWidth
              label="Contact No"
              variant="filled"
              defaultValue=" "
              value={userDetails.contactNo}
            ></ReadOnlyTextField>
          </Grid>
          <Grid item xs={12}>
            <ReadOnlyTextField
              fullWidth
              label="Address"
              variant="filled"
              defaultValue=" "
              value={userDetails.address}
            ></ReadOnlyTextField>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
            >
              <Button
                variant="contained"
                onClick={handleOpenEditForm}
                startIcon={<DriveFileRenameOutlineOutlinedIcon />}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenDelete}
                startIcon={<DeleteForeverOutlinedIcon />}
              >
                Delete Profile
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 2, sm: 2, md: 0, lg: 0, xl: 0 }}
            >
              <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                <EditTextField
                  name="firstName"
                  fullWidth
                  helperText={
                    formik.errors.firstName ? formik.errors.firstName : " "
                  }
                  error={Boolean(formik.errors.firstName)}
                  label="First Name"
                  type="text"
                  value={formik.values.firstName}
                  variant="filled"
                  onChange={formik.handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                <EditTextField
                  name="lastName"
                  fullWidth
                  helperText={
                    formik.errors.lastName ? formik.errors.lastName : " "
                  }
                  error={Boolean(formik.errors.lastName)}
                  label="Last Name"
                  type="text"
                  value={formik.values.lastName}
                  variant="filled"
                  onChange={formik.handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <EditTextField
                  name="email"
                  fullWidth
                  helperText={formik.errors.email ? formik.errors.email : " "}
                  error={Boolean(formik.errors.email)}
                  label="Email*"
                  type="email"
                  value={formik.values.email}
                  variant="filled"
                  placeholder="Enter your email"
                  InputProps={{
                    disableUnderline: true,
                    readonly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <EditTextField
                  name="contactNo"
                  fullWidth
                  helperText={
                    formik.errors.contactNo ? formik.errors.contactNo : " "
                  }
                  error={Boolean(formik.errors.contactNo)}
                  label="Contact Number*"
                  type="text"
                  value={formik.values.contactNo}
                  variant="filled"
                  placeholder="Enter your contact number"
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <EditTextField
                  name="address"
                  fullWidth
                  helperText={
                    formik.errors.address ? formik.errors.address : " "
                  }
                  error={Boolean(formik.errors.address)}
                  label="Address*"
                  type="text"
                  value={formik.values.address}
                  variant="filled"
                  placeholder="Enter your address"
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onSubmit={formik.handleSubmit}
              startIcon={<DriveFileRenameOutlineOutlinedIcon />}
              disabled={!formik.isValid}
            >
              Update
            </Button>
          </form>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-start", pl: "25px" }}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Profile</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the profile?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteProfileRequest();
            }}
            variant="contained"
            color="error"
            startIcon={<DeleteForeverOutlinedIcon />}
          >
            Delete
          </Button>
          <Button onClick={handleCloseDelete} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
