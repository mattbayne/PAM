// import {AuthProvider} from '../firebase/Auth';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import '../App.css';

import Navigation from './Navigation';
import Landing from './Landing';
import SignUp from './SignUp';
import SignIn from './SignIn';
import SignOut from './SignOut';
import {AuthProvider} from "../firebase/Auth";
import ChangePassword from "./ChangePassword";
import PrivateRoute from "./PrivateRoute";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <header className="App-header">
                        <Navigation/>
                    </header>
                </div>
                <Routes>
                    <Route exact path='/' component={Landing} />
                    <Route path='/signup' component={SignUp} />
                    <Route path='/signin' component={SignIn} />
                    <Route path='/signout' component={SignOut} />
                    <Route path='/changepassword' component={PrivateRoute}>
                        <Route path='/changepassword' component={ChangePassword} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
