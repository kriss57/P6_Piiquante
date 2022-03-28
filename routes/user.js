//-----------------------------------------//
//-------Import des modules nécéssaires----//
const express = require('express')

//--------Import contrololleur user--------//
const userCtrl = require('../controller/user')

//------Récupération du routeur d'express--------//
let router = express.Router();

//---------------------------------------//
//----Routage de la ressource User------//
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)


module.exports = router

