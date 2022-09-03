//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
import { useNavigate, useParams } from "react-router-dom";
import eventsRegistered from "../../data/MyEvents";
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, Snackbar, Stack, Typography } from "@mui/material";
import { DetailHeader, DetailRow } from "../ReservationDetails";
import { SyntheticEvent, useEffect, useState } from "react";
import { MyEventInterface } from "../../data/MyEventInterface";
import { DetailDescription } from "../EventDetails";
import Loader from "../../components/Loader";
import { getBackendUrl } from "../../components/getUrl";
import axios from "axios";
import { getUser } from "../../components/getLocalStorage";
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import { toast } from "react-toastify";


export default function MyEventDetails() {
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const params = useParams();
    const bookingId = (!params.bookingId) ? "1" : params.bookingId;
    const [details, setDetails] = useState<MyEventInterface | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<{ open: boolean, vertical: 'top' | 'bottom', horizontal: 'left' | 'right' }>({ open: false, vertical: 'top', horizontal: 'right' });
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const { open, vertical, horizontal } = snackbarOpen;
    useEffect(() => {
        axios.get(`${getBackendUrl()}/event-bookings/my-single-booking/${bookingId}`, {
            headers: {
                "access-token": localStorage.getItem('access-token')!
            }
        }).then(res => res.data.data).then(content => {
            setIsLoading(false);
            setDetails(content);
        }).catch(err => {
            setIsLoading(false);
            console.log(err);
        })
    }, []);

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
        axios({
            method: 'put',
            url: `${getBackendUrl()}/event-bookings/cancel-event/${bookingId}/${getUser()._id}`,
            headers: {
                "access-token": localStorage.getItem('access-token')!
            }
        }).then(res => res.data.data).then(content => {
            notify('success', 'Successfully cancelled your booking');
            navigate('/my-events');
        }).catch(err => {
            console.log(err);
            closeDialog();
            notify('error', err.response.data.message);
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
        (isLoading) ? (<Loader />) : (
            (details === null) ? (<>No booking found  with the given reference id!</>) : (
                <div className="App">
                    <Box sx={{ width: '100%', mt: '20px' }}>
                        <Grid container rowSpacing={2} columnSpacing={2}>
                            {/* Image Grid */}
                            <Grid item xs={12} md={4} sm={6}>
                                <Card sx={{ margin: '20px', width: '90%', height: '90%', display: 'flex', justifyContent: 'center' }} elevation={6}>
                                    <img className='image-responsive' src={`${details.image}`} alt="" />
                                </Card>
                            </Grid>
                            {/* Primary Reservation Grid */}
                            <Grid item xs={12} md={4} sm={6}>
                                <Card sx={{ margin: '20px', width: '90%', height: '90%' }} elevation={6}>
                                    <Stack sx={{ my: '30px' }} alignItems='center' spacing={2.5} divider={<Divider orientation="horizontal" variant="middle" flexItem />}>
                                        <DetailHeader heading='Reservation Details' />
                                        <DetailRow columnName='Reference ID' columnData={details.bookingId} />
                                        <DetailRow columnName='Event Date' columnData={new Date(details.eventDate).toDateString()} />
                                        <DetailRow columnName='Booked Date' columnData={new Date(details.bookingDate).toDateString()} />
                                        <DetailRow columnName='Max. Capacity' columnData={details.capacity} />
                                        <DetailRow columnName='Booked Tickets' columnData={details.bookedTickets} />
                                        <DetailRow columnName='Status' columnData={details?.status} />
                                    </Stack>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4} sm={6}>
                                <Card sx={{ margin: '20px', width: '90%', height: '90%' }} elevation={6}>
                                    <Stack sx={{ my: '30px' }} alignItems='center' spacing={3}>
                                        <DetailHeader heading='Event Descrption' />
                                        <DetailDescription content={details.eventDescription} />
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
                                        navigate("/my-events");
                                    }}
                                >
                                    Back
                                </Button>
                                {(details?.status === 'Cancelled') ? (<></>): (
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
                                    disabled = {new Date(details.eventDate) < new Date}
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
                </div>))
    );
}