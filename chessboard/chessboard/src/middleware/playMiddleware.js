import { setCurrentSelected } from '../actions/gameActions'
import {generate_plays} from '../logic/board/travelPaterns'

export function playMiddleware(x,y){
  return function(dispatch, getState){
    let _store = getState()
    console.log(_store)
    let board = _store.board.board
    let player = _store.game.currentPlayer
    let playList = generate_plays(player, board, x, y)
    console.log(playList)
    if (board[x][y].army === player)
      dispatch(setCurrentSelected(x,y))
  }
}
