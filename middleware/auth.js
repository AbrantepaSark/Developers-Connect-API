const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    //Get token from header
    const token = req.header('x-auth-token')

    if(!token){
        return res.status(401).json({msg: 'No token, authorization denied'})
    }

    //verify token
    try {
        const decoded = jwt.verify(token,config.get('jwtToken'))
        req.user = decoded.user
        next()
    } catch (error) {
        res.status(401).json({msg: 'Invalid token'});
    }
}