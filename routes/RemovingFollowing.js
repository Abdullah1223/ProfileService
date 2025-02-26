const express= require('express');
const RemovingFollowing = require('../controllers/Following/RemovingFollowing');

const routeforremovingfollowing = express.Router();

routeforremovingfollowing.delete('/:_id',RemovingFollowing)


module.exports = routeforremovingfollowing;