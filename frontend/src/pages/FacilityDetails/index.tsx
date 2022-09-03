//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
import { Box, Button, Card, Checkbox, Divider, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FacilitiesInterface } from "../../data/FacilitiesInterfac";
import { DetailHeader, DetailRow } from "../ReservationDetails";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './FacilityDetails.css';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import { getFromDate, getRemainingAvailableSlots, getToDate } from "../../data/AvailabilityData";
import Loader from "../../components/Loader";
import { AvailabilitySlots } from "../../data/AvailaibilitySlots";
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import { getUser } from "../../components/getLocalStorage";
import { getBackendUrl } from "../../components/getUrl";
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

interface ReservationForm {
    date?: Date | null,
    from?: Date | null,
    to?: Date | null,
    timeRange: string,
    selfBooking: boolean,
    fullName: string,
    age: number
}

interface ReservationFormError {
    date: boolean,
    timeRange: boolean,
    fullName: boolean,
    age: {
        required: boolean,
        rangeError: boolean,
    }
}

const FacilityDetails = () => {
    const navigate = useNavigate();
    const [facilityNotFound, setFacilityNotFound] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [timeslotsLoading, setTimeslotsLoading] = useState(false);
    const [loggedInUserRole] = useState(getUser()?.profile);
    const [availableSlots, setAvailableSlots] = useState<AvailabilitySlots[]>([]);
    const [reservationDetails, setReservationDetails] = useState<ReservationForm>({
        date: null,
        timeRange: '',
        selfBooking: true,
        fullName: getUser()?.firstName + " " + getUser()?.lastName,
        age: 25
    });

    const [reservationFormErrors, setReservationFormErrors] = useState<ReservationFormError>({
        fullName: false,
        date: false,
        timeRange: false,
        age: {
            required: false,
            rangeError: false
        }
    });

    const [resource, setResource] = useState<FacilitiesInterface | null>(null);

    const [snackbar, setSnackbar] = useState<{ open: boolean, vertical: 'top' | 'bottom', horizontal: 'left' | 'right' }>({ open: false, vertical: 'top', horizontal: 'right' });
    const { open, vertical, horizontal } = snackbar;
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const onReservationDetailsChange = (event: any) => {
        const reservationDetailsTemp = {
            ...reservationDetails,
            [event.target.name]: event.target.value,
        };
        setReservationDetails(reservationDetailsTemp);
        validateForm(reservationDetailsTemp);
    }

    const validateForm = (formDetails: ReservationForm) => {
        if (formDetails.date === null) {
            setReservationFormErrors({
                ...reservationFormErrors,
                date: true,
            });
            return false;
        }
        if (formDetails.timeRange === '') {
            setReservationFormErrors({
                ...reservationFormErrors,
                date: false,
                timeRange: true,
            });
            return false;
        }
        if (formDetails.fullName === '') {
            setReservationFormErrors({
                ...reservationFormErrors,
                date: false,
                timeRange: false,
                fullName: true,
            });
            return false;
        }
        if (!formDetails || !formDetails.age) {
            setReservationFormErrors({
                ...reservationFormErrors,
                date: false,
                timeRange: false,
                fullName: false,
                age: {
                    required: true,
                    rangeError: false,
                }
            });
            return false;
        }
        else if (formDetails.age < 18 || formDetails.age > 70) {
            setReservationFormErrors({
                ...reservationFormErrors,
                date: false,
                timeRange: false,
                fullName: false,
                age: {
                    required: false,
                    rangeError: true,
                }
            });
            return false;
        }

        setReservationFormErrors({
            fullName: false,
            date: false,
            timeRange: false,
            age: {
                required: false,
                rangeError: false
            }
        });
        return true;
    }

    let minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    let maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    let params = useParams();
    let resourceId: string = (!params.resourceId) ? "1" : params.resourceId;
    useEffect(() => {
        axios.get(`${getBackendUrl()}/facility/${resourceId}`,{
            headers: {
                "access-token": localStorage.getItem("access-token")!,
            }
        })
            .then(response => response.data)
            .then(content => {
                setResource(content.data);
                setIsLoading(false);
                // setDisplayList(content.data);
            })
            .catch(function (err) {
                if (err.response.status === 404) {
                    setFacilityNotFound(true);
                    setIsLoading(false);
                }
            });
    }, [resourceId]);

    const availabilityMenuItems = (availableSlots?.map((availabilitySlot) => {
        return (
            <MenuItem key={availabilitySlot.id} value={availabilitySlot.id}>{availabilitySlot.displayValue}</MenuItem>
        );
    }));

    const loaderMenuItem = (<MenuItem disabled><div className="TimeslotLoader"><Loader /></div></MenuItem>);

    const onDateChange = async (updatedDate: Date | null) => {
        const reservationDetailsTemp = {
            ...reservationDetails,
            date: updatedDate,
            timeRange: '',
            from: null,
            to: null
        };
        setReservationDetails(reservationDetailsTemp);
        validateForm(reservationDetailsTemp);
        setTimeslotsLoading(true);
        axios({
            method: 'get',
            url: `${getBackendUrl()}/facility/booked-slots?facilityId=${resourceId}&date=${updatedDate?.getTime()}`,
            headers: {
                "access-token": localStorage.getItem("access-token")!,
            }
        }).then(res => {
            setTimeslotsLoading(false);
            setAvailableSlots(getRemainingAvailableSlots(res.data.data));
        }).catch(err => {
            console.log(err);
        })
    }

    const onTimeslotChange = (event: SelectChangeEvent) => {
        const reservationDetailsTemp = {
            ...reservationDetails,
            from: getFromDate(+event.target.value, reservationDetails.date),
            to: getToDate(+event.target.value, reservationDetails.date),
            timeRange: event.target.value,
        };
        console.log('state: ', reservationDetailsTemp);
        setReservationDetails(reservationDetailsTemp);
        validateForm(reservationDetailsTemp);
    }

    const onSelfBookingCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let reservationDetailsTemp = {
            ...reservationDetails,
            selfBooking: event.target.checked,
        };
        if (event.target.checked) {
            const loggedInUser = getUser();
            const fullName = loggedInUser.firstName + " " + loggedInUser.lastName;
            reservationDetailsTemp = {
                ...reservationDetailsTemp,
                fullName: fullName,
                age: 25,
            }
        }
        setReservationDetails(reservationDetailsTemp);
        validateForm(reservationDetailsTemp);
    }

    const getReservationApiReqBody = (filledDetails: ReservationForm) => {
        const requestBody = {
            from: filledDetails.from,
            to: filledDetails.to,
            facility_id: resourceId,
            booked_date: new Date(),
            reserved_by: getUser()._id,
            reserved_for: filledDetails.fullName
        }
        return requestBody;
    }

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
        if (!validateForm(reservationDetails)) {
            return;
        }
        else {
            const reqBody = getReservationApiReqBody(reservationDetails);
            axios({
                method: 'post',
                url: `${getBackendUrl()}/reservation`,
                data: reqBody,
                headers: {
                    "access-token": localStorage.getItem("access-token")!,
                }
            }).then(() => {
                notify('success', 'Successfuly booked facility!');
                navigate('/facility');
            }).catch((err) => {
                if (err.response.status === 400 || err.response.status === 409 || err.response.status === 500) {
                    notify('error', err.response.data.message);
                }
                console.log('Exception occured', err);
            });
        }
    }

    const onCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
        setSnackbarMsg('');
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
        (isLoading) ? (<Loader />) : ((facilityNotFound || !resource) ? (<h1>Facility Not Found!</h1>) : (
            <Box sx={{ width: '100%', mt: '20px' }}>
                <Grid container rowSpacing={2} columnSpacing={2}>
                    <Grid item xs={12} md={4} sm={6}>
                        <Card sx={{ margin: '20px', width: '90%', height: '90%', justifyContent: 'center', objectFit: 'contain' }} elevation={6}>
                            <Box sx={{ padding: '20px'}}>
                                <img className='img-responsive' src={`${resource.image}`} alt="" />
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <Card sx={{ margin: '20px', width: '90%', height: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} elevation={6}>
                            <Stack sx={{ my: '30px' }} alignItems='center' spacing={3} divider={<Divider orientation="horizontal" variant="middle" flexItem />}>
                                <DetailHeader heading='Facility Details' />
                                <DetailRow columnName='Facility Name' columnData={resource.name} />
                                <DetailRow columnName='Facility Category' columnData={resource.category} />
                                <DetailRow columnName='Facility Location' columnData={resource.location} />
                                <DetailRow columnName='Facility Status' columnData={'Active'} />
                                <br />
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <Card sx={{ margin: '20px', width: '90%', height: '90%' }} elevation={6}>
                            <Stack sx={{ my: '30px' }} alignItems='center' spacing={3}>
                                <DetailHeader heading='Facility Description' />
                                <DetailDescription content={resource.description} />
                            </Stack>
                        </Card>
                    </Grid>
                    {/* Date and timeslot grid */}
                    <Grid item xs={12} md={4} sm={6}>
                        <Card sx={{ margin: '20px', width: '90%', height: '90%' }} elevation={6}>
                            <Stack sx={{ mt: '30px', }} alignItems='center' spacing={3}>
                                <DetailHeader heading='For Booking' />
                                {/* Date Picker */}
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Choose Date"
                                        value={reservationDetails.date}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        onChange={(newValue) => {
                                            onDateChange(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                        disabled={loggedInUserRole === 'admin'}
                                    />
                                    {reservationFormErrors.date && <p className="Error">Please pick a date!</p>}
                                </LocalizationProvider>
                                {/* Time Picker */}
                                <FormControl sx={{ width: 227 }}>
                                    <InputLabel id="timeslot-label">Choose Timeslot</InputLabel>
                                    <Select
                                        labelId="timeslot-label"
                                        id="timeslot-label"
                                        sx={{ justifyContent: 'center' }}
                                        value={reservationDetails.timeRange}
                                        onChange={onTimeslotChange}
                                        label='Choose Timeslot'
                                        disabled={loggedInUserRole === 'admin' || reservationDetails.date == null}
                                    >
                                        {(timeslotsLoading) ? loaderMenuItem : availabilityMenuItems}
                                    </Select>
                                    {reservationFormErrors.timeRange && <p className="Error">Please choose a timeslot!</p>}
                                </FormControl>
                                {/* Self Booking */}
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={reservationDetails.selfBooking} onChange={onSelfBookingCheckboxChange} name='selfBooking' disabled={loggedInUserRole === 'admin'} />
                                    }
                                    label="Self Booking" />
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6}>
                        <Card sx={{ margin: '20px', width: '90%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} elevation={6}>
                            <Stack alignItems='center' spacing={3}>
                                <DetailHeader heading='Booking Details' />
                                {/* Full Name */}
                                <TextField
                                    required
                                    name='fullName'
                                    label="Full Name"
                                    value={reservationDetails.fullName}
                                    onChange={onReservationDetailsChange}
                                    disabled={loggedInUserRole === 'admin' || reservationDetails.selfBooking}
                                    helperText={reservationFormErrors.fullName ? 'Please enter full name' : ''}
                                    sx={{
                                        '.MuiFormHelperText-root': {
                                            color: 'red'
                                        }
                                    }}
                                />
                                {/* <TextField
                                required
                                name='age'
                                label="Age"
                                type='number'
                                value={reservationDetails.age}
                                onChange={onReservationDetailsChange}
                                inputProps={{ min: 18, max: 70 }}
                                disabled={reservationDetails.selfBooking}
                                helperText={reservationFormErrors.age.required ? 'Please enter age!' : (reservationFormErrors.age.rangeError? 'Age must be between 18 and 70': '')}
                                sx={{
                                    '.MuiFormHelperText-root': {
                                        color: 'red'
                                    }
                                }}
                            /> */}
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4} sm={6} sx={{
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
                            height: '36.5px',
                            mt: '20px'
                        }}
                            variant='contained'
                            onClick={() => { navigate('/facility') }}
                        >
                            Back
                        </Button>
                        <Button sx={{
                            ml: '10px',
                            backgroundColor: '#326DD9',
                            color: '#ffffff',
                            borderColor: '#d43f3a',
                            ':hover': {
                                backgroundColor: '#326DD9'
                            },
                            height: '36.5px',
                            mt: '20px'
                        }}
                            onClick={onSubmitBooking}
                            disabled={loggedInUserRole === 'admin'}
                        >
                            Book Facility
                        </Button>
                    </Grid>
                </Grid>
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
            </Box>))
    );
}

export default FacilityDetails;