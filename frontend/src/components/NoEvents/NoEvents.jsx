/* Author: Aravind Jayanthi (B00868943)
   Email: ar687531@dal.ca */
import { Container, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import './NoEvents.css';

const NoEvents = ({single}) => {
    const getImagePath = () => {
        return (single)? "../no-events.png": "./no-events.png";
    }
    
    const headerText = () => {
        return (single) ? "Event you are looking is not found" : "Sorry we have no events!";
    }

    return (
        <Container maxWidth="xl" sx={{ mb: "4", width: { xs: "100%", sm: "100%", md: "70%", lg: "70%", xl: "50%" } }}>
            <Paper variant="outlined" sx={{
                my: { xs: '25%', md: 2 },
                p: { xs: 2, md: 3 },
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* <a href="https://storyset.com/event">Event illustrations by Storyset</a> */}
                <img src={getImagePath()} className="Image" />
                <Typography sx={{ fontSize: '25px' }}>{headerText()}</Typography>
                {(single
                ? (<Typography>Please go to <Link to="../events">events</Link> page for booking seats in available events</Typography>) 
                : (<Typography sx={{ fontSize: '15px' }}>We are trying our best to add more events for you to participate</Typography>))}
                
            </Paper>
        </Container>
    );
}

export default NoEvents;