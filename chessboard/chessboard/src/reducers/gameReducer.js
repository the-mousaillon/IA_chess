const initialState = {
  gamestate: "START",
  turn: 1,
  availablePlays: [],
  currentPlayer: "white",
  currentSelectedCell: {},
  playerProps: {
    white:{
      isChecked: false,
      canRoque: {king :true, queen: true},
      verticalInfo: {position: "bot", multiplier: -1},
      enPassant: null,
      upgrade: null
    },
    black:{
      isChecked: false,
      canRoque: {king :true, queen: true},
      verticalInfo: {position: "top", multiplier: 1},
      enPassant: null,
      upgrade: null
    }
  }
}

function setEnPassant(state, action){
  let newprops = {...state.playerProps }
  newprops[action.payload.player].enPassant = action.payload.j
  return newprops
}


function setUpgrade(state, action){
  let newprops = {...state.playerProps }
  newprops[action.payload.player].upgrade = action.payload.pos
  return newprops
}


const gameReducer = (state=initialState, action) => {
  switch(action.type){
    case "SET_AVAILABLE_PLAYS":
      let plays = action.payload.playList
      return {...state, availablePlays: plays}

    case "SET_SELECTED":
      return {...state, currentSelectedCell: action.payload.coord}

    case "SET_EN_PASSANT":
      return {...state, playerProps: setEnPassant(state, action)}

    case "SET_UPGRADE":
      return {...state, playerProps: setUpgrade(state, action)}

    case "NEXT_TURN":
      let opponent
      if (state.currentPlayer === "white")
        opponent = "black"
      else
        opponent = "white"
      let newprops = {...state.playerProps }
      newprops[opponent].enPassant = null
      return {...state, currentPlayer: opponent, turn: state.turn+1, playerProps: newprops}
    default:
      return { ...state }
  }
}

export default gameReducer
