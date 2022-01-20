import React, {Component} from 'react';
import '../App.css'
import logo from './N+.png'
import history from './history';


export default class Nav extends Component{

    login(){
        history.push('/login');
        window.location.reload();
    }

    register(){
        history.push('/register');
        window.location.reload();
    }

    gohome(){
        history.push('/home');
        window.location.reload();
    }


    render(){
        return( 
            <div id="nav" className={'navbar navbar-light'}>
                <div>
                    <div className={"container-fluid"}>
                        <img src={logo} alt="Logo NoloNolo+" onClick={() => this.gohome()} style={{cursor : 'pointer'}} aria-hidden="true"></img>
                    </div>
                </div>
                <div>
                    <div className={'d-flex'}>
                        <button style={{border : '0px', backgroundColor : 'transparent'}} onClick={() => this.login()} className={'navbar-brand'} aria-label="Accedi" tabIndex="0">Accedi</button>
                        <button style={{border : '0px', backgroundColor : 'transparent'}} onClick={() => this.register()} className={'navbar-brand'} aria-label="Registrati" tabIndex="0">Registrati</button>
                    </div>
                </div>
            </div>
        )
    }

}