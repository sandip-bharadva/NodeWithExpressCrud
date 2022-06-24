const { string } = require('joi');
const { default: mongoose, now } = require('mongoose');


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
    },
    password : {
        type : String,
        required : true
    },
    role : String,
    token: { type: String },
    profile : {
        type : String,
        required : false
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    created_at : {
        type : Date,
        default : Date()
    }
});

const User = mongoose.model('User',userSchema,'User');

module.exports = User;
