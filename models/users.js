//---------------------------------------//
//----Import des modules nécessaires----//
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') // Pour appliquer au shema et appliquer unique a email

//-----------------------------------------//
//------
const UserModel = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

UserModel.plugin(uniqueValidator)

module.exports = mongoose.model("user", UserModel)

/*//----------------------------------------//
//----- Défénition du modele User --------//
const UserModel = mongoose.model('test', {
    email: {
       type: String,
       required: true,
       unique: true
    },
    password: {
       type: String,
       required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},
"user")


module.exports = UserModel*/