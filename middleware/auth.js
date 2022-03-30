//--------------------------------------------------//
//------------Authorisation par token--------------//

//-----Import des modules nécéssaires------//
const jwt = require('jsonwebtoken')

//----Methode extraction du token--------//
/**
 * 
 * @param {string} authorization 
 * @returns matches et token
 */
const extractBearer = authorization => {

    if (typeof authorization !== 'string') {
        return false
    }

    // Isolation du token
    const matches = authorization.match(/(bearer)\s+(\S+)/i)
    console.log('m=' + matches);
    console.log('m=' + matches[2]);
    return matches && matches[2]
}

//------------------------------------------------------//
//------------Vérification du token--------------------//
/**
 * Middleware d'autorisation au route
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
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

