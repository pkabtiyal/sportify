const express = require('express')
const Stripe = require('stripe');
const Merchandise = require('../models/merchandise');
const stripe = Stripe(process.env.STRIPE_KEY)

const CLIENT_URL = process.env.FRONTEND_URL

require("dotenv").config();

const checkoutSession = async (request,response) => {
    const line_items = request.body.backendReqBody.map((item)=>{
        return{
            price_data: {
                currency: 'CAD',
                product_data: {
                    name: item.plan_name,
                },
                unit_amount: item.total_cost * 100,
              },
              quantity: 1,
        }
    })
    console.log(line_items)
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${CLIENT_URL}/purchased-membership?payment=success`,
        cancel_url: `${CLIENT_URL}/membership`,
      });
    
      response.send({url: session.url});
    
}

const webHook = async (request,response) => {
    console.log(request.body);
    const productDetails = new Merchandise({
        product_id: 88,
        product_name: 'request.body.product_name',
        product_price: 313,
        product_description: request.body,
        product_image: 'request.body.product_image'
    })

   await productDetails.save()
    response.send(200);
}
// const calculateOrderAmount = (items) => {
//     // Replace this constant with a calculation of the order's amount
//     // Calculate the order total on the server to prevent
//     // people from directly manipulating the amount on the client
//     return 1700;
// };

// app.post("/create-payment-intent", async (request, response) => {
//     const items = request.body;

//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: calculateOrderAmount(items),
//         currency: "cad",
//         payment_method_types: ["card", "afterpay_clearpay"]
//     });

//     response.send({
//         clientSecret: paymentIntent.client_secret,
//     });
// });
module.exports = {checkoutSession, webHook}