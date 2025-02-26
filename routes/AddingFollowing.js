const express = require('express');
const AddingFollowing = require('../controllers/Following/AddingFollowing');

const routeforaddingfollowing = express.Router()

routeforaddingfollowing.post('/',AddingFollowing)

module.exports = routeforaddingfollowing;