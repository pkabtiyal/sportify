//Author@Soham Kansodaria(B00865680)
const express = require('express');
const route = express.Router()

const rewardsController = require('../controllers/rewards');
const authentication = require('../middleware/authentication')

route.post('/api/get-points',authentication.verifyRequest, rewardsController.getPoints);
route.post('/api/update-points',authentication.verifyRequest, rewardsController.updatePoints);

module.exports = route;