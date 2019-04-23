package chess
package play

import pieces._
import position.{Coord}
import board._

trait Play{
    def applyPlay(board: Board) : AppliedPlay = ???
}

case class Move(from: Piece, to: Coord) extends Play {
    override def applyPlay(board: Board) : AppliedPlay = {
        val newBoard = Board(board.board - from.coord + (to -> from.updateCoord(to)))
        AppliedPlay(this, newBoard)
    }
    override def toString = from.toString + '-' + to.toPng
}

case class Prise(from: Piece, to: Coord) extends Play {
    override def applyPlay(board: Board) : AppliedPlay = {
        val newBoard = Board(board.board - from.coord + (to -> from.updateCoord(to)))
        AppliedPlay(this, newBoard)
    }
    override def toString = from.toString + 'x' + to.toPng
}

case class PriseEnPassant(from: Piece, to: Coord) extends Play {
    val takenPawn = Coord(from.coord.x, from.coord.y + to.x - from.coord.x)
    override def applyPlay(board: Board) : AppliedPlay = {
        val newBoard = Board(board.board - from.coord 
                                         + (to -> from.updateCoord(to))
                                         - takenPawn)
        AppliedPlay(this, newBoard)
    }
    override def toString = from.toString + 'x' + to.toPng  + "e.p"
}

case class RoqueKing(side: Faction, king: Piece, rook: Piece) extends Play {
    def roqueWhite(board: Board) : Board = Board(
        board.board - king.coord - rook.coord + 
        (Coord(0, 6) -> king.updateCoord(Coord(0, 6))) + 
        (Coord(0, 6) -> rook.updateCoord(Coord(0, 5)))
    )

    def roqueBlack(board: Board) : Board = Board(
        board.board - king.coord - rook.coord + 
        (Coord(7, 6) -> king.updateCoord(Coord(7, 6))) + 
        (Coord(7, 5) -> rook.updateCoord(Coord(7, 5)))
    )

    override def applyPlay(board: Board) : AppliedPlay =  side match {
        case White => AppliedPlay(this, roqueWhite(board))
        case _ => AppliedPlay(this, roqueBlack(board))
    }

    override def toString = "0-0"
}

case class RoqueQueen(side: Faction, king: Piece, rook: Piece) extends Play {
    def roqueWhite(board: Board) : Board = Board(
        board.board - king.coord - rook.coord + 
        (Coord(0, 2) -> king.updateCoord(Coord(0, 2))) + 
        (Coord(0, 3) -> rook.updateCoord(Coord(0, 3)))
    )

    def roqueBlack(board: Board) : Board = Board(
        board.board - king.coord - rook.coord + 
        (Coord(7, 2) -> king.updateCoord(Coord(7, 2))) + 
        (Coord(7, 3) -> rook.updateCoord(Coord(7, 3)))
    )

    override def applyPlay(board: Board) : AppliedPlay =  side match {
        case White => AppliedPlay(this, roqueWhite(board))
        case _ => AppliedPlay(this, roqueBlack(board))
    }

    override def toString = "0-0-0"
}

case class UpgradePawn(faction: Faction, from: Piece, to: Coord, upgrade: Piece) extends Play {
    override def applyPlay(board: Board) : AppliedPlay = {
        AppliedPlay(this, Board(board.board - from.coord + (to -> upgrade)))
    }
    override def toString = to.toPng + '=' + upgrade.toString

}

/// appliedmoves for evaluation

case class AppliedPlay(play: Play, board: Board){
    override def toString = play.toString
}
