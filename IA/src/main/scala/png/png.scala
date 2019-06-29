package chess
package png
import game.Game
import play._
import pieces._
import board._
import position.Coord

// Custom png : move1,move2,move3 ...
case class Png(png: String) {

    val allPlaysPng: Array[String] = png.split(',')
    val getFaction = (i: Int) => i % 2 match {case 0 => White case _ => Black}

    val toCoord = (pos: String) => Coord(pos.tail.toInt -1, pos.head.toByte - 97)
    val getPiece = (board: Board, move: String) => board.getPiece(toCoord(move.slice(1,3))).get

    val getKing = (board: Board) => board.getKing(getFaction(allPlaysPng.length))

    def toMove(board: Board, move: String, faction: Faction) : Play = {
        move.head match {
            case 'K' | 'Q' | 'N' | 'B' | 'R' | 'P' => (move.contains('-'), move.contains("e.p"), move.contains("=")) match {
                case (true, false, false) => Move(faction, getPiece(board, move), toCoord(move.split('-')(1)))
                case (false, true, false) => PriseEnPassant(faction, getPiece(board, move), toCoord(move.split('x')(1).slice(0, 2)))
                case (_, _, true) =>  (move.split('=')(1).head) match {
                    case 'Q' => UpgradePawn(faction, getPiece(board, move), toCoord(move.slice(5, 7)), Queen(faction, toCoord(move.slice(5, 7))))
                    case _ => UpgradePawn(faction, getPiece(board, move), toCoord(move.slice(5, 7)), Knight(faction, toCoord(move.slice(5, 7))))
                }
                case _ => Prise(faction, getPiece(board, move), toCoord(move.split('x')(1)))
            }
            case _ => (faction, move) match {
                case (White, "0-0") => RoqueKing(faction, getKing(board), board.board(Coord(0,7)))
                case (_, "0-0") => RoqueKing(faction, getKing(board), board.board(Coord(7,7)))
                case (White , "0-0-0") => RoqueQueen(faction, getKing(board), board.board(Coord(0,7)))
                case _ => RoqueQueen(faction, getKing(board), board.board(Coord(7,7)))
            }
        }
    }

    def toGame = allPlaysPng.foldLeft(chess.initialGame)(
        (acc, x) => acc.play(
            toMove(acc.history.head.board, x.stripSuffix("+"), getFaction(acc.history.length-1))
            .applyPlay(acc.history.head.board).get
            )
        )
}