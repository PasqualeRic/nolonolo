import React from 'react';
import './App.css'
import Home from "./components/home.components"
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Register from "./components/register.component"
import Login from "./components/login.component"
import UHome from './components/uhome.component'
import PrivateRoute from './components/privateRoute'
import Orders from './components/orders.component'
import Profile from './components/profile.component';
import Rent from './components/rent.component';
import editRes from './components/editReservation.component';
import Bill from './components/bill.component';
import Fidelity from './components/fidelity.component';
import Logout from './components/logout';
import Footer from './components/footer.component';


function App(){

  return (
    <div className="page-container">
        <div className="content-wrap">
            <BrowserRouter>
                <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/register" component={Register}/>
                <Route path="/login" component={Login}/>
                <PrivateRoute path="/home" component={UHome}></PrivateRoute>
                <PrivateRoute path="/orders" component={Orders}></PrivateRoute>
                <PrivateRoute path="/profile" component={Profile}></PrivateRoute>
                <PrivateRoute path="/rent" component={Rent}></PrivateRoute>
                <PrivateRoute path="/edit_reservation" component={editRes}></PrivateRoute>
                <PrivateRoute path="/bill" component={Bill}></PrivateRoute>
                <PrivateRoute path="/fidelity" component={Fidelity}></PrivateRoute>
                <PrivateRoute path="/logout" component={Logout}></PrivateRoute>
                </Switch>
            </BrowserRouter>
        </div>
        <Footer></Footer>
    </div>
  );
}

export default App;
