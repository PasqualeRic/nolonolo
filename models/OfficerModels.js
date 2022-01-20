const mongoose = require('mongoose');

const officerTemplate = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
})

var Officer = mongoose.model('officer', officerTemplate);
module.exports = Officer;