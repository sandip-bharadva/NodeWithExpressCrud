const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require("dotenv").config();
const multer = require('multer');

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));


app.listen(PORT,() => {
    console.log(`Server running at port : http://localhost:${PORT}/`);
});


mongoose.connect('mongodb://localhost:27017/ExpressCrud',{ useNewUrlParser : true }).then(() => {
        console.log('Database connected successfully....');
    }).catch((err) => {
        console.log('Database connection error....');
    });


const userRouter = require('./routes/user');

app.use('/api/users',userRouter);


