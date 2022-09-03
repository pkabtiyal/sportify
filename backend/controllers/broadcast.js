let BroadcastDB = require('../models/broadcastMessages');
const { v4: uuidv4 } = require('uuid');

exports.getMessages = (req, res)=>{
    BroadcastDB.find()
    .then(msg => {
        return res.send({ 
            success : true,
            data : msg
        })
    })
    .catch(err => {
        return res.status(500).send({ 
            success : false,
            message : "Internal server error"
        })
    })
}


// create and save new Broadcast
exports.createBroadcast = (req,res)=>{
    // input validation
    if(!req.body){
        return res.status(400).send({ 
            success : false,
            message : "Content is missing"
        })
    }
    console.log(req.body)
    const info = new BroadcastDB({
        id : uuidv4(),
        timestamp : new Date(),
        message : req.body.message,
        customers : req.body.userids
    })

    // save details in the database
    info.save(info)
    .then(data => {
        return res.status(201).json({
            message:"Broadcast added",
            success:true,
            data:info
        })
    })
    .catch(err =>{
        return res.status(500).json({
            message:"Internal server error",
            success:false
        });
    });
}