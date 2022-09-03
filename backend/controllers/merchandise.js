const { request, response } = require('express')
const { v4: uuidv4 } = require('uuid');
var Merchandise = require('../models/merchandise')

//display all merchandise

const getMerchandiseData = async (request, response) => {
    try {
        const merchandiseData = await Merchandise.find();
        return response.json(merchandiseData)
    }
    catch (err) {
        console.log(err)
        return response.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


//add a new product 

const addMerchandiseData = async (request, response) => {
    const reqBody = request.body;
    for (const prop in request.body) {
        // check for empty values
        if (!reqBody[prop]) {
            return response.status(400).json({
                message: `${prop} is required`,
                success: false,
            });
        }
    }
    let productData = {
        ...reqBody,
        product_id: uuidv4()
    };
    try {
        const newProduct = new Merchandise(productData);
        await newProduct.save();
        return response.status(200).json({
            data: productData,
            success: true,
        });
    }
    catch (err) {
        console.log(err)
        return response.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

//get a product detail

const getProductData = async (request,response) => {
    const id = request.params.id;
    if (!id) {
        return response.status(400).send({
            message: "Id is required!",
            success: false,
        });
    }
    try {
        const product = await Merchandise.findOne({product_id: id});
        if (!product || product.length == 0) {
            return response.status(404).send({
                message: "Product not found!",
                success: false
            });
        }
        return response.status(200).send({
            data: product,
            success: true
        })
    }
    catch(err) {
        return response.status(500).json({
            message:"Internal server error",
            success:false
        });
    }
}


// api to delete the product

const deleteProduct = async (request,response) =>{
    const id = request.params.id;
    if (!id) {
        return response.status(400).send({
            message: "Id is required!",
            success: false,
        });
    }
    try{
        const product = await Merchandise.findOneAndDelete({product_id:id})

        return response.status(200).send({
            message: "Product Deleted",
            success: true
        })

    }
    catch(error){
        console.log(error)
        return response.status(500).json({
            message:"Internal server error",
            success:false
        });
    }
}
module.exports = { getMerchandiseData, addMerchandiseData, getProductData, deleteProduct }