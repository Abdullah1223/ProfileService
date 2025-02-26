const express = require('express')
const FetchingFollowing = require('../controllers/FetchingData/FetchingFollowing')
const routerforfetchingfollowing = express.Router()

routerforfetchingfollowing.get('/:cursor/:role',FetchingFollowing)


module.exports = routerforfetchingfollowing;