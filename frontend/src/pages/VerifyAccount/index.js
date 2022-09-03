import { Card, Grid, Link } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBackendUrl } from "../../components/getUrl";
// import verifiedImage from "./public/MailConfirmed.svg";
const Main = () => {

  const [isVerified, setIsVerified] = useState(null);

  const queryParams = new URLSearchParams(window.location.search);
  console.log(queryParams.get("token"));
  const token = queryParams.get("token");


  const verifyUrl = getBackendUrl()+"/api/verify-account?token="+token;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const requestOptions = {
    method: "GET"
  };
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
            notify("success", result.message);
        }
        else if (statusCode === 400){
            console.log(result);
            notify("warn", result.message);
        } 
        else {
            notify("error", result.message);
        }
      })
      .catch((error) => console.log("error", error));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Grid
      container
      id="verifyAccountPg"
      height="100%"
      justifyContent="center"
      alignItems="center"
      className="loginSide1"
    >
      <Grid item xl={3} lg={4} md={5} sm={7} xs={11}>
        <Card sx={{ p: "1.5rem" }} elevation={5}>
            {isVerified === true  ? (<><img src="/MailConfirmed.svg" className="img-responsive" alt="mailConfirm" />
          <Typography variant="h5" align="center">
            Link Verified Successfully
          </Typography></>) : (isVerified === false ? (<><img src="/400Error.svg" alt="error" className="img-responsive" />
          <Typography variant="h5" align="center">
            Link is broken or bad request </Typography></>) : <Typography variant="h5" align="center">
            Content is loading </Typography>)}

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
  );
};
export default Main;
