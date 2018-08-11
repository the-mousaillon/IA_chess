import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wkn from './pieces/Wkn'
import Bkn from './pieces/Bkn'
import Bb from './pieces/Bb'
import Wb from './pieces/Wb'
import Br from './pieces/Br'
import Wr from './pieces/Wr'
import Bq from './pieces/Bq'
import Wq from './pieces/Wq'
import Bk from './pieces/Bk'
import Wk from './pieces/Wk'
import Bp from './pieces/Bp'
import Wp from './pieces/Wp'

class Piece extends Component {
  getPiece = (name) => {
    switch (name) {
      // king
      case "blackk":
        return <Bk />
        break
      case "whitek":
        return <Wk />
        break
      // queen
      case "blackq":
        return <Bq />
        break
      case "whiteq":
        return <Wq />
        break
      // knight
      case "blackkn":
        return <Bkn />
        break
      case "whitekn":
        return <Wkn />
        break
      // bishop
      case "blackb":
        return <Bb />
        break
      case "whiteb":
        return <Wb />
        break
      // rook
      case "blackr":
        return <Br />
        break
      case "whiter":
        return <Wr />
        break
     // pawn
      case "blackp":
        return <Bp />
        break
      case "whitep":
        return <Wp />
        break
      case "empty":
        return null
        break
    }
  }
  render(){
    return this.getPiece(this.props.piece)
  }
}

export default Piece;
