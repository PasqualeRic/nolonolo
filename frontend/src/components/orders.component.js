import React, { Component } from 'react';
import '../App.css'
import logo from './N+.png'
import './styles/orders.css'
import axios from 'axios';
import NavU from "./navU.component"
import Modal from 'react-bootstrap/Modal'


export default class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            ordini: [],
            status: '',
            show : false,
            ord : '',
            start : '',
            end : ''
        }
    }

    async componentDidMount() {
        const user = await axios.get('/user', { headers: { token: localStorage.getItem('token') } });
        const data = { user: user.data.user._id };
        this.setState({ user: user.data.user._id });
        await axios.get('/getOrdersByClient', { params: data }).then(res => {
            const orders = res.data;
            this.setState({ ordini: orders });
        }).catch(err => console.log(err));
    }

    handleClose = () => this.setState({show : false});
    handleShow = () => this.setState({show: true});
    early_return(ord, init, end) {
        let today = new Date().toISOString().substring(0, 10);
        
        let data = {
            ord: ord,
            data_res: today
        };


        axios.post('/early_return', data).then(ris => {
            if(ris.status === 200)
            {
                console.log(ris);
            }
        }).catch(err => console.log(err));
        let giorni = (((((new Date(end) - new Date(init)) / 1000) / 60) / 60) / 24); //calcolo i giorni del periodo di noleggio
        axios.post('/return', { ordine: ord, giorni: giorni, utente: this.state.user }).then(
            res => {
                if (res.data === 'Ok') {
                    window.location.reload();
                }
            }
        ).catch(err => console.log(err));
    }
    

    status(start, end, eff, funz) {
        let today = new Date();
        start = start.split('-');
        end = end.split('-');
        let st = new Date(start[0], start[1] - 1, start[2]);
        let fin = new Date(end[0], end[1] - 1, end[2]);

        if (today < st) {
            return "Futuro";
        }
        if (today > st && today < fin) {
            return "In corso";
        }

        if (today > fin && eff === "not_confirmed") {
            return "Da restituire"
        }
        if (today.setHours(0,0,0,0) === fin.setHours(0,0,0,0) && eff === "not_confirmed") {
            return "Ultimo giorno"
        }
        if (eff !== "not_confirmed" && funz === "not_confirmed") {
            return "Da convalidare"
        }
        if (eff !== "not_confirmed" && funz !== "not_confirmed") {
            return "Concluso"
        }

    }

    return(ord, init, end) {
        let giorni = (((((new Date(end) - new Date(init)) / 1000) / 60) / 60) / 24); //calcolo i giorni del periodo di noleggio
        axios.post('/return', { ordine: ord, giorni: giorni, utente: this.state.user }).then(
            res => {
                if (res.data === 'Ok') {
                    window.location.reload();
                }
            }
        ).catch(err => console.log(err));
    }

    edit_res(ord) {
        this.props.history.push({ pathname: '/edit_reservation', state: { ordine: ord } });
        window.location.reload();
    }

    get_bill(ord) {
        this.props.history.push({ pathname: '/bill', state: { ordine: ord } })
        window.location.reload();
    }

    action(start, end, eff, ord, funz) {
        let state = this.status(start, end, eff, funz);
        if (state === "Futuro") {
            return <button onClick={this.edit_res.bind(this, ord)} style={{ border: "0px", backgroundColor: "transparent" }} id="edit" aria-labelledby="action edit" role="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg></button>
        }

        if (state === "Da restituire" || state === "Ultimo giorno") {
            return <button onClick={this.return.bind(this, ord, start, end)} id="bill" aria-labelledby="action return" role="button" style={{ border: "0px", backgroundColor: "transparent" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16" style={{ cursor: "pointer" }}>
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
            </svg></button>
        }

        if (state === "Concluso") {
            return <button onClick={this.get_bill.bind(this, ord)} id="ord" aria-labelledby="action bill" role="button" style={{ border: "0px", backgroundColor: "transparent" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-file-earmark-spreadsheet-fill" viewBox="0 0 16 16">
                <path d="M6 12v-2h3v2H6z" />
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM3 9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2H3V9z" />
            </svg></button>
        }
        

        if (state === "In attesa di convalida") {
            return " "
        }

        if (state === "In corso") {
            return (
            <div>
                <button class="early" onClick={() => this.setState({show: true, ord : ord, start : start, end : end})} id="ord" aria-labelledby="action early return" role="button">Restituisci in anticipo</button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header className="headFot">
                    <Modal.Title>Restituisci in anticipo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Attenzione! Stai restituendo in anticipo il prodotto. Si ricorda che la NoloNolo+ offre la possibilità di fare il reso del prodotto nei primi due giorni del noleggio, restituendo il prodotto e ottenendo il rimborso. Se non si è nei primi due giorni, il prodotto verrà restituito e il costo del noleggio verrà ammortizzato</Modal.Body>
                    <Modal.Footer className="headFot">
                    <button className="modalButton" onClick={this.handleClose}>
                        Annulla
                    </button>
                    <button class="modalButton" onClick={() => this.early_return(this.state.ord, this.state.start, this.state.end)}>
                        Procedi
                    </button>
                    </Modal.Footer>
                </Modal>
            </div>
            );
        }
    }


    render() {
        return (
            <div>
                <NavU role="navigation" tabIndex="0"></NavU>
                <div>
                    <div className="container_orders">
                        <div className="div_logo">
                            <img id="logo" src={logo} alt="Logo NoloNolo+" aria-hidden="true"></img>
                        </div>
                        {this.state.ordini.map((ordini) =>
                            <div className="order">
                                <div className="order_title">
                                    <h6 tabIndex="0" aria-label="Numero del noleggio">Noleggio numero : {ordini._id}</h6>
                                    <h4 id="status" tabIndex="0" aria-label="Stato del noleggio">{this.status(ordini.inizio_noleggio, ordini.fine_noleggio, ordini.effettiva_restituzione, ordini.funzionario)}</h4>
                                </div>
                                <div className="order_box">
                                    <ul>
                                        <li tabIndex="0">{ordini.prodotto_codice}</li>
                                        <li tabIndex="0">Da {ordini.inizio_noleggio} a {ordini.fine_noleggio}</li>
                                        <li tabIndex="0">Prezzo : {ordini.prezzo}</li>
                                    </ul>
                                    <label id="action">{this.action(ordini.inizio_noleggio, ordini.fine_noleggio, ordini.effettiva_restituzione, ordini._id, ordini.funzionario)}</label>
                                </div>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        )
    }

}