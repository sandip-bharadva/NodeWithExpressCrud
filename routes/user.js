const express = require('express');
const app = express();

const userRouter = express.Router();
const UserController = require('../app/controllers/userController');
const AuthController = require('../app/controllers/authController');
const auth = require("../app/middleware/auth");


userRouter.post('/login',AuthController.login);

userRouter.use(auth);


userRouter.get('/',UserController.getUsers);
userRouter.post('/',UserController.createUser);
userRouter.get('/:id',UserController.getUser);
userRouter.post('/update',UserController.updateUser);
userRouter.post('/delete',UserController.deleteUser);
userRouter.post('/change-password',AuthController.changePassword);

module.exports = userRouter;