import React, { Component } from 'react';
import {connect} from 'react-redux';
import Piece from './Piece';
import './Cell.css'
import { cellClicked } from '../actions/cellActions'


/* Le principe est de laisser le componnent Cell déterminer
son prope état. Il choisirat le type dévenement à dispatcher.
*/

@connect((store) => {
  return{
    board: store.board.board
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
    this.props.dispatch(cellClicked(rowindex, colindex))
  }
  render(){
    let cell = this.props.board[this.props.rowindex][this.props.colindex]
    return  <div className = { cell.color + "Cell" } onClick = { this.handleClick }>
              <Piece piece = { cell.piece } />
            </div>
  }
}

export default Cell;
