const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports.generateToken = async(payload)=> {
    const token = jwt.sign(payload , process.env.SECRET_KEY ,{ expiresIn: 10 * 60 * 100 });
    return token ;
}

module.exports.verifyToken = async(token)=> {
    return jwt.verify(token , process.env.SECRET_KEY);
}

