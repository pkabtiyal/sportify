import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent, CardMedia, Button } from '@mui/material';
import { Grid, Container, TextField } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import Sportify from '../../assets/images/Sportify.png'
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { primaryColor, whiteThemeColor } from "../../Theme/colors";
import { getUser } from "../../components/getLocalStorage";
import {getBackendUrl} from "../../components/getUrl" 

function Products() {
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState('');

    const navigate = useNavigate();
    const [isLoggedIn] = useState(localStorage.getItem('isLogin'));
    const [loggedInUserRole] = useState(getUser()?.profile);
    const { state } = useLocation();
    const [snackbarMsg] = useState(state?.snackbarMsg);
    const [snackbarOpen, setSnackbarOpen] = useState({ open: (!!state?.snackbar), vertical: 'top', horizontal: 'right' });
    const { open, vertical, horizontal } = snackbarOpen;

    const redirectToDetailsPage = (productId) => {
        navigate('/product/' + productId);
    }

    // const onCloseSnackbar = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setSnackbarOpen({ ...snackbarOpen, open: false });
    //     navigate(".", { replace: true });
    // }

    // const snackbarCloseAction = (<IconButton
    //     size="small"
    //     aria-label="close"
    //     color="inherit"
    //     onClick={onCloseSnackbar}
    // >
    //     <CloseIcon fontSize="small" />
    // </IconButton>);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onAddNewProductClick = () => {
        navigate('/product/add-new');
    }

    useEffect(() => {
        axios.get(`${getBackendUrl()}/api/merchandise/display-merchandise/all`).then((res) => {
            console.log(res)
            setProducts(res.data)
        }).then((err) => {
            console.log(err);
        });
    }, [])

    return (

        <div>
         {(loggedInUserRole === 'admin') &&
                <div style={{ display: "flex", justifyContent: 'flex-end'}}> 
                    <Button 
                        sx={{ m: '10px', color: whiteThemeColor, backgroundColor: primaryColor }}
                        style={{display:'flex',justifyContent:'right'}}
                        variant="contained"
                        onClick={onAddNewProductClick}>
                        <AddIcon sx={{ mr: '3px' }} /> Add new Product
                </Button>
                </div>}
            <Container maxWidth="md" sx={{ mb: 3, mt: 4 }}>
                <Typography gutterBottom variant="h3" component="div" align='center' marginBottom={3}>
                    Products
                </Typography>
                <Grid container justifyContent='center'>
                    <TextField placeholder='Search...' value={search} color='secondary' onChange={handleSearchChange} variant='outlined' sx={{ width: '50ch' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchOutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Container>
            <Grid
                container
                style={{ padding: 20 }}
                // height="100%"
                alignItems="center"
                justifyContent="center"
                // className="bg-gray padding-ub"
                rowSpacing={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 7 }}
                columnSpacing={{ xs: 1, sm: 2, md: 5, lg: 6, xl: 8 }}>
                {products.filter((product) => product.product_name.toLowerCase().includes(search.toLowerCase())).map((product) => (
                    <Grid item xl={3} lg={4} md={6} sm={6} xs={11}>
                        <Card elevation={7}>
                            <CardMedia
                                component="img"
                                height="300"
                                width="300"
                                margin="15px auto 15px auto"
                                image={product.product_image ?? Sportify}
                                alt={product.product_id}
                            />
                            <CardContent>
                                <Typography align="center" gutterBottom variant="h6" component="div"
                                    style={{ textTransform: 'capitalize' }}>
                                    {product.product_name}
                                </Typography>
                                <Typography align="center" gutterBottom variant="subtitle1" component="div"
                                    style={{ textTransform: 'capitalize' }}>
                                    CAD {product.product_price}
                                </Typography>
                                <Typography align="center" gutterBottom variant="body2" component="div"
                                    style={{ textTransform: 'capitalize' }}>
                                    {product.product_description}
                                </Typography>
                            </CardContent>
                            {(loggedInUserRole === 'admin') && 
                            <CardActions 
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    backgroundColor: primaryColor
                                }}
                            >
                                <Button
                                    sx={{ color: whiteThemeColor, width: '100%' }}
                                    onClick={() => redirectToDetailsPage(product.product_id)}>
                                    View Details
                                </Button>
                            </CardActions>}
                        </Card>
                    </Grid>
                ))
                }

            </Grid>
            {/* <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={3000}
                onClose={onCloseSnackbar}
                action={snackbarCloseAction}
            >
                <MuiAlert onClose={onCloseSnackbar} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
                    {snackbarMsg}
                </MuiAlert>
            </Snackbar> */}
        </div>
    )
}

export default Products