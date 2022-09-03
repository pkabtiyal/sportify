import { Button, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const parse = require('html-react-parser');

/**
* @author
* @function Blogs
**/
///api/blogs/allblogs
const baseURL = "https://sportify-backend-prd.herokuapp.com/blogs/api/blogs/allblogs"
const Blogs = (props) => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const notify = () => toast("Successfully liked this post!");
    const removeHTML= (str) =>{ 
        var tmp = document.createElement("p");
        tmp.innerHTML = str;
        return tmp.innerText;
    };
    useEffect(() => {
        axios.get(baseURL).then((response) => {
            console.log(response.data);
            response.data.data.shortContent= removeHTML(response.data.data[0].shortContent);
            setData(response.data.data);
            console.log(response.data.data[0].shortContent);
          });
    }, [])
    return (
        <Grid>
            <Grid item sx={{marginY:"4%",marginLeft:"20%",alignContent:"center"}}>
                        <Grid container direction="row"spacing={2} columns={12}>
                            <Grid item xs={6}>   
                          <Button sx={{width:"50%"}} variant="contained" onClick={() => {
                                navigate("/yourblogs");
                            }}>      
                            Your Blogs
                        </Button>
                            </Grid>
                            <Grid item xs={6}>
                           
                         <Button sx={{width:"50%"}} variant="contained" onClick={() => {
                                navigate("/createblog");
                            }}>
                         
                            Create Blog
                             
                         </Button>
                       
                            </Grid>
                        </Grid>
                        
                        
                    </Grid>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{mb:"70px"}}>
            {data.map((display, index) => (
                <Grid item xs={12} sm={4} md={4} key={index}>
                    <Card sx={{ maxWidth: 345, marginY: "5%", marginLeft: "15%" ,marginRight:"10%",height:"100%"}}>
                        <CardActionArea onClick={() => {
                                navigate("/blogpost/"+display.id);
                            }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={display.blogImage}
                                alt={display.id}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {display.blogTitle}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                 {parse(display.shortContent)}
                                </Typography>
                            </CardContent>
                            

                        </CardActionArea>
                        {/* <CardActions>
                                <IconButton aria-label="add to favorites" onClick={notify}>
                                <ToastContainer />
                                    <FavoriteIcon />
                                </IconButton>
                         </CardActions> */}

                    </Card>
                </Grid>
            ))}
        </Grid>
        </Grid>
        
    )

}

export default Blogs;