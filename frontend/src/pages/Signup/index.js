import { Card, Grid, Link } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Logo from "../../assets/images/Sportify.png";
import { hashText } from "../../components/encryptText";
import { getBackendUrl } from '../../components/getUrl';
import { SignupForm } from "./signupForm";

// cite : https://dev.to/finallynero/react-form-using-formik-material-ui-and-yup-2e8h
// I used some of the code from article, but I change as per my preferences

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
      "Enter valid contact number  902-999-9999 or +1 902-999-9999"
    )
    .required("Contact number is required"),
  password: Yup.string("")
    .min(8, "Minimum 8 characters needed for password")
    .matches("[a-z]", "Must contain one lowercase letter")
    .matches("[A-Z]", "Must contain one uppercase letter")
    .matches("[0-9]", "Must contain one number character")
    .matches(/[\W]/, "Must contain one special character")
    .max(25, "Maximum 25 characters allowed for password")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function InputForm(props) {
  const navigate = useNavigate();

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

  const signUpRequest = (values) => {
    // console.log(values);
    console.log(values.password);
    hashText(values.password).then((result) => {
      // values.password = result
      // console.log("hashed Password" + values.password);
      const requiredValues = (({ confirmPassword,password, ...restValues }) => restValues)(
        values
      );
      requiredValues['password'] = result;
      console.log(requiredValues);
      const signupUrl = getBackendUrl()+"/api/signup";
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requiredValues),
      };
      let statusCode;
      fetch(signupUrl, requestOptions)
        .then((response) => {
          statusCode = response.status;
          return response.json();
        })
        .then((result) => {
          if (statusCode === 500) {
            notify("error", result.message);
          } else {
            // console.log(result);
            notify("success", result.message);
            navigate("/login");
          }
        })
        .catch((error) => console.log("error", error));
    });

    
  };

  const values = {
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <React.Fragment>
      <Grid
        container
        id="signupPage"
        justifyContent="center"
        alignItems="center"
        className="loginSide1"
        sx={{ padding: "35px 0", minHeight: "100vh" }}
      >
        <Grid item xl={4} lg={5} md={7} sm={7} xs={11}>
          <Card sx={{ p: "1.5rem" }} elevation={5}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{ display: "flex", mb: "10px" }}
            >
              <img
                src={`${Logo}`}
                alt="Sportify"
                loading="lazy"
                className="logo-img"
              />
            </Typography>
            {/*<Divider variant="middle"></Divider>*/}
            <Typography
              align="center"
              variant="h4"
              fontWeight="medium"
              color="black"
              marginBottom="20px"
            >
              Signup
            </Typography>
            <Box sx={{ m: 4 }}></Box>
            <Formik
              initialValues={values}
              validationSchema={validations}
              onSubmit={(values) => {
                console.log(values);
                signUpRequest(values);
                // notify();
                // navigate('/login');
              }}
            >
              {(props) => <SignupForm {...props} />}
            </Formik>
            <Box
              component="div"
              sx={{
                mt: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Link
                display="flex"
                justifySelf="flex-start"
                marginBottom={1}
                href="/login"
                underline="none"
              >
                {"Already a member? Login"}
              </Link>
              <Link display="flex" marginBottom={1} href="/" underline="none">
                {"Back to Home"}
              </Link>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
