import { setCurrentSelected, setAvailablePlays, nexTurn, setEnPassant, setUpgrade } from '../actions/gameActions'
import { applyPlayList, clearPlayList, movePiece, roqueKing, roqueQueen, priseEnPassant } from '../actions/boardActions'
import { generate_plays } from '../logic/board/travelPatterns'

function findPlay(x, y, playList){
  for (let i in playList){
    if (playList[i].i === x && playList[i].j === y)
      return i
  }
  return -1
}

function get_opponent(player){
  if (player === "white")
    return "black"
  else
    return "white"
}

function makePlay(player, current, play, dispatch){
  let pos2 = {i: play.i, j: play.j}
  let pos1 = {i: current.x, j: current.y}
  switch(play.type){
    case "MOVE": case "PRISE":
      dispatch(movePiece(pos1, pos2))
    break
    case "ROQUE_KING":
      dispatch(roqueKing(player))
    break
    case "ROQUE_QUEEN":
      dispatch(roqueQueen(player))
    break
    case "BIGSTART":
      dispatch(movePiece(pos1, pos2))
      dispatch(setEnPassant(player, pos2.j))
    break
    case "PRISE_EN_PASSANT":
      dispatch(priseEnPassant(pos1, pos2))
    break
    case "MOVE_PAWNUPGRADE": case "PRISE_PAWNUPGRADE":
      dispatch(movePiece(pos1, pos2))
      dispatch(setUpgrade(player, pos2))
    break
    default:
  }
}

export function playMiddleware(x, y){
  return function(dispatch, getState){
    console.log("play --> ", x, y)
    let _store = getState()
    let board = _store.board.board
    let player = _store.game.currentPlayer
    if (board[x][y].army === player){
      dispatch(setCurrentSelected(x,y))
      _store = getState()
    }
    let currentSelected = _store.game.currentSelectedCell
    console.log(currentSelected)
    if (currentSelected.x !== undefined){
      let currentCell = board[currentSelected.x][currentSelected.y]
      let playList = _store.game.availablePlays
      if (board[x][y].army === player){
        dispatch(setCurrentSelected(x,y))
        playList = generate_plays(player, board, x, y)
        console.log(playList)
        dispatch(clearPlayList())
        dispatch(setAvailablePlays(playList))
        dispatch(applyPlayList(playList))
      }
      else if ((board[x][y].army === "empty" || board[x][y].army === get_opponent(player))
      && currentCell.army === player){
        let index = findPlay(x, y, playList)
        if (index !== -1){
          if (getState().game.playerProps[player].upgrade === null)
            makePlay(player, currentSelected, playList[index], dispatch)
          if (getState().game.playerProps[player].upgrade === null)
            dispatch(nexTurn())
        }
        dispatch(clearPlayList())
      }
    }
  }
}
