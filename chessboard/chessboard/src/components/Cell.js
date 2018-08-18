import React, { Component } from 'react';
import {connect} from 'react-redux';
import Piece from './Piece';
import './Cell.css'
import { playMiddleware } from '../middleware/playMiddleware'


@connect((store) => {
  return{
    board: store.board.board,
    player: store.board.currentPlayer
  }
})
class Cell extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
}
  handleClick(e) {
    let rowindex = this.props.rowindex
    let colindex = this.props.colindex
    e.preventDefault();
    e.stopPropagation();
    this.props.dispatch(playMiddleware(rowindex, colindex))
  }
  render(){
    let cell = this.props.board[this.props.rowindex][this.props.colindex]
    let threatened = ""
    if (cell.threatened)
      threatened = " threatened"
    return  <div className = { cell.color + "Cell" + threatened} onClick = { this.handleClick }>
              <Piece piece = { cell.piece } />
            </div>
  }
}

export default Cell;
