import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import Board from './components/Board.js';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Board>
        </Board>
        <p className="App-intro">
          To get started bite, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
