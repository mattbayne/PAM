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
                    <Route exact path='/' element={<Landing/>} />
                    <Route path='/signup' element={<SignUp/>} />
                    <Route path='/signin' element={<SignIn/>} />
                    <Route path='/signout' element={<SignOut/>} />
                    <Route path='/changepassword' element={<PrivateRoute path='/changepassword' element={<ChangePassword/>} />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
