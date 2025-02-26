const express = require('express')
const FetchingNotifications = require('../controllers/FetchingData/FetchingNotifications')


const routeforfetchingnotifications = express.Router()

routeforfetchingnotifications.get('/:cursor/:type',FetchingNotifications)


module.exports =routeforfetchingnotifications;