import React, { Component } from 'react';
import {connect} from 'react-redux';
import Piece from './Piece';
import './Cell.css'

@connect((store) => {
  return{
    board: store.board.board
  }
})

class Cell extends Component {
  render(){
    let cell = this.props.board[this.props.rowindex][this.props.colindex]
    return  <div className = { cell.color + "Cell" }>
              <Piece piece = { cell.piece } />
            </div>
  }
}

export default Cell;
