package chess
package pieces

trait Faction {
    def unary_! : Faction
}

case object White extends Faction {
    override def unary_! : Faction = Black
}

case object Black extends Faction{
    override def unary_! : Faction = White
}
