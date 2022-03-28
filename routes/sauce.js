//-----------------------------------------//
//-------Import des modules nécéssaires----//
const express = require('express')
const router = express.Router();

//--------Import des modeles---------------//
const sauceCtrl = require('../controller/sauce')
const auth = require('../middleware/auth')           // Pour appliquer la protec token sur les routes sauce

const multer = require("../middleware/multer");

//---------------------------------------//
//----Routage de la ressource User------//
router.get('/', auth, sauceCtrl.getAllSauce)        // Fait //Voir authorisation 
router.get('/:id', auth, sauceCtrl.getOneSauce)    //Fait     //Voir authorisation
router.post('/', auth, multer, sauceCtrl.createSauce)       // Fait
router.put('/:id', auth, multer, sauceCtrl.updateSauce)          // Fait
router.delete('/:id', auth, sauceCtrl.deleteSauce)         //Fait
router.post('/:id/like', auth, sauceCtrl.thumbSauce)



module.exports = router