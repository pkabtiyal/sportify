let MembershipDB = require('../models/membership');
const { v4: uuidv4 } = require('uuid');

// retrieve membership details using id
exports.findMembership = (req, res)=>{
    if(req.params.id){
        const id = req.params.id;
        MembershipDB.findOne({id:id})
            .then(data =>{
                if(!data){
                    return res.send({ 
                        success : true,
                        data : "",
                        message : "No membership found "
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

    }
    else{
        MembershipDB.find()
            .then(memShip => {
                return res.send({ 
                    success : true,
                    data : memShip
                })
            })
            .catch(err => {
                return res.status(500).send({ 
                    success : false,
                    message : "Internal server error"
                })
            })
    }
}

// retrieve user-specific active memberships 
exports.findMemberships = (req, res)=>{
    if(req.params.user_id){
        const user_id = req.params.user_id;
        MembershipDB.find({user_id:user_id, status:'Ongoing'})
            .then(data =>{
                if(!data){
                    return res.send({ 
                        success : true,
                        data : "",
                        message : "No membership found "
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

    }
}

// create and save new membership
exports.createMembership = (req,res)=>{
    // input validation
    console.log("--- in createMembership----");
    if(!req.body){
        return res.status(400).send({ 
            success : false,
            message : "Content is missing"
        })
    }
    console.log(req.body)
    const memInfo = new MembershipDB({
        id : uuidv4(),
        user_id : req.body.userId,
        total_cost : req.body.backendReqBody[0].total_cost,
        plan_name : req.body.backendReqBody[0].plan_name,
        start_date : req.body.backendReqBody[0].start_date,
        end_date : req.body.backendReqBody[0].end_date,
        status : req.body.backendReqBody[0].status
    })

    // save details in the database
    memInfo.save(memInfo)
        .then(data => {
            return res.status(201).json({
                message:"Membership added",
                success:true,
                data:memInfo
            })
        })
        .catch(err =>{
            return res.status(500).json({
                message:"Internal server error",
                success:false
            });
        });
}

// Update membership
exports.updateMembership = (req, res)=>{
    if(!req.body){
        return res.status(400).send({ 
            success : false,
            message : "Content is missing"
        })
    }

    const id = req.params.id;
    MembershipDB.findOneAndUpdate({id:id}, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                return res.status(404).send({ 
                    success : false,
                    message : "No membership found "
                })
            }else{
                return res.status(200).json({
                    message:"Membership updated",
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
}

//cancel membership
exports.cancelMembership = (req, res)=>{

    console.log("in cancel membership");
    const user_id = req.body.user_id;
    MembershipDB.findOneAndUpdate({status:'Ongoing', user_id:user_id}, {status:'Cancelled'}, { useFindAndModify: false})
        .then(data => {
            if(!data){
                return res.status(404).send({ 
                    success : false,
                    message : "No membership found "
                })
            }else{
                return res.status(200).json({
                    message:"Membership updated",
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
}