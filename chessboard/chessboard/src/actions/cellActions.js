export function cellClicked(i,j){
  console.log("CELL_CLICKED" + " " + i + " " + j)
  return {
    type: "CELL_CLICKED",
    payload:{
      i: i,
      j: j
    }
  }
}
