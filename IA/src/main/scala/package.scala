
package object chess{
    type Direction = position.Coord => position.Coord
    type PieceMap = Map[position.Coord, pieces.Piece]

    def initialiseBoard : board.Board = {
        val initialPawn = (faction: pieces.Faction, c: position.Coord) => pieces.Pawn(faction, c, false, false)
        val initialRook = (faction: pieces.Faction, c: position.Coord) => pieces.Rook(faction, c, false)
        val initialKing = (faction: pieces.Faction) => faction match {
            case pieces.White => pieces.King(faction, position.Coord(0, 4), false, false)
            case _ => pieces.King(faction, position.Coord(7, 4), false, false)
        }

        val pawnRow = (faction: pieces.Faction) => faction match {
            case pieces.White => (0 to 7).foldLeft(Map[position.Coord, pieces.Piece]())((acc, y) => acc + (position.Coord(1, y) -> initialPawn(pieces.White, position.Coord(1, y))))
            case _ => (0 to 7).foldLeft(Map[position.Coord, pieces.Piece]())((acc, y) => acc + (position.Coord(6, y) -> initialPawn(pieces.Black, position.Coord(6, y))))
        }

        val whiteBigPieces = Map(
            position.Coord(0, 0) -> initialRook(pieces.White, position.Coord(0, 0)),
            position.Coord(0, 1) ->  pieces.Knight(pieces.White, position.Coord(0,1)),
            position.Coord(0, 2) -> pieces.Bishop(pieces.White, position.Coord(0,2)),
            position.Coord(0, 3) -> pieces.Queen(pieces.White, position.Coord(0,3)),
            position.Coord(0, 4) -> initialKing(pieces.White),
            position.Coord(0, 5) -> pieces.Bishop(pieces.White, position.Coord(0,5)),
            position.Coord(0, 6) -> pieces.Knight(pieces.White, position.Coord(0,6)),
            position.Coord(0, 7) -> initialRook(pieces.White, position.Coord(0, 7))
        )

        val blackBigPieces = Map(
            position.Coord(7, 0) -> initialRook(pieces.Black, position.Coord(7, 0)),
            position.Coord(7, 1) ->  pieces.Knight(pieces.Black, position.Coord(7,1)),
            position.Coord(7, 2) -> pieces.Bishop(pieces.Black, position.Coord(7,2)),
            position.Coord(7, 3) -> pieces.Queen(pieces.Black, position.Coord(7,3)),
            position.Coord(7, 4) -> initialKing(pieces.Black),
            position.Coord(7, 5) -> pieces.Bishop(pieces.Black, position.Coord(7,5)),
            position.Coord(7, 6) -> pieces.Knight(pieces.Black, position.Coord(7,6)),
            position.Coord(7, 7) -> initialRook(pieces.Black, position.Coord(7, 7))
        )

        board.Board(whiteBigPieces ++ pawnRow(pieces.White) ++ pawnRow(pieces.Black) ++ blackBigPieces)
    }
    val initialBoard = initialiseBoard
}



