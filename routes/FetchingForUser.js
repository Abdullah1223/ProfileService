const express = require('express');
const FetchingData = require('../controllers/FetchingData/FetchingData');
const routeforfetchingforuser = express.Router();
routeforfetchingforuser.get('/',FetchingData)


module.exports = routeforfetchingforuser;