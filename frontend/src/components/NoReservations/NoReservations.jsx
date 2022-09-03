/* Author: Aravind Jayanthi (B00868943)
   Email: ar687531@dal.ca */
import { Container, Paper, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import './NoReservations.css';

const NoReservations = () => {
   
    return (
        <Container maxWidth="xl" sx={{ mb: "4", width: {xs: "100%", sm: "100%", md:"70%", lg: "70%", xl: "50%"} }}>
            <Paper variant="outlined" sx={{
                my: { xs: '25%', md: 2 },
                p: { xs: 2, md: 3 },
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* <a href="https://storyset.com/event">Event illustrations by Storyset</a> */}
                <img src="./no-reservations.svg" className="Image" />
                <Typography sx={{fontSize: '25px'}}>You have no reservations!</Typography>
                <Typography sx={{fontSize: '15px'}}>Go to <Link to="../facility">facilities</Link> page for booking reservations</Typography>
            </Paper>
        </Container>
    );
}

export default NoReservations;