import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Cell.css';


@connect((store) => {
  return{
    cellClass: store.board.getCellClass
  };
})
class Cell extends Component {
  render(){
    return  <div className = { cellClass(this.props.ColIndex, this.props.rowIndex) }>
            </div>
  }
}

export default Cell;
