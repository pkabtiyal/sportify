//Author@Soham Kansodaria(B00865680)
const express = require('express');
const route = express.Router()

const couponsController = require('../controllers/coupons');
const authentication = require('../middleware/authentication')

route.get('/api/get-coupons',authentication.verifyRequest, couponsController.getCoupons);

module.exports = route;