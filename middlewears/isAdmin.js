import jwt from 'jsonwebtoken'
import winston from 'winston';
import User from '../model/UserSchema.js';
const isAdminAndModerator = async (req, res, next) => {

    const getToken = req.headers.authorization
    try {
        jwt.verify(getToken, process.env.PRV_KEY, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ error: "invalid token" })
            }
            const findUser = await User.findById(decoded.id).exec()
            if (!findUser) {
                return res.status(400).json({ error: "User not found" })
            }
            if (findUser.role === 'admin' || findUser.role === 'moderator' || findUser.role === 'dev') {
                return next();
            } else {
                return res.status(400).json({ error: "You are not authorized to perform this action" })
            }
        });


    } catch (err) {
        console.log(err.message);
        winston.error(err.message);
        return res.status(401).json(err.message);
    }
};
const isAdminOnly = async (req, res, next) => {

    const getToken = req.headers.authorization
    try {
        jwt.verify(getToken, process.env.PRV_KEY, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ error: "invalid token" })
            }
            const findUser = await User.findById(decoded.id).exec()
            if (!findUser) {
                return res.status(400).json({ error: "User not found" })
            }
            if (findUser.role === 'admin' || findUser.role === 'dev') {
                return next();
            } else {
                return res.status(400).json({ error: "You are not authorized to perform this action" })
            }
        });


    } catch (err) {
        console.log(err.message);
        winston.error(err.message);
        return res.status(401).json(err.message);
    }
};

export default { isAdminAndModerator, isAdminOnly };
