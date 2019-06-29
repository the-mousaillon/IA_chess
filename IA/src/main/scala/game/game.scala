package chess
package game
import board._
import pieces._
import position._
import play._

case class Game(currentPlayer: Faction, history: List[AppliedPlay]) {
    def play(ap: AppliedPlay) : Game = Game(!currentPlayer, ap :: history)
}

