//-----------------------------------------//
//-------Import des modules nécéssaires----//
const express = require('express')
const router = express.Router();

//--------Import des modeles---------------//
const sauceCtrl = require('../controller/sauce')
const auth = require('../middleware/auth')           // Pour appliquer la protec token sur les routes sauce

const multer = require("../middleware/multer.js");

//---------------------------------------//
//----Routage de la ressource User------//
router.get('/', auth, sauceCtrl.getAllSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.post('/', auth, multer, sauceCtrl.createSauce)
router.put('/:id', auth, multer, sauceCtrl.updateSauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.post('/:id/like', auth, sauceCtrl.thumbSauce)



module.exports = router