//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, Snackbar, Stack, Typography } from "@mui/material";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import './ReservationDetails.css';
import { getBackendUrl } from "../../components/getUrl";
import { toast } from "react-toastify";

const primaryColor = '#326DD9';

const DetailRow = (props: any) => {
    return (
        <Stack sx={{ width: '100%' }} alignItems='center' direction='row' spacing={1}>
            <Typography sx={{ width: '50%', display: 'flex', justifyContent: 'flex-end', fontSize: '14px', fontWeight: 'bold' }} variant="h6">
                {`${props.columnName} :`}
            </Typography>
            <Typography sx={{ display: 'flex', justifyContent: 'flex-start', fontSize: '12px' }} component="div">
                {props.columnData}
            </Typography>
        </Stack>
    );
}

const DetailHeader = (props: any) => {
    return (
        <Stack sx={{ width: '100%' }} alignItems='center' direction='row' spacing={2}>
            <Typography sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', mr: '40px', color: primaryColor }} variant="h4">
                {props.heading}
            </Typography>
        </Stack>
    );
}

interface ReservationInterface2 {
    id: number,
    reservationFrom: Date,
    reservationTo: Date,
    reservedDate: Date,
    reservationDate: Date,
    reservedBy: string,
    reservedFor: string,
    reservationStatus: 'Active' | 'Cancelled',
    equipmentName: string,
    equipmentLoc: string,
    equipmentImg: string,
    equipmentCategory: string
}

const ReservationDetails = () => {
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [detailNotFound, setDetailsNotFound] = useState(false);
    const [details, setDetails] = useState<ReservationInterface2 | null>(null);

    const [snackbarOpen, setSnackbarOpen] = useState<{ open: boolean, vertical: 'top' | 'bottom', horizontal: 'left' | 'right' }>({ open: false, vertical: 'top', horizontal: 'right' });
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const { open, vertical, horizontal } = snackbarOpen;

    let navigate = useNavigate();
    let params = useParams();
    const resId = (!params.reservationId) ? 1 : params.reservationId;

    useEffect(() => {
        axios.get(`${getBackendUrl()}/reservation/my-single-reservation/${resId}`, {
            headers: {
                "access-token": localStorage.getItem("access-token")!,
            }
        }).then(res => res.data).then(content => {
            setDetails(content.data);
            setIsLoading(false);
        }).catch((err) => {
            if (err.response.status === 404) {
                setIsLoading(false);
                setDetailsNotFound(true);
            }
        });
    }, [resId]);


    const closeDialog = () => {
        setCancelDialogOpen(false);
    }

    const onCancelReservation = () => {
        setCancelDialogOpen(true);
    }

    const notify = (type: String, msg: String) => {
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

    const cancelConfirmationSnackbar = () => {
        axios.put(`${getBackendUrl()}/reservation/cancel-reservation/${resId}`, {
            headers: {
                "access-token": localStorage.getItem("access-token")
            }
        }).then(res => res.data).then(content => {
            const msg = (!content.message) ? 'Successfuly cancelled your reservation.' : content.message;
            notify('success', msg);
            navigate('/my-reservations');
        }).catch(err => {
            closeDialog();
            if (err.response.status === 400 || err.response.status === 404) {
                notify('error', err.response.data.message);
            }
        });
    }

    const onCloseSnackbar = (event: SyntheticEvent | Event, reason?: any) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen({ ...snackbarOpen, open: false });
        navigate(".", { replace: true });
    }

    const snackbarCloseAction = (<IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onCloseSnackbar}
    >
        <CloseIcon fontSize="small" />
    </IconButton>);
    return (
        <div className="App">
            {(isLoading) ? (<Loader />) : (
                (detailNotFound || details == null) ? (<h1>Reservation details not found!</h1>) : (
                    <>
                        <Box sx={{ width: '100%', mt: '20px' }}>
                            <Grid container rowSpacing={2} columnSpacing={2}>
                                {/* Image Grid */}
                                <Grid item xs={12} md={4} sm={6}>
                                    <Card sx={{ margin: '20px', width: '90%', height: '90%', justifyContent: 'center' }} elevation={6}>
                                        <img className='Image' src={`${details.equipmentImg}`} alt="" />
                                    </Card>
                                </Grid>
                                {/* Primary Reservation Grid */}
                                <Grid item xs={12} md={4} sm={6}>
                                    <Card sx={{ margin: '20px', width: '90%', height: '90%' }} elevation={6}>
                                        <Stack sx={{ my: '30px' }} alignItems='center' spacing={2.5} divider={<Divider orientation="horizontal" variant="middle" flexItem />}>
                                            <DetailHeader heading='Reservation Details' />
                                            <DetailRow columnName='Reference ID' columnData={details.id} />
                                            <DetailRow columnName='Reservation Start' columnData={new Date(details.reservationFrom).toLocaleString()} />
                                            <DetailRow columnName='Reservation End' columnData={new Date(details.reservationTo).toLocaleString()} />
                                            <DetailRow columnName='Reservation Date' columnData={new Date(details.reservationDate).toLocaleDateString()} />
                                            <DetailRow columnName='Reservation For' columnData={details.reservedFor} />
                                            <DetailRow columnName='Reservation Status' columnData={details.reservationStatus} />
                                        </Stack>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4} sm={6}>
                                    <Card sx={{ margin: '20px', width: '90%', height: '90%' }} elevation={6}>
                                        <Stack sx={{ my: '30px' }} alignItems='center' spacing={3} divider={<Divider orientation="horizontal" variant="middle" flexItem />}>
                                            <DetailHeader heading='Property Details' />
                                            <DetailRow columnName="Property Name" columnData={details.equipmentName} />
                                            <DetailRow columnName="Property Location" columnData={details.equipmentLoc} />
                                            <DetailRow columnName="Category" columnData={details.equipmentCategory} />
                                        </Stack>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={12} sm={6} sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                    <Button sx={{
                                        color: '#000000',
                                        backgroundColor: '#ffffff',
                                        ':hover': {
                                            backgroundColor: '#000000',
                                            color: '#ffffff'
                                        },
                                        mr: '10px',
                                        height: '36.5px'
                                    }}
                                        variant='contained'
                                        onClick={() => {
                                            navigate("/my-reservations");
                                        }}
                                    >
                                        Back
                                    </Button>
                                    {(details.reservationStatus === 'Cancelled') ? (<></>) : (
                                        <Button sx={{
                                            ml: '10px',
                                            backgroundColor: '#d9534f',
                                            color: '#ffffff',
                                            borderColor: '#d43f3a',
                                            ':hover': {
                                                backgroundColor: '#d43f3a'
                                            },
                                            height: '36.5px'
                                        }}
                                            onClick={onCancelReservation}
                                            disabled={new Date(details.reservationFrom) < new Date()}
                                        >
                                            Cancel Reservation
                                        </Button>)}
                                </Grid>
                            </Grid>
                        </Box>
                        <Dialog
                            open={cancelDialogOpen}
                            onClose={closeDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Cancel Confirmation"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure, want to cancel the reservation?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={cancelConfirmationSnackbar}>Yes</Button>
                                <Button variant="contained" onClick={closeDialog} autoFocus>
                                    No
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {/* Snack bar for error messages */}
                        <Snackbar
                            anchorOrigin={{ vertical, horizontal }}
                            open={open}
                            autoHideDuration={3000}
                            onClose={onCloseSnackbar}
                            action={snackbarCloseAction}
                        >
                            <MuiAlert onClose={onCloseSnackbar} severity="error" sx={{ width: '100%' }} elevation={6} variant="filled">
                                {snackbarMsg}
                            </MuiAlert>
                        </Snackbar>
                    </>
                ))}
        </div>
    );
}
export { ReservationDetails, DetailRow, DetailHeader };