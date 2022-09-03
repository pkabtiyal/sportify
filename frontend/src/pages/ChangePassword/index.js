import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Button, Card, Grid, InputAdornment, Link } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Logo from "../../assets/images/Sportify.png";
import { hashText } from "../../components/encryptText";
import { getBackendUrl } from "../../components/getUrl";
import { ValidationTextField } from "../../components/TextfieldCustom";
// cite : https://dev.to/finallynero/react-form-using-formik-material-ui-and-yup-2e8h
// I used some of the code from article, but I change as per my preferences

const validations = Yup.object({
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
  const [isVerified, setIsVerified] = useState(null);
  const queryParams = new URLSearchParams(window.location.search);
  console.log(queryParams.get("token"));
  const token = queryParams.get("token");

  const verifyUrl = getBackendUrl() + "/api/change-password?token=" + token;
  const requestOptions = {
    method: "GET",
  };
  //   const notify = () => {
  //     toast.success("Password Changed Successfully", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   };

  const notify = (type, msg) => {
    if (type === "success") {
      toast.success(msg, { position: toast.POSITION.TOP_RIGHT });
    } else if (type === "error") {
      toast.error(msg, { position: toast.POSITION.TOP_RIGHT });
    } else if (type === "warn") {
      toast.error(msg, { position: toast.POSITION.TOP_RIGHT });
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let statusCode;
    fetch(verifyUrl, requestOptions)
      .then((response) => {
        statusCode = response.status;
        return response.json();
      })
      .then((result) => {
        console.log(statusCode);
        if (statusCode === 200) {
          console.log(result);
          setIsVerified(true);
          formik.values.email = result.mail;
          notify("success", result.message);
        } else if (statusCode === 404) {
          console.log(result);
          formik.values.email = " ";
          setIsVerified(false);
          notify("warn", result.message);
        } else {
          formik.values.email = " ";
          setIsVerified(false);
          notify("error", result.message);
        }
      })
      .catch((error) => console.log("error", error));
  }, []);

  const changePasswordRequest = (values) => {
    console.log(values);
    console.log(isVerified);
    const editPasswordUrl = getBackendUrl() + "/api/change-password";
    let body = {};

    body["email"] = formik.values.email;
    hashText(formik.values.password).then((result) => {
      // values.password = result
      // console.log("hashed Password" + values.password);
      body["password"] = result;
      console.log(body);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };
      let statusCode;
      fetch(editPasswordUrl, requestOptions)
        .then((response) => {
          statusCode = response.status;
          return response.json();
        })
        .then((result) => {
          if (statusCode === 500 || statusCode === 404) {
            notify("error", result.message);
          } else {
            console.log(result);
            notify("success", result.message);
            window.location.replace("/login");
          }
        })
        .catch((error) => console.log("error", error));
    });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validations,
    onSubmit: (values) => {
      // alert(JSON.stringify(formik.values, null, 2));
      console.log("Change Password");
      changePasswordRequest(values);
    },
  });

  const [visiblePassword, setVisiblePassword] = useState(false);
  const showPassword = () => setVisiblePassword(!visiblePassword);
  const hiddenPassword = () => setVisiblePassword(!visiblePassword);

  const [visibleCPassword, setVisibleCPassword] = useState(false);
  const showCPassword = () => setVisibleCPassword(!visibleCPassword);
  const hiddenCPassword = () => setVisibleCPassword(!visibleCPassword);

  const values = { email: "", password: "", confirmPassword: "" };
  return (
    <React.Fragment>
      <Grid
        container
        id="loginPage"
        height="100%"
        justifyContent="center"
        alignItems="center"
        className="loginSide1"
      >
        <Grid item xl={3} lg={4} md={5} sm={7} xs={11}>
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
              Change Password
            </Typography>
            <Box sx={{ m: 4 }}></Box>

            <form onSubmit={formik.handleSubmit}>
              <ValidationTextField
                name="email"
                helperText={formik.errors.email ? formik.errors.email : " "}
                error={Boolean(formik.errors.email)}
                label="Email*"
                type="email"
                value={formik.values.email}
                variant="filled"
                placeholder="Enter your email"
                InputProps={{
                  // <-- This is where the toggle button is added.
                  disableUnderline: true,
                  readonly: true,
                }}
              />

              <ValidationTextField
                name="password"
                disabled={!isVerified}
                helperText={
                  formik.errors.password ? formik.errors.password : " "
                }
                error={Boolean(formik.errors.password)}
                label="Password*"
                type={visiblePassword ? "text" : "password"}
                value={formik.values.password}
                variant="filled"
                placeholder="Enter your password"
                sx={{ marginBottom: "1px" }}
                InputProps={{
                  // <-- This is where the toggle button is added.
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle show password"
                        onClick={showPassword}
                        onMouseDown={hiddenPassword}
                      >
                        {visiblePassword ? (
                          <VisibilityOutlinedIcon />
                        ) : (
                          <VisibilityOffOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
              />
              <ValidationTextField
                name="confirmPassword"
                disabled={!isVerified}
                helperText={
                  formik.errors.confirmPassword
                    ? formik.errors.confirmPassword
                    : " "
                }
                error={Boolean(formik.errors.confirmPassword)}
                label="Confirm Password*"
                type={visibleCPassword ? "text" : "password"}
                value={formik.values.confirmPassword}
                variant="filled"
                placeholder="Enter your password again"
                sx={{ marginBottom: "1px" }}
                InputProps={{
                  // <-- This is where the toggle button is added.
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle show password"
                        onClick={showCPassword}
                        onMouseDown={hiddenCPassword}
                      >
                        {visibleCPassword ? (
                          <VisibilityOutlinedIcon />
                        ) : (
                          <VisibilityOffOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className="flex-center"
                startIcon={<LockResetOutlinedIcon />}
                disabled={!formik.isValid}
              >
                Reset Password
              </Button>
            </form>
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
                {"Back to login"}
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
