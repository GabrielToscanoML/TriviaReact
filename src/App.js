import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Configuration from './pages/Configuration';

export default function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
        <p>SUA VEZ</p>
      </header> */}
      <Switch>
        {/* coloquei o exact pois estava dando conflito */}
        <Route exact path="/" component={ Login } />
        <Route exact path="/configuration" component={ Configuration } />
      </Switch>
    </div>
  );
}
