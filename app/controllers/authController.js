const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ChangePassswordValidator = require('../validator/change_password');

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
                  res.status(400).send({ "message" : "Login Successfully done", "data" : user,"status" : true});
            });
        });

        
    }else{
        res.status(400).send({ "message" : "Invalid Credentials", "status" : false});
    }
    
}

const changePassword = async function(req,res){

    const { error } = ChangePassswordValidator.validate(req.body);
    if(error){
        return res.status(500).send({ "message" : error.message, "status" : false});
    }

    const password = req.body.password;
    res.send(req.user);
    if(password != ''){
        const password = req.body.password;
        encryptedPassword = await bcrypt.hash(password.toString(), 10);
        user.password = encryptedPassword;
    }
}

module.exports = {
    login,
    changePassword
}