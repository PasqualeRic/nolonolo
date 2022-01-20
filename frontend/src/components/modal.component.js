import React, {Component} from 'react'

export default class Modals extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return
            <>{this.props.isOpen ? <div>ciao</div> : null}</>;
    }
}