import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const protect = async (req, res, next) => {
    console.log(req.headers.authorization)

    try {

        const token = req.cookies.token

        // if (headersToken && headersToken.startsWith('Bearer')){
        //     token = headersToken.split(" ")[1]
        // }

        if (!token) {
            const error = new Error("you are not logged in")
            error.statusCode = 401
            return next(error)
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)

        const user = await User.findById(decoded.id)
        if (!user) {
            const error = new Error("the user with the given token does not exit")
            error.statusCode = 401
            return next(error)
        }
        req.user = user
        next()

    } catch (error) {
        return next(err)
    }
}