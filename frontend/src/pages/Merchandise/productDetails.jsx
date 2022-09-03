import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Card, CardActions, CardContent, CardMedia, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getBackendUrl } from "../../components/getUrl";
import { primaryColor, whiteThemeColor } from "../../Theme/colors";

function Products() {
    const [product, setProduct] = useState({});
    const { state } = useLocation();
    const navigate = useNavigate();

    const notify = (type, msg) => {
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

    const redirectToMerchandisePage = (productId) => {
        axios.delete(`${getBackendUrl()}/api/merchandise/delete-merchandise/` + productId).then((res) => {
            console.log(res)
            notify("success","Successfully deleted the product")
            navigate('/store')
        }).then((err) => {
            console.log(err)
        })
    }

    const onBack = () => {
        navigate('/store')
    }

    let params = useParams();
    let productId = params.productId;

    useEffect(() => {
        axios.get(`${getBackendUrl()}/api/merchandise/display-merchandise/` + productId).then((res) => {
            console.log(res)
            setProduct(res.data.data)
        }).then((err) => {
            console.log(err);
        });
    }, [])

    return (

        <div>
            <div style={{ display: "flex", justifyContent: 'flex-start' }}>
                <Button
                    sx={{ m: '10px', color: whiteThemeColor, backgroundColor: primaryColor }}
                    variant="contained"
                    onClick={onBack}>
                    <ArrowBackIcon sx={{ mr: '3px' }} /> Back
                </Button>
            </div>
            <Grid
                container
                style={{ padding: 20 }}
                // height="100%"
                alignItems="center"
                justifyContent="center"
                // className="bg-gray padding-ub"
                rowSpacing={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 7 }}
                columnSpacing={{ xs: 1, sm: 2, md: 5, lg: 6, xl: 8 }}>
                {product ?
                    <Grid item xl={3} lg={4} md={6} sm={6} xs={11}>
                        <Card elevation={7}>
                            <CardMedia
                                component="img"
                                height="300"
                                width="300"
                                margin="15px auto 15px auto"
                                image={product.product_image}
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
                            <CardActions
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    backgroundColor: '#ff1744'
                                }}
                            >
                                <Button
                                    sx={{ color: whiteThemeColor, width: '100%' }}
                                    onClick={() => redirectToMerchandisePage(product.product_id)}>
                                    Delete Product
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    : <div>Loading</div>
                }
            </Grid>
        </div>
    )
}

export default Products