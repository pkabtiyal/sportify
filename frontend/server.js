//Install express server
const express = require('express');
const path = require('path');
const app = express();

const stripe = require("stripe")('sk_test_51LAz4KC9WWOmeUQqrPNjR1MoMg8QUwat6VjKu7criZO85933G7zghbRiOZl4u6L8aY4VetIlnUEkxANmg24K018D000U1euugz');
const cors = require('cors');

// Serve only the static files form the dist 
// directory
const corsOptions = {

    allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],

    origin: "*",

    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",

    preflightContinue: false,

};
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/build'));
app.get('/*',
    function (req, res) {
        res.sendFile(path.join(__dirname + '/build/index.html'));
    });

// Start the app by listening on the default Heroku port


app.listen(process.env.PORT || 8080);