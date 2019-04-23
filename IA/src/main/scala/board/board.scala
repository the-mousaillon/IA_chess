package chess
package board

import scala.annotation.tailrec 
import pieces.{Piece, Faction, King}
import position.{Coord}
import play.{Play, AppliedPlay}

trait Case

case object EmptyCase extends Case

case class FullCase(piece: Piece) extends Case

case class Board(board: PieceMap) {
    val isKing = (faction: Faction) => (p: Piece) => p match {case King(`faction`, _, _, _) => true case _ => false}
    val addPlay = (faction: Faction) => (p: Piece) => if (p.faction == faction) p getMoves this else Nil

    def getPiece(pos: Coord) : Option[Piece] = board get pos
    def getKing(faction: Faction) : King = board.values.find(isKing(faction)) match {case Some(k: King) => k case _ => throw new Exception("No king found")}
    
    def getAllFactionPlays(faction: Faction) : List[Play] = board.values.foldLeft(List[Play]())((acc, x) => acc ::: addPlay(faction)(x))
    def checkMated(faction : Faction) : Boolean = getKing(faction) checkMated this

    def getAllAppliedPlays(faction: Faction) : List[AppliedPlay] = {
        getAllFactionPlays(faction) map (x => x applyPlay (this)) filter (x => !(x.board checkMated faction))  
    }

    def prettyPrint : String = {
        var s = ""
        for (i <- (0 to 7).reverse){
            for (j <- 0 to 7){
                board.get(Coord(i, j)) match {
                    case Some(p : Piece) => {s = s + p.prettyPrint + " | "}
                    case None => {s = s + "  | "}
                }
            }
            s = s + '\n'
        }
        s
    }

}