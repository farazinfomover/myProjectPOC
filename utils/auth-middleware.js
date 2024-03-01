const jwt = require('jsonwebtoken');
const empModel = require("../models/user.model");

exports.checkUserAuth = async (req, res, next) => {
    let token
    const { authorization } = req.headers

    if (authorization && authorization.startsWith('Bearer')) {
        try {
            // Get Token from header
            token = authorization.split(' ')[1]

            // Verify Token
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

            // Get User from Token
            req.user = await empModel.findById(userID).select('-password')

            next()
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: "Unauthorized User" });
        }
    }
    if (!token) {
        return res.status(401).json({ message: "Unauthorized User, No Token" });
    }
}