import mongoose from "mongoose"


const schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: false
    },
    lastLogin:{
        type:Date,
        default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    verificationToken:String,
    verificationTokenExpireAt:Date
},{timetamps:true})

const User = mongoose.model('AUTH', schema)

export default User
