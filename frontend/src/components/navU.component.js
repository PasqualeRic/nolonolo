import React, {Component} from 'react';
import '../App.css'
import logo from './N+.png'
import { SidebarData } from './sidebar.component';
import './styles/sidebar.css'
import axios from 'axios';
import history from './history';


export default class NavU extends Component{

    constructor(props){
        super(props);
        this.state = {
            sidebar : false,
            utente : ''
        }
    }

    async componentDidMount(){
        const user = await axios.get('/user', {headers: {token : localStorage.getItem('token')}});
        this.setState({utente : user.data.user.username})
    }

    showSidebar = () => this.setState({sidebar : true})
    hideSideBar = () => this.setState({sidebar : false})

    nav(path){
        history.push(path);
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
                        <img src={logo} onClick={() => this.gohome()} alt="Logo NoloNolo+" aria-hidden="true" style={{cursor : 'pointer'}}></img>
                    </div>
                </div>
                <div>
                    <div className={'d-flex'}>
                        <span id="welcome" tabIndex="0">Ciao, {this.state.utente}</span>
                        <button style={{border:'0px', backgroundColor:"transparent"}} onClick={this.showSidebar} aria-labelledby="Apri menu" tabIndex="0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="white" class="bi bi-list" viewBox="0 0 16 16" onClick={this.showSidebar}>
                            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        </button>
                        <div className={this.state.sidebar ? 'activeSideb' : 'sideB'} id="sidebar" role="list">
                            <ul>
                                <li>
                                <button style={{border:'0px', backgroundColor:"transparent"}} onClick={this.hideSideBar}><svg aria-labelledby="Chiudi menu" id="close" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white  " class="bi bi-x-lg" onClick={this.hideSideBar} viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                                    <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
                                </svg></button>
                                </li>
                                {SidebarData.map((item, index) => {
                                    return(
                                        <li key={index} className={item.cName}>
                                            <button style={{border:'0px', backgroundColor:"transparent", color:"white", padding : '8px'}} tabIndex="0" role="button" onClick={() => this.nav(item.path)} aria-labelledby="act"><span id="act">{item.title}</span></button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}