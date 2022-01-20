import React, {Component} from 'react'
import axios from 'axios'
import Nav from "./nav.component"
import './styles/home.css'
import Modals from './modal.component'
import history from './history'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Footer from './footer.component'

export default class Home extends Component{

    constructor(props){
        super(props);
        this.state = {
            products : [],
            searchTerm : '',
            category : ''
        }
    }


    async componentDidMount(){
        if (localStorage.getItem('token') != null)
        {
            history.push('/home');
            window.location.reload();
        }
        let prod = await axios.get('/getProducts').then(res=>{
            const users = res.data;
            this.setState({products : users});
            console.log(this.state.products);
        }).catch(err => {
            console.log(err);
        })

        
    }

    min(arg){
        let prices = [];
        for(var i in arg){
            prices[i] = parseFloat(arg[i].prezzo);
        }
        return Math.min(...prices);
    }

    add(){
        axios.post('/addFidelity').then(res => {console.log(res)});
    }

    get(){
        axios.get('/getFidelities').then(res => console.log(res));
    }


    render(){

            return(
                <div className="body">
                    <Nav tabIndex="0" role="navigation"></Nav>
                <div className="filter_box">
                        <select className='selectInput' onChange={e => this.setState({category : e.target.value})}>
                            <option className='option' value='' disabled selected>Categoria</option>
                            <option className='option' value="global">Globale</option>
                            <option className='option' value="agricoltura">Agricoltura</option>
                            <option className='option' value="veicoli">Veicoli</option>
                            <option className='option' value="sport">Sport</option>
                        </select>
                        <input className={"form-control me-2"} type="text" placeholder="Cerca prodotto..." aria-label="Cerca" id="search_input" onChange={(e) =>  {console.log(e.target.value) 
                                                                                                                                                                    this.setState({searchTerm : e.target.value})}}></input>
                </div>
                <div className="container" role="main">
                    {this.state.products.filter((product)=>{
                        if(this.state.searchTerm === "" && (this.state.category === '' || this.state.category==='global')){
                            return product
                        } else if(this.state.searchTerm != ''){
                            if(product.nome.toLowerCase().includes(this.state.searchTerm.toLowerCase())){
                                if(this.state.category === '' || this.state.category==='global'){
                                    return product
                                }else if(this.state.category !== '' && this.state.category!=='global'){
                                    if(this.state.category.toLowerCase() === product.categoria.toLowerCase()){
                                        return product
                                    }
                                }
                            }
                        } else if(this.state.category !== '' && this.state.category!=='global'){
                            if(this.state.category.toLowerCase() === product.categoria.toLowerCase()){
                                return product
                            }
                            
                        }})
                        .map((product) => 
                                <div className="card_space">
                                	<div className="card_photo">
                                        <img tabIndex="0" src={`/image/${product.img}`} className="img" alt="Foto che rappresenta il prodotto"></img>
                                    </div>
                                    <div className="card_body">
                                    <h5 className="card-title" tabIndex="0">{product.nome}{(product.sconti.length > 0 ? (<OverlayTrigger aria-labelledby="openInfo" trigger="click" placement="top" overlay={
                                            <Popover id="popover-basic">
                                                <Popover.Title as="h3">Sconti</Popover.Title>
                                                <Popover.Content>
                                                    {product.sconti.map(sconti => 
                                                        <p><strong>{sconti.nomesconto} : </strong>{sconti.descrizionesconto}</p>
                                                        )}
                                                </Popover.Content>
                                            </Popover>}>
                                            
                                            <button tabIndex="0" role="button" style={{border : "0px", backgroundColor : "transparent"}}><svg style={{marginLeft:'10px'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
                                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                                            </svg></button>
                                            </OverlayTrigger>) :
                                            (<label></label>))}</h5>
                                        <p tabIndex="0" className="descrizione">{product.descrizione}</p>
                                        <p tabIndex="0">a partire da {this.min(product.magazzino)}€</p>
                                    </div>
                                </div>
                    )}
                    {
                        this.state.isClicked ?   <Modals /> : ''
                    }
                </div>
            </div>
            );
        }
}