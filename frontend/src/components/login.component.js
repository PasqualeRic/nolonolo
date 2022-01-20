import React, {Component} from 'react'
import axios from 'axios'
import './styles/logreg.css'
import logo from './N+.png'
import Nav from "./nav.component"

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            mex : ''
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        const data = {
            username : this.username,
            password : this.password
        };


        axios.post('/login', data).then(
            res => {
                if(res.data.title === "login success")
                {
                    localStorage.setItem('token', res.data.token); 
                    this.props.history.push('/home')
                }

                else
                {
                    this.setState({mex : res.data.error});
                }

            }
        );
    }



    render(){
        return(
            <div>
                <Nav tabIndex="0" role="navigation"></Nav>
                <div className="body">
                <form className="logregcontainer" onSubmit={this.handleSubmit}>
                    <img src={logo} id="logreglogo" alt="Logo NoloNolo+"></img>
                    <p style={{color : 'red'}}>{this.state.mex}</p>
                    <div className="ins">
                        <input type="text"  id="inputUsername" placeholder="Nome utente" onChange={e => this.username = e.target.value} aria-required="true"></input>
                    </div>
                    <div className="ins">
                        <input type="password" id="inputPass" placeholder="Password" onChange={e => this.password = e.target.value} aria-required="true"></input>
                    </div>
                    <div className="buttons">
                        <button type="submit" className="logreg" id="btnreg" tabIndex="0" aria-label="Accedi">Accedi</button>
                    </div>
                </form>
                </div>
            </div>
        )
    }

}