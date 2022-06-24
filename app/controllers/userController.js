const User = require('../models/User');
const bcrypt = require('bcryptjs');
const UserValidator = require('../validator/create_user');
const multer = require('multer');
const path = require('path');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = process.env;


const getUsers = async function(req, res){
        await User.find({ role : 'user' }).select({_id : 1, name : 1, email : 1, role : 1, created_at : 1}).sort({ created_at : -1}).then(users => {
            return res.json({ 'message' : 'User List.','users' : users,'status' : true});
        }).catch(err => {
            return res.send(err);
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
        return res.send({'message' : 'User has been added successfully.','data' : _.pick(userObj,['_id','name','email','role']),'status' : true})
    }).catch(err => {
        return res.send({'message': err.message,'status' : false});
    });
    
}

const getUser = async function(req,res){
    const user = await User.findById(req.params.id).then(user => {
        if(!user) return res.send({'message' : 'User Not Found!','status' : false});
        return res.send({'message' : 'User details has been successfully retrived','data' : _.pick(user,['_id','name','email','role']),'status' : true});
    }).catch(err => {
        return res.send({'message' : err.message,'status' : false});
    });
}

const updateUser = async function(req,res){
   const user =  await User.findById(req.body.id);
    if(!user){
        return res.send({'message' : 'User Not Found!','status' : false});
    }

    user.name = req.body.name;

   await user.save().then(user => {
       return res.send({'message' : 'User has been successfully updated.','data' : _.pick(user,['_id','name','email','role']),'status' : true})
   }).catch(err => {
       return res.send({'message' : err.message,'status' : false});
   });
}

const deleteUser = async function(req,res){
    await User.findByIdAndDelete(req.body.id).then(() => {
        return res.send({'message' : 'User has been successfully deleted.','status' : true})
    }).catch(err => {
        return res.send({'message' : err.message,'status' : false});
    });
}


const uploadProfilePicture = async function(req,res){

    
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Uploads is the Upload_folder_name
            cb(null, "uploads")
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + "-" + Date.now()+".jpg")
        }
      })
           
    // Define the maximum size for uploading
    // picture i.e. 5 MB. it is optional
    const maxSize = 5 * 1000 * 1000;
        
    var upload = multer({ 
        storage: storage,
        limits: { fileSize: maxSize },
        fileFilter: function (req, file, cb){
        
            // Set the filetypes, it is optional
            var filetypes = /jpeg|jpg|png/;
            var mimetype = filetypes.test(file.mimetype);
      
            var extname = filetypes.test(path.extname(
                        file.originalname).toLowerCase());
            
            if (mimetype && extname) {
                return cb(null, true);
            }
          
            cb("Error: File upload only supports the "
                    + "following filetypes - " + filetypes);
          } 
      
    // mypic is the name of file attribute
    }).single("profile");  
    
   const path_file =  await upload(req,res,function(err) {
  
        if(err) {
            return res.send(err);
        }
        else {
  
            // SUCCESS, image successfully uploaded
            const token = req.headers["token"];
            const decoded = jwt.verify(token, config.TOKEN_KEY);
            req.user = decoded;
            const user = User.findById(req.user.user_id).then((user) => {
                user.profile = req.file.path;
                user.save();
                return res.send({'user' : _.pick(user,['_id','name','email','role','profile']), 'message' : 'Profile has been successfully uploaded.'});
            });
        }
    })

}

module.exports = {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    uploadProfilePicture
}
