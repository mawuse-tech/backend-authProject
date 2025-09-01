import User from "./../models/user.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { sendMail } from "../config/email.js";
import crypto from 'crypto'


export const addUser = async (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email, !password, !confirmPassword) {
        return res.status(400).json({ msg: 'all fields are required' })
    }

    try {
        const user = await User.create(req.body);

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })

        res.cookie('token', token, {
            httpOnly: true, //avoid client side tempering
            maxAge: 24 * 60 * 60 * 1000 //1 day
        })

        res.status(201).json({
            success: true,
            statusCode: 200,
            user,
            // token
        })
    } catch (err) {

        next(err)
    }
};

export const Login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new Error("email and password required")
        error.statusCode = 400
        return next(error)
    }

    try {
        const user = await User.findOne({ email })

        if (!user) {
            const error = new Error("Email or password is wrong")
            error.statusCode = 401
            return next(error)
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            const error = new Error("email or password is wrong")
            error.statusCode = 401
            return next(error)
        }

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        res.cookie('token', token, {
            httpOnly: true, //avoid client side tempering
            maxAge: 24 * 60 * 60 * 1000 //1 day
        })

        return res.status(200).json({
            success: true,
            statusCode: 200,
            user,
            // token
        })


    } catch (error) {

    }

}

export const userInfo = async (req, res, next) => {
    const token = req.cookies.token

    try {
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
        res.status(200).json({
            success: true,
            statusCode: 200,
            user
        })

    } catch (error) {
        next(error)
    }

}


export const logout = async (req, res, next) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
        })
    } catch (error) {
        next(error)
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('could not find user with given email');
            error.statusCode = 404
            return next(error)
        }

        const resetToken = user.createResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        //send link back
        const resetUrl = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;
        const message = `there is been a request for a password reset. kindly use the link below to reset it \n\n${resetUrl}`

        try {
            await sendMail({
                email: user.email,
                subject: 'password change request recieved',
                message: message
            });

            res.status(200).json({
                success: true,
                message: 'password rest link sent to your email, check it'
            })
        } catch (error) {
            user.passwordResetToken = undefined
            user.passwordResetTokenExpiry = undefined
            await user.save({ validateBeforeSave: false })
            next(error)
        }

    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, res, next) => {
    const { token } = req.params
    const encryptedToken = crypto.createHash('sha256').update(token).digest('hex')

    try {
        const user = await User.findOne({ passwordResetToken: encryptedToken, passwordResetTokenExpiry: { $gt: Date.now() } });

    if (!user) {
        const error = new Error('token has expired')
        error.statusCode = 400
       return next(error)
    };

    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword

    user.passwordResetToken = undefined
    user.passwordResetTokenExpiry = undefined

    await user.save()

    res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'password reset successfully'
    })
    } catch (error) {
        next(error)
    }
}

