
// package chess
// package ia.minmax
// import play.AppliedPlay
// import chess.board.Board
// import pieces._
// import scala.annotation.tailrec
// import play.Play
// import game._

// case object EvaluationFunctions {
//     def naive(board: Board) ={
//         val evalPiece = (p: Piece) => p match {
//             case Queen(White, _) => 90
//             case Queen(_, _) => -90
//             case King(White, _, _, _) => 9000
//             case King(_, _, _, _) => -9000
//             case Rook(White, _, _) => 50
//             case Rook(_, _, _) => -50
//             case Pawn(White, _, _, _) => 10
//             case Pawn(_, _, _, _) => -10
//             case Bishop(White, _) | Knight(White, _)=> 30
//             case Bishop(_, _) | Knight(_, _)=> -30
//             case _ => 0
//         }
//         board.board.values.foldLeft(0)((acc, x) => acc + evalPiece(x))
//     }

//     def moderate(board: Board) ={
//         val pawnBlack = Vector(
//             Vector(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
//             Vector(5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0),
//             Vector(1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0),
//             Vector(0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5),
//             Vector(0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0),
//             Vector(0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5),
//             Vector(0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5),
//             Vector(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0))
        
//         val pawnWhite = pawnBlack.reverse

//         val knigth = Vector(
//             Vector(-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0),
//             Vector(-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0),
//             Vector(-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0),
//             Vector(-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0),
//             Vector(-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0),
//             Vector(-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0),
//             Vector(-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0),
//             Vector(-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0))

//         val bishopBlack = Vector(
//             Vector(-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0),
//             Vector(-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0),
//             Vector(-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0),
//             Vector(-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0),
//             Vector(-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0),
//             Vector(-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0),
//             Vector(-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0),
//             Vector(-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0))
        
//         val bishopWhite = bishopBlack.reverse

//         val rookBlack = Vector(
//             Vector(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
//             Vector(0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5),
//             Vector(-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5),
//             Vector(-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5),
//             Vector(-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5),
//             Vector(-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5),
//             Vector(-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5),
//             Vector(0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0))
        
//         val rookWhite = rookBlack.reverse

//         val queen = Vector(
//             Vector(-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0),
//             Vector(-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0),
//             Vector(-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0),
//             Vector(-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5),
//             Vector(0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5),
//             Vector(-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0),
//             Vector(-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0),
//             Vector(-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0))

//         val kingBlack = Vector(
//             Vector(-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0),
//             Vector(-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0),
//             Vector(-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0),
//             Vector(-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0),
//             Vector(-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0),
//             Vector(-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0),
//             Vector(2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0),
//             Vector(2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0))
        
//         val kingWhite = kingBlack.reverse

//         val evalPiece = (p: Piece) => p match {
//             case q @ Queen(White, _) => 90 + queen(q.coord.x)(q.coord.y)
//             case q @ Queen(_, _) => -90 - queen(q.coord.x)(q.coord.y)
//             case k @ King(White, _, _, _) => 900 + kingWhite(k.coord.x)(k.coord.y)
//             case k @ King(_, _, _, _) => -900 - kingBlack(k.coord.x)(k.coord.y)
//             case r @ Rook(White, _, _) => 50 + rookWhite(r.coord.x)(r.coord.y)
//             case r @ Rook(_, _, _) => -50 - rookBlack(r.coord.x)(r.coord.y)
//             case p @ Pawn(White, _, _, _) => 10 + pawnWhite(p.coord.x)(p.coord.y)
//             case p @ Pawn(_, _, _, _) => -10 - pawnBlack(p.coord.x)(p.coord.y)
//             case b @ Bishop(White, _) => 30 + bishopWhite(b.coord.x)(b.coord.y)
//             case b @ Bishop(_, _) => -30 - bishopBlack(b.coord.x)(b.coord.y)
//             case kn @ Knight(White, _)=> 30 + knigth(kn.coord.x)(kn.coord.y)
//             case kn @ Knight(_, _)=> -30 - knigth(kn.coord.x)(kn.coord.y)
//             case _ => 0
//         }
//         board.board.values.foldLeft(0.0)((acc, x) => acc + evalPiece(x))
//     }
// }

// trait Tree

// case object Leaf extends Tree

// case class Node(ap: AppliedPlay, value: Double, childen: List[Tree]) extends Tree

// case class MaxNode(ap: AppliedPlay, value: Double, childen: List[Tree]) extends Tree

// case class MinMax(game: Game, f: (Board => Double)) {
//     val maxPlayer = White
//     val minPlayer = !maxPlayer
//     val board = game.history.head.board
    
//     val sortChildrens = (ap: AppliedPlay, player: Faction) => ap.board.getAllAppliedPlays(player).sortBy(x => player match{
//         case `maxPlayer` => f(x.board)
//         case _ => -f(x.board)
//     })

//     def iaPlay(maxDeepness: Int) : AppliedPlay = {
//         def minmax(alpha: Double, beta: Double, l: List[AppliedPlay], player: Faction, deepness: Int, initialValue: Double) : Double = {
//             @tailrec
//             def sub(alpha: Double, beta: Double, l: List[AppliedPlay], acc: Double) : Double = l match {
//                 case ap :: tl => player match {
//                     case `minPlayer` => {
//                         val v: Double = math.min(acc, alphaBeta(alpha, beta, ap, !player, deepness + 1))
//                         if (alpha >= v) v else sub(alpha, math.min(beta, v), tl, v)
//                     }
//                     case _ => {
//                         val v: Double = math.max(acc, alphaBeta(alpha, beta, ap, !player, deepness + 1))
//                         if (beta <= v) v else sub(math.max(alpha, v), beta, tl, v)
//                     }
//                 }
//                 case _ => acc
//             }
//             sub(alpha, beta, l, initialValue)
//         }
        
//         def alphaBeta(alpha: Double, beta: Double, ap: AppliedPlay, player: Faction, deepness: Int) : Double = (deepness > maxDeepness, player) match {
//             case (false, `maxPlayer`) => minmax(alpha, beta, ap.board.getAllAppliedPlays(player), player, deepness, -10000)
//             case (false, `minPlayer`) => minmax(alpha, beta, ap.board.getAllAppliedPlays(player), player, deepness, 10000)
//             case _ => f(ap.board)
//         }

//     }
//     def next(maxDeepness: Int) = MinMax(game.play(iaPlay(maxDeepness)), f)
// }
