package chess
package ia.minmax_OLD
import play.AppliedPlay
import chess.board.Board
import pieces._
import scala.annotation.tailrec
import play.Play

case object EvaluationFunctions {
    def naive(board: Board, faction: Faction) ={
        val evalPiece = (p: Piece) => p match {
            case Queen(`faction`, _) => 9
            case King(`faction`, _, _, _) => 10
            case Rook(`faction`, _, _) => 5
            case Pawn(`faction`, _, _, _) => 1
            case Bishop(`faction`, _) | Knight(`faction`, _)=> 3
            case _ => 0
        }
        board.board.values.foldLeft(0)((acc, x) => acc + evalPiece(x))
    }
}


case class Node(ap: AppliedPlay, player: Faction, value: Int, childrens: List[Node]) {
    def evaluate = 1
    def count : Int = {
        1 + childrens.foldLeft(0)((acc, x) => acc + x.count)
    }
    def prettyPrint : Unit = {println(ap.board.prettyPrint); println(ap.play.toString); childrens.foreach(c => c.prettyPrint)}
}

case class MinMax(board: Board, initialPlayer: Faction, f: ((Board, Faction) => Int)){

    val maximiser = (children: List[Node]) => children.foldLeft(-1000)((acc, x) => math.max(acc, x.value))
    val minimiser = (children: List[Node]) => children.foldLeft(1000)((acc, x) => math.min(acc, x.value))

    val evaluate = (player: Faction, children: List[Node]) => player match {
        case `initialPlayer` => maximiser(children)
        case _ => minimiser(children)
    }

    val initialValues = (player: Faction) => player match {
        case `initialPlayer` => -10000
        case _ => 10000
    }

    def descendant(p: AppliedPlay, player: Faction) = p.board.getAllAppliedPlays(player)

    def makePartialTree(ap: AppliedPlay, maxDeepness: Int) = {
        def sub(ap: AppliedPlay, player: Faction, deepness: Int) : Node = (deepness < maxDeepness) match {
            case true => {
                Node(ap, player, initialValues(player),  descendant(ap, !player).foldLeft(List[Node]())(
                    (acc, x) => sub(x, !player, deepness + 1) :: acc))
            }
            
            
             case _ => Node(ap, player, f(ap.board, player), Nil)
        }
        sub(ap, !initialPlayer, 1)
    }

    def makeTrees(maxDeepness: Int) = board.getAllAppliedPlays(initialPlayer).map(ap => makePartialTree(ap, maxDeepness))


    def iaPlay(maxDeepness: Int) : Play = {
        @tailrec
        def getMaxNode(l: List[Node], maxValue: Int, node: Node) : Play = l match {
            case head :: tl =>  if (head.value > maxValue)
                                    getMaxNode(tl, head.value, head)
                                else
                                    getMaxNode(tl, maxValue, node)
            case _ => node.ap.play
        }
        val trees = makeTrees(maxDeepness)
        getMaxNode(trees, trees.head.value, trees.head)
    }
}