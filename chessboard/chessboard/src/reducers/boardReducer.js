const gen_default_cell = (y, x, baseplayer) => {
  let army = ""
  let piece = ""
  let color = ""
  let top_prefix = ""
  let bot_prefix = ""
  switch (baseplayer){
    case "white": {
      top_prefix = "black"
      bot_prefix = "white"
    }
    break
    case "black": {
      top_prefix = "white"
      bot_prefix = "black"
    }
    break
  }
  if (y == 0 || y == 1 || y == 6 || y == 7){
    let prefix = ""
    if (y < 2){
      prefix = top_prefix
      army = top_prefix
    }
    else{
      prefix = bot_prefix
      army = bot_prefix
    }
    if (y == 0 || y == 7){
      if (x == 0 || x == 7)
        piece = prefix + "r"
      else if (x == 1 || x == 6)
        piece = prefix + "kn"
      else if (x == 2 || x == 5)
        piece = prefix + "b"
      else if (x == 3)
        piece = prefix + "q"
      else
        piece = prefix + "k"
    }
    else {
      console.log("pawn")
      piece = prefix + "p"
    }
  }
  else{
    piece = "empty"
    army = "empty"
  }
  switch((x+y)%2){
    case 1:
      color = "white"
      break
    case 0:
      color = "black"
      break
  }
  return {
    color : color,
    army : army,
    piece : piece,
    position : {
      i : x,
      j : y
    }
  }
}

const gen_default_board = (baseplayer) => {
  let board = []
  for (let i=0; i<8; i++){
    let row = []
    for (let j=0; j<8; j++){
      row.push(gen_default_cell(i,j, baseplayer))
    }
    board.push(row)
  }
  return board
}

var initial_board = gen_default_board("white")


var initialState = {
  board: initial_board
}

console.log(initialState)

const boardReducer = (state=initialState, action) => {
  return { ...state }
}

export default boardReducer
