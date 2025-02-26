const express = require('express');
const FetchingSaved = require('../controllers/SavedFunctionality/FetchingSaved');

const routeforfetchingsaved = express.Router()


routeforfetchingsaved.get('/',FetchingSaved)

module.exports = routeforfetchingsaved;