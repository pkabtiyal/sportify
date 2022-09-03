//Author@Soham Kansodaria(B00865680)
const express = require('express');
const route = express.Router()

const userController = require('../controllers/user');
const authentication = require('../middleware/authentication')

route.post('/api/signup', userController.register);
route.get('/api/verify-account', userController.verifyAccount);
route.post('/api/signin', userController.signin);
route.get('/api/signout', authentication.verifyRequest,userController.signOut);
route.post('/api/edit-profile', authentication.verifyRequest, userController.editProfile);
route.post('/api/reset-password', userController.resetPassword);
route.get('/api/change-password', userController.resetPasswordCheck);
route.post('/api/change-password', userController.changePassword);
route.post('/api/delete-profile',authentication.verifyRequest, userController.deleteProfile);

module.exports = route;