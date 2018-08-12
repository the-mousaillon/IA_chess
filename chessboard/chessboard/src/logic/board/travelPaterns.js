function availablePlays(player, board, x, y, travelFunc){
  let travelList = travelFunc(x,y)
  let opponentArmy
  switch (player){
    case "white":
      opponentArmy = "black"
      break
    case "black":
      opponentArmy = "white"
      break
    default:
  }
  for (let i in travelList){
    let coord = travelList[i]
    let cell = board[coord.i][coord.j]
    if (coord.i >= 0 && coord.i <= 7 && coord.j >= 0 && coord.j <= 7){
      if (cell.army === "empty")
      board[coord.i][coord.j].piece = "moveMarker"
    }
  }
}

/////////// Travel patterns /////////////

let default_resctrict_line = [{direction: "t", spread: 8},
  {direction: "b", spread: 8},
  {direction: "r", spread: 8},
  {direction: "l", spread: 8}
]

function linePattern(x, y, restrict = default_resctrict_line){
  let playList = []
  for (let j in restrict){
    let r = restrict[j]
    switch(r.direction){
      case "t":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x,j:y+i})
      break
      case "b":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x,j:y-i})
      break
      case "l":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x-i,j:y})
      break
      case "r":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x+i,j:y})
      break
      default:

    }
  }
  return playList
}

let default_resctrict_diag = [{direction: "tr", spread: 8},
  {direction: "tl", spread: 8},
  {direction: "br", spread: 8},
  {direction: "bl", spread: 8}
]

function diagPattern(x, y, restrict = default_resctrict_diag){
  let playList = []
  for (let j in restrict){
    let r = restrict[j]
    switch(r.direction){
      case "tr":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x+i,j:y+i})
      break
      case "tl":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x+i,j:y-i})
      break
      case "br":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x-i,j:y+i})
      break
      case "bl":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x-i,j:y-i})
      break
      default:

    }
  }
  return playList
}

//// Pieces travel patterns

function knightPattern(x, y){
  let playList = []
  playList.push({i:x+2, j:y+1})
  playList.push({i:x+2, j:y-1})
  playList.push({i:x-2, j:y+1})
  playList.push({i:x-2, j:y-1})
  playList.push({i:x+1, j:y+2})
  playList.push({i:x-1, j:y+2})
  playList.push({i:x+1, j:y-2})
  playList.push({i:x-1, j:y-2})
  return playList
}

function kingPattern(x, y){
  let playList = []
  let restrict_line = [{direction: "r", spread: 1},
    {direction: "l", spread: 1},
    {direction: "r", spread: 1},
    {direction: "l", spread: 1}
  ]
  let restrict_diag = [{direction: "tr", spread: 1},
    {direction: "tl", spread: 1},
    {direction: "br", spread: 1},
    {direction: "bl", spread: 1}
  ]
  playList = playList + diagPattern(x, y, restrict_diag) + linePattern(x, y, restrict_line)
// ajout du roque (king and queen side)
  if ((x === 0 && y === 4) || (x === 7 && y === 4)){
    playList.push({i:x, j:6})
    playList.push({i:x, j:1})
  }
  return playList
}

function bishopPattern(x, y){
  let playList = []
  playList = playList + diagPattern(x, y)
  return playList
}

function rookPattern(x, y){
  let playList = []
  playList = playList + linePattern(x, y)
  return playList
}

function queenPattern(x, y){
  let playList = []
  playList = playList + linePattern(x, y) + diagPattern(x,y)
  return playList
}

/* pawn is way different than the other piece
that's why we can't use the same approach as the others*/


function pawnPattern(player, board, x, y){
  let playList = []
  switch (player){
    case "white":
      playList.push({i:x+1, j:y, type: "MOVE"})
      if (x === 1){
        playList.push({i:x+2, j:y, type: "MOVE"})
      }
      if (x === 4 && board[x][y-1].army === "black")
        playList.push({i:x+1, j:y-1, type: "MOVE"})
      if (x === 4 && board[x][y+1].army === "black")
        playList.push({i:x+1, j:y+1, type: "PRISE_AU_PASSANT"})
    break
    case "black":
      playList.push({i:x-1, j:y})
      if (x === 1){
        playList.push({i:x-2, j:y})
      }
    break
    default:
  }
  playList.push()
  return playList
}
