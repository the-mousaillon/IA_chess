export function cellClicked(i,j){
  console.log("CELL_CLICKED ", i, " ", j)
  return {
    type: "CELL_CLICKED",
    payload:{
      i: i,
      j: j
    }
  }
}


export function movePiece(pos1, pos2){
  return {
    type: "MOVE_PIECE",
    payload:{
      pos1: pos1,
      pos2: pos2
    }
  }
}

export function roqueQueen(player){
  return {
    type: "ROQUE_QUEEN",
    payload: {
      player: player
    }
  }
}

export function roqueKing(player){
  return {
    type: "ROQUE_KING",
    payload: {
      player: player
    }
  }
}

export function pawnUpgrade(coord, pieceType){
  return {
    type: "PAWN_UPGRADE",
    payload: {
      coord: coord,
      pieceType: pieceType
    }
  }
}
