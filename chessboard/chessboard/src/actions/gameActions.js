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

export function nexTurn(){
  return {
    type: "NEXT_TURN"
  }
}
