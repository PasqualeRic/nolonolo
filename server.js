/*
File: index.js
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


/* ========================== */
/*                            */
/*           SETUP            */
/*                            */
/* ========================== */

global.rootDir = __dirname ;
global.startDate = null; 

const express = require('express') ;
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { resolveNaptr } = require("dns");
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const User = require('./models/SignUpModels')
const Product = require('./models/ProductModels');
const Fidelity = require('./models/FidelityModels');
const Reservation = require('./models/ReservationModels');
const Officer = require('./models/OfficerModels');
const Bill = require('./models/BillModels');
const Manager = require('./models/ManagerModels');
const { title, send } = require('process');



/* ========================== */
/*                            */
/*  EXPRESS CONFIG & ROUTES   */
/*                            */
/* ========================== */

let app= express(); 
app.use('/js'  , express.static(global.rootDir +'/js/'));
app.use('/css' , express.static(global.rootDir +'/public/css'));
app.use('/data', express.static(global.rootDir +'/public/data'));
app.use('/pages', express.static(global.rootDir +'/pages/'));
app.use('/image' , express.static(global.rootDir +'/images/'));

app.enable('trust proxy');





var corsOption = {
    origin : "http://site202125.tw.cs.unibo.it:8000"
};

app.use(cors());

const path = __dirname + '/frontend/build/';
const path2 = __dirname + '/manager/dist/';

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/boff', express.static(__dirname + '/backoff/'));
app.use(express.static(path));
app.use(express.static(path2));

function verifyJWT (req, res, next) {
    var token = req.headers['cookie'];
    if (token != undefined) {
        token = token.substring(6);
        jwt.verify(token, "nolonolosecret", (err, decoded) => {
            if(decoded){
                next()
            }
            else{
                res.redirect('/boff/login.html');
            }

        });
    }
    else{
        res.redirect('/boff/login.html');
    }
};

app.get('/backoff', async function(req, res) {
    res.redirect('/boff/b_off.html');
})



app.get('/private/*',verifyJWT, (req, res) => {
    res.redirect('/boff/private/handle_r.html');
})

app.get('/manager', async function(req, res) {
    res.sendFile(path2 + "index.html");
})




/* ========================== */
/*                            */
/*           MONGODB          */
/*                            */
/* ========================== */

const mongoCredentials = {
	user: "site202125",
	pwd: "eelu5Ahh",
	site: "mongo_site202125"
}  

mongoose.connect("mongodb://site202125:eelu5Ahh@mongo_site202125:27017", () => console.log("Database connected"))
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
//MANAGER------------------------------------------------
app.get('/manager_test', (req, res, next) => {
    let token = req.headers.token;
    jwt.verify(token, "secretkey", (err, decoded) => {
        if(err) res.json({
            title : 'unauthorized'
        })
        else{
            Manager.findOne({_id:decoded.userId}, (err, user) => {
                if(err) return console.log(err)
                res.json({
                    title : 'utente trovato',
                    user : {
                       username : user.username,
                       _id : user._id
                    }
                })
            })
        }
    })
})
app.post('/login_manager', async (req, res, next)=>{
    Manager.findOne({username: req.body.username}, (err, user) =>{

        if(err) return res.send(500).json({
            title: 'server error',
            error: err
        })
        if(!user) {
            return res.status(401).json({
                title: 'user not found',
                error: 'invalid credentials'
            })
        }
        //incorrect password
/*         else if(!bcrypt.compareSync(req.body.password, user.password))//bcrypt cripta la password con compare le confronto
        {
            res.status(401).json({
                title: 'login failed',
                error: 'invalid credentials'
            })
        } */
        else if(req.body.password != user.password)//bcrypt cripta la password con compare le confronto
        {
            res.status(401).json({
                title: 'login failed',
                error: 'invalid credentials'
            })
        }
        else {
        //if all is good create token and send to frontend

        let token = jwt.sign({userId : user._id}, 'secretkey');
        return res.status(200).json({
            title: 'login success',
            token: token
        })
    }
    })
})
app.post('/crea_manager', (req,res)=>{
    const newManager = new  Manager({
        username:"Pasquale00",
        password:"password"
    })
    newManager.save(err =>{
        if(err){
            return res.status(400).json({
                title: 'error',
                error: 'email in use'
            })
        }
        return res.status(200).json({
            title: 'signup success'
        })
    })
})

app.post('/crea', (req,res)=>{
    User.insertMany('./data/utenti.json').then(res.send('ok'));
})
app.post('/update_order_funz_noleggio', async (req,res) => {
    await Reservation.findOneAndUpdate(
        {'_id' : req.body.book_id},
        {"funzionario_noleggio" : req.body.funzionario_noleggio})
        .then(response =>{
        	res.status(200).json({
            	response,
            	title : 'succes',
            	success : "Update avvenuto con successo"
        	})
    	}).catch(error =>{
        	res.status(401).json({
            	error,
            	title: 'error',
            	errore : 'errore'
        	})
    	});
})
app.post('/update_order_funz_restituzione', async (req,res) => {
    await Reservation.findOneAndUpdate(
        {'_id' : req.body.book_id},
        {"funzionario_restituzione" : req.body.funzionario_restituzione})
        .then(response =>{
        	res.status(200).json({
            	response,
            	title : 'success',
            	success : "Update avvenuto con successo"
        	})
    	}).catch(error =>{
        	res.status(401).json({
            	error,
            	title: 'error',
            	errore : 'errore'
        	})
    	});
})
app.get('/one_user', async (req, res)=>{
    await User.findOne({_id:req.query._id}).then(product =>{
        res.status(200).json(product)

    }).catch(error => {
        res.status(401).json(error)
    })

})
app.post('/update_disp', async(req,res)=>{
    let up = await Product.findOneAndUpdate({
        '_id' : req.body.id,
        'magazzino' : 
            {$elemMatch : {'codice' : req.body.codice}}},
            {$pull : {'magazzino.$.nondisp' : req.body.nondispo}})
            .then(response =>{
                res.status(200).json({
                    response,
                    title : 'success',
                    success : ''
                })
            }).catch(error => {
                res.status(401).json({
                    error,
                    title : 'errore',
                    error : 'dati errati'
                })
            });
})
app.post('/addAnnotation_manager', async (req, res) => {
    var text = 'Attenzione ';
    if(req.body.res != undefined){
        for(var i in req.body.res){
            await Reservation.findOneAndUpdate(
                {_id : req.body.res[i]},
                {annotazioni : `Il noleggio ha bisogno di un cambio di prodotto. Dopo aver verificato le date, modificare affinchè il prezzo sia comunque uguale a ${req.body.prices[i]}`})
                .catch(error => {
                    res.status(401).json(error)
                })
        }
    }
    res.status(200).send('update effettuata');
})

app.get('/getBills', async (req, res) => {
    await Bill.find()
    .then(response => {
    	res.status(200).json(response)
    }).catch(error => {
    	res.stauts(400).json({
    		error,
    		title : 'errore',
    		error : 'Operazione fallita'
    		
    	})
    });
})

app.post('/early_return', async function (req,res){
    let data_res = new Date(req.body.data_res)
    let ord = await Reservation.findOne({_id:req.body.ord}).catch(err => res.send(err));
    let data_inizi = new Date(ord.inizio_noleggio)
    let data_tot = (data_res - data_inizi)/86400000;

    let prezzo = 0;

    if(data_tot <= 2)
    {    
        await Reservation.findOneAndUpdate({
            '_id':req.body.ord},
            {'fine_noleggio':req.body.data_res,'prezzo':prezzo + "€"}).catch(err => res.send(err));

        await Product.findOneAndUpdate({
            '_id' : ord.prodotto_serie,
            'magazzino' : 
             {$elemMatch : {'codice' : ord.prodotto_codice}}},
             {$pull : {'magazzino.$.nondisp' : ord.inizio_noleggio + ',' + ord.fine_noleggio}}).catch(err => res.send(err));
     
        await Product.findOneAndUpdate({
             '_id' : ord.prodotto_serie,
             'magazzino' : 
                 {$elemMatch : {'codice' : ord.prodotto_codice}}},
                 { $push : {'magazzino.$.nondisp' : ord.inizio_noleggio + ',' + req.body.data_res}},
                 {'new' : true, 'safe' : true, 'upsert' : true}).catch(err => res.send(err));

                 res.status(200).send('Ok');
    }else{
        let prod = await Product.findOne({
            _id : ord.prodotto_serie});
        

        for(var i in prod.magazzino)
        {
            if(prod.magazzino[i].codice == ord.prodotto_codice)
            {
                prezzo = parseFloat(prod.magazzino[i].prezzo) * (data_tot-1);
            }
        }
        
        await Reservation.findOneAndUpdate({
            '_id':req.body.ord},
            {'fine_noleggio':req.body.data_res,'prezzo':prezzo.toFixed(2) + "€"}).catch(err => res.send(err));

        await Product.findOneAndUpdate({
            '_id' : ord.prodotto_serie,
            'magazzino' : 
             {$elemMatch : {'codice' : ord.prodotto_codice}}},
             {$pull : {'magazzino.$.nondisp' : ord.inizio_noleggio + ',' + ord.fine_noleggio}}).catch(err => res.send(err));
     
        await Product.findOneAndUpdate({
             '_id' : ord.prodotto_serie,
             'magazzino' : 
                 {$elemMatch : {'codice' : ord.prodotto_codice}}},
                 { $push : {'magazzino.$.nondisp' : ord.inizio_noleggio + ',' + req.body.data_res}},
                 {'new' : true, 'safe' : true, 'upsert' : true}).catch(err => res.send(err));

                 res.status(200).send('Ok');
    }
})
//FINE MANAGER------------------------------------------------


app.get('/user', (req, res) => {
    let token = req.headers.token;
    jwt.verify(token, "nolonolosecret", (err, decoded) => {
        if(err) res.json({
            title : 'unauthorized'
        })
        else{
            // User.findOne({_id:decoded.userId}, (err, user) => {
            //     if(err) 
            //     {res.json({
            //         title : 'unauthorized'
            //     })}
            //     else{
            //     res.status(200).json({
            //         title : 'utente trovato',
            //         user : {
            //             _id : user._id,
            //             nome : user.nome,
            //             cognome : user.cognome,
            //             username : user.username,
            //             email : user.email
            //         }
            //     })
            // }
            // })

            User.findOne({_id : decoded.userId}).then(user => {
                res.status(200).json({
                    title : 'utente trovato',
                    user : {
                        _id : user._id,
                        nome : user.nome,
                        cognome : user.cognome,
                        username : user.username,
                        email : user.email
                    }
                })
            }).catch(err => {
                res.json({
                    title : 'unauthorized'
                })
            })
        }
    })
})


// FRONTEND API
app.post('/registrati', async (req, res) => {

    let cntrl = false;
    if(await User.findOne({username : req.body.username}) != null)
    {
        cntrl = true;
    }
    if(await User.findOne({email : req.body.email}) != null)
    {
        cntrl = true;
    }
    if(cntrl == true)
    {
        res.status(400).send('Trovato');
    }
    else{
        const NewUser = new User({
            nome : req.body.nome,
            cognome : req.body.cognome,
            username : req.body.username,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10)
        })
        NewUser.save()
        .then(data => {
            res.status(200).send('Ok');
        })
        .catch(error => {
            res.status(400).send(error);
        })
    }
});

app.post('/login', async (req, res) => {
    await User.findOne({
        username : req.body.username
    }).then(user=>{
        if(!user){
            res.json({
                title : 'Utente non trovato',
                error : 'Dati inseriti errati o inesistenti'
            })
        }
        else{
        if(!bcrypt.compareSync(req.body.password, user.password))
        {
            res.json({
                title : 'Login fallito',
                error : 'Password errata'
            })
        }
        else{
                let token = jwt.sign({userId : user._id}, "nolonolosecret");
                res.status(200).json({
                    title : 'login success',
                    token : token
                })
            }
        }
    })
});

app.get('/addProducts', async function(req, res){
    await Product.insertMany(prodotti, (succ, err) => {
        if(succ)
        {
            res.send(succ);
        }
    })
})

app.get('/getProducts',function(req, res){
    Product.find({}).then(succ => res.send(succ));
 });

app.post('/addFidelity', function(req,res){

    const newFid = {
        cliente : 'ciaociaociao',
        punti : 300,
        saldoAccumulato : 33
    };

    Fidelity.create(newFid).then(ris => res.send(ris)).catch(err => res.send(err));
})

app.get('/getFidelities', async function (req, res) {
    await User.find().then(response => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({
        	response,
        	success:'Operazione riuscita',
        }).catch(error => {
        	res.json({
        		error,
        		err : 'Operazione fallita'
        	})
        });
    })
})


app.get('/getProducts', async (req, res) => {
    await Product.find().then(product=>{
        res.status(200).json(product)
    }).catch(error=>{
        res.status(400).json({error, err:'Operazione fallita'})
    })
 });


app.post('/book', async (req, res)=>{
    let date_nol = req.body.periodo_noleggio.split(',');
    if(req.body.data_restituzione == undefined)
    {
        effdate = 'not_confirmed';
    }
    else{
        effdate = req.body.data_restituzione;
    }
    
    if(req.body.funzionario_noleggio == undefined)
    {
        funzionario_n = 'not_confirmed';
    }
    else{
        funzionario_n = req.body.funzionario_noleggio;
    }

    if(req.body.funzionario_restituzione == undefined)
    {
        funzionario_r = 'not_confirmed';
    }
    else{
        funzionario_r = req.body.funzionario_restituzione;
    }
    

    const NewReservation = new Reservation({
        cliente : req.body.user,
        usernamecliente : req.body.usernamecliente,
        prodotto_nome : req.body.prodotto_nome,
        prodotto_serie : req.body.product_series,
        prodotto_codice : req.body.product_id,
        funzionario_noleggio : funzionario_n,
        funzionario_restituzione : funzionario_r,
        inizio_noleggio : date_nol[0],
        fine_noleggio : date_nol[1],
        effettiva_restituzione : effdate,
        prezzo : req.body.prezzo + '€',
        categoria : req.body.categoria,
        fattura : false
    });
    let cntrl2 = false;
    let sav = await NewReservation.save();
    if(!sav)
    {
        cntrl2 = true;
    }

    let up = await Product.findOneAndUpdate({
        '_id' : req.body.product_series,
        'magazzino' : 
            {$elemMatch : {'codice' : req.body.product_id}}},
            { $push : {'magazzino.$.nondisp' : req.body.periodo_noleggio}});

    if(!up)
    {
        cntrl2 = true;
    }

    if(cntrl2==true)
    {
        res.status(400).send("Impossibile soddisfare la richiesta");
    }
    else{
        res.status(200).send("Ok");
    }
    });

    app.post('/return', async(req, res) => {
    
        let today = new Date();
        today = today.toISOString();
        today = today.substring(0, 10);
    
        await Reservation.findOneAndUpdate(
            {'_id' : req.body.ordine},
            {'effettiva_restituzione' : today}
        );
    
        let fid = await Fidelity.findOne(
            {'cliente' : req.body.utente}
        );
        
        if(fid)
        {
            await Fidelity.findOneAndUpdate(
                {'cliente' : req.body.utente},
                {'punti' : fid.punti + 5 * req.body.giorni}
            );
        }
        
        res.status(200).send('Ok');
    })
    
    app.get('/getResbyId', async (req, res) => {
        let ord = Reservation.findOne({_id : req.query.cod}, (err, data) => {
            res.status(200).json(data);
        });
    })
    
    app.get('/getProdbyId', async (req, res) => {
        Product.findOne({_id : req.query.codiceprodotto}, (err, data) => {
            if(data){
                res.status(200).json(data);
            }
            else{
                res.status(400).json(err);
            }
        });
    })
    
    app.post('/editBook', async (req, res) => {
        await Reservation.findOneAndUpdate(
                {'_id' : req.body.book_id},
                {'prezzo' : req.body.prezzo + '€', 'prodotto_codice' : req.body.product_id, "inizio_noleggio" : req.body.periodo_noleggio.split(',')[0], "fine_noleggio" : req.body.periodo_noleggio.split(',')[1]
            }).catch(err=>{res.status(400).send(err)});
        await Product.findOneAndUpdate({
           '_id' : req.body.product_series,
           'magazzino' : 
            {$elemMatch : {'codice' : req.body.old_product_id}}},
            {$pull : {'magazzino.$.nondisp' : req.body.old_period}}).catch(err=>{res.status(400).send(err)});
    
        await Product.findOneAndUpdate({
            '_id' : req.body.product_series,
            'magazzino' : 
                {$elemMatch : {'codice' : req.body.product_id}}},
                { $push : {'magazzino.$.nondisp' : req.body.periodo_noleggio}}).catch(err => {res.status(400).send(err)},
                {'new' : true, 'safe' : true, 'upsert' : true});
    
        res.status(200).send('Ok');
    });

    app.get('/getOrdersByClient', async (req, res) => {
        await Reservation.find({cliente : req.query.user}).then(product=>{
            res.status(200).json(product)
        }).catch(error=>{
            res.json({error, error : 'Operazione fallita'})
        })
    })

    app.post('/editBook_bo', async (req, res) => {
        await Product.findOneAndUpdate({
            '_id' : req.body.old_product,
            'magazzino' : 
                {$elemMatch : {'codice' : req.body.old_code}}},
                {$pull : {'magazzino.$.nondisp' : req.body.old_period}}).then(msg=>{console.log('Qui dovrebbe fare una modifica importante' + msg)}).catch(err => res.send(err));
        
       await Reservation.findOneAndUpdate(
            {'_id' : req.body.book_id},
            {'prezzo' : req.body.price , 'prodotto_codice' : req.body.product_id, "inizio_noleggio" : req.body.periodo_noleggio.split(',')[0], "fine_noleggio" : req.body.periodo_noleggio.split(',')[1], 'cliente' : req.body.client
        }).catch(err => res.send(err));
    
        await Product.findOneAndUpdate({
            '_id' : req.body.product_series,
            'magazzino' : 
                {$elemMatch : {'codice' : req.body.product_id}}},
                { $push : {'magazzino.$.nondisp' : req.body.periodo_noleggio}},
                {'new' : true, 'safe' : true, 'upsert' : true}).catch(err => res.send(err));
    
            res.status(200);
    })
    
    app.post('/deleteBook', async (req, res) => {
        await Product.findOneAndUpdate({
            '_id' : req.body.product_series,
            'magazzino' : 
             {$elemMatch : {'codice' : req.body.product_id}}},
             {$pull : {'magazzino.$.nondisp' : req.body.old_period}}).catch(err=>{res.status(400).send(err)});
        
        await Reservation.findOneAndDelete(
            {'_id' : req.body.book_id}
        ).catch(err => res.status(400).send(err));
        res.status(200).send('Ok');
    })
    
    app.get('/getFidelity', async (req, res) => {
        Fidelity.findOne({
            'cliente' : req.query.cod
        }).then(card => res.status(200).json(card)).catch(err => res.status(400).json(err));
    })
    
    app.post('/createFidelity', async (req, res) => {
        const newFidelity = new Fidelity({
            cliente : req.body.cliente,
            punti : 25,
            saldoAccumulato : 0
        })
        newFidelity.save()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
    })
    
    
    app.get('/getUsers', async (req, res) => {
        User.find().then(data => {
            res.status(200).json(data);
        })
    });
    
    app.post('/editUser', async (req, res) => {
        let cntrl = false;
            if(req.body.ident != req.body.username)
            {
                if(await User.findOne({username : req.body.username}) != null)
                {
                    cntrl = true;
                }
            }
            if(req.body.emI != req.body.email)
            {
                if(await User.findOne({email : req.body.email}) != null)
                {
                    cntrl = true;
                }
            }
            if(cntrl == true)
            {
                return res.status(401).json({
                    title: 'user not found',
                    error: 'email o username già in uso'
                })
            }
            else{
                await User.findOneAndUpdate(
                    {username : req.body.ident},
                    {'nome' : req.body.nome, 'cognome' : req.body.cognome, 'email' : req.body.email, 'username' : req.body.username})
                    .then(response =>{
                    	res.status(200).json({response, success: 'Utente modificato'});
                    }).catch(error => {
                    	res.json({error, err : 'Operazione fallita'})
                    });
            }
        
    });
    
    app.post('/deleteUser', async (req, res) => {
    
        let user = await User.findOne({username : req.body.username});
        if(user)
        {
            let reservation = await Reservation.find({cliente : user._id});
            let cntrl = false;
            if(reservation)
            {
                for(var i in reservation)
                {
                    if(new Date(reservation[i].inizio_noleggio) >= new Date())
                    {
                        cntrl = true;
                    }
                }
    
            }
            if(cntrl == true)
                {
                    res.status(200).send('Noleggi futuri')
                }
            else{
                    let del = await User.deleteOne({username : req.body.username});
                    if(del)
                    {
                        res.status(200).send('Eliminato');
                    }
                    else{
                        res.status(400).send('Impossibile eliminare');
                    }
                }
        }
        else{
            res.status(404).send('Utente non trovato');
        }
    })
    
    app.post('/insertUser', async (req, res) => {
    
        let cntrl = false;
        if(await User.findOne({username : req.body.username}) != null)
        {
            cntrl = true;
        }
        if(await User.findOne({email : req.body.email}) != null)
        {
            cntrl = true;
        }
        if(cntrl == true)
        {
            res.status(400).send('Trovato');
        }
        else{
            const NewUser = new User({
                nome : req.body.nome,
                cognome : req.body.cognome,
                username : req.body.username,
                email : req.body.email,
                password : bcrypt.hashSync(req.body.password, 10),
            })
            NewUser.save()
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.json(error)
            })
        }
    });
    
    app.get('/getUserByUsername', async (req, res) => {
        let us = await User.findOne({username : req.query.username});
        if(us)
        {
            res.status(200).send(us);
        }
        else{
            res.status(400).send('Error');
        }
    })
    
    app.post('/editProduct', async (req, res) => {
        let cntrl = false;
    
        let up1 = await Product.findOneAndUpdate(
            {nome : req.body.ident},
            {nome : req.body.nome, categoria : req.body.categoria}
        );
        if(!up1)
        {
            res.status(400).send("Errore nell'aggiornare nome e categoria prodotto");
            cntrl = true;
        }
    
        var fndate = '';
    
        if(req.body.indate != '')
        {
            var periodo_noleggio = req.body.indate + ',' + req.body.fndate;
            if(req.body.fndate == '' || req.body.fndate == undefined || req.body.fndate == null)
            {
                fndate = '2100-12-31';
                periodo_noleggio = req.body.indate + ',' + fndate;
            }
    
            let up2 = await Product.findOneAndUpdate({
                'nome' : req.body.nome,
                'magazzino' : 
                    {$elemMatch : {'codice' : req.body.codice}}},
                    { $push : {'magazzino.$.nondisp' : periodo_noleggio}});
    
            if(!up2)
            {   
                res.status(400).send("Errore nell'aggiornare non disponibilità prodotto");
                cntrl = true;
            }
        }
        let up3 = await Product.findOneAndUpdate({
            'nome' : req.body.nome,
            'magazzino' : 
                {$elemMatch : {'codice' : req.body.codice}}},
                {'magazzino.$.prezzo' : req.body.prezzo, 'magazzino.$.condizione' : req.body.condizione});
        if(!up3)
        {
            res.status(400).send("Errore nell'aggiornare prezzo e condizione singolo prodotto in magazzino");
            cntrl = true;
        }
    
        if(cntrl == false)
        {
            res.status(200).send('Update effettuata');
        }
    })
    
var Storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, global.rootDir + '/images/');
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage : Storage,
    limits: { fieldSize: 10 * 1024 * 1024 }
});

app.post('/uploadPhoto', upload.single('img'), async (req, res)=>{
    res.json('Ok')
})

app.post('/insertProduct', async (req, res) => {
    let search = null;
    search = await Product.findOne({nome : req.body.nome});
    if(search == null)
    {
            const newProduct = new Product({
                img :req.body.nomefile,
                nome : req.body.nome,
                descrizione : req.body.descrizione,
                categoria : req.body.categoria,
                sconti : req.body.sconti,
                magazzino : [{
                    codice : req.body.codice,
                    prezzo : req.body.prezzo + '€',
                    condizione : req.body.condizione,
                    nondisp : []
                }]
            });
            newProduct.save().then((ris, err) => {
                if(ris){
                    res.status(200).send('Salvato');
                }
                else{
                    res.status(400).send('Errore');
                }
            
            });
        

    }
    else{
        let cod = await Product.findOne({'nome' : req.body.nome,'magazzino.codice' : req.body.codice});
        if(!cod)
        {
            let mag = {
                codice : req.body.codice,
                prezzo : req.body.prezzo + '€',
                condizione : req.body.condizione,
                nondisp : []
            };
            let update = await Product.updateOne(
                {'nome' : req.body.nome},
                { $push : {'magazzino' : mag}});
            if(update)
            {
                res.status(200).send('Ok');
            }
            else{
                res.status(400).send('Errore');
            }
        }
        else{
            res.status(400).send('Codice già esistente');
        }
        }
    
})
    
    app.post('/deleteProduct', async (req, res) => {
        let reservation = await Reservation.find({prodotto_serie : req.body.serie_prodotto, prodotto_codice : req.body.codice});
        let cntrl = false;
        if(reservation){
            for(var i in reservation)
            {
                if(new Date(reservation[i].inizio_noleggio).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0) || (new Date(reservation[i].inizio_noleggio).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0) && new Date(reservation[i].fine_noleggio).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)))
                {
                    cntrl = true;
                }
            }
        }
    
        if(cntrl == false)
        {
            let up = await Product.findOneAndUpdate(
                {'nome' : req.body.nome},
                { $pull : { 'magazzino' : {'codice' : req.body.codice}}});
            if(!up)
            {
                res.status(400).send("Impossibile continuare con l'eliminazione");
            }
            let prod = await Product.findOne({'nome' : req.body.nome});
            if(prod)
            {
                if(prod.magazzino.length == 0)
                {
                    let del = await Product.deleteOne({'nome' : req.body.nome});
                    if(del)
                    {
                        res.status(200).send("Eliminato");
                    }
                    else{
                        res.status(400).send("Impossibile eliminare");
                    }
                }
                else{
                    res.status(200).send("Eliminato");
                }
            }
            else{
                res.status(400).send("Impossibile continuare con l'eliminazione");
            }
        }
        else{
            res.status(200).json({error:"Il prodotto è coinvolto in noleggi futuri, impossibile eliminare"});
        }
    })
    
    app.get('/getReservations', async (req, res) => {
        let data = await Reservation.find();
        res.json(data);
    })
    
    app.get('/getReservationsByProd', async (req, res) =>{
        let result = await Reservation.find(
            {'prodotto_serie' : req.query.product_series, 'prodotto_codice' : req.query.product_code}
        );
        res.json(result);
    })
    
    app.post('/setFun', async (req, res) => {
        await Reservation.findOneAndUpdate(
            {'_id' : req.body.id},
            {'funzionario' : req.body.fun}
        );
    })

    
    app.post('/createBill', async (req, res) => {
        let sconti = [];
        let resto = 0
        let totale = parseFloat(req.body.totale);
        let fid = await Fidelity.findOne({'cliente' : req.body.cliente});
        if(req.body.sconti != undefined)
        {
            sconti.push(req.body.sconti);
        }
        if(fid != null){
            if(fid.saldoAccumulato > 0)
            {
                if(totale <= fid.saldoAccumulato)
                {
                    resto = totale;
                    totale = 0;
                }
                else{
                    resto = fid.saldoAccumulato;
                    totale = totale - fid.saldoAccumulato;
                }
                let fidUp1 = await Fidelity.findOneAndUpdate(
                    {'cliente' : req.body.cliente},
                    {'saldoAccumulato' : fid.saldoAccumulato-resto}
                );
                if(!fidUp1)
                {
                    res.status(400).send('Impossibile aggiornare saldo accumulato');
                }
                sconti.push('Saldo fedeltà');
            }
            if(fid.punti >= 400)
            {
                if(parseFloat(req.body.totale) <= 50)
                {
                    totale = 0;
                    resto = 50 - parseFloat(req.body.totale);
                }
                else{
                    totale = parseFloat(req.body.totale) - 50;
                }
                let fidUp2 = await Fidelity.findOneAndUpdate(
                    {'cliente' : req.body.cliente},
                    {'punti' : fid.punti-400, 'saldoAccumulato' : fid.saldoAccumulato+resto}
                );
                if(!fidUp2)
                {
                    res.status(400).send('Impossibile applicare sconto punti');
                }
                sconti.push('Sconto fedeltà');
            }
        }
        const NewBill = new Bill({
            ordine : req.body.id_fatt,
            id_cliente : req.body.cliente,
            us_cliente : req.body.us_cliente,
            funzionario : req.body.funzionario,
            prodotto : req.body.prodotto_codice,
            nome_prodotto : req.body.prodotto_nome,
            subtotale : req.body.subtotale,
            periodo_noleggio : req.body.periodo_noleggio,
            penale : req.body.penale,
            sconti : sconti,
            totale : totale.toFixed(2) + '€',
            data_creazione : req.body.data_creazione
        });
    
        let bills = await NewBill.save();
    
        if(!bills)
        {
            res.status(400).send("Impossibile creare fattura");
        }
    
        let resUp = await Reservation.findOneAndUpdate({
            _id : req.body.id_fatt},
            {fattura : true}
        );
    
        if(!resUp)
        {
            res.status(400).send("Impossibile aggiornare noleggio");
        }
        else{
            res.status(200).send(resUp);
        }
    })
    
    app.get('/getBillbyId', async (req, res) => {
        let data = await Bill.findOne({ordine : req.query.id});
        res.json(data);
    })
    
    app.post('/createBook', async (req, res) => {
        let initdate = req.body.data_noleggio.split(',')[0];
        let findate = req.body.data_noleggio.split(',')[1];
        let effdate = "not_confirmed";
        if(new Date(findate) < new Date())
        {
            effdate = req.body.data_rest;
        }
        const newReservation = new Reservation({
            cliente : req.body.cliente,
            prodotto_serie : req.body.prodotto,
            prodotto_codice : req.body.codice,
            funzionario : req.body.funzionario,
            inizio_noleggio : initdate,
            fine_noleggio : findate,
            effettiva_restituzione : effdate,
            prezzo : req.body.prezzo + '€',
            fattura : false
        });
    
        newReservation.save();
    
        Product.findOneAndUpdate({
            '_id' : req.body.prodotto,
            'magazzino' : 
                {$elemMatch : {'codice' : req.body.codice}}},
                { $push : {'magazzino.$.nondisp' : req.body.data_noleggio}}).then(msg => {console.log(msg)},
                {'new' : true, 'safe' : true, 'upsert' : true});
    })
    
    app.post('/certificateRes', async (req, res) => {
        if(req.body.funzionario_r == undefined)
        {
            let reser = await Reservation.findOneAndUpdate(
                {_id : req.body.res},
                {funzionario_noleggio : req.body.funzionario_n}
            );
    
            if(reser){
                res.status(200).send('Ok');
            }
            else{
                res.status(400).send('Error');
            }
        }
        else if(req.body.funzionario_n == undefined){
    
            let reser = await Reservation.findOneAndUpdate(
                {_id : req.body.res},
                {funzionario_restituzione : req.body.funzionario_r}
            );
    
            if(reser){
                res.status(200).send('Ok');
            }
            else{
                res.status(400).send('Error');
            }
        }
    })
    
    app.post('/addAnnotation', async (req, res) => {
        var text = 'Attenzione ';
        if(req.body['res[]'].length != 24)
        {
            for(var i in req.body['res[]'])
            {
                await Reservation.findOneAndUpdate(
                    {_id : req.body['res[]'][i]},
                    {annotazioni : `Il noleggio ha bisogno di un cambio di prodotto. Dopo aver verificato le date, modificare affinchè il prezzo sia comunque uguale a ${req.body['price[]'][i]}`}
                ); 
            }
        }
        else{
            await Reservation.findOneAndUpdate( 
                {_id : req.body['res[]']},
                    {annotazioni : `Il noleggio ha bisogno di un cambio di prodotto. Dopo aver verificato le date, modificare affinchè il prezzo sia comunque uguale a ${req.body['price[]']}`}
            )
        }
    })
    

    app.post('/removeAnnotation', async (req, res) => {
        await Reservation.findOneAndUpdate(
            {_id : req.body.book_id},
            {annotazioni : null}
        ).then(response =>{
        	res.status(200).json({response, success:'Annotazione rimossa'})
        }).catch(error => {
        	res.json({error, err : 'Operazione fallita'})
        });
    })


	app.get('/getUserbyId', async (req, res)=>{    
    await User.findOne({_id : req.query.id})
    .then(response => {
    	res.status(200).json(response)
    }).catch(error => {
    	res.stauts(400).json({
    		error,
    		title : 'errore',
    		error : 'Operazione fallita'
    		
    	})
    });
})

app.post('/modificaDatiU', async (req, res) => {

    if(req.body.newpassword != '' && req.body.newpassword != undefined){
        let modifica = {
            nome : req.body.nome,
            cognome : req.body.cognome,
            email : req.body.email,
            username : req.body.username,
            password : bcrypt.hashSync(req.body.newpassword,10)
        }

        if(req.body.username != req.body.old_username || req.body.email != req.body.old_email)
        {
            let userTest = await User.findOne({username : req.body.username});
            let emailTest = await User.findOne({email : req.body.email});
            if(userTest || emailTest)
            {
                res.status(200).json('exist');
            }
            else{
                const user = await User.findOne({_id : req.body.id});
                if(user)
                {
                    if(bcrypt.compareSync(req.body.password, user.password))
                    {
                        const result = await User.findOneAndUpdate({_id:req.body.id}, modifica);
                        if(result == null)
                        {
                            res.status(200).json('error')
                        }
                        else{
                            res.status(200).json('ok')
                        }
                    }
                    else{
                        res.status(200).json('error');
                    }
                }
                else{
                    res.status(200).json('error');
                }
            }
        }
        else{
            const user = await User.findOne({_id : req.body.id});
            if(user)
            {
                if(bcrypt.compareSync(req.body.password, user.password))
                {
                    const result = await User.findOneAndUpdate({_id:req.body.id}, modifica);
                    if(result == null)
                    {
                        res.status(200).json('error')
                    }
                    else{
                        res.status(200).json('ok')
                    }
                }
                else{
                    res.status(200).json('error');
                }
            }
            else{
                res.status(200).json('error');
            }
        }
    }
    else{
        let modifica = {
            nome : req.body.nome,
            cognome : req.body.cognome,
            email : req.body.email,
            username : req.body.username
        }
        if(req.body.username != req.body.old_username || req.body.email != req.body.old_email)
        {
            let userTest = await User.findOne({username : req.body.username});
            let emailTest = await User.findOne({email : req.body.email});
            if(userTest || emailTest)
            {
                res.status(200).json('exist');
            }
            else{
                const user = await User.findOne({_id : req.body.id});
                if(user)
                {
                    if(bcrypt.compareSync(req.body.password, user.password))
                    {
                        const result = await User.findOneAndUpdate({_id:req.body.id}, modifica);
                        if(result)
                        {
                            res.status(200).json('ok')
                        }
                        else{
                            
                            res.status(200).json('error')
                        }
                    }
                    else{
                        res.status(200).json('error');
                    }
                }
                else{
                    res.status(200).json('error');
                }
            }
        }
        else{

            const user = await User.findOne({_id : req.body.id});
            if(user)
            {
                if(bcrypt.compareSync(req.body.password, user.password))
                {
                    const result = await User.findOneAndUpdate({_id:req.body.id}, modifica);
                    if(result)
                    {
                        res.status(200).json('ok')
                    }
                    else{
                        
                        res.status(200).json('error')
                    }
                }
                else{
                    res.status(200).json('error');
                }
            }
            else{
                res.status(200).json('error');
            }
        }
       
        
     
    }

});
// FINE FRONTEND API ------------------------------------------



// INIZIO BACKEND API --------------------------------

app.get('/login_bo', async (req, res) => {
    res.redirect('/boff/login.html');
})


app.post('/login_bo', async (req, res) => {
    await Officer.findOne({
        username : req.body.username
    }).then(user=>{
        if(!user){
            res.json({
                title : 'Utente non trovato',
                error : 'Dati inseriti errati o inesistenti'
            })
        }
        else{
        if(req.body.password != user.password)
        {
            res.json({
                title : 'Login fallito',
                error : 'Password errata'
            })
        }
        else{
                let token = jwt.sign({userId : user._id}, "nolonolosecret");
                res.status(200).json({
                    title : 'login success',
                    token : token
                })
            }
        }
    })
})

app.get('/getOfficer', async (req, res) => {

    
    let token = req.headers.authorization;
    jwt.verify(token, "nolonolosecret", (err, decoded) => {
        if(err) res.json({
            title : 'unauthorized'
        })
        else{
            Officer.findOne({_id:decoded.userId}, (err, user) => {
                if(err) return console.log(err)     
                res.status(200).json({
                    title : 'utente trovato',
                    user : {
                        _id : user._id,
                        nome : user.nome,
                        cognome : user.cognome,
                        username : user.username,
                        email : user.email
                    }
                })
            })
        }
    })
})


app.get('/manager/*', async function(req, res) {
    res.sendFile(path2 + "index.html");
})
app.get('/*', async function(req, res) {
    res.sendFile(path + "index.html");
})


/* ========================== */
/*                            */
/*    ACTIVATE NODE SERVER    */
/*                            */
/* ========================== */

app.listen(8000, function() { 
	global.startDate = new Date() ; 
	console.log(`App listening on port 8000 started ${global.startDate.toLocaleString()}` )
})
