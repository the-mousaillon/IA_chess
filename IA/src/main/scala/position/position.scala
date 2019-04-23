package chess
package position

import scala.annotation.tailrec
import pieces._
import play._
import board._

case class Coord(x:Int, y:Int){
    def toPng = (y+97).toChar + (x+1).toString
    val outOfBounds = (x > 7) || (y > 7) || (x < 0) || (y < 0)
}

case class Travel(pos:Coord, faction:Faction){

    val down = (pos:Coord) => Coord(pos.x-1, pos.y)
    val up = (pos:Coord) => Coord(pos.x+1, pos.y)
    val left = (pos:Coord) => Coord(pos.x, pos.y-1)
    val right = (pos:Coord) => Coord(pos.x, pos.y+1)
    val upLeft = (pos:Coord) => Coord(pos.x+1, pos.y-1)
    val upRight = (pos:Coord) => Coord(pos.x+1, pos.y+1)
    val downLeft = (pos:Coord) => Coord(pos.x-1, pos.y-1)
    val downRight = (pos:Coord) => Coord(pos.x-1, pos.y+1)
    val allDirections = List(down, up, left, right, upLeft, upRight, downLeft, downRight)

    // knightDirections

    val knightDirs = List(
        (pos: Coord) => Coord(pos.x+1, pos.y-2),
        (pos: Coord) => Coord(pos.x+1, pos.y+2),
        (pos: Coord) => Coord(pos.x+2, pos.y-1),
        (pos: Coord) => Coord(pos.x+2, pos.y+1),
        (pos: Coord) => Coord(pos.x-1, pos.y-2),
        (pos: Coord) => Coord(pos.x-1, pos.y+2),
        (pos: Coord) => Coord(pos.x-2, pos.y-1),
        (pos: Coord) => Coord(pos.x-2, pos.y+1)
    )

    val dist = (pos1: Coord, pos2: Coord) => math.max(math.abs(pos1.x - pos2.x), math.abs(pos1.y - pos2.y))

    // validation d'un coup classique (prise ou move)

    def travel(piece: Piece, board: Board)(direction: Direction): List[Play] = {
        @tailrec
        def sub(currentPos: Coord, travelList: List[Play]) : List[Play] = (currentPos.outOfBounds, board.getPiece(currentPos)) match {
            case (false, None) => sub(direction(currentPos), Move(piece, currentPos) :: travelList)
            case (false, Some(p: Piece)) =>  p.faction match {
                case `faction` => travelList
                case _ => Prise(piece, currentPos) :: travelList
            }
            case _ => travelList
        }
        sub(direction(piece.coord), List())
    }
    
    def travelOnce(piece: Piece, board:Board)(direction: Direction): Option[Play] = (direction(piece.coord).outOfBounds, board.getPiece(direction(piece.coord))) match {
        case (false, None) => Some(Move(piece, direction(piece.coord)))
        case (false, Some(p: Piece)) =>  p.faction match {
            case `faction` => None
            case _ => Some(Prise(piece, direction(piece.coord)))
        }
        case _ => None
    }

    // Checking if the king is checkmated

    def checkForMateTravel(king: Piece, board:Board)(direction: (Coord => Coord)) : Boolean = {
        @tailrec
        def sub(currentPos: Coord) : Boolean = (currentPos.outOfBounds, board getPiece currentPos) match {
            case (false, None) => sub(direction(currentPos))
            case (false, Some(p: Piece)) =>  p.faction match {
                case `faction` => false
                case _ => threatenned(king, p, direction)
            }
            case _ => false
        }
        sub(direction(king.coord))
    }

    def threatenned(king: Piece, threat: Piece, direction : Direction) : Boolean = (direction, threat) match{
        case (lines @ (`up` | `down` | `right` | `left`), lineThreats @ (_:Queen | _:Rook))                  => true
        case (diags @ (`upRight` | `downRight` | `downLeft` | `upLeft`), diagThreats @ (_:Queen | _:Bishop)) => true
        case (_, p: Pawn) if ((dist(king.coord, p.coord) == 1) && p.priseDirs.contains(direction))           => true
        case (_, k: King) if (dist(king.coord, k.coord) == 1)                                                => true
        case _                                                                                               => false
    }

    val isAnOpponentKnight = (p: Option[Piece], opponentFaction: Faction) => p match {
        case Some(Knight(opponentFaction, _)) => true
        case _ => false
    }

    val checkForMateKnights = (king: Piece, board: Board) => knightDirs.foldLeft(false)(
        (acc, dir) => acc || isAnOpponentKnight (board getPiece dir(king.coord), !king.faction)
    )

    val diag = (piece: Piece, board:Board) => List(upLeft, upRight, downLeft, downRight).map(travel(piece, board)).flatten

    val line = (piece: Piece, board:Board) => List(left, right, down, up).map(travel(piece, board)).flatten

    val allDirectionsOnce = (piece: Piece, board:Board) => allDirections.map(travelOnce(piece, board)).flatten
}