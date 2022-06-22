const User = require('../models/User');
const bcrypt = require('bcryptjs');
const UserValidator = require('../validator/create_user');
const multer = require('multer');

const getUsers = async function(req, res){
        await User.find({ role : 'user' }).select({_id : 1, name : 1, email : 1, role : 1, created_at : 1}).sort({ created_at : -1}).then(users => {
            res.json({ 'message' : 'User List.','users' : users,'status' : true});
        }).catch(err => {
            res.send(err);
        });
}

const createUser = async function(req,res){

    const { error } = UserValidator.validate(req.body);
    if(error){
        return res.status(500).send({ "message" : error.message, "status" : false});
    }

    const userObj = new User();
    userObj.name = req.body.name;
    userObj.email = req.body.email;
    userObj.role = req.body.role;
    userObj.created_at = Date();

    await userObj.save().then((userObj) => {
        res.send({'message' : 'User has been added successfully.','data' : userObj,'status' : true})
    }).catch(err => {
        res.send({'message': err.message,'status' : false});
    });
    
}

const getUser = async function(req,res){
    const user = await User.findById(req.params.id).then(user => {
        if(!user) return res.send({'message' : 'User Not Found!','status' : false});
        res.send({'message' : 'User details has been successfully retrived','data' : user,'status' : true});
    }).catch(err => {
        res.send({'message' : err.message,'status' : false});
    });
}

const updateUser = async function(req,res){
   const user =  await User.findById(req.body.id);
    if(!user){
        return res.send({'message' : 'User Not Found!','status' : false});
    }

    user.name = req.body.name;

   await user.save().then(user => {
       res.send({'message' : 'User has been successfully updated.','data' : user,'status' : true})
   }).catch(err => {
        res.send({'message' : err.message,'status' : false});
   });
}

const deleteUser = async function(req,res){
    await User.findByIdAndDelete(req.body.id).then(() => {
        res.send({'message' : 'User has been successfully deleted.','status' : true})
    }).catch(err => {
        res.send({'message' : err.message,'status' : false});
    });
}

module.exports = {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
}