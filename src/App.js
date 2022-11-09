import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import GamePage from './pages/GamePage';

export default function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
        <p>SUA VEZ</p>
      </header> */}
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route path="/game" component={ GamePage } />
      </Switch>
    </div>
  );
}
