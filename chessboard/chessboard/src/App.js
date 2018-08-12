import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import Board from './components/Board.js';

class App extends Component {
  render() {
    return (
        <Board />
    );
  }
}

export default App;
