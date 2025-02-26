const express = require('express');
const FetchingArtistsForHome = require('../controllers/FetchingData/FetchingArtistsForHome');



const routeforfetchingartistsforhome = express.Router()

routeforfetchingartistsforhome.get('/',FetchingArtistsForHome)

module.exports = routeforfetchingartistsforhome;