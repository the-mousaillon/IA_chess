package chess
package play

import pieces._
import position.{Coord}
import board._

trait Play{
    val from: Piece
    def applyPlay(board: Board) : AppliedPlay = ???
    def updateKingStatus(board: Board) : Board = {
        val king = board.getKing(!from.faction)
        (king.hasbeenChecked, king.checkMated(board)) match {
            case (true, true) => Board(board.board - king.coord + (king.coord -> king.updateCheckStatus))
            case _ => board
        }
    }
}

case class Move(from: Piece, to: Coord) extends Play {
    override def applyPlay(board: Board) : AppliedPlay = {
        val newBoard = Board(board.board - from.coord + (to -> from.updateCoord(to)))
        AppliedPlay(this, updateKingStatus(newBoard))
    }
    override def toString = from.toString + '-' + to.toPng
}

case class Prise(from: Piece, to: Coord) extends Play {
    override def applyPlay(board: Board) : AppliedPlay = {
        val newBoard = Board(board.board - from.coord + (to -> from.updateCoord(to)))
        AppliedPlay(this, updateKingStatus(newBoard))
    }
    override def toString = from.toString + 'x' + to.toPng
}

case class PriseEnPassant(from: Piece, to: Coord) extends Play {
    val takenPawn = Coord(from.coord.x, from.coord.y + to.x - from.coord.x)
    override def applyPlay(board: Board) : AppliedPlay = {
        val newBoard = Board(board.board - from.coord 
                                         + (to -> from.updateCoord(to))
                                         - takenPawn)
        AppliedPlay(this, updateKingStatus(newBoard))
    }
    override def toString = from.toString + 'x' + to.toPng  + " e.p"
}

case class RoqueKing(side: Faction, from: Piece, rook: Piece) extends Play {
    def roqueWhite(board: Board) : Board = Board(
        board.board - from.coord - rook.coord + 
        (Coord(0, 6) -> from.updateCoord(Coord(0, 6))) + 
        (Coord(0, 6) -> rook.updateCoord(Coord(0, 5)))
    )

    def roqueBlack(board: Board) : Board = Board(
        board.board - from.coord - rook.coord + 
        (Coord(7, 6) -> from.updateCoord(Coord(7, 6))) + 
        (Coord(7, 5) -> rook.updateCoord(Coord(7, 5)))
    )

    override def applyPlay(board: Board) : AppliedPlay =  side match {
        case White => AppliedPlay(this, updateKingStatus(roqueWhite(board)))
        case _ => AppliedPlay(this, updateKingStatus(roqueBlack(board)))
    }

    override def toString = "0-0"
}

case class RoqueQueen(side: Faction, from: Piece, rook: Piece) extends Play {
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

    override def applyPlay(board: Board) : AppliedPlay =  side match {
        case White => AppliedPlay(this, updateKingStatus(roqueWhite(board)))
        case _ => AppliedPlay(this, updateKingStatus(roqueBlack(board)))
    }

    override def toString = "0-0-0"
}

case class UpgradePawn(faction: Faction, from: Piece, to: Coord, upgrade: Piece) extends Play {
    override def applyPlay(board: Board) : AppliedPlay = {
        val newBoard = Board(board.board - from.coord + (to -> upgrade))
        AppliedPlay(this, updateKingStatus(newBoard))
    }
    override def toString = to.toPng + '=' + upgrade.toString

}

/// appliedmoves for evaluation

case class AppliedPlay(play: Play, board: Board){
    lazy val opponentChecked = board.checkMated(!play.from.faction) match {case true => "+" case _ => ""}
    override def toString = play.toString + opponentChecked
}
