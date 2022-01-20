const mongoose = require('mongoose');

const billTemplate = new mongoose.Schema({
    ordine : {
        type : String,
        required : true
    },
    id_cliente : {
        type : String, 
        required : true
    },
    us_cliente : {
        type : String, 
        required : true
    },
    funzionario : {
        type : String,
        required : true
    },
    prodotto : {
        type : String,
        required : true
    },
    nome_prodotto : {
        type : String,
        required : true
    },
    subtotale : {
        type : String,
        required : true,
    },
    periodo_noleggio : {
        type : String,
        required: true
    },
    penale : {
        type : String,
        required : true
    },
    sconti : {
        type : Array,
        required : true
    },
    totale : {
        type : String,
        required : true
    },
    data_creazione : {
        type : String,
    }

})

var Bill = mongoose.model('bill', billTemplate);
module.exports = Bill;