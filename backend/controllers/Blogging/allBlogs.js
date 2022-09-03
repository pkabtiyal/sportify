//Author: Navya Jayapal (B00886554)
//Email: nv408879@dal.ca
const { v4: uuidv4 } = require('uuid');
const blogs = require("../../models/Blogging/allBlogs");
const getBlog = (req, res, next) => {
    blogs.findOne({id:req.params.id})
            .then(data =>{
                if(!data){
                    return res.send({ 
                        success : true,
                        data : "",
                        message : "No such Blog"
                    })
                }else{
                    return res.send({ 
                        success : true,
                        data : data
                    })
                }
            })
            .catch(err =>{
                return res.status(500).send({ 
                    success : false,
                    message : "Internal server error"
                })
            })
  };

  const postBlog = (req,res)=> {
    if(!req.body){
        return res.status(400).send({ 
            success : false,
            message : "Not able to post blog"
        })
    }
    
    const blogInfo = new blogs({
        id : req.body.jsonData.blogId,
        userId : req.body.jsonData.userId,
        blogTitle : req.body.jsonData.blogTitle,
        blogImage:req.body.jsonData.blogImage,
        blogContent : req.body.jsonData.blogContent,
        shortContent : req.body.jsonData.shortContent,
        timeStamp: req.body.jsonData.timeStamp
    })
    console.log(blogInfo);
    // save details in the database
    blogInfo.save(blogInfo)
        .then(data => {
            return res.status(201).json({
                message:"Blog added",
                success:true,
                data:blogInfo
            })
        })
        .catch(err =>{
            return res.status(500).json({
                message:"Internal server error",
                success:false
            });
        });
};

  const getAllBlogs = (req, res, next) => {
    const allBlogs = blogs.find({}).then(data=>
        {
            if(!data){
                return res.send({ 
                    success : false,
                    data : "",
                    message : "No blogs found "
                })
            }else{
                return res.send({ 
                    success : true,
                    data : data
                })
            }
        }
        )
  };

  const getYourBlogs = (req, res, next) => {
    blogs.find({userId:req.params.id})
            .then(data =>{
                if(!data){
                    return res.send({ 
                        success : true,
                        data : "",
                        message : "No such user"
                    })
                }else{
                    return res.send({ 
                        success : true,
                        data : data
                    })
                }
            })
            .catch(err =>{
                return res.status(500).send({ 
                    success : false,
                    message : "Internal server error"
                })
            })
  };

  const updateBlog = (req,res)=> {
    console.log(req.body);
    if(!req.body){
        return res.status(400).send({ 
            success : false,
            message : "Content is missing"
        })
    }

    const id = req.body.jsonData.id;
    blogs.findOneAndUpdate({id:id}, req.body.jsonData, { useFindAndModify: false})
        .then(data => {
            if(!data){
                return res.status(404).send({ 
                    success : false,
                    message : "No blog found"
                })
            }else{
                return res.status(200).json({
                    message:"Blog Updated",
                    success:true
                })
            }
        })
        .catch(err =>{
            return res.status(500).json({
                message:"Internal server error",
                success:false
            });
        })
};


const deleteBlog = (req,res)=> {
    blogs.findOneAndDelete({id:req.params.id}, function(err){
        console.log(err);
        if(err){
            return res.status(500).json({
                message:"Internal server error",
                success:false
            });
        } else {
            return res.status(200).json({
                message:"Blog Deleted",
                success:true
            })
        }
     });
    };




module.exports = {getAllBlogs,getBlog,getYourBlogs,postBlog,updateBlog,deleteBlog};