const express = require('express')
const route = express.Router();

const merchandiseController = require('../controllers/merchandise')


route.get('/api/merchandise/display-merchandise/all', merchandiseController.getMerchandiseData)
route.post('/api/merchandise/add-merchandise', merchandiseController.addMerchandiseData)
route.get('/api/merchandise/display-merchandise/:id', merchandiseController.getProductData)
route.delete('/api/merchandise/delete-merchandise/:id',merchandiseController.deleteProduct)

module.exports = route 