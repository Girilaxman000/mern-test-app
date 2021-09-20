const jwt = require('jsonwebtoken')
const User = require('../model/userSchema')

const authenticate = async (req, res, next) => {
 try{
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    const verifyToken = jwt.verify(token, 'MYNAMEISLAXMAN')
    const rootUser = await User.findOne({_id: verifyToken._id, "token": token})
    if(!rootUser){
        throw new Error('uSER not found')
    }
    req.token = token;
    req.rootUser = rootUser
    req.userID = rootUser._id

    next()

 }catch(err){
     res.status(401).send('Unauthorized')
    console.log(err)
 }
}

module.exports = authenticate