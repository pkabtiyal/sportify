import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../../components/getLocalStorage';
const parse = require('html-react-parser');
/**
* @author
* @function YourBlogs
**/
const baseURL = "https://sportify-backend-prd.herokuapp.com/blogs/api/blogs/yourblog"
const baseURL2 = "https://sportify-backend-prd.herokuapp.com/blogs/api/blogs/delete"

const removeHTML= (str) =>{ 
    var tmp = document.createElement("p");
    tmp.innerHTML = str;
    return tmp.innerText;
};

const YourBlogs = (props) => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(baseURL+ "/" + getUser()._id).then((response) => {
            console.log(response.data);
           // response.data.data.shortContent= parse(response.data.data[0].shortContent);
            setData(response.data.data);
          });
    }, []);
    const myFunction = (id,e) =>{
        e.preventDefault();
        axios.delete(baseURL2+ "/" + id)
         .then(() => {
           navigate("/blogs");
         }, (error) => {
           console.log(error);
         });
        }
    return (
        <Grid>
            <Grid item sx={{marginY:"4%",marginLeft:"20%",alignContent:"center"}}>
                        <Grid container direction="row"spacing={2} columns={12}>
                            <Grid item xs={6}>   
                         <Button sx={{width:"50%"}} variant="contained" onClick={() => {
                                navigate("/blogs");
                            }}>      
                         {/* <Link sx={{color:"white"}} to={
                                 {pathname:'/blogs'}
                              }> */}
                              All Blogs
                             {/* </Link> */}
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
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} alignItems="stretch">
            {data.map((display, index) => (
                <Grid item xs={12} sm={4} md={4} key={index} sx={{display:'flex'}}>
                    <Card sx={{ maxWidth: 345, marginY: "5%", marginLeft: "15%" ,marginRight:"10%",display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
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
                        <CardActions>
                            <Button size="small" onClick={() => {
                                navigate("/editblogs/"+display.id);
                            }}>Edit</Button>
                            <Button size="small" onClick={(e)=>myFunction(display.id,e)} >Delete</Button>
                            </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
        </Grid>
        
    )

}

export default YourBlogs;