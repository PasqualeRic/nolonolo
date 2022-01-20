import {Redirect, Route} from 'react-router-dom';
import axios from 'axios'
import history from './history'

const PrivateRoute = props => {
    if(localStorage.getItem('token')!=null)
    {
        const user = axios.get('/user', {headers: {token : localStorage.getItem('token')}});
        user.then(function(result){
            if(result.data.title === 'unauthorized'){
                window.localStorage.removeItem('token');
                history.push('/');
                window.location.reload();
            }
        }).catch(function(err){
            console.log(err);

        });
    }
    else{
        return <Redirect to='/'/>;
    }

    return <Route {...props} />;
};

export default PrivateRoute;