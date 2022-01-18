import Moves from "@/components/Moves.vue";

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
				game.move(notation);
				var status = "";
				if (game.getStatus().isCheck) {
					status += "+";
				} else if (game.getStatus().isCheckmate) {
					status += "#";
				}
				Moves.onMove(notation + status, name);
				return true;
			}
	}
	return;
}
