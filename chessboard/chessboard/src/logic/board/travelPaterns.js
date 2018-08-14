/////////// Travel patterns /////////////

let default_resctrict_line = [{direction: "t", spread: 8},
  {direction: "b", spread: 8},
  {direction: "r", spread: 8},
  {direction: "l", spread: 8}
]

function linePattern(player, board, x, y, restrict = default_resctrict_line){
  let playList = []
  for (let j in restrict){
    let r = restrict[j]
    switch(r.direction){
      case "t":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x,j:y+i,
            type: get_playType(player, board, x, y+i)})
      break
      case "b":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x,j:y-i,
            type: get_playType(player, board, x, y-i)})
      break
      case "l":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x-i,j:y,
            type: get_playType(player, board, x-i, y)})
      break
      case "r":
        for (let i = 0; i<r.spread; i++)
          playList.push({i:x+i,j:y,
            type: get_playType(player, board, x+i, y)})
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

function diagPattern(player,board, x, y, restrict = default_resctrict_diag){
  let playList = []
  for (let j in restrict){
    let r = restrict[j]
    switch(r.direction){
      case "tr":
      for (let i = 0; i<r.spread; i++){
        let _type = get_playType(player, board, x+i, y+i)
        if (_type.type !== "INVALID")
          playList.push({i:x+i,j:y+i,type: _type})
        else
          break
        if (_type.type === "PRISE")
          break
        }
      break
      case "tl":
      for (let i = 0; i<r.spread; i++){
        let _type = get_playType(player, board, x+i, y+i)
        if (_type.type !== "INVALID")
          playList.push({i:x+i,j:y+i,type: _type})
        else
          break
        if (_type.type === "PRISE")
          break
        }
      break
      case "br":
      for (let i = 0; i<r.spread; i++){
        let _type = get_playType(player, board, x+i, y+i)
        if (_type.type !== "INVALID")
          playList.push({i:x+i,j:y+i,type: _type})
        else
          break
        if (_type.type === "PRISE")
          break
        }
      break
      case "bl":
      for (let i = 0; i<r.spread; i++){
        let _type = get_playType(player, board, x+i, y+i)
        if (_type.type !== "INVALID")
          playList.push({i:x+i,j:y+i,type: _type})
        else
          break
        if (_type.type === "PRISE")
          break
        }
      break
      default:

    }
  }
  return playList
}

//// Pieces travel patterns

/* return only for MOVE, PRISE and INVALID */
function get_playType(player, board, x, y){
  let opponent
  if (x < 0 || x > 7 || y < 0 || y > 7)
    return "INVALID"
  switch(player){
    case "white":
      opponent = "black"
      break
    case "black":
      opponent = "white"
      break
    default:
  }
  if (board[x][y].army === opponent)
    return "PRISE"
  else if (board[x][y].army === "empty")
    return "MOVE"
  else
    return "INVALID"
}

function filterPlayList(playList){
  let filtedredPlaylist = []
  for (let i in playList){
    if (playList[i].type !== "INVALID")
      filtedredPlaylist.push(playList[i])
    }
    return filtedredPlaylist
}

function knightPattern(player, board, x, y){
  let playList = []
  playList.push({i:x+2, j:y+1, type: get_playType(player,board,x+2,y+1)})
  playList.push({i:x+2, j:y-1, type: get_playType(player,board,x+2,y-1)})
  playList.push({i:x-2, j:y+1, type: get_playType(player,board,x-2,y+1)})
  playList.push({i:x-2, j:y-1, type: get_playType(player,board,x-2,y-1)})
  playList.push({i:x+1, j:y+2, type: get_playType(player,board,x+1,y+2)})
  playList.push({i:x-1, j:y+2, type: get_playType(player,board,x-1,y+2)})
  playList.push({i:x+1, j:y-2, type: get_playType(player,board,x+1,y-2)})
  playList.push({i:x-1, j:y-2, type: get_playType(player,board,x-1,y-2)})
  return filterPlayList(playList)
}

function kingPattern(player, board, x, y){
  let playList
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
  playList = diagPattern(player, board, x, y, restrict_diag).concat(
    linePattern(player,board, x, y, restrict_line))
// ajout du roque (king and queen side)
  if ((x === 0 && y === 4) || (x === 7 && y === 4)){
    playList.push({i:x, j:6, type: "ROQUE_KING"})
    playList.push({i:x, j:1, type: "ROQUE_QUEEN"})
  }
  return filterPlayList(playList)
}

function bishopPattern(player, board, x, y){
  let playList
  playList = diagPattern(player, board, x, y)
  return filterPlayList(playList)
}

function rookPattern(player, board, x, y){
  let playList
  playList = linePattern(player, board, x, y)
  return filterPlayList(playList)
}

function queenPattern(player, board, x, y){
  let playList
  playList = linePattern(player, board, x, y).concat(
    diagPattern(player, board, x, y))
  return filterPlayList(playList)
}

/* pawn is way different than the other piece
that's why we can't use the same approach as the others*/


function pawnPattern(player, board, x, y){
  let playList = []
  switch (player){
    case "white":
      if (board[x-1][y].army === "empty")
        playList.push({i:x+1, j:y, type: "MOVE"})
      if (x === 6 && board[x-2][y].army === "empty"){
        playList.push({i:x+2, j:y, type: "MOVE"})
      }
      if (board[x-1][y-1].army === "black")
        playList.push({i:x-1, j:y-1, type: "PRISE"})
      if (board[x-1][y+1].army === "black")
        playList.push({i:x-1, j:y+1, type: "PRISE"})
      if (x === 4 && board[x][y-1].army === "black")
        playList.push({i:x-1, j:y-1, type: "PRISE_AU_PASSANT"})
      if (x === 4 && board[x][y+1].army === "black")
        playList.push({i:x-1, j:y+1, type: "PRISE_AU_PASSANT"})
    break
    case "black":
      if (board[x+1][y].army === "empty")
        playList.push({i:x+1, j:y, type: "MOVE"})
      if (x === 1 && board[x+2][y].army === "empty"){
        playList.push({i:x+2, j:y, type: "MOVE"})
      }
      if (board[x+1][y-1].army === "white")
        playList.push({i:x+1, j:y-1, type: "PRISE"})
      if (board[x+1][y+1].army === "white")
        playList.push({i:x+1, j:y+1, type: "PRISE"})
      if (x === 4 && board[x][y-1].army === "white")
        playList.push({i:x+1, j:y-1, type: "PRISE_AU_PASSANT"})
      if (x === 4 && board[x][y+1].army === "white")
        playList.push({i:x+1, j:y+1, type: "PRISE_AU_PASSANT"})
    break
    default:
  }
  return playList
}

/// HANDLER

export function generate_plays(player, board, x, y){
  switch (board[x][y].piece){
    case "whitek" : case "blackk":
      return kingPattern(player, board, x, y)
    case "whiter" : case "blackr":
      return rookPattern(player, board, x, y)
    case ("blackkn") : case "whitekn":
      return knightPattern(player, board, x, y)
    case "blackb" : case "whiteb":
      return bishopPattern(player, board, x, y)
    case "blackq" : case "whiteq":
      return queenPattern(player, board, x, y)
    case "blackp" : case "whitep":
      return pawnPattern(player, board, x, y)
    default:
  }
}
