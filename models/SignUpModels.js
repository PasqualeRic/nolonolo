const mongoose = require('mongoose');

const signUpTemplate = new mongoose.Schema({
    nome : {
        type : String,
        required : true
    },
    cognome : {
        type : String, 
        required : true
    },
    username : {
        type : String, 
        required : true
    },
    email : {
        type : String, 
        required : true
    },
    password : {
        type : String,
        required : true
    },
    annotazioni : {
        type : Array,
        required : false
    }
})

var User = mongoose.model('user', signUpTemplate);
module.exports = User;