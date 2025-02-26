const express = require('express');
const RemovingFromSaved = require('../controllers/SavedFunctionality/RemovingFromSaved');

const routeforemovingfromsaved = express.Router()

routeforemovingfromsaved.delete('/:_id/:genre',RemovingFromSaved)

module.exports=routeforemovingfromsaved;