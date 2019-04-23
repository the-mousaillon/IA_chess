import org.scalatest.FunSuite
import chess.test._
import chess.pieces.{White, Black}
import chess.png._

class EmptyBoardTest extends FunSuite {
    test("Créer un plateau vide") {
        val b = chess.initialBoard
        print(b.toString)
    }
}

class GetMovesTest extends FunSuite {
    test("Get the moves of the initial board") {
        val b = TestFunctions.initialiseBoard
        println(b.getAllAppliedPlays(White))
        println(b.getAllAppliedPlays(Black))
    }
}

class ConverMoves extends FunSuite {
    test("test png converter") {
        val png = Png("Pc2-c4,Pg7-g5,Qd1-a4,Ph7-h5,Pc4-c5,Pb7-b5,Pc5xb6 e.p,Pb6=Qa8,Pa8=Qa8,0-0")
        println(png.board.prettyPrint)
    }
}