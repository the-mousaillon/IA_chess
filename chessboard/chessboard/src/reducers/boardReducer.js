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
    threatened: false,
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
}


//// REDUCER FUNCTIONS FOR HANDELING GAME EVENTS ////

// this one turned out to be pretty usefull so I'll export it ^^
export function copyArray(arr){
  let newtab = []
  let objectTab = []
  for (let i in arr){
    for (let j in arr[i])
      objectTab.push({...arr[i][j]})
    newtab.push(Array.from(objectTab))
    objectTab = []
  }
  return newtab
}

export function movePiece(board, pos1, pos2){
  let new_board = copyArray(board)
  new_board[pos2.i][pos2.j].piece = new_board[pos1.i][pos1.j].piece
  new_board[pos2.i][pos2.j].army = new_board[pos1.i][pos1.j].army
  new_board[pos1.i][pos1.j].piece = "empty"
  new_board[pos1.i][pos1.j].army = "empty"
  return new_board
}

export function priseEnPassant(board, pos1, pos2){
  let new_board = copyArray(board)
  new_board[pos2.i][pos2.j].piece = new_board[pos1.i][pos1.j].piece
  new_board[pos2.i][pos2.j].army = new_board[pos1.i][pos1.j].army
  new_board[pos1.i][pos2.j].piece = "empty"
  new_board[pos1.i][pos2.j].army = "empty"
  new_board[pos1.i][pos1.j].piece = "empty"
  new_board[pos1.i][pos1.j].army = "empty"
  return new_board
}

export function roqueQueen(board, player){
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

export function roqueKing(board, player){
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


function applyPlayList(board, playList){
  let new_board = copyArray(board)
  for (let i in playList){
      let play = playList[i]
      if (board[play.i][play.j].army === "empty")
        new_board[play.i][play.j].piece = "moveMarker"
      else
        new_board[play.i][play.j].threatened = true
  }
  return new_board
}

function clearPlayList(board, playList){
  let new_board = copyArray(board)
  for (let i=0; i<8; i++){
    for (let j=0; j<8; j++){
      if (board[i][j].threatened)
        new_board[i][j].threatened = false
      if (board[i][j].piece === "moveMarker")
        new_board[i][j].piece = "empty"
    }
  }
  return new_board
}

const boardReducer = (state=initialState, action) => {
  let new_board;
  switch(action.type){
    case "CELL_CLICKED":
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

    case "PRISE_EN_PASSANT":
      new_board = priseEnPassant(state.board, action.payload.pos1, action.payload.pos2)
      return { ...state, board: new_board }

    case "PAWN_UPGRADE":
      new_board = movePiece(state.board, action.payload.pos1, action.payload.pos2)
      return { ...state, board: new_board }

    case "APPLY_PLAYLIST":
      new_board = applyPlayList(state.board, action.payload.playList)
      return { ...state, board: new_board }

    case "CLEAR_PLAYLIST":
      new_board = clearPlayList(state.board)
      return { ...state, board: new_board }

    default:
  }
  return { ...state }
}

export default boardReducer
