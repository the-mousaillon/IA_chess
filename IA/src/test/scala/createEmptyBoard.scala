import org.scalatest.FunSuite
import chess.test._
import chess.pieces.{White, Black}

class EmptyBoardTest extends FunSuite {
    test("Créer un plateau vide") {
        val b = TestFunctions.initialiseBoard
        print(b.toString)
    }
}

class GetMovesTest extends FunSuite {
    test("Get the moves of the initial board") {
        val b = TestFunctions.initialiseBoard
        println(b.getAllFactionPlays(White).length)
        println(b.getAllFactionPlays(Black).length)
    }
}