//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const primaryThemeColor: string = '#326DD9';

const ReservationItem = (props: any) => {
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', objectFit: 'contain' }}>
                        <img className="img-responsive" alt="complex" src={props.reservationDetails.equipmentImg} />
                    </Box>
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                {props.reservationDetails.equipmentName}
                            </Typography>
                            <Typography variant="body2" gutterBottom sx={{
                                mb: '20px'
                            }}>
                                {
                                    (props.reservationDetails.reservationStatus === 'Active') ?
                                        <Chip label={props.reservationDetails.reservationStatus} color="success" /> :
                                        <Chip label={props.reservationDetails.reservationStatus} color="error" />
                                }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                               From: {new Date(props.reservationDetails.reservationFrom).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                               To: {new Date(props.reservationDetails.reservationTo).toLocaleString()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4} sx={{ display: { sm: 'block', xs: 'block', md: 'block' } }}>
                    <Button variant='outlined' onClick={() => { navigate('/my-reservations/' + props.reservationDetails.id) }}>
                        View Details
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default ReservationItem;