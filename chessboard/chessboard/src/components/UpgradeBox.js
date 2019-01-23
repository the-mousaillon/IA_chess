import React, { Component } from 'react';
import {connect} from 'react-redux';
import Piece from './Piece';
import './UpgradeBox.css'
import { pawnUpgrade } from '../actions/boardActions'
import { nexTurn, setUpgrade } from '../actions/gameActions'
import { upgradeMiddleware } from '../middleware/playMiddleware'

@connect((store) => {
  return{
    playerProps: store.game.playerProps,
    player: store.game.currentPlayer
  }
})

class UpgradeBox extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  renderBox() {
    let box = []
    let player = this.props.player
    let upgradePos = this.props.playerProps[player].upgrade
    box.push(<div onClick={() => this.handleClick(this.props.player + "kn", upgradePos)} >
    <Piece piece = {this.props.player + "kn"} /></div>)
    box.push(<div onClick={() => this.handleClick(this.props.player + "q", upgradePos)} >
    <Piece piece = {this.props.player + "q"} /></div>)
    box.push(<div onClick={() => this.handleClick(this.props.player + "r", upgradePos)} >
    <Piece piece = {this.props.player + "r"} /></div>)
    box.push(<div onClick={() => this.handleClick(this.props.player + "b", upgradePos)} >
    <Piece piece = {this.props.player + "b"} /></div>)
    if (upgradePos!==null)
      return box
    else
      return null
  }

  handleClick = (action, upgradePos) => {
    console.log("upgradebox --> ", action)
    this.props.dispatch(pawnUpgrade(upgradePos, action))
    this.props.dispatch(setUpgrade(this.props.player, null))
    this.props.dispatch(nexTurn())
  }

  render(){
    return  <div className="upgradeBox">
              { this.renderBox() }
            </div>
  }
}

export default UpgradeBox;
