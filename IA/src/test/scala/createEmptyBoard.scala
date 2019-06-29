import org.scalatest.FunSuite
import chess.test._
import chess.pieces.{White, Black}
import chess.png._
import chess.position.Coord
import chess.ia.minmax._
import chess.board.Board
import chess.play._
import chess.pieces._
import chess.game._
import chess.position._

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

class ConvertMoves extends FunSuite {
    test("test png converter") {
        val png = Png("Pc2-c4,Pg7-g5,Qd1-a4,Ph7-h5,Pc4-c5,Pb7-b5,Pc5xb6 e.p,Pb6=Qa8,Pa8=Qa8,0-0")
        val game = png.toGame
        game.history.foreach(x => println(x.prettyPrint))
    }
}

class TestAvalaivlePlays extends FunSuite {
    test("test move generation") {
        val png = Png("Pc2-c4,Pg7-g5,Pg5-g4,Qd1-a4,Ph7-h5,Pc4-c5,Pb7-b5,Pc5xb6 e.p,Pb6=Qa8,Pa8=Ka8,Ph1-h2,Qd8-d1,Qa4xd1,Ng8-e5,Pf2-f4")
        val game = png.toGame
        game.history.foreach(x => println(x.prettyPrint))
    }
}

class TestTree extends FunSuite {
    test("test move generation") {
        val pngString = "Pc2-c4,Pg7-g5,Pg5-g4,Qd1-a4,Ph7-h5,Pc4-c5,Pb7-b5,Pc5xb6 e.p,Pb6=Qa8,Pa8=Ka8,Ph1-h2,Qd8-d1,Qa4xd1,Ng8-e5,Pf2-f4"
        val png = Png("Pc2-c4,Pg7-g5,Pg5-g4,Qd1-a4,Ph7-h5,Pc4-c5,Pb7-b5,Pc5xb6 e.p,Pb6=Qa8,Pa8=Ka8,Ph1-h2,Qd8-d1,Qa4xd1,Ng8-e5,Pf2-f4") // B
        val game = png.toGame

    }
}

// class EmulateIa extends FunSuite {
//     test("Ia against itself") {
//         val png = Png("Pc2-c4") // W
//         val game = png.toGame
//         def play(g: Game) : Game = {
//             val ia = MinMax(g, EvaluationFunctions.naive)
//             val play = ia.iaPlay(5)
//             val newBoard = play.applyPlay(g.history.head).get
//             println(g.currentPlayer + " -> " + newBoard.toString); println(newBoard.board.prettyPrint)
//             Game(!g.currentPlayer, newBoard.board :: game.history)
//         }
//         var newgame = game
//         for (i <- 0 to 100){
//             newgame = play(newgame)
//         }
//     }
// }

// class IaVsRandom extends FunSuite {
//     test("Ia against random player") {
//         var newgame = Game(White, List(chess.initialBoard))
//         def play(g: Game, level:Int) : Game = {
//             val ia = MinMax(g, EvaluationFunctions.moderate)
//             val play = ia.iaPlay(level)
//             val newBoard = play.applyPlay(g.history.head).get
//             println(g.currentPlayer + " -> " + newBoard.toString); println(newBoard.board.prettyPrint)
//             Game(!g.currentPlayer, newBoard.board :: g.history)
//         }
    
//         def genRandomMove(game: Game) : AppliedPlay = {
//             val plays = game.history.head.getAllAppliedPlays(game.currentPlayer)
//             val r = scala.util.Random
//             plays(r.nextInt(plays.length))
//         }

//         for (i <- 0 to 40){
//             newgame = play(newgame, 3)
//             val randomMove = genRandomMove(newgame)
//             randomMove.prettyPrint
//             newgame = Game(!newgame.currentPlayer, randomMove.board :: newgame.history)
//         }
//     }
// }


class IaVsIa extends FunSuite {
    test("The IA plays against a weaker version of itself"){
        var game = chess.initialGame
        var ia = MinMax(game, EvaluationFunctions.moderate)
        for (i <- 0 to 20){
           // Thread.sleep(1000)
            println("score : " + EvaluationFunctions.moderate(game.history.head.board).toString)
            println(!game.currentPlayer + " -> " + game.history.head.toString); println(game.history.head.board.prettyPrint)
            ia = ia.next((i) % 2 * 5 + 0)
           // Thread.sleep(1000)
            game = ia.game
        }
        println(!game.currentPlayer + " -> " + game.history.head.toString); println(game.history.head.board.prettyPrint)    
    }
}