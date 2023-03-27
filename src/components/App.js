// import {AuthProvider} from '../firebase/Auth';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import '../App.css';

import Navigation from './Navigation';
import Landing from './Landing';
import SignUp from './SignUp';
import SignIn from './SignIn';
import SignOut from './SignOut';

function App() {
  return (
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
          <Route path='/logout' component={SignOut} />
        </Routes>
      </Router>
  );
}

export default App;
