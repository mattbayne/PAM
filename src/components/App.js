// import {AuthProvider} from '../firebase/Auth';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import '../App.css';

import Navigation from './Navigation';
import Landing from './Landing';
import SignUp from './SignUp';
import Login from './Login';
import SignOut from './LogOut';
import {AuthProvider} from "../firebase/Auth";
import ChangePassword from "./ChangePassword";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Dashboard/Dashboard";
import LogOut from "./LogOut";

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
                    <Route exact path='/' element={<Dashboard/>} />
                    <Route path='/signup' element={<SignUp/>} />
                    <Route path='/login' element={<Login/>} />
                    {/*<Route path='/logout' element={<LogOut/>} />*/}
                    <Route path='/changepassword' element={<PrivateRoute path='/changepassword' element={<ChangePassword/>} />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
