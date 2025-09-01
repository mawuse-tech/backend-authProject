import bcrypt from "bcryptjs";
import crypto from 'crypto'

import { model, Schema } from "mongoose";

const userShema = new Schema({
    firstName: {
        type: String,
        minlenght: 3,
        required: true
    },

    lastName: {
        type: String,
        minlenght: 3,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (value) {
                return value.includes('@')
            },
            message: (props) => `${props.value} is not a valid email`
        }
    },

    password: {
        type: String,
        minlength: 5,
        required: true,
    },

    confirmPassword: {
        type: String,
        minlength: 5,
        required: true,

        validate: {
            validator: function (value) {
                return value === this.password
            },
            message: "password and confirm password should match"
        }
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'manager'], //accepts array
        default: 'user'
    },

    profilePice: String,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date


});

userShema.pre('save', async function (next) {

    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined;

    next()
});

userShema.methods.createResetPasswordToken = function () { //always use normal function if doing crypto
    const token = crypto.randomBytes(32);
    const resetToken = token.toString("hex");

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')  //coming from node

    this.passwordResetTokenExpiry = Date.now() + 7 * 60 * 1000;
    console.log(resetToken, this.passwordResetToken)
    return resetToken
}

const User = model('user', userShema);

export default User

