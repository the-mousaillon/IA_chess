package chess
package game
import board._
import pieces._
import position._

case class Game(gamePng: String) {
    def initialiseBoard : Board = {
        val initialPawn = (faction: Faction, c: Coord) => Pawn(faction, c, false, false)
        val initialRook = (faction: Faction, c: Coord) => Rook(faction, c, false)
        val initialKing = (faction: Faction) => faction match {
            case White => King(faction, Coord(0, 4), false, false)
            case _ => King(faction, Coord(7, 4), false, false)
        }

        val pawnRow = (faction: Faction) => faction match {
            case White => (0 to 7).foldLeft(Map[Coord, Piece]())((acc, y) => acc + (Coord(1, y) -> initialPawn(White, Coord(1, y))))
            case _ => (0 to 7).foldLeft(Map[Coord, Piece]())((acc, y) => acc + (Coord(6, y) -> initialPawn(Black, Coord(6, y))))
        }

        val whiteBigPieces = Map(
            Coord(0, 0) -> initialRook(White, Coord(0, 0)),
            Coord(0, 1) ->  Knight(White, Coord(0,1)),
            Coord(0, 2) -> Bishop(White, Coord(0,2)),
            Coord(0, 3) -> Queen(White, Coord(0,3)),
            Coord(0, 4) -> initialKing(White),
            Coord(0, 5) -> Bishop(White, Coord(0,5)),
            Coord(0, 6) -> Knight(White, Coord(0,6)),
            Coord(0, 7) -> initialRook(White, Coord(0, 7))
        )

        val blackBigPieces = Map(
            Coord(7, 0) -> initialRook(Black, Coord(7, 0)),
            Coord(7, 1) ->  Knight(Black, Coord(7,1)),
            Coord(7, 2) -> Bishop(Black, Coord(7,2)),
            Coord(7, 3) -> Queen(Black, Coord(7,3)),
            Coord(7, 4) -> initialKing(Black),
            Coord(7, 5) -> Bishop(Black, Coord(7,5)),
            Coord(7, 6) -> Knight(Black, Coord(7,6)),
            Coord(7, 7) -> initialRook(Black, Coord(7, 7))
        )

        Board(whiteBigPieces ++ pawnRow(White) ++ pawnRow(Black) ++ blackBigPieces)
    }
}

