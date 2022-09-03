import './BlogPost.css';
import { Typography } from '@mui/material';
import Card_custom from '../../../components/Card_custom/Card_custom';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import blogsData from '../../../data/BlogsData';
const parse = require('html-react-parser');
/**
* @author
* @function BlogPost
**/
const baseURL = "https://sportify-backend-prd.herokuapp.com/blogs/api/blogs/blog"
const BlogPost = (props) => {

    const navigate = useNavigate();
    let params = useParams();
    const [data, setData] = useState([]);
    const resId = params.id;
    console.log(resId);
    // const details = blogsData.filter(res => res.id === (+resId));
    // const answer = details[0];
    // console.log({answer}, " details[0]");
    
    useEffect(() => {
        axios.get(baseURL+ "/" + resId).then((response) => {
            console.log(response.data);
            response.data.data.blogContent = parse(response.data.data.blogContent);
            setData(response.data.data);
            console.log(data.blogContent)
          });
    }, [])

    return (
        <div className="blogPostContainer">
            <Card_custom style={{ marginBottom: '20px' }}>
                <div className="blogHeader">
                    <span className="blogCategory" style={{ fontSize: '20px' }}>Featured</span>
                    <h1 className="postTitle" style={{ padding: '0 50px', fontWeight: 500, fontSize: '40px' }}>{data.blogTitle}</h1>
                    <span className="postedBy">posted on 04 June,2022 by Navya Jayapal</span>
                </div>

                <div className="postImageContainer">
                    <img src={data.blogImage} alt="Post Image" />
                </div>

                <div className="postContents">
                   <Typography variant="body2" color="text.secondary">
                              {data.blogContent}
                </Typography>
                </div>
            </Card_custom>
        </div>
    )

}

export default BlogPost;