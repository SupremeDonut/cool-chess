import Board from "@/components/Board.vue";
import Moves from "@/components/Moves.vue";
import Squares from "@/components/Squares.vue";

const chess = require("chess");

export const game = chess.create({"PGN": true});

export function getSquareName(transX, transY, squareSize) {
	transX /= squareSize;
	transY /= squareSize;
	var xPos = "abcdefgh"[transX];
	return xPos + (8 - transY);
}

export function getValidMoves(square, size) {
	square = getSquareName(...square, size);
	var moves = [];
	for (const [, move] of Object.entries(game.getStatus().notatedMoves)) {
		if (move.src.file == square[0] && move.src.rank == square[1]) {
			moves.push(["abcdefgh".indexOf(move.dest.file) * size, (8 - move.dest.rank) * size])
		}
	}
	return moves;
}

export function makeMove(src, dest, size, piece) {
	src = getSquareName(...src, size);
	dest = getSquareName(...dest, size);
	var moves = game.getStatus().notatedMoves;
	for (const [notation, move] of Object.entries(moves)) {
		if (move.src.piece.type == piece
			&& move.src.file == src[0]
			&& move.src.rank == src[1]
			&& move.dest.file == dest[0]
			&& move.dest.rank == dest[1]
			) {
				var name = move.src.piece.side.name;
				var ret = game.move(notation);
				var capture = ret.move.capturedPiece;
				var status = "";
				if (game.getStatus().isCheck) {
					status += "+";
				} else if (game.getStatus().isCheckmate) {
					status += "#";
				}
				Moves.onMove(notation + status, name);

				if (status) {
					for (var square of game.getStatus().board.squares) {
						if (square.piece?.type == "king" && square.piece.side.name != name) {
							Squares.showAttack("abcdefgh".indexOf(square.file) * size, (8 - square.rank) * size);
							break;
						}
					}
				} else {
					Squares.hide_squares(true);
				}
				
				if (capture) {
					if (piece == "pawn" && capture.type == "pawn") {
						var enPassant = 2;
						var pos = Board.positions;
						for (var id in pos) {
							if (JSON.stringify(pos[id]) == JSON.stringify(["abcdefgh".indexOf(move.dest.file) * size, (8 - move.dest.rank) * size])) {
								enPassant--;
							}
						}
						if (enPassant) {
							if (name == "white") {
								return ["abcdefgh".indexOf(move.dest.file) * size, (9 - move.dest.rank) * size];
							} else {
								return ["abcdefgh".indexOf(move.dest.file) * size, (7 - move.dest.rank) * size];
							}
						}
					}
					
					return ["abcdefgh".indexOf(move.dest.file) * size, (8 - move.dest.rank) * size];
				}
				return true;
			}
	}
	return;
}
