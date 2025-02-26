const express = require('express');
const profileUpdate = require('../controllers/Profile/profileUpdate');

const routeforprofileupdate = express.Router()

routeforprofileupdate.put('/',profileUpdate)





module.exports = routeforprofileupdate;