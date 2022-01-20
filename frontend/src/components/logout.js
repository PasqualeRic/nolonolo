import React, {Component} from 'react'
import './styles/logreg.css'
import {Redirect} from 'react-router-dom'

export default class Logout extends Component{


    componentDidMount(){
        localStorage.removeItem('token');
    }



    render(){
        return(
            <Redirect to="/"></Redirect>
        )
    }

}