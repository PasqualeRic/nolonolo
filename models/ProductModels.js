const mongoose = require('mongoose');

const productTemplate = new mongoose.Schema({
	img : {
		type : String
	},
    nome : {
        type : String,
        required : true
    },
    descrizione : {
        type : String, 
        required : false
    },
    categoria : {
        type : String, 
        required : true
    },
    sconti : [{
        nomesconto : {
            type : String
        },
        descrizionesconto : {
            type : String
        }
    }],
    magazzino : [{
       codice:{
           type : String,
           required : true
       },
       prezzo: {
           type : String,
           required : true
       },
       condizione : {
           type : String,
           required : true
       },
       nondisp : {
           type : Array,
           requred : true 
       }    
    }]
})

var Product = mongoose.model('product', productTemplate);
module.exports = Product;