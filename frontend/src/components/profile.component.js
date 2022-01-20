import React, { Component} from 'react';
import '../App.css'
import logo from './N+.png'
import axios from 'axios';
import './styles/logreg.css'
import NavU from "./navU.component"


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            message: ''
        }
    }

    async componentDidMount() {
        axios.get('/user', { headers: { token: localStorage.getItem('token') } }).then(res => {
            const user = res.data.user;
            this.setState({ user: user });
        }).catch(err => {
            console.log(err);
        })
    }

   modifica = e => {
        e.preventDefault();
        if(this.nome === '' || this.cognome === '' || this.username === '' || this.email === '')
        {
            this.setState({message : 'I campi non possono essere vuoti'})
        }
        else if (this.password === '' || this.password === null || this.password === undefined) {
            this.setState({ message: 'Devi inserire la password per effettuare modifiche' });
        }
        else {
            const data = {
                id: this.state.user._id,
                nome: this.nome,
                cognome: this.cognome,
                username: this.username,
                email: this.email,
                password: this.password,
                newpassword: this.npassword,
                old_username: this.state.user.username,
                old_email : this.state.user.email
            };

            console.log(data);

            axios.post('/modificaDatiU', data).then(res => {
                console.log(res);
                if (res.data == 'error') {
                    this.setState({ message: 'Password errata. La pagina si riaggornerà tra 3 secondi' });
                    window.setTimeout('window.location.reload()', 3000);
                }
                if (res.data == 'exist') {
                    this.setState({ message: 'Username o email già esistente. La pagina si riaggornerà tra 3 secondi' });
                    window.setTimeout('window.location.reload()', 3000);
                }
                else if (res.data == 'ok') {
                    this.setState({ message: '' });
                    window.location.reload();
                }
            });
        }
    }

    render() {
        return (
            <div>
                <NavU role="navigation" tabIndex="0"></NavU>

                <form className="logregcontainer" onSubmit={this.modifica}>
                    <img src={logo} id="logreglogo" alt="Logo NoloNolo+"></img>
                    <p id="error">{this.state.message}</p>
                    <div className="ins">
                        <label tabIndex="0" className="descr" htmlFor="nome" id="nome">Nome</label><br></br>
                        <input type="text" defaultValue={this.state.user.nome} name="nome" id="nome" onChange={e => this.nome = e.target.value} aria-describedby="nome"></input>
                    </div>
                    <div className="ins">
                        <label tabIndex="0" className="descr" htmlFor="cognome" id="cognome">Cognome</label><br></br>
                        <input type="text" defaultValue={this.state.user.cognome} name="cognome" id="cognome" onChange={e => this.cognome = e.target.value} aria-describedby="cognome"></input>
                    </div>
                    <div className="ins">
                        <label tabIndex="0" className="descr" htmlFor="username" id="username">Username</label><br></br>
                        <input type="username" defaultValue={this.state.user.username} name="username" id="username" onChange={e => this.username = e.target.value} aria-describedby="username"></input>
                    </div>
                    <div className="ins">
                        <label tabIndex="0" className="descr" htmlFor="email" id="email">E-mail</label><br></br>
                        <input type="email" defaultValue={this.state.user.email} name="email" onChange={e => this.email = e.target.value} aria-describedby="email"></input>
                    </div>
                    <div className="ins">
                        <input type="password" placeholder="Inserire password attuale" name="password" onChange={e => this.password = e.target.value} aria-label="Inserire password attuale"></input>
                    </div>
                    <div className="ins">
                        <label tabIndex="0" htmlFor="newpass" className="descr" id="descr">Se vuoi cambiare password, inserire la nuova password in questo campo</label>
                        <input type="password" placeholder="Nuova password" name="npass" id="newpass" onChange={e => this.npassword = e.target.value} aria-describedby="descr"></input>
                    </div>
                    <div className="buttons">
                        <button type="submit" className="logreg" id="edit" tabIndex="0" role="button">Modifica</button>
                    </div>
                </form>
            </div>
        )
    }

}