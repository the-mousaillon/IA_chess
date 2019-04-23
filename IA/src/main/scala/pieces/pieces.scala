package chess
package pieces
import scala.annotation.tailrec
import position._
import play._
import board._
import scala.language.postfixOps

/// CHECKING FUNCTIONS

trait Piece{
    val faction: Faction
    val coord: Coord
    val travelPatterns = Travel(coord, faction)
    def updateCoord(c: Coord) : Piece = ???
    def getMoves(board: Board): List[Play] = ???
    def prettyPrint : String = ???
}

case class Knight(faction: Faction, coord: Coord) extends Piece {
    override def updateCoord(c: Coord) : Piece = Knight(faction, c)
    override def getMoves(board: Board) : List[Play] = (travelPatterns.knightDirs) map (travelPatterns.travelOnce(this, board)) flatten
    override def toString = "N" + coord.toPng
    override def prettyPrint: String = {faction match {case White => "♞" case _ => "♘"}}
}

case class Queen(faction: Faction, coord: Coord) extends Piece {
    override def updateCoord(c: Coord) : Piece = Queen(faction, c)
    override def getMoves(board: Board) : List[Play] = travelPatterns.diag(this, board) ::: travelPatterns.line(this, board)
    override def toString = "Q" + coord.toPng
    override def prettyPrint: String = {faction match {case White => "♛" case _ => "♕"}}
}

case class Bishop(faction: Faction, coord: Coord) extends Piece {
    override def updateCoord(c: Coord) : Piece = Bishop(faction, c)
    override def getMoves(board: Board) : List[Play] = travelPatterns.diag(this, board)
    override def toString = "B" + coord.toPng
    override def prettyPrint: String = {faction match {case White => "♝" case _ => "♗"}}
}

case class Rook(faction: Faction, coord: Coord, hasMoved: Boolean) extends Piece {
    override def updateCoord(c: Coord) : Piece = Rook(faction, c, true)
    override def getMoves(board: Board) : List[Play] = travelPatterns.line(this, board)
    override def toString = "R" + coord.toPng
    override def prettyPrint: String = {faction match {case White => "♜" case _ => "♖"}}
}

case class Pawn(faction: Faction, coord: Coord, hasMoved: Boolean, enPassant: Boolean) extends Piece {
    override def updateCoord(c: Coord) : Piece = travelPatterns.dist(c, coord) match{
        case 1 => Pawn(faction, c, true, false)
        case 2 => Pawn(faction, c, true, true)
    }
    val ennemyFaction = !faction
    val moveDirection = faction match {case White => travelPatterns.up case _ =>  travelPatterns.down}
    val moveDirection2 = (c: Coord) => moveDirection(moveDirection(c))
    val priseDirs = faction match {case White => List(travelPatterns.upLeft, travelPatterns.upRight)
                                   case _     => List(travelPatterns.downLeft, travelPatterns.downRight)}

    val canEnPassant = (faction, coord) match {
        case (White, Coord(4, _)) => true
        case (Black, Coord(3, _)) => true
        case _ => false
    }

    val firstMove = (board: Board) => hasMoved match {
        case false => deplacement(board)(moveDirection2)
        case _ => List[Option[Play]]()
    }

    def genUpgrades(direction: Direction) : List[Option[Play]] = List(
        Some(UpgradePawn(faction, this, direction(coord), Queen(faction, direction(coord)))),
        Some(UpgradePawn(faction, this, direction(coord), Knight(faction, direction(coord)))),
    )

    val upgradeOrMove = (direction : Direction) => if (direction(coord).x == 0 || direction(coord).x == 7) 
                                                            genUpgrades(direction)
                                                          else  
                                                            List(Some(Move(this, direction(coord))))
    
    def deplacement(board: Board)(direction: Direction) : List[Option[Play]] = (priseDirs.contains(direction), direction, board.getPiece(direction(coord))) match {
        case (_, `moveDirection` | `moveDirection2`, None) => upgradeOrMove(direction)
        case (true, _, Some(p: Piece)) if (p.faction != faction) => List(Some(Prise(this, direction(coord))))
        case _ => List[Option[Play]]()
    }

    def getEnPassant(board: Board) : List[Option[Play]] = {
        def sub(board: Board)(direction: Direction) : Option[Play] = (canEnPassant, board.getPiece(direction(coord))) match {
            case (true, Some(Pawn(`ennemyFaction`, _, _, true))) => Some(PriseEnPassant(this, moveDirection(direction(coord))))
            case _ => None
        }
        List(travelPatterns.right, travelPatterns.left).map(sub(board) _ )
    }


    override def getMoves(board: Board) : List[Play] = {
        ((moveDirection :: priseDirs).flatMap(deplacement(board) _) ::: firstMove(board) ::: getEnPassant(board)).flatten
    }
    override def toString = 'P' + coord.toPng
    override def prettyPrint: String = {faction match {case White => "♟" case _ => "♙"}}
}

case class King(faction: Faction, coord: Coord, hasbeenChecked: Boolean, hasMoved: Boolean) extends Piece {
    override def updateCoord(c: Coord) : Piece = King(faction, c, hasbeenChecked, true)
    def updateCheckStatus = King(faction, coord, true, hasMoved)

    val queenSideRoque = travelPatterns.right
    val kingSideRoque = travelPatterns.left

    def getRoquePlays(board: Board) : List[Play] = {
        @tailrec
        def sub(currentPos: Coord)(direction: Direction) : Option[Play] = (direction, board.getPiece(currentPos)) match {
            case (`kingSideRoque`, Some(Rook(`faction`, _, false))) => Some(RoqueKing(faction, this, board getPiece currentPos get))
            case (`queenSideRoque`, Some(Rook(`faction`, _, false))) => Some(RoqueQueen(faction, this, board getPiece currentPos get))
            case (_, None) => sub(direction(currentPos))(direction)
            case _ => None
        }
        
        if (!hasbeenChecked)
            List(queenSideRoque, kingSideRoque).map(dir => sub(dir(coord))(dir)).flatten
        else
            List()
    }

    override def getMoves(board: Board) : List[Play] = travelPatterns.allDirectionsOnce(this, board) ::: getRoquePlays(board)

    val checkMated = (board: Board) => travelPatterns.checkForMateKnights(this, board) || travelPatterns.allDirections.foldLeft(false)(
        (acc, dir) => acc || travelPatterns.checkForMateTravel(this, board)(dir)
    )
    override def toString = "K" + coord.toPng
    override def prettyPrint: String = {faction match {case White => "♚" case _ => "♔"}}
}