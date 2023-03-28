const mongoose = require('mongoose');

const db = () =>{
    mongoose.connect("mongodb://127.0.0.1:27017/akim-metal-son",)
        .then(() => console.log('Connected db!')).catch()
}
module.exports = db;
