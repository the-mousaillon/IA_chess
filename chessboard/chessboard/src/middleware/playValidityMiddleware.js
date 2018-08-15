import { movePiece, roqueKing, roqueQueen } from '../reducers/boardReducer'
import store from '../store'

function dist(king, i, j){
  if (king.x !== i && king.y !== j)
    return Math.round(Math.sqrt(Math.pow(king.x-i, 2) + Math.pow(king.y-j, 2))/Math.sqrt(2))
  else if (king.x === i)
    return Math.abs(j-king.y)
  else
    return Math.abs(i-king.x)
}

function emulatePlay(player, board, current, play){
  switch(play.type){
    case "MOVE": case "PRISE":
      let pos2 = {i: play.i, j: play.j}
      let pos1 = {i: current.x, j: current.y}
      return movePiece(board, pos1, pos2)
    case "ROQUE_KING":
      return roqueKing(player, board)
    case "ROQUE_QUEEN":
      return roqueQueen(player, board)
    default:
  }
}

function get_opponent(player){
  if (player === "white")
    return "black"
  else
    return "white"
}

// the pieces that can treaten the king, both in diagonal and line
// knight will have is own special pattern (cause he's so weird)

function diagPieces(player, cell, kingDist){
  let opponent = get_opponent(player)
  if (cell.piece === opponent + "b" || cell.piece === opponent + "q")
    return false
  else if ((cell.piece === opponent + "p" || cell.piece === opponent + "k") && kingDist === 1)
    return false
  else
    return true
}

function linePieces(player, cell, kingDist){
  let opponent = get_opponent(player)
  if (cell.piece === opponent + "r" || cell.piece === opponent + "q")
    return false
  else if ((cell.piece === opponent + "k") && kingDist === 1)
    return false
  else
    return true
}


// omg sa passe crême avec la récursion, bien mieux que itérativement
function diagonalCheck(player, board, king){
  function sub(player, board, i, j, di, dj, king){
    if (i < 0 || i > 7 || j < 0 || j > 7)
      return true
    else if (board[i][j].army === player)
      return true
    else if (board[i][j].army !== player && board[i][j].army !== "empty")
      return diagPieces(player, board[i][j], dist(king, i, j))
    else
      return sub(player, board, i+di, j+dj, di, dj, king)
  }
  return (sub(player, board, king.x, king.y, 1, 1, king) &&
  sub(player, board, king.x+1, king.y-1, 1, -1, king) &&
  sub(player, board, king.x-1, king.y+1, -1, 1, king) &&
  sub(player, board, king.x-1, king.y-1, -1, -1, king))
}


function lineCheck(player, board, king){
  function sub(player, board, i, j, di, dj, king){
    if (i < 0 || i > 7 || j < 0 || j > 7)
      return true
    else if (board[i][j].army === player)
      return true
    else if (board[i][j].army !== player && board[i][j].army !== "empty")
      return linePieces(player, board[i][j], dist(king, i, j))
    else
      return sub(player, board, i+di, j+dj, di, dj, king)
  }
  return (sub(player, board, king.x, king.y+1, 0, 1, king) &&
  sub(player, board, king.x, king.y-1, 0, -1, king) &&
  sub(player, board, king.x-1, king.y, -1, 0, king) &&
  sub(player, board, king.x+1, king.y, +1, 0, king))
}

function locateKing(player, board){
    for (let i=0; i<8; i++){
      for (let j=0; j<8; j++){
        if (board[i][j].piece === player + "k")
          return {x:i, y:j}
      }
    }
}

export function checkForMate(player, board, play){
  let current = store.getState().game.currentSelectedCell
  let emulatedBoard = emulatePlay(player, board, current, play)
  let king = locateKing(player, emulatedBoard)
  console.log("da king --> ", king)
  let check_diag = diagonalCheck(player, emulatedBoard, king)
  let check_line = lineCheck(player, emulatedBoard, king)
  console.log("line --> ",check_line, " diag --> ", check_diag)
  return check_diag && check_line
}

export function canRoque(player, board, play){

}
