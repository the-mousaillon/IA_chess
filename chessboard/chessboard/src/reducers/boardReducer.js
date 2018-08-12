const gen_default_cell = (y, x, baseplayer) => {
  let army = ""
  let piece = ""
  let color = ""
  let top_prefix = ""
  let bot_prefix = ""
  switch (baseplayer){
    case "white":
      top_prefix = "black"
      bot_prefix = "white"
    break
    case "black":
      top_prefix = "white"
      bot_prefix = "black"
    break
    default:
  }
  if (y === 0 || y === 1 || y === 6 || y === 7){
    let prefix = ""
    if (y < 2){
      prefix = top_prefix
      army = top_prefix
    }
    else{
      prefix = bot_prefix
      army = bot_prefix
    }
    if (y === 0 || y === 7){
      if (x === 0 || x === 7)
        piece = prefix + "r"
      else if (x === 1 || x === 6)
        piece = prefix + "kn"
      else if (x === 2 || x === 5)
        piece = prefix + "b"
      else if (x === 3)
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
    default:
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
  board: initial_board,
  currentPlayer: "white"
}


//// REDUCER FUNCTIONS FOR HANDELING GAME EVENTS ////
function copyArray(arr){
  let newtab = []
  for (let i in arr)
    newtab.push(Array.from(arr[i]))
  return newtab
}

function movePiece(board, pos1, pos2){
  let new_board = copyArray(board)
  new_board[pos2.i][pos2.j].piece = new_board[pos1.i][pos1.j].piece
  new_board[pos2.i][pos2.j].army = new_board[pos1.i][pos1.j].army
  new_board[pos1.i][pos1.j].piece = "empty"
  new_board[pos1.i][pos1.j].army = "empty"
  return new_board
}


function roqueQueen(board, player){
  let new_board = copyArray(board)
  let rowindex
  switch(player){
    case "white":
      rowindex = 7
    break
    case "black":
      rowindex = 0
    break
    default:
  }
  // move the king
  let pos1 = {i: rowindex, j: 4}
  let pos2 = {i: rowindex, j: 2}
  new_board = movePiece(new_board, pos1, pos2)
  //move the rook
  pos1 = {i: rowindex, j: 0}
  pos2 = {i: rowindex, j: 3}
  new_board = movePiece(new_board, pos1, pos2)
  return new_board
}

function roqueKing(board, player){
  let new_board = copyArray(board)
  let rowindex
  switch(player){
    case "white":
      rowindex = 7
    break
    case "black":
      rowindex = 0
    break
    default:
  }
  // move the king
  let pos1 = {i: rowindex, j: 4}
  let pos2 = {i: rowindex, j: 6}
  new_board = movePiece(new_board, pos1, pos2)
  //move the rook
  pos1 = {i: rowindex, j: 7}
  pos2 = {i: rowindex, j: 5}
  new_board = movePiece(new_board, pos1, pos2)
  return new_board
}




const boardReducer = (state=initialState, action) => {
  let new_board;
  switch(action.type){
    case "CELL_CLICKED":
      console.log("-------reducer fired !! ------------")
      console.log(state)
      return { ...state}
    case "MOVE_PIECE":
      new_board = movePiece(state.board, action.payload.pos1, action.payload.pos2)
      return { ...state, board: new_board }

    case "ROQUE_KING":
      new_board = roqueKing(state.board, action.payload.player)
      return { ...state, board: new_board }

    case "ROQUE_QUEEN":
      new_board = roqueQueen(state.board, action.payload.player)
      return { ...state, board: new_board }

    case "PAWN_UPGRADE":
      new_board = movePiece(state.board, action.payload.pos1, action.payload.pos2)
      return { ...state, board: new_board }

    default:
  }
  return { ...state }
}

export default boardReducer
