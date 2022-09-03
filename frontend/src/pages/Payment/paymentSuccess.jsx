import React from 'react';
import {Grid,Card,CardContent,Typography,CardActions,Button} from '@mui/material';

import { useNavigate } from 'react-router-dom';

function PaymentSuccess() {

const navigate = useNavigate();

const handleClick =() => {

    navigate('/')
}
  return (
    <Grid item xl={3} lg={4} md={6} sm={6} xs={11}>
                        <Card elevation={7}>
                            <CardContent>
                                <Typography align="center" gutterBottom variant="h6" component="div"
                                    style={{ textTransform: 'capitalize' }}>
                                    Payment Successful
                                </Typography>
                                <Typography align="center" gutterBottom variant="subtitle1" component="div"
                                    style={{ textTransform: 'capitalize' }}>
                                    Bonjour! To our new member
                                </Typography>
                                <Typography align="center" gutterBottom variant="body2" component="div"
                                    style={{ textTransform: 'capitalize' }}>
                                    Membership activated
                                </Typography>
                            </CardContent>
                            <CardActions>
                                    <Button size="medium"
                                            color="primary"
                                            variant="contained"
                                            style={{display: 'flex', margin: '0 auto'}}
                                            onClick={handleClick}
                                    >
                                        Back to My Profile
                                    </Button>
                                </CardActions>
                        </Card>
                    </Grid>
  )
}

export default PaymentSuccess;