/////////// Travel patterns /////////////

import { checkForMate } from '../../middleware/playValidityMiddleware'

let default_resctrict_line = [{direction: "t", spread: 7},
  {direction: "b", spread: 7},
  {direction: "r", spread: 7},
  {direction: "l", spread: 7}
]

function linePattern(player, board, x, y, restrict = default_resctrict_line){
  let playList = []
  for (let j in restrict){
    let r = restrict[j]
    switch(r.direction){
      case "t":
      for (let i = 1; i<=r.spread; i++){
        console.log("Applying diagpattern to --> ", x-i, " | ", y+i)
        let cond = iterPattern(player, board, x-i, y, playList)
        if (cond === "BREAK")
          break
      }
      break
      case "b":
      for (let i = 1; i<=r.spread; i++){
        let cond = iterPattern(player, board, x+i, y, playList)
        if (cond === "BREAK")
          break
      }
      break
      case "l":
      for (let i = 1; i<=r.spread; i++){
        let cond = iterPattern(player, board, x, y-i, playList)
        if (cond === "BREAK")
          break
      }
      break
      case "r":
      for (let i = 1; i<=r.spread; i++){
        let cond = iterPattern(player, board, x, y+i, playList)
        if (cond === "BREAK")
          break
      }
      break
      default:
    }
  }
  return playList
}

// ajoute le play à la playList et retourne le iterState
//* iterState --> indique à la boucle si elle doit break
function iterPattern(player, board, x, y, playList){
  let _type = get_playType(player, board, x, y)
  if (_type !== "INVALID")
    playList.push({i:x,j:y,type: _type})
  else
    return "BREAK"
  if (_type === "PRISE")
    return "BREAK"
}

let default_resctrict_diag = [{direction: "tr", spread: 7},
  {direction: "tl", spread: 7},
  {direction: "br", spread: 7},
  {direction: "bl", spread: 7}
]

function diagPattern(player,board, x, y, restrict = default_resctrict_diag){
  let playList = []
  for (let j in restrict){
    let r = restrict[j]
    switch(r.direction){
      case "tr":
      for (let i = 1; i<=r.spread; i++){
        console.log("Applying diagpattern to --> ", x-i, " | ", y+i)
        let cond = iterPattern(player, board, x-i, y+i, playList)
        if (cond === "BREAK")
          break
      }
      break
      case "tl":
      for (let i = 1; i<=r.spread; i++){
        let cond = iterPattern(player, board, x-i, y-i, playList)
        if (cond === "BREAK")
          break
      }
      break
      case "br":
      for (let i = 1; i<=r.spread; i++){
        let cond = iterPattern(player, board, x+i, y+i, playList)
        if (cond === "BREAK")
          break
      }
      break
      case "bl":
      for (let i = 1; i<=r.spread; i++){
        let cond = iterPattern(player, board, x+i, y-i, playList)
        if (cond === "BREAK")
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
  let restrict_line = [{direction: "t", spread: 1},
    {direction: "b", spread: 1},
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

function pawnTake(player, board, x, y){
  let playList = []
  switch(player){
  case "white":
    if (x-1 >= 0){
      if (y-1 > 0){
        if (board[x-1][y-1].army === "black")
            playList.push({i:x-1,j:y-1,type: "PRISE"})
      }
      if (y+1 > 0){
        if (board[x-1][y+1].army === "black")
            playList.push({i:x-1,j:y+1,type: "PRISE"})
      }
    }
    return playList
  case "black":
    if (x+1 < 8){
      if (y-1 > 0){
        if (board[x+1][y-1].army === "black")
            playList.push({i:x-1,j:y-1,type: "PRISE"})
      }
      if (y+1 > 0){
        if (board[x+1][y+1].army === "black")
            playList.push({i:x-1,j:y+1,type: "PRISE"})
      }
    }
    return playList
  default:
  }
}

function pawnFilter(playList){
let filtered = []
for (let i in playList){
  if (playList[i].type !== "PRISE")
    filtered.push(playList[i])
  }
  return filtered
}
function pawnPattern(player, board, x, y){
  let playList = []
  let top1 = [{direction: "t", spread: 1}]
  let top2 = [{direction: "t", spread: 2}]
  let bot1 = [{direction: "b", spread: 1}]
  let bot2 = [{direction: "b", spread: 2}]
  switch (player){
    case "white":
      if (x === 6)
        playList = playList.concat(linePattern(player, board, x, y, top2))
      else
        playList = playList.concat(linePattern(player, board, x, y, top1))

    break
    case "black":
    if (x === 1)
      playList = playList.concat(linePattern(player, board, x, y, bot2))
    else
      playList = playList.concat(linePattern(player, board, x, y, bot1))
    break
    default:
  }
  return pawnFilter(filterPlayList(playList)).concat(pawnTake(player, board, x, y))
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
