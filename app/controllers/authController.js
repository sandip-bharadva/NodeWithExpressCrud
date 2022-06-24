const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ChangePassswordValidator = require('../validator/change_password');
const _ = require('lodash');
const UserValidator = require('../validator/create_user');
const nodemailer = require('nodemailer');
const { config } = require('dotenv');

const login = async function (req,res){
    const { email , password } = req.body;
    const user = await User.findOne({ email : email});

    if(user != '' && bcrypt.compareSync(password.toString(),user.password)){

        
        bcrypt.hash(password.toString(), 10, function(err, hash) {
            if (err) { res.status(500).send({ "message" : err.message, "status" : false}); }

            bcrypt.compare(password.toString(), hash, function(err, result) {
                if (err) { res.status(500).send({ "message" : err.message, "status" : false}); }
                const token = jwt.sign(
                    { user_id: user._id, email,role : user.role },
                    process.env.TOKEN_KEY,
                    {
                      expiresIn: "2h",
                    }
                );
            
                  // save user token
                  user.token = token;
                  res.status(400).send({ "message" : "Login Successfully done", "data" : _.pick(user,['_id','name','email','token']),"status" : true});
            });
        });

        
    }else{
        res.status(400).send({ "message" : "Invalid Credentials", "status" : false});
    }
    
}

const changePassword = async function(req,res){

    const { error } = ChangePassswordValidator.validate(req.body);
    if(error){
        return res.status(400).send({ "message" : error.message, "status" : false});
    }

    const password = req.body.password;
    if(password != ''){
        const password = req.body.password;
        encryptedPassword = await bcrypt.hash(password.toString(), 10);
        user.password = encryptedPassword;
    }
}

const register = async function(req,res){
    const { error } = UserValidator.validate(req.body);
    if(error){
        return res.status(400).send({ "message" : error.message, "status" : false});
    }

    const is_duplicate = await User.findOne({ email : req.body.email});
    if(is_duplicate){
        return res.status(400).send({ "message" : 'Email already exists', "status" : false});
    }

    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;
    const password = req.body.password;
    encryptedPassword = await bcrypt.hash(password.toString(), 10);
    user.password = encryptedPassword;
    user.save();

    const date = new Date();
    const mail = {
        'id' : user._id,
        'created_at' : date.toString()
    }

    const token = jwt.sign(mail,process.env.TOKEN_KEY,{
        expiresIn: "2h",
    });

    const url = process.env.BASE_URL+'api/user/verify-email?token='+token;

    let transporter = nodemailer.createTransport({
        name: "NodeExpressCrudDemo",
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false, // use SSL
        auth: {
            user: process.env.EMAIL_USERNAME, // username for your mail server
            pass: process.env.EMAIL_PASSWORD, // password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"NodeExpressCrud" <${process.env.EMAIL_FROM}>`, // sender address
        to: user.email, // list of receivers seperated by comma
        subject: "NodeExpressCrud - Account Verification", // Subject line
        text: "Click on the link below to veriy your account " + url, // plain text body
    }, (error, info) => {

        if (error) {
            console.log(error)
            return res.send({ 'message' : error,"status" : false});
        }
        console.log('Message sent successfully!');
        console.log(info);
        transporter.close();
        return res.send({ 'user' : _.pick(user,['_id','name','email','isVerified']),'message' : 'Registration completed. Please verify you email to login.'});
    });

}

const verifyEmail = async function(req,res){
    const token = req.query.token;
    const decoded = jwt.verify(token, process.env.TOKEN_KEY,(e,decoded) => {
        if(e){
            return res.send("Invalid token")
        }else{
            const id = decoded.id;
            const user = User.findOne({ '_id' : id}).then( (user) => {
                user.isVerified = true;
                user.save();
                return res.send({'message' : 'Email has been sucessfully verified','user' : _.pick(user,['_id','name','email','isVerified'])});
            });
        }
    });
}

module.exports = {
    login,
    changePassword,
    register,
    verifyEmail
}
