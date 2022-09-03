/* Author: Aravind Jayanthi (B00868943)
   Email: ar687531@dal.ca */
import { Button, Card, CardActions, CardHeader, CardMedia, Grid } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FacilitiesInterface } from "../data/FacilitiesInterfac";
import { primaryColor, seondaryColor, whiteThemeColor } from "../Theme/colors";
import { getUser } from "./getLocalStorage";

const FacilityItem = (props: any) => {
    const navigate = useNavigate();
    const [isLoggedIn] = useState(localStorage.getItem('isLogin'));
    const [loggedInUserRole] = useState(getUser()?.profile);
    const facility: FacilitiesInterface = props.facility;
    const redirectToDetailsPage = (resourceId: string) => {
        navigate('/facility/' + resourceId);
    }
    return (
        <Grid key={facility.id} item sx={{ height: 'auto' }} xl={3} xs={12} sm={6} md={4}>
            <Card
                // sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'spaceBetween' }} 
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
                    title={facility.name}
                    subheader={facility.category} />
                <CardMedia
                    component="img"
                    sx={{
                        display: 'block',
                        objectFit: 'contain',
                        width: '250px',
                        height: '250px',
                        m: '0 auto'
                    }}
                    image={facility.image}
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
                        onClick={() => redirectToDetailsPage(facility.id)}>
                        {(isLoggedIn === 'false')? "Login to view details": ((loggedInUserRole === 'admin')? "View Details" : "Reserve Property")}
                    </Button>
                </CardActions>
            </Card>
        </Grid>);
}

export default FacilityItem;