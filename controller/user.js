//-----------------------------------------//
//-------Controleur email et mdp-----------//

//-----Import des modeles nécéssaires------//
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//------Fonction Password => hashage, Salage---//
/**
 * Protection mot de passe hashage + salage
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.signup = (req, res, next) => {
   bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND))
      .then(hash => {
         const user = new User({
            email: req.body.email,
            password: hash
         })
         //Enregistre l utilisateur dans la Bdd
         user.save()
            .then(() => res.status(201).json({ message: 'User created !' }))
            .catch(error => res.status(400).json({ message: 'Database error' }))
      })
      .catch(error => res.status(500).json({ message: 'Hash error' }))
}

//-------Fonction Login via Email --------------//
/**
 * fonction login email
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns Doit renvoyer le token en fonction de l id
 */
exports.login = (req, res, next) => {
   User.findOne({ email: req.body.email })  //Cherche utilisateur email = email de la requete
      .then(user => {
         if (!user) {
            return req.status(401).json({ error: 'User not found !' })
         }
         bcrypt.compare(req.body.password, user.password)   //Bcrypt compare le mdp envoye par la requete avec le mdp user
            .then(valid => {
               if (!valid) {
                  return res.status(401).json({ error: 'incorrect password' })
               }
               res.status(200).json({
                  userId: user._id,          //Si c valid envoi id utilisateur +:
                  token: jwt.sign(           //Envoi du token
                     { userId: user._id },
                     process.env.JWT_SECRET,
                     { expiresIn: process.env.JWT_DURING }
                  )
               })
            })
            .catch(error => res.status(500).json({ message: 'Database error' }))
      })
      .catch(error => res.status(500).json({ message: 'Database error' }))
}