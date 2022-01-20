import React, {Component} from 'react';
import '../App.css'
import logo from './N+.png'
import axios from 'axios';
import './styles/rent.css'
import manageNol from './utilities/manageNol'
import history from './history'
import NavU from './navU.component'


export default class Rent extends Component{

    constructor(props){
        super(props);
        this.state ={
            product : '',
            initdate : undefined,
            findate : undefined,
            message : '',
            addOn : '',
            bottone : "true",
            userid : undefined,
            prod_code : '',
            data_prenotata : '',
            price : 0,
            prova : 'ciao',
            today : ''
        }
        this.verificadate = this.verificadate.bind(this);
        this.confermaNol = this.confermaNol.bind(this);
    }

    async componentDidMount(){
        const id = localStorage.getItem('id_prod');
        const params = {
            codiceprodotto : id
        }
        axios.get('/getProdbyId', {params}).then(res => {
            this.setState({product : res.data});
        }).catch(err => {console.log(err)});

        let today = new Date();
        today = today.toISOString();
        today = today.substring(0,10);
        this.setState({today : today});
    }

    verificadate(){

        this.setState({addOn : ''});
        this.setState({message : ''});
        this.setState({bottone : "true"});
        this.setState({prod_code : ''});
        this.setState({data_prenotata : ''});


        if(this.state.initdate > this.state.findate){
            this.setState({message : 'Date non valide!'})
        }
        else if(this.state.initdate === undefined || this.state.findate === undefined)
        {
            this.setState({message : 'Inserire entrambe le date!'})
        }
        else{
            const results = manageNol(this.state.initdate, this.state.findate, this.state.product, this.state.prova);
            if(results === 'nondisp')
            {
                this.setState({addOn : 'Prodotto non disponibile nelle date selezionate'});
            }
            else{
                const text = results[0];
                const price = parseFloat(results[1]).toFixed(2);
                if(text !== null && text !== undefined)
                {
                    this.setState({addOn : text})
                }
                this.setState({price : price});
                this.setState({message : 'Prezzo totale noleggio : ' + price + '€'});
                this.setState({bottone : ""});
                this.setState({prod_code : results[2]});
                this.setState({data_prenotata : results[3]});
            }
        }
    }

    async confermaNol(){
        //prendo i dati del cliente che ha effettuato l'ordine
        let user = await axios.get('/user', {headers: {token : localStorage.getItem('token')}});
        let date_length = this.state.data_prenotata.length;
        let id_utente = user.data.user._id;
        let username_utente = user.data.user.username;
    
        const data = {
            user : id_utente,
            usernamecliente : username_utente,
            prodotto_nome : this.state.product.nome,
            product_series : this.state.product._id,
            product_id : this.state.prod_code,
            periodo_noleggio : this.state.data_prenotata[0].toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '-' ) + ',' + this.state.data_prenotata[date_length-1].toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '-' ),
            prezzo : this.state.price,
            categoria : this.state.product.categoria
        };
        axios.post('/book', data).then(res => {
            this.setState({message : 'Ordine confermato. Per visionarlo, andare nella sezione > I miei ordini dalla barra laterale. Sarai reindirizzato nella pagina home tra qualche secondo'});
            this.setState({bottone : "true"});
            history.push('/home');
            window.setTimeout("window.location.reload()", 5000);
        }).catch(err => console.log(err));
    }


    render(){
        return(
            <div>
                <NavU role="navigation" tabIndex="0"></NavU>
            <div className="nol_container">
                <div className="div_logo">
                    <img id="logo" src={logo} alt="Logo NoloNolo+"></img>
                </div>
                <div className="description_box">
                    <div className="des_img">
                        <img src={`/image/${this.state.product.img}`} alt="Foto descrittiva del prodotto"></img>
                    </div>
                    <div className="des_text">
                        <h3 tabIndex="0">{this.state.product.nome}</h3>
                        <p tabIndex="0">{this.state.product.descrizione}</p>
                    </div>
                </div>
                <div className = "form_space">
                    <label tabIndex="0" htmlFor="init_date" id="init_date">Data inizio noleggio : </label><br></br>
                    <input type="date" id="init_date" name="init_date" min={this.state.today} max={this.state.findate} onChange={e => this.setState({initdate : e.target.value})} aria-describedby="init_date"></input><br></br>
                    <label tabIndex="0" htmlFor="fin_date" id="fin_date">Data fine noleggio : </label><br></br>
                    <input type="date" id="fin_date" name="fin_date" min={this.state.initdate} onChange={e => this.setState({findate : e.target.value})} aria-describedby="fin_date"></input>
                    <div className="buttons">
                        <button onClick={this.verificadate} className="logreg">Verifica</button>
                        <p tabIndex="0" className="messages">{this.state.addOn}</p>
                        <p tabIndex="0" className="messages">{this.state.message}</p>
                        <button role="button" tabIndex="0" onClick={this.confermaNol} className="logreg" disabled={this.state.bottone}>Conferma noleggio</button>
                    </div>
                </div>
            </div>
            </div>
        )
    }

}