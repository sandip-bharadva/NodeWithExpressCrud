const mongoose = require('mongoose');


const connection = async () => {
    mongoose.connect('mongodb://localhost:27017/ExpressCrud',{ useNewUrlParser : true }).then(() => {
        console.log('Database connected successfully....');
    }).catch((err) => {
        console.log('Database connection error....');
    });
}

module.exports = connection;