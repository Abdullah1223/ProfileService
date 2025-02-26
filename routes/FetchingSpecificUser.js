const express = require('express');
const FetchingSpecificUser = require('../controllers/FetchingData/FetchingSpecificUser');


const routeforfetchingspecificuser = express.Router()

routeforfetchingspecificuser.get('/:userid',FetchingSpecificUser)
module.exports = routeforfetchingspecificuser;