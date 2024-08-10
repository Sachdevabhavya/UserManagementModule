const jwt = require("jsonwebtoken")
const {secret} = require("../config/jwtConfig")


const auth_middleware = async(req,res) => {
    var token = req.params.token

    if(!token) {
        return res.status(404).json({message : "Access denied , no token provided"})
    }

    try {
        console.log("token",d_token)
        const decoded = jwt.verify(d_token, secret)
        req.user = decoded
        console.log("decoded",decoded)
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    auth_middleware
}