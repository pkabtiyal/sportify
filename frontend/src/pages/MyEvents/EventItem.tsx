//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import './MyEvents.css'

const primaryThemeColor: string = '#326DD9';

const EventItem = (props: any) => {
    let navigate = useNavigate();
    return (
        <Paper
            sx={{
                p: 2,
                margin: '5px auto',
                width: '70%',
                maxWidth: 5000,
                flexGrow: 1,
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            }}
        >
            <Grid container spacing={3}>
                <Grid item lg={4} md={3} sm={6} xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <img alt="complex" src={props.reservationDetails.image} />
                    </Box>
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                {props.reservationDetails.eventName}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {new Date(props.reservationDetails.eventDate).toDateString()}
                            </Typography>
                            <Typography variant = "body2" gutterBottom>
                            {
                                    (props.reservationDetails.bookingStatus === 'Active') ?
                                        <Chip label={props.reservationDetails.bookingStatus} color="success" /> :
                                        <Chip label={props.reservationDetails.bookingStatus} color="error" />
                                }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tickets Booked: {props.reservationDetails.ticketsBooked}
                            </Typography>
                        </Grid>
                        <Grid item sx={{display: {sm: 'block', xs: 'block', md: 'none'}}}>
                            <Button variant='outlined' onClick={() => {navigate('/my-events/' + props.reservationDetails.bookingId)}}>
                                View Details
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4} sx={{display: {sm: 'none', xs: 'none', md: 'block'}}}>
                    <Button variant='outlined' onClick={() => {navigate('/my-events/' + props.reservationDetails.bookingId)}}>
                        View Details
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default EventItem;