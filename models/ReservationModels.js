const mongoose = require('mongoose');

const reservationTemplate = new mongoose.Schema({
    cliente : {
        type : String,
        required : true
    },
    usernamecliente : {
        type : String,
        require : true
    },
    prodotto_serie : {
        type : String, 
        required : true
    },
    prodotto_nome : {
        type : String, 
        required : true
    },
    prodotto_codice : {
        type : String, 
        required : true
    },
    funzionario_noleggio : {
        type : String,
        required : true
    },
    funzionario_restituzione : {
        type : String,
        required : true
    },
    inizio_noleggio : {
        type : String,
        required : true
    },
    fine_noleggio : {
        type : String,
        required : true,
    },
    effettiva_restituzione : {
        type : String,
        required : true
    },
    prezzo : {
        type : String,
        required : true
    },
    fattura : {
        type : Boolean,
        required : true
    },
    annotazioni : {
        type : String,
        required : false
    },
    categoria : {
        type : String,
        required : true
    }
})

var Reservation = mongoose.model('reservation', reservationTemplate);
module.exports = Reservation;