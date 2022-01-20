import React, {Component} from 'react'
import axios from 'axios'
import './styles/logreg.css'
import logo from './N+.png'
import {Link, Redirect} from 'react-router-dom'
import manageNol from './utilities/manageNol'
import './styles/bill.css'
import history from './history'
import NavU from './navU.component'

export default class Bill extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            fattura : [],
            mex : '',
            display : '',
        }
    }

async componentDidMount(){

    let params = {
        id : this.props.history.location.state.ordine
    }
    axios.get('/getBillbyId', {params}).then(res=>{
        if(res.data == null)
        {
            this.setState({fattura : ''});
            this.setState({mex : 'Ordine ancora in elaborazione. Riprovare più tardi'});
            this.setState({display : 'none'});
        }
        else{
            this.setState({fattura : res.data});
        }
    });
}

gohome(){
    history.push('/orders');
    window.location.reload();
}

render(){
    return(
        <div>
            <NavU role="navigation" tabIndex="0"></NavU>
        <div>
        <div className="bill">
            <h1 style={{textAlign:"center"}}>{this.state.mex}</h1>
            <div className="bill_row" style={{display : this.state.display}}>
                <h3>NoloNolo+</h3>
                <h2>FATTURA</h2>
            </div>
            <div className="bill_row_tables" style={{display : this.state.display}}>
                <div className="nolo_info">
                    <p>nolonolosrl</p>
                    <p>Bologna</p>
                    <p>Via Zamboni</p>
                </div>
                <div className="info_bill">
                     <table>
                        <tr>
                            <th>FATTURA N.</th>
                            <th>DATA</th>
                        </tr>
                        <tr>
                            <td>{this.state.fattura._id}</td>
                            <td>{this.state.fattura.data_creazione}</td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <th>ID CLIENTE</th>
                            <th>USERNAME</th>
                        </tr>
                        <tr>
                            <td>{this.state.fattura.id_cliente}</td>
                            <td>{this.state.fattura.us_cliente}</td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <th>FUNZIONARIO</th>
                        </tr>
                        <tr>
                            <td>{this.state.fattura.funzionario}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div className="bill_body" style={{display : this.state.display}}>
                <table>
                    <tr>
                        <th>DESCRIZIONE</th>
                        <th>PERIODO</th>
                        <th>IMPORTO</th>
                    </tr>
                    <tr>
                        <td>(COD:{this.state.fattura.prodotto}){this.state.fattura.nome_prodotto}</td>
                        <td>{this.state.fattura.periodo_noleggio}</td>
                        <td>{this.state.fattura.subtotale}</td>
                    </tr>
                </table>
            </div>
            <div className="price_handle" style={{display : this.state.display}}>
                <table>
                    <tr>
                        <th>SUBTOTALE</th><td>{this.state.fattura.subtotale}</td></tr>
                        <tr><th>SCONTI</th><td>{this.state.fattura.sconti}</td></tr>
                        <tr><th>PENALE</th><td>{this.state.fattura.penale}</td></tr>
                        <tr><th>TOTALE</th><td>{this.state.fattura.totale}</td></tr>
                </table>

            </div>
        <p id="thx" style={{display : this.state.display}}>Grazie per averci scelto!</p>
        </div>
        </div>
        </div>
    )
}
}