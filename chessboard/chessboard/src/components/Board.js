import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Board.css';
import Cell from './Cell.js';

class Board extends Component {
  renderBoard = () => {
    let boardJSX = [];
    for (let i=0; i<10; i++){
      for (let j=0; j<10; j++)
        boardJSX.push(<Cell rowIndex = { i } colIndex = { j } />)
    }
    return boardJSX
  }

  render() {
    return (
      <div>
        { this.renderBoard() }
      </div>
    );
  }
}

export default Board;
