const express = require('express');
const AddingToSaved = require('../controllers/SavedFunctionality/AddingToSaved');

const routeforsaving = express.Router()

routeforsaving.post('/',AddingToSaved)


module.exports = routeforsaving;