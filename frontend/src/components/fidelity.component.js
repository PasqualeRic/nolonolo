import React, {Component} from 'react'
import axios from 'axios'
import './styles/logreg.css'
import logo from './N+.png'
import './styles/fidelity.css'
import NavU from './navU.component'

export default class Bill extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            nothave : "",
            have : "",
            card : []
        }
        this.partecipa = this.partecipa.bind(this);
    }

async componentDidMount(){

    const user = await axios.get('/user', {headers: {token : localStorage.getItem('token')}});
    this.setState({utente : user.data.user._id});
    const params = {
        cod : this.state.utente
    }
    axios.get('/getFidelity', {params}).then(res => {
        if(res.data === null)
        {
            this.setState({nothave : "true"});
            this.setState({have : "false"});
        }
        else{
            this.setState({nothave : "false"});
            this.setState({have : "true"});
            this.setState({card : res.data});
        }
    }).catch(err => console.log(err));
}

partecipa(){
    const data = {
        cliente : this.state.utente
    }
    axios.post('/createFidelity', data).then(res => 
    {
        window.location.reload();
    });
}


render(){
    return(
        <div>
            <NavU role="navigation" tabIndex="0"></NavU>
            <div className={this.state.nothave}>
                <h4 tabIndex="0">Non hai la fidelity card, vuoi partecipare al programma ora? Per te numerosi vantaggi</h4>
                <button role="button" onClick={this.partecipa}>Partecipa</button>
                <p tabIndex="0" className="condizioni" style={{fontSize : "smaller"}}>Partecipando, accetti le condizioni e accetti l'invio sulla tua mail delle nostre promozioni</p>
            </div>
            <div className={this.state.have}>
                <div className="card">
                    <img src={logo} alt="Logo NoloNolo+"></img>
                    <hr></hr>
                    <h2 tabIndex="0"><span id="fid">FIDELITY</span>card</h2>
                    <hr></hr>
                    <p tabIndex="0">{this.state.card.cliente}</p>
                    <p tabIndex="0">Punti fedeltà : {this.state.card.punti}</p>
                    <p tabIndex="0">Saldo accumulato : {parseFloat(this.state.card.saldoAccumulato).toFixed(2)}</p>
                </div>

            </div>
        </div>
    )
}
}