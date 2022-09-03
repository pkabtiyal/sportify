const express = require('express');
const route = express.Router()

const cont = require('../controllers/broadcast');

route.get('/api/broadcasts', cont.getMessages);
route.post('/api/broadcasts', cont.createBroadcast);