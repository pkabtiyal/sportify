const express = require('express');
const route = express.Router()
const blogController = require('../controllers/Blogging/allBlogs');

// blogs get apis
route.get('/api/blogs/allblogs', blogController.getAllBlogs); 
route.get('/api/blogs/blog/:id', blogController.getBlog); 
route.get('/api/blogs/yourblog/:id', blogController.getYourBlogs);

// blogs post api.
route.post('/api/blogs/postBlog', blogController.postBlog);
//blogs update api
route.put('/api/blogs/updateBlog', blogController.updateBlog);

// to delet blog
route.delete('/api/blogs/delete/:id', blogController.deleteBlog);
module.exports = route;

