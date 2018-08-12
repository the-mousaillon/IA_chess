import React, { Component } from 'react';
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
      case "whitek":
        return <Wk />
      // queen
      case "blackq":
        return <Bq />
      case "whiteq":
        return <Wq />
      // knight
      case "blackkn":
        return <Bkn />
      case "whitekn":
        return <Wkn />
      // bishop
      case "blackb":
        return <Bb />
      case "whiteb":
        return <Wb />
      // rook
      case "blackr":
        return <Br />
      case "whiter":
        return <Wr />
     // pawn
      case "blackp":
        return <Bp />
      case "whitep":
        return <Wp />
      case "moveMarker":
        return <Wp />

      case "empty":
        return null
        default:
    }
  }
  render(){
    return this.getPiece(this.props.piece)
  }
}

export default Piece;
