const initialState = {
  gamestate: "START",
  availablePlays: [],
  currentPlayer: "white",
  currentSelectedCell: {},
  playerProps: {
    white:{
      availablePlays: []
    },
    black:{
      availablePlays: []
    }
  }
}

const gameReducer = (state=initialState, action) => {
  switch(action.type){
    case "SET_AVAILABLE_PLAYS":
      let plays = action.payload.playList
      return {...state, availablePlays: plays}
    case "SET_SELECTED":
      return {...state, currentSelectedCell: action.payload.coord}
    case "NEXT_TURN":
      let opponent
      if (state.currentPlayer === "white")
        opponent = "black"
      else
        opponent = "white"
      return {...state, currentPlayer: opponent}
    default:
      return { ...state }
  }
}

export default gameReducer
