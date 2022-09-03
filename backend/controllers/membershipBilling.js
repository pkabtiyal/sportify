var MembershipBillingDB = require('../models/membershipBilling');

// retrieve billing information based on user id
exports.findBillingInfo = (req, res)=>{
    console.log("findBillingInfo called");
    if(req.params.id){
        const id = String(req.params.id);

        MembershipBillingDB.findOne({ id: id})
            .then(data =>{
                if(!data){
                    return res.send({ 
                        success : true,
                        data : "",
                        message : "No billing information found ",
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    })
                }else{
                    return res.send({ 
                        success : true,
                        data : data,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    })
                }
            })
            .catch(err =>{
                console.log(err);
                return res.status(500).send({ 
                    success : false,
                    message : "Internal server error"
                })
            })

    }
    else{
        return res.status(400).send({ 
            success : false,
            message : "User id missing in the request"
        })
    }
}

// create and save new Billing info
exports.createBillingInfo = (req,res)=>{
    console.log("createBillingInfo called");
    // input validation
    if(!req.body){
        return res.status(400).send({ 
            success : false,
            message : "Content is missing"
        })
    }

    const billingInfo = new MembershipBillingDB({
        id : req.body.id,
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        address : req.body.address,
        city : req.body.city,
        state : req.body.state,
        zip_code : req.body.zip_code,
        country : req.body.country
    })

    // save details in the database
    billingInfo.save(billingInfo)
        .then(data => {
            return res.status(201).json({
                message:"Billing info added",
                success:true,
                data:billingInfo
            })
        })
        .catch(err =>{
            return res.status(500).json({
                message:"Internal server error",
                success:false
            });
        });
}

// Update exising billing info
exports.updateBillingInfo = (req, res)=>{
    console.log("updateBillingInfo called");
    if(!req.body){
        return res.status(400).send({ 
            success : false,
            message : "Content is missing"
        })
    }

    const id = req.params.id;
    MembershipBillingDB.findOneAndUpdate({id:id}, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                return res.status(404).send({ 
                    success : false,
                    message : "No billing information found "
                })
            }else{
                return res.status(200).json({
                    message:"Billing info updated",
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