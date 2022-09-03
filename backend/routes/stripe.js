const express = require('express')
const router = express.Router();

const stripeController = require('../controllers/stripe')


router.post('/api/stripe/create-checkout-session', stripeController.checkoutSession)
router.post('/api/stripe/webhook', stripeController.webHook)


module.exports = router;