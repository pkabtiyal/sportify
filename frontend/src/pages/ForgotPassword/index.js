import { Card, Grid, Link } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Logo from "../../assets/images/Sportify.png";
import { getBackendUrl } from "../../components/getUrl";
import { ForgotPasswordForm } from "./forgotPasswordForm";
// import verifiedImage from "./public/MailConfirmed.svg";
const validations = Yup.object({
  email: Yup.string("Enter your email")
  .email("Enter valid email like abc@xyz.com")
  .required("Email is required")
});

export default function InputForm(props) {

  const notify = () => {
      toast.success("Password Reset Request Successfully. Check your mail.",{position: toast.POSITION.TOP_RIGHT});
  }

  const passwordResetRequest = (values) => {
    console.log(values);
    const signupUrl = getBackendUrl()+"/api/reset-password";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
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
          console.log(result);
          notify("success", result.message);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const values = {email:""};
      return (
          <React.Fragment>
              <Grid container id="loginPage"
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                    className="loginSide1">
                  <Grid item xl={3} lg={4} md={5} sm={7} xs={11}>
                      <Card sx={{p:'1.5rem'}} elevation={5}>
                      <Typography
                          variant="h6"
                          noWrap
                          component="a"
                          href="/"
                          sx={{display:'flex',mb:'10px'}}
                      >
                          <img
                              src={`${Logo}`}
                              alt="Sportify"
                              loading="lazy"
                              className="logo-img"
                          />
                      </Typography>
                          {/*<Divider variant="middle"></Divider>*/}
                          <Typography align="center"
                                      variant="h4"
                                      fontWeight='medium'
                                      color="black" marginBottom="20px">
                              Reset Password
                          </Typography>
                          <Box sx={{m: 4}}></Box>
                          <Formik initialValues={values}
                                  validationSchema={validations}
                                  onSubmit={(values) => {
                                      console.log(values);
                                      passwordResetRequest(values);
                                  }}>
                              {(props) => (<ForgotPasswordForm {...props} />)}
                          </Formik>
                      <Box component="div"
                           sx={{mt: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                          <Link display='flex' justifySelf='flex-start' marginBottom={1} href="/login" underline="none">
                              {'Back to login'}
                          </Link>

                          <Link display='flex' marginBottom={1} href="/" underline="none">
                              {'Back to Home'}
                          </Link>
                      </Box>
                      </Card>
                  </Grid>
              </Grid>
          </React.Fragment>
      );
}


