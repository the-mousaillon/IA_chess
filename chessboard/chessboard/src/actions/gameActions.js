export function setCurrentSelected(x,y){
  return {
    type: "SET_SELECTED",
    payload:{
      coord: {x, y}
    }
  }
}
