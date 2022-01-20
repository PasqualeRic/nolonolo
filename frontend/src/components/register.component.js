import React, {Component} from 'react'
import axios from 'axios'
import './styles/logreg.css'
import logo from './N+.png'
import history from './history'
import Nav from "./nav.component"

export default class Register extends Component{
    constructor(props) {
        super(props);
        this.state = {
            mex : ''
        }
    }
    handleSubmit = e => {
        e.preventDefault();
        console.log(this.nome);
        if(this.nome === undefined || this.cognome === undefined || this.username === undefined || this.email === undefined || this.password === undefined)
        {
            this.setState({mex : 'Inserire tutti i dati'});
        }
        else{

            const data = {
                nome : this.nome,
                cognome : this.cognome,
                username : this.username,
                email : this.email,
                password : this.password
            };

            const headers = {
                'Content-Type' : 'application/json'
            };
            axios.post('/registrati', data).then(
                res => {console.log(res.data);
                    if(res.data === "Ok")
                    {
                        history.push('/login');
                        window.location.reload();
                    }
                }
            ).catch(
                err => {
                    console.log({message:err});
                    this.setState({mex : 'Username o email già in uso'});
                }
            )
        }
    }
    
    render(){

        return(
            <div>
                <Nav tabIndex="0" role="navigation"></Nav>
 
                <form className="logregcontainer" onSubmit={this.handleSubmit}>
                    <p style={{'color' : 'red'}}>{this.state.mex}</p>
                    <img src={logo} id="logreglogo" alt="Logo NoloNolo+"></img>
                    <div className="ins">
                        <input type="text" id="inputNome" placeholder="Nome" onChange={ e => this.nome = e.target.value} aria-required="true" aria-label="nome"></input>
                    </div>
                    <div className="ins">
                        <input type="text" id="inputCognome" placeholder="Cognome" onChange={ e => this.cognome = e.target.value} aria-required="true" aria-label="cognome"></input>
                    </div>
                    <div className="ins">
                        <input type="text" id="inputUsername" placeholder="Username" onChange={ e => this.username = e.target.value} aria-required="true" aria-label="username"></input>
                    </div>
                    <div className="ins">
                        <input type="email" id="inputEmail" placeholder="e-mail" onChange={ e => this.email = e.target.value} aria-required="true" aria-label="email"></input>
                    </div>
                    <div className="ins">
                        <input type="password" id="inputPass" placeholder="Password" onChange={ e => this.password = e.target.value} aria-required="true" aria-label="password"></input>
                    </div>
                    <div className="buttons">
                        <button type="submit" className="logreg" id="btnreg" role="button">Registrati</button>
                    </div>
                </form>
            </div>
        )
    }

}