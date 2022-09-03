/* Author: Aravind Jayanthi (B00868943)
   Email: ar687531@dal.ca */
import { Button, Card, CardActions, CardHeader, CardMedia, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EventInterface } from "../data/EventInterface";
import { primaryColor, seondaryColor, whiteThemeColor } from "../Theme/colors";
import { getUser } from "./getLocalStorage";

const EventItem = (props: any) => {
    const navigate = useNavigate();
    const event: EventInterface = props.event;
    const loggedInUserRole = getUser()?.profile;
    const isLoggedIn = localStorage.getItem('isLogin');

    const redirectToDetailsPage = (resourceId: string) => {
        navigate('/events/' + resourceId);
    }
    return (
        <Grid key={event.id} item sx={{ height: 'auto' }} xl={3} xs={12} sm={6} md={4}>
            <Card
                elevation={6}>
                <CardHeader
                    sx={{
                        '.MuiCardHeader-title': {
                            display: 'flex',
                            justifyContent: 'center',
                            color: primaryColor
                        },
                        '.MuiCardHeader-subheader': {
                            display: 'flex',
                            justifyContent: 'center',
                            color: seondaryColor
                        }
                    }}
                    title={event.name}
                    subheader={new Date(event.date).toDateString()}
                />
                <CardMedia
                    component="img"
                    sx={{
                        display: 'block',
                        objectFit: 'contain',
                        width: '250px',
                        height: '250px',
                        m: '0 auto'
                    }}
                    image={event.image}
                    alt="Equipment image"
                />
                <CardActions
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        backgroundColor: primaryColor
                    }}
                >
                    <Button
                        sx={{ color: whiteThemeColor, width: '100%' }}
                        onClick={() => redirectToDetailsPage(event.id)}>
                        {(isLoggedIn === 'false') ? "Login to view event" : ((loggedInUserRole === 'admin') ? "view Details" : "Book Event")}
                    </Button>
                </CardActions>
            </Card>
        </Grid>);
}

export default EventItem;