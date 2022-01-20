const mongoose = require('mongoose');

const fidelityTemplate = new mongoose.Schema({
    cliente : {
        type : String,
        required : true
    },
    punti : {
        type : Number,
        required : true
    },
    saldoAccumulato : {
        type : Number,
        required : false
    }
})

var Fidelity = mongoose.model('fidelity', fidelityTemplate);
module.exports = Fidelity;