export function setCurrentSelected(x,y){
  return {
    type: "SET_SELECTED",
    payload:{
      coord: {x, y}
    }
  }
}

export function setAvailablePlays(playList){
  return {
    type: "SET_AVAILABLE_PLAYS",
    payload:{
      playList: playList
    }
  }
}

export function setEnPassant(player, y){
  return {
    type: "SET_EN_PASSANT",
    payload:{
      player: player,
      j: y
    }
  }
}

export function setUpgrade(player, pos){
  return {
    type: "SET_UPGRADE",
    payload:{
      player: player,
      pos: pos
    }
  }
}

export function nexTurn(){
  return {
    type: "NEXT_TURN"
  }
}
