# The Rules: Chameleon Chess

This game is a special adaptation of the most popular game of Chess. However it is somehow a bit faster to play, but also a little more challenging.

## The Objective

The goal is quite simple: The last player who still has pawns on the board wins. So, the objective is to be the last (wo)man standing.

## The Game Board

This game is played on a standard 8x8 chess board. However, there is a catch! Instead of the normal black and white colouring on normal chess boards, this game uses a quite colorful board:

![Picture of chameleon chess board]()

Instead of black and white there are four different colors to be found on the board. Them colors being: Red, Green, Yellow and Blue. The layout of these colors is not random, but has been determined by long hours of testing. So, there is a purpose behind the layout!

## The Pawns

What also differs, are the pawns. Instead of normal chess pawns, each player has only four pawns. These pawns are small chameleons themselves, meaning that they are shape shifters. Have a look at them:

![Picture of chameleon chess pawns]()

They can be either one of four different chess pawns: Knight, Bishop, Rook or Queen. Which role they actually assume depends on the color of the field a pawn currently stands on.

So, if the first pawn stands on a Red tile, it is a Knight. If it stands on a green tile it is a Queen etc. There are different combinations of field colors and roles, that differ from pawn to pawn.

The game can be played with two, three or four players. Each player has four pawns and this is the standard starting constellation:

![Picture of the starting constellation for four players]()

## Game Play

It is a turn based game. The Red player starts, then comes the Blue, the Yellow and the Green player. A turn consists of the player choosing one of his/her pawns and moving it accordingly to the pawn's role. For anyone not familiar with the different chess pawns and how they are allowed to move, see below.

After the player has moved one of his/her pawns, the turn is over and the next player continues.

Opponent's pawns can be beaten if one can reach the field they are standing on. So, if a pawn is moved to a field where an opponent's pawn is placed, the opponent's pawn is beaten and removed from the game.

![Picture of a red pawn beating blue one]()

If a player has no pawns left, he/she is out of the game.

## The Limits

To make the game more exciting, the game board also shrinks over time.

Initially the board is 8x8 tiles in size. As soon as a player moves to the center and one or more of the outer most rows or columns become free (so there is no pawn anymore), the board shrinks. So, the outermost pawns determine the current board size.

![Picture of a moving pawn and the shrinking board]()

Once the board has shrunken, it never grows again (until a new game is started at least). The smallest size however is 3x3. So once the board has reached 3x3, it doesn't shrink any further.

// TODO: besser formulieren!!!
**Attention**: There is one special case in the end game. It might happen, that the board has reached the 3x3 size and a pawn will have the role of a knight in the center tile. In that case this pawn can't move anymore and is therefore considered dead! If this pawn is the only one left of a player, he/she will loose

## Chess Pawns Movement

Except for the Knight, pawns can't jump over other pieces. An opponents pawn, that blocks the way can be beaten, but will also stop the movement. The players own pawns simply block the way.

**Knight:** A knight moves to the nearest square not on the same rank, file, or diagonal. (This can be thought of as moving two squares horizontally then one square vertically, or moving one square horizontally then two squares vertically—i.e. in an "L" pattern.) The knight is not blocked by other pieces: it jumps to the new location.

![Picture of a Knight and how it can move]()

**Bishop:** A bishop moves any number of vacant squares diagonally.

![Picture of a Bishop and how it can move]()

**Rook:** A rook moves any number of vacant squares horizontally or vertically.

![Picture of a Rook and how it can move]()

**Queen:** The queen moves any number of vacant squares horizontally, vertically, or diagonally. So, a queen is a combination of a bishop and a rook.

![Picture of a Queen and how it can move]()