//--------------------------------------------------//
//------------Authorisation par token--------------//

//-----Import des modules nécéssaires------//
const jwt = require('jsonwebtoken')

//----Methode extraction du token--------//
const extractBearer = authorization => {

    if (typeof authorization !== 'string') {
        return false
    }

    // Isolation du token
    const matches = authorization.match(/(bearer)\s+(\S+)/i)
    console.log(matches);
    return matches && matches[2]
}

//------------------------------------------------------//
//------------Vérification du token--------------------//
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization && extractBearer(req.headers.authorization)
        console.log('TOKEN:' + token)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId
        req.auth = { userId }
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User Id non valable'
        } else {
            next()
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        })
    }
}

