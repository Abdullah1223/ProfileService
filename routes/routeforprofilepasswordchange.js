const express = require('express');
const profilePasswordChange = require('../controllers/Profile/profilePasswordChange');

const routeforprofilepasswordchange = express.Router()

routeforprofilepasswordchange.put('/',profilePasswordChange)


module.exports  = routeforprofilepasswordchange;





