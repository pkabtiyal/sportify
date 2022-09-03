//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
import { Box, Button, Card, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DetailHeader, DetailRow } from "../ReservationDetails";
import '../FacilityDetails/FacilityDetails.css';
import { EventInterface } from "../../data/EventInterface";
import axios from "axios";
import { getBackendUrl } from "../../components/getUrl";
import Loader from "../../components/Loader";
import NoEvents from "../../components/NoEvents";
import { getUser } from "../../components/getLocalStorage";
import { toast } from "react-toastify";

const DetailDescription = (props: any) => {
    return (
        <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} alignItems='center' direction='row' spacing={2}>
            <Typography sx={{ m: '20px', width: '100%', display: 'flex', justifyContent: 'center', fontSize: '15px' }} variant="h4">
                {props.content}
            </Typography>
        </Stack>
    );
}

interface EventBookingFormError {
    slots: {
        required: boolean,
        rangeError: boolean,
    }
}

const EventDetails = () => {
    const navigate = useNavigate();
    const [loggedInUserRole] = useState(getUser()?.profile);

    const [selectedSlots, setSelectedSlots] = useState<number | null>(1);

    const [reservationFormErrors, setReservationFormErrors] = useState<EventBookingFormError>({
        slots: {
            required: false,
            rangeError: false
        }
    });

    const onReservationDetailsChange = (event: any) => {
        setSelectedSlots(event.target.value);
        validateForm(event.target.value);
    }

    const validateForm = (selSlots: number | null) => {
        if (!selSlots) {
            setReservationFormErrors({
                slots: {
                    required: true,
                    rangeError: false,
                }
            });
            return false;
        }

        if (resource?.availableCapacity && (selSlots < 1 || selSlots > resource.availableCapacity)) {
            setReservationFormErrors({
                slots: {
                    required: false,
                    rangeError: true,
                }
            });
            return false;
        }

        setReservationFormErrors({
            slots: {
                required: false,
                rangeError: false
            }
        });
        return true;
    }

    let params = useParams();
    const resourceId: string = (!params.eventId) ? "1" : params.eventId;
    const [isLoading, setIsLoading] = useState(true);
    const [resource, setResource] = useState<EventInterface | null>(null);
    const [noResource, setNoResource] = useState(false);
    useEffect(() => {
        axios.get(`${getBackendUrl()}/events/single-event/${resourceId}`, {
            headers: {
                'access-token': localStorage.getItem('access-token')!
            }
        }).then(res => res.data).then(content => {
            setIsLoading(false);
            setResource(content.data);
        }).catch((err) => {
            console.log(err);
            if (err.response.status === 404) {
                setIsLoading(false);
                setNoResource(true);
            }
        });
    }, []);

    const notify = (type: string, msg: string) => {
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

    const onSubmitBooking = () => {
        if (!validateForm(selectedSlots)) {
            return;
        }
        else {
            const reqBody = {
                eventId: resourceId,
                bookedTickets: selectedSlots,
                name: getUser()?.firstName + " " + getUser()?.lastName,
                phone: getUser()?.contactNo,
                userId: getUser()._id,
            }
            console.log(reqBody);
            axios({
                method: 'post',
                url: `${getBackendUrl()}/event-bookings/book`,
                data: reqBody,
                headers: {
                    "access-token": localStorage.getItem("access-token")!,
                }
            }).then(res => {
                notify('success', 'Successfuly booked ticket(s) for the event!');
                navigate('/events');
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    return (
        (isLoading)
            ? (<Loader />)
            : (
                (noResource || resource === null)
                    ? (<NoEvents single={true} />)
                    : (
                        <Box sx={{ width: '100%', mt: '20px' }}>
                            <Grid container rowSpacing={2} columnSpacing={2}>
                                <Grid item xs={12} md={4} sm={6}>
                                    <Card sx={{ margin: '20px', width: '90%', height: '90%', display: 'flex', justifyContent: 'center' }} elevation={6}>
                                        <img className='img-responsive' src={`${resource.image}`} alt="" />
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4} sm={6}>
                                    <Card sx={{ margin: '20px', width: '90%', height: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} elevation={6}>
                                        <Stack sx={{ my: '30px' }} alignItems='center' spacing={2} divider={<Divider orientation="horizontal" variant="middle" flexItem />}>
                                            <DetailHeader heading='Event Details' />
                                            <DetailRow columnName='Event Name' columnData={resource.name} />
                                            <DetailRow columnName='Event Date' columnData={new Date(resource.date).toDateString()} />
                                            <DetailRow columnName='Event Location' columnData={resource.location} />
                                            <DetailRow columnName='Event Capacity' columnData={resource.maxCapacity} />
                                            <DetailRow columnName='Available slots' columnData={resource.availableCapacity} />
                                            <br />
                                        </Stack>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4} sm={6}>
                                    <Card sx={{ margin: '20px', width: '90%', height: '90%' }} elevation={6}>
                                        <Stack sx={{ my: '30px' }} alignItems='center' spacing={3}>
                                            <DetailHeader heading='Event Description' />
                                            <DetailDescription content={resource.description} />
                                        </Stack>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4} sm={6}>
                                    <Card sx={{ margin: '20px', width: '90%', height: '90%' }} elevation={6}>
                                        <Stack sx={{ mt: '30px', }} alignItems='center' spacing={3}>
                                            <DetailHeader heading='Booking Details' />
                                            {/* Full Name */}
                                            <DetailRow columnName='Full Name' columnData={getUser()?.firstName + " " + getUser()?.lastName} />
                                            <DetailRow columnName='Phone' columnData={getUser()?.contactNo} />
                                        </Stack>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4} sm={6} sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                    <Stack sx={{ mt: '30px', }} alignItems='center' spacing={3}>
                                        <TextField
                                            required
                                            name='slots'
                                            label="Total Participants"
                                            type='number'
                                            value={selectedSlots}
                                            onChange={onReservationDetailsChange}
                                            inputProps={{ min: 1, max: resource.availableCapacity }}
                                            helperText={reservationFormErrors.slots.required ? 'Please enter total participants!' : (reservationFormErrors.slots.rangeError ? `Total participants can't exceed available slots` : '')}
                                            sx={{
                                                '.MuiFormHelperText-root': {
                                                    color: 'red'
                                                }
                                            }}
                                            disabled={loggedInUserRole === 'admin'}
                                        />
                                        <Stack direction='row'>
                                            <Button sx={{
                                                color: '#000000',
                                                backgroundColor: '#ffffff',
                                                ':hover': {
                                                    backgroundColor: '#000000',
                                                    color: '#ffffff'
                                                },
                                                mr: '10px',
                                                height: '36.5px',
                                                mt: '20px'
                                            }}
                                                variant='contained'
                                                onClick={() => { navigate('/events') }}
                                            >
                                                Back
                                            </Button>
                                            <Button sx={{
                                                ml: '10px',
                                                backgroundColor: '#326DD9',
                                                color: '#ffffff',
                                                ':hover': {
                                                    backgroundColor: '#152D59'
                                                },
                                                height: '36.5px',
                                                mt: '20px'
                                            }}
                                                onClick={onSubmitBooking}
                                                disabled={resource.availableCapacity === 0 || loggedInUserRole === 'admin'}
                                            >
                                                Book Tickets
                                            </Button>
                                        </Stack>
                                    </Stack>

                                </Grid>
                            </Grid>
                        </Box>
                    )
            )
    );
}

export { EventDetails, DetailDescription };