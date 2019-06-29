package chess
package play

import pieces._
import position.{Coord}
import board._

trait Play{
    val player: Faction
    def applyPlay(board: Board) : Option[AppliedPlay] = ???
}

case class NoPlay(player: Faction) extends Play

trait PlayCore {
    val from: Piece
    def updateKingStatus(board: Board) : Board = {
        val king = board.getKing(!from.faction)
        (king.hasbeenChecked, king.checkMated(board)) match {
            case (true, true) => Board(board.board - king.coord + (king.coord -> king.updateCheckStatus))
            case _ => board
        }
    }
}

case class Move(player: Faction, from: Piece, to: Coord) extends Play  with PlayCore {
    override def applyPlay(board: Board) : Option[AppliedPlay]= {
        val newBoard = Board(board.board - from.coord + (to -> from.updateCoord(to)))
        Some(AppliedPlay(this, updateKingStatus(newBoard)))
    }
    override def toString = from.toString + '-' + to.toPng
}

case class Prise(player: Faction, from: Piece, to: Coord) extends Play with PlayCore {
    override def applyPlay(board: Board) : Option[AppliedPlay] = {
        board.getPiece(to) match {
            case Some(k: King) => None
            case _ => {
               val newBoard = Board(board.board - from.coord + (to -> from.updateCoord(to)))
                Some(AppliedPlay(this, updateKingStatus(newBoard)))
            }
        }
    }
    override def toString = from.toString + 'x' + to.toPng
}

case class PriseEnPassant(player: Faction, from: Piece, to: Coord) extends Play with PlayCore {
    val takenPawn = Coord(from.coord.x, from.coord.y + to.x - from.coord.x)
    override def applyPlay(board: Board) : Option[AppliedPlay] = {
        val newBoard = Board(board.board - from.coord 
                                         + (to -> from.updateCoord(to))
                                         - takenPawn)
        Some(AppliedPlay(this, updateKingStatus(newBoard)))
    }
    override def toString = from.toString + 'x' + to.toPng  + " e.p"
}

case class RoqueKing(player: Faction, from: Piece, rook: Piece) extends Play with PlayCore {
    def roqueWhite(board: Board) : Board = Board(
        board.board - from.coord - rook.coord + 
        (Coord(0, 6) -> from.updateCoord(Coord(0, 6))) + 
        (Coord(0, 5) -> rook.updateCoord(Coord(0, 5)))
    )

    def roqueBlack(board: Board) : Board = Board(
        board.board - from.coord - rook.coord + 
        (Coord(7, 6) -> from.updateCoord(Coord(7, 6))) + 
        (Coord(7, 5) -> rook.updateCoord(Coord(7, 5)))
    )

    override def applyPlay(board: Board) : Option[AppliedPlay] =  player match {
        case White => Some(AppliedPlay(this, updateKingStatus(roqueWhite(board))))
        case _ => Some(AppliedPlay(this, updateKingStatus(roqueBlack(board))))
    }

    override def toString = "0-0"
}

case class RoqueQueen(player: Faction, from: Piece, rook: Piece) extends Play with PlayCore {
    def roqueWhite(board: Board) : Board = Board(
        board.board - from.coord - rook.coord + 
        (Coord(0, 2) -> from.updateCoord(Coord(0, 2))) + 
        (Coord(0, 3) -> rook.updateCoord(Coord(0, 3)))
    )

    def roqueBlack(board: Board) : Board = Board(
        board.board - from.coord - rook.coord + 
        (Coord(7, 2) -> from.updateCoord(Coord(7, 2))) + 
        (Coord(7, 3) -> rook.updateCoord(Coord(7, 3)))
    )

    override def applyPlay(board: Board) : Option[AppliedPlay] =  player match {
        case White => Some(AppliedPlay(this, updateKingStatus(roqueWhite(board))))
        case _ => Some(AppliedPlay(this, updateKingStatus(roqueBlack(board))))
    }

    override def toString = "0-0-0"
}

case class UpgradePawn(player: Faction, from: Piece, to: Coord, upgrade: Piece) extends Play with PlayCore {
    override def applyPlay(board: Board) : Option[AppliedPlay] = {
        board.getPiece(to) match {
            case Some(k: King) => None
            case _ => {
                val newBoard = Board(board.board - from.coord + (to -> upgrade))
                Some(AppliedPlay(this, updateKingStatus(newBoard)))
            }
        }

    }
    override def toString = to.toPng + '=' + upgrade.toString

}

/// appliedmoves for evaluation

case class AppliedPlay(play: Play, board: Board){
    lazy val opponentChecked = board.checkMated(!play.player) match {case true => "+" case _ => ""}
    override def toString = play.toString + opponentChecked
    def prettyPrint = {println(this.toString); println(board.prettyPrint)}
}
