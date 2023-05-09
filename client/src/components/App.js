import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import '../App.css';

import Navigation from './Navigation';
import SignUp from './SignUp';
import {AuthenticatedRoute, AuthProvider, UnauthenticatedRoute} from "../firebase/Auth";
import ChangePassword from "./ChangePassword";
import Dashboard from "./Dashboard/Dashboard";

import Login from "./Login";
import LogOut from "./LogOut";
import ConvertHtmlToPdf from "./wkhtmltopdf"

import Account from "./Account";

import DashboardContext from '../components/Dashboard/DashboardContext';

function App() {
    const [selectedFunctionality, setSelectedFunctionality] = useState('home');
    return (
        <AuthProvider>
            <DashboardContext.Provider value={{selectedFunctionality, setSelectedFunctionality}}>
                <Router>
                    <div className="App">
                        <header className="App-header">
                            <Navigation/>
                        </header>
                    </div>
                    <Routes>
                        <Route exact path='/' element={<AuthenticatedRoute />}>
                            <Route exact path='/' element={<Dashboard />} />
                        </Route>

                        <Route exact path='/account' element={<AuthenticatedRoute />}>
                            <Route exact path='/account' element={<Account />} />
                        </Route>

                        <Route exact path='/changepassword' element={<AuthenticatedRoute />}>
                            <Route exact path='/changepassword' element={<ChangePassword />} />
                        </Route>

                        <Route path='/wkhtmltopdf' element={<ConvertHtmlToPdf/>} />

                        <Route exact path='/login' element={<UnauthenticatedRoute />}>
                            <Route path='/login' element={<Login />} />
                        </Route>

                        <Route exact path='/signup' element={<UnauthenticatedRoute />}>
                            <Route path='/signup' element={<SignUp />} />
                        </Route>

                        {<Route path='/logout' element={<LogOut />} />}
                    </Routes>
                </Router>

            </DashboardContext.Provider>

        </AuthProvider>
    );
}

export default App;
