import { Button, Card, Container, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUser } from "../../components/getLocalStorage";
import { getBackendUrl } from "../../components/getUrl";

export default function index() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rewardTab, setRewardTab] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [redeem, setRedeem] = useState({});
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [coupons, setCoupons] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [redeemValue, setRedeemValue] = useState(100);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [maxRedeem, setMaxRedeem] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [brand, setBrand] = useState("Mark's");

  //   open the dialog
  const handleClickOpen = () => {
    if (redeem.remainingPoints >= 100) {
      document.querySelector("#redeemMsg").innerHTML = "  ";
      setOpen(true);
    } else {
      document.querySelector("#redeemMsg").innerHTML =
        "Insufficient points to redeem";
    }
  };
  //   close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  //   handle the maximum value for redeem
  const handleRedeem = (event) => {
    let value = parseInt(event.target.value, 10);

    if (value > maxRedeem) {
      value = maxRedeem;
    }

    if (value < 100) {
      value = 100;
    }

    setRedeemValue(value);
  };
  // handle brand name in redeem points
  const handleBrand = (event) => {
    setBrand(event.target.value);
    // console.log(brand);
  };
  //   cite : https://mui.com/material-ui/react-tabs/#basic-tabs
  //   handle tab change with props
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function tabProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  //   send notfication
  const notify = (type, msg) => {
    if (type === "success") {
      toast.success(msg, { position: toast.POSITION.TOP_RIGHT });
    } else if (type === "error") {
      toast.error(msg, { position: toast.POSITION.TOP_RIGHT });
    }
  };
  // fetch points for users
  const getPoints = () => {
    const getPointsUrl = getBackendUrl() + "/api/get-points";
    let body = {};
    body["id"] = getUser()._id;
    // console.log(body);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
      },
      body: JSON.stringify(body),
    };
    let statusCode;
    fetch(getPointsUrl, requestOptions)
      .then((response) => {
        statusCode = response.status;
        return response.json();
      })
      .then((result) => {
        if (statusCode === 500) {
          notify("error", result.message);
        } else {
          // console.log(result);
          //   remainingPoints =
          result.reward["remainingPoints"] =
            result.reward.total_earned_points - result.reward.reedemed_points;
          setMaxRedeem(
            result.reward.total_earned_points - result.reward.reedemed_points
          );
          setRedeem(result.reward);
          // console.log(redeem);
          //   localStorage.setItem("user", JSON.stringify(result.user));
          //   notify("success", result.message);
          //   window.location.replace("/my-account");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const getCoupons = () => {
    const getCouponsUrl = getBackendUrl() + "/api/get-coupons";
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
      },
    };
    let statusCode;
    fetch(getCouponsUrl, requestOptions)
      .then((response) => {
        statusCode = response.status;
        return response.json();
      })
      .then((result) => {
        if (statusCode === 500) {
          notify("error", result.message);
        } else {
          // console.log(result.coupons);
          setCoupons(result.coupons);
        }
      })
      .catch((error) => console.log("error", error));
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // console.log("get redeem points");
    getPoints();
    getCoupons();
  }, []);

  const redeemPoints = () => {
    // console.log(brand, redeemValue);
    const updatePointsUrl = getBackendUrl() + "/api/update-points";
    let body = {};
    body["id"] = getUser()._id;
    body["reedemed_points"] = redeemValue + redeem.reedemed_points;
    body["brand"] = brand;
    // console.log(body);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-token": localStorage.getItem("access-token"),
      },
      body: JSON.stringify(body),
    };
    let statusCode;
    fetch(updatePointsUrl, requestOptions)
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
          window.location.replace("/my-rewards");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handleChange = (event, newValue) => {
    setRewardTab(newValue);
  };

  return (
    <>
      <Container sx={{ pt: 2 }}>
        <Typography pt={2} align="center" variant="h5">
          Rewards
        </Typography>
        <hr className="hr-fancy1" />
        <Container>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={rewardTab}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Redeem Points" {...tabProps(0)} />
              <Tab label="Coupons" {...tabProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={rewardTab} index={0}>
            <Typography variant="h5" pb={2}>
              Redeem Points
            </Typography>
            <Grid container spacing={3}>
              <Grid item xl={4} lg={4} md={6} sm={11} xs={11}>
                <Card sx={{backgroundColor:"#326dd9",py:"25px"}}>
                  {redeem.remainingPoints >= 0 ? (
                    <Typography variant="h6" color="white" textAlign="center">
                      <b>{redeem.remainingPoints}</b>
                      <br/>
                      Remaining points
                    </Typography>
                  ) : (
                    <Skeleton variant="text" width="250px" />
                  )}
                </Card>
              </Grid>

              <Grid item xl={4} lg={4} md={6} sm={11} xs={11}>
                <Card sx={{backgroundColor:"#bbb",py:"25px"}}>
                {redeem.reedemed_points >= 0 ? (
              <Typography variant="h6" textAlign="center">
                {redeem.reedemed_points}
                <br/>
                Redeemed points
              </Typography>
            ) : (
              <Skeleton variant="text" width="150px" />
            )}
                </Card>
              </Grid>
            </Grid>

            <Grid container mt={2} spacing={3}>
              <Grid item xl={4} lg={4} md={6} sm={11} xs={11}>
                <Card sx={{backgroundColor:"#eee",py:"25px"}}>
                {redeem.total_earned_points >= 0 ? (
                  <Typography variant="h6" textAlign="center">
                    {redeem.total_earned_points}
                    <br/>
                    Total Earned Points
                    <br/>
                    Equivalent Cash : CA$ {redeem.total_spent_money}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width="150px" />
                )}
                </Card>
              </Grid>
            </Grid>

            



            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleClickOpen}
            >
              Redeem Points
            </Button>
            <Typography
              id="redeemMsg"
              variant="caption"
              display="block"
              color="error"
            >
              &nbsp;&nbsp;
            </Typography>
          </TabPanel>
          {/* Coupons Tab Content */}
          <TabPanel value={rewardTab} index={1}>
            <Typography variant="h5">Coupons</Typography>
            <Grid container mt={2} mb={3} spacing={4}>
              {coupons.map((coupon) => {
                return (
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={11}
                    key={coupon._id}
                    justifyContent="center"
                    alignItems="stretch"
                  >
                    <Paper
                      sx={{
                        p: 2,
                        margin: "auto",
                        height: "92%",
                        flexGrow: 1,
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                      }}
                    >
                      <Grid container spacing={2} justifyContent="center">
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={5}
                          sm={11}
                          xs={11}
                          alignItems="center"
                        >
                          <Box sx={{ height: "100%", display: "flex" }}>
                            <img
                              alt="complex"
                              src={
                                coupon.coupon_brand
                                  .replaceAll(" ", "")
                                  .toLowerCase() + ".svg"
                              }
                              className="img-responsive"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm container>
                          <Grid
                            item
                            xs
                            container
                            direction="column"
                            spacing={2}
                          >
                            <Grid item xs>
                              <Typography
                                gutterBottom
                                variant="body1"
                                component="div"
                              >
                                <b>{coupon.coupon_brand}</b>
                              </Typography>
                              <Typography variant="body2" gutterBottom>
                                {coupon.coupon_description}
                              </Typography>
                              <Typography variant="body1" color="primary">
                                Coupon Code: <br/>
                                {coupon.coupon_code}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary"
                                href={coupon.coupon_link}
                                target="_blank"
                              >
                                Shop Now
                              </Button>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle1" component="div">
                              <b>{coupon.coupon_discount}% OFF</b>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </TabPanel>

          {/* Redeem Dialog Box */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Redeem Points</DialogTitle>
            <DialogContent>
              <DialogContentText>
                This point redeem is irreversible. So, please choose carefully.
              </DialogContentText>
              <FormControl sx={{ my: 3 }} fullWidth>
                <InputLabel id="demo-simple-select-helper-label">
                  Select Brand
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={brand}
                  label="Select Brand"
                  onChange={handleBrand}
                >
                  <MenuItem value={"Mark's"}>Mark's</MenuItem>
                  <MenuItem value={"Best Buy"}>Best Buy</MenuItem>
                  <MenuItem value={"Adidas"}>Adidas</MenuItem>
                  <MenuItem value={"Nike"}>Nike</MenuItem>
                  <MenuItem value={"My Protein"}>My Protein</MenuItem>
                </Select>
                <FormHelperText>Select brand to redeem points</FormHelperText>
              </FormControl>
              <TextField
                type="number"
                inputProps={{ min: 0, max: redeem.remainingPoints, step: 15 }}
                value={redeemValue}
                onChange={(e) => handleRedeem(e)}
                label="Points to Redeem"
                fullWidth
              />
              <Typography variant="body2">
                Equivalent Cash : {parseFloat((redeemValue / 30).toFixed(2))}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button onClick={redeemPoints} color="primary">
                Redeem
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Container>
    </>
  );
}
