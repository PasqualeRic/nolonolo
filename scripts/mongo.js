/*
File: mongo.js
Author: Fabio Vitali
Version: 1.0 
Last change on: 10 April 2021


Copyright (c) 2021 by Fabio Vitali

   Permission to use, copy, modify, and/or distribute this software for any
   purpose with or without fee is hereby granted, provided that the above
   copyright notice and this permission notice appear in all copies.

   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
   SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
   OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
   CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/

/* Dati di prova */
let fn = "/data/prodotti.json"
let dbname = "utenti"
let collection ="prodotti"
let fieldname = "country"

const { MongoClient } = require("mongodb");
const fs = require('fs').promises ;
const template = require(global.rootDir + '/scripts/tpl.js') ; 

// prova find


exports.insert = async function(d, credentials){
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;
	try{
		const mongo = new MongoClient(mongouri);
		await mongo.connect();
		let added = await mongo.db(dbname)
					.collection(d["type"])
					.insertOne(
					{
						name : d["nome"],
						surname : d["cognome"],
						email : d["em"], 
						username : d["usn"],
						pwd : d["psw"],
						ruolo : d["role"]
					});
		await mongo.close();
		return {
			message: 'ok'
		}
	} catch (e) {
		return 'cazzo'
		}
}

exports.insert_object = async function(d, credentials){
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;
	try{
		const mongo = new MongoClient(mongouri);
		await mongo.connect();
		let added = await mongo.db(dbname)
					.collection(d["type"])
					.insertOne(
					{
                        img : d["link"],
						nome : d["nome"],
						categoria : d["categoria"],
						magazzino : [d["codice"], d["prezzo"], d["condizione"], d["nondisp"], d["disponibile"]]
					});
		await mongo.close();
		return {
			message: 'ok'
		}
	} catch (e) {
		return 'cazzo'
		}
}

exports.insert_order = async function(d, credentials){
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;
	try{
		const mongo = new MongoClient(mongouri);
		await mongo.connect();
		let added = await mongo.db(dbname)
					.collection(d["type"])
					.insertOne(
					{
                        codice : d["codice"],
						nome : d["nome"],
                        congome : d["cognome"],
                        username : d["username"],
                        prezzo : d["prezzo"], 
                        nome_prodotto : d["nome_p"], 
                        data_in : d["data_in"], 
                        data_fin : d["data_fin"], 
                        data_a : d["data_a"]
					});
		await mongo.close();
		return {
			message: 'ok'
		}
	} catch (e) {
		return 'error'
		}
}

exports.del = async function(d, credentials){
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;
	try{
		const mongo = new MongoClient(mongouri);
		await mongo.connect();
        if(d['type'] == 'utenti_norm'){
            let added = await mongo.db(d['dbn'])
					.collection(d['type'])
					.remove(
					{
						username : d["usrn"]
					});
        }
        else{
            let added = await mongo.db(d['dbn'])
                        .collection(d['type'])
                        .remove(
                        {
                            nome : d["nm"]
                        });
        }
		await mongo.close();
		}catch(e){
			alert('error')
		}
}

exports.update = async function(d, credentials){
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;
	try{
		const mongo = new MongoClient(mongouri);
		await mongo.connect();
        if(d["type"]=="utenti_norm"){
            await mongo.db(d["dbn"])
                    .collection(d["type"])
                    .update(
                        {username : d["ident"]},
                        {$set : {name : d["name"], surname : d["surname"], email : d["email"], username : d["username"], pwd : d["psw"]}}
                    );
        }
        else if(d["type"] == "prodotti"){
            await mongo.db(d["dbn"])
                    .collection(d["type"])
                    .update(
                        {nome : d["ident"]},
                        {$set : {nome : d["nome"], marca : d["marca"], categoria : d["categoria"],  prezzo : d["prezzo"], descrizione : d["descrizione"], numero:d["quantita"]}}
                    );
        }
        else{
            await mongo.db(d["dbn"])
            .collection(d["type"])
            .update(
                {codice : d["ident"]},
                {$set : {nome : d["nome"], cognome : d["cognome"], username : d["username"], prezzo : d["prezzo"], nome_prodotto : d["nome_p"], data_in : d["data_in"], data_fin : d["data_fin"], data_a : d["data_a"]}}
            );
        }
		await mongo.close();
		}catch(e){
			alert('error')
		}
}

exports.f_ind = async function(d, credentials){
    const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;
	try{
		const mongo = new MongoClient(mongouri);
		await mongo.connect();
		let res = await mongo.db(d.dbn)
				.collection(d.collection)
				.findOne(
					{username : d.user}
				);
		await mongo.close();
		}catch(e){
			alert('error')
		}
        return res;

}

exports.create = async function(credentials) {
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;

	let debug = []
	try {
		debug.push(`Trying to connect to MongoDB with user: '${credentials.user}' and site: '${credentials.site}' and a ${credentials.pwd.length}-character long password...`)
		const mongo = new MongoClient(mongouri);		
		await mongo.connect();
		debug.push("... managed to connect to MongoDB.")

		debug.push(`Trying to read file '${fn}'... `)
		let doc = await fs.readFile(rootDir + fn, 'utf8')
		let data = JSON.parse(doc)
		debug.push(`... read ${data.length} records successfully. `)

		debug.push(`Trying to remove all records in table '${dbname}'... `)
		let cleared = await mongo.db(dbname)
					.collection(collection)
					.deleteMany()
		debug.push(`... ${cleared?.result?.n || 0} records deleted.`)
					
		debug.push(`Trying to add ${data.length} new records... `)
		let added = await mongo.db(dbname)
					.collection(collection)
		 			.insertMany(data);	
		debug.push(`... ${added?.result?.n || 0} records added.`)

		await mongo.close();
		debug.push("Managed to close connection to MongoDB.")

		return {
			message: `<h1>Removed ${cleared?.result?.n || 0} records, added ${added?.result?.n || 0} records</h1>`, 
			debug: debug
		}
	} catch (e) {
		e.debug = debug
		return e
	}
}

exports.read = async function(d, credentials){
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;
	
	try{
		const mongo = new MongoClient(mongouri);
		await mongo.connect();
		
		let result = []
		
		await mongo.db(d["dbn"])
				.collection(d["type"])
				.find()
				.forEach( (r) => {
					result.push(r)
			});
	
		return result
	} catch(e){
	
		return e}
}


/*exports.search = async function(q,credentials) {
	const mongouri = `mongodb://${credentials.user}:${credentials.pwd}@${credentials.site}?writeConcern=majority`;

	try {
		const mongo = new MongoClient(mongouri);		
		await mongo.connect();
		let result = []
		await mongo.db(q["dbn"])
					.collection(d["type"])
					.find({username : d["usn"]})
					.forEach( (r) => { 
						result.push(r) 
					} );

		return result
	} catch (e) {
		return e
	}
}*/

/* Untested */
// https://stackoverflow.com/questions/39599063/check-if-mongodb-is-connected/39602781
exports.isConnected = async function() {
	let client = await MongoClient.connect(mongouri) ;
	return !!client && !!client.topology && client.topology.isConnected()
}