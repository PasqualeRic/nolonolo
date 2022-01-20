import React, { Component } from 'react'
import axios from 'axios'
import './styles/logreg.css'
import logo from './N+.png'
import manageNol from './utilities/manageNol'
import './styles/rent.css'
import history from './history'
import NavU from "./navU.component"

export default class editRes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordine: [],
            prodotto: [],
            today: "",
            initdate: undefined,
            findate: undefined,
            price: "",
            message: "",
            addOn: "",
            bottone: "true",
            data_prenotata: '',
            prod_code: ''
        }
        this.verificadate = this.verificadate.bind(this);
        this.confermaNol = this.confermaNol.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        const params = {
            cod: this.props.location.state.ordine
        }
        axios.get('/getResbyId', { params }).then(res => {
            this.setState({ ordine: res.data });
            this.setState({initdate : res.data.inizio_noleggio});
            this.setState({findate : res.data.fine_noleggio});
        });
        let today = new Date();
        today = today.toISOString();
        today = today.substring(0, 10);
        this.setState({ today: today });
    }

    async verificadate() {
        const params = {
            codiceprodotto: this.state.ordine.prodotto_serie
        };
        let prodotto = await axios.get('/getProdbyId', { params });
        this.setState({ prodotto: prodotto });
        if (this.state.initdate === undefined || this.state.findate === undefined) {
            this.setState({ message: 'Inserire entrambe le date!' })
        }
        else {
            let productTemp = prodotto.data;
            for (var i in productTemp.magazzino) //vado ad eliminare la data dell'attuale prenotazione ad un oggetto di ricambio temporaneo
            {
                if (productTemp.magazzino[i].codice === this.state.ordine.prodotto_codice) {
                    for (var dat in productTemp.magazzino[i].nondisp) {
                        if (productTemp.magazzino[i].nondisp[dat].split(',')[0] === this.state.ordine.inizio_noleggio && productTemp.magazzino[i].nondisp[dat].split(',')[1] == this.state.ordine.fine_noleggio) {
                            productTemp.magazzino[i].nondisp.splice(dat, 1);
                        }
                    }
                }
            }
            const results = manageNol(this.state.initdate, this.state.findate, productTemp); //passiamo alla gestione il prodotto temporaneo

            if (results == "nondisp") {
                this.setState({ addOn: 'Prodotto non disponibile nelle date selezionate' });
            }
            else {
                if (results[0] !== null && results[0] !== undefined) {
                    this.setState({ addOn: results[0] })
                    this.setState({ bottone: "true" });
                }
                this.setState({ price: (parseFloat(results[1]).toFixed(2)) });
                this.setState({ message: 'Prezzo totale noleggio : ' + this.state.price + '€' });
                this.setState({ bottone: "" });
                this.setState({ prod_code: results[2] });
                this.setState({ data_prenotata: results[3] });
            }
        }
    }

    confermaNol() {
        let date_length = this.state.data_prenotata.length;
        const data = {
            book_id: this.state.ordine._id,
            product_series: this.state.ordine.prodotto_serie,
            product_id: this.state.prod_code,
            old_product_id: this.state.ordine.prodotto_codice,
            old_period: this.state.ordine.inizio_noleggio + ',' + this.state.ordine.fine_noleggio,
            periodo_noleggio: this.state.data_prenotata[0].toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '-' ) + ',' + this.state.data_prenotata[date_length-1].toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '-' ),
            prezzo: this.state.price
        };
        axios.post('/editBook', data).then(res => {
            if (res.data === 'Ok') {
                window.location.reload();
            }
        }).catch(err => console.log(err));
    }

    delete() {
        const data = {
            book_id: this.state.ordine._id,
            product_series: this.state.ordine.prodotto_serie,
            product_id: this.state.ordine.prodotto_codice,
            old_period: this.state.ordine.inizio_noleggio + ',' + this.state.ordine.fine_noleggio
        };
        axios.post('/deleteBook', data).then(res => {
            if (res.data === 'Ok') {
                history.push('/orders');
                window.location.reload();
            }
        }).catch(err => console.log(err));
    }

    gohome() {
        history.push('/orders');
        window.location.reload();
    }

    render() {
        return (
            <div>
                <NavU role="navigation" tabIndex="0"></NavU>
                <div>
                    <button onClick={() => this.gohome()} style={{ border: '0px', backgroundColor: 'transparent' }} className='logregutilities' aria-labelledby="backhome"><svg role="button" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#007bac" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                    </svg><label id="backhome" className="align-middle">Torna agli ordini</label></button>
                </div>
                <div className="logregcontainer">
                    <img src={logo} id="logreglogo" alt="Logo NoloNolo+" aria-hidden="true"></img>
                    <div className="ins">
                        <label className="descr" htmlFor="cliente" id="cliente" tabIndex="0">Cliente</label><br></br>
                        <input type="text" defaultValue={this.state.ordine.cliente} name="cliente" id="cliente" aria-describedby="cliente" readOnly></input>
                    </div>
                    <div className="ins">
                        <label className="descr" htmlFor="prod_cod" id="prod_code" tabIndex="0">Prodotto</label><br></br>
                        <input type="text" defaultValue={this.state.ordine.prodotto_codice} name="prod_cod" id="prod_cod" aria-describedby="prod_code" readOnly ></input>
                    </div>
                    <div className="ins">
                        <label className="descr" htmlFor="init_date" tabIndex="0">Inizio noleggio</label><br></br>
                        <input type="date" value={this.state.initdate} name="init_date" id="init_date" min={this.state.today} max={this.state.findate} onChange={e => this.setState({ initdate: e.target.value })} aria-describedby="init_date"></input>
                    </div>
                    <div className="ins">
                        <label className="descr" htmlFor="fin_date" id="fin_date" tabIndex="0">Fine noleggio</label><br></br>
                        <input type="date" value={this.state.findate} name="fin_date" id="fin_date" min={this.state.initdate} onChange={e => this.setState({ findate: e.target.value })} aria-describedby="fin_date"></input>
                    </div>
                    <div className="buttons">
                        <button className="logreg" id="edit" onClick={this.verificadate} tabIndex="0" role="button">Verifica disponibilità</button>
                        <p tabIndex="0" style={{ color: "white", fontSize: "small" }}>{this.state.addOn}</p>
                        <p tabIndex="0" style={{ color: "white" }}>{this.state.message}</p>
                        <button className="logreg" id="conferma_noleggio" disabled={this.state.bottone} onClick={this.confermaNol} role="button" tabIndex="0">Conferma Modifica</button>
                        <button className="logreg_mid" id="delete" style={{ color: "red" }} onClick={this.delete} role="button" tabIndex="0">Elimina noleggio</button>
                    </div>
                </div>
            </div>
        )
    }
}