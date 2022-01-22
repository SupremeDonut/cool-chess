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

export function getSquarePos(file, rank, size) {
	return ["abcdefgh".indexOf(file) * size, (8 - rank) * size]
}

export function getValidMoves(square, size) {
	square = getSquareName(...square, size);
	var moves = [];
	for (const [, move] of Object.entries(game.getStatus().notatedMoves)) {
		if (move.src.file == square[0] && move.src.rank == square[1]) {
			moves.push(getSquarePos(move.dest.file, move.dest.rank, size))
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
				var pos = Board.positions;
				var name = move.src.piece.side.name;
				var ret = game.move(notation);
				var capture = ret.move.capturedPiece;
				var status = "";
				if (notation == "O-O") {
					for (const id in pos) {
						if (JSON.stringify(pos[id]) == `[${size * 7},${size * 7}]` && name == "white"
							|| JSON.stringify(pos[id]) == `[${size * 7},0]` && name == "black"
						) {
							pos[id][0] -= size * 2;
							document.getElementById(id).style.transform = `translate(${pos[id][0]}px, ${pos[id][1]}px)`;
							break;
						}
					}
				} else if (notation == "O-O-O") {
					for (const id in pos) {
							if (JSON.stringify(pos[id]) == `[0,${size * 7}]` && name == "white"
							|| JSON.stringify(pos[id]) == `[0,0]` && name == "black"
						) {
							pos[id][0] += size * 3;
							document.getElementById(id).style.transform = `translate(${pos[id][0]}px, ${pos[id][1]}px)`;
							break;
						}
					}
				}
				if (game.getStatus().isCheck) {
					status += "+";
				} else if (game.getStatus().isCheckmate) {
					status += "#";
				}
				Moves.onMove(notation + status, name);

				if (status) {
					for (const square of game.getStatus().board.squares) {
						if (square.piece?.type == "king" && square.piece.side.name != name) {
							console.log(square)
							Squares.showAttack(...getSquarePos(square.file, square.rank, size));
							break;
						}
					}
				} else {
					Squares.hide_squares(true);
				}
				
				if (capture) {
					if (piece == "pawn" && capture.type == "pawn") {
						var enPassant = 2;
						for (const id in pos) {
							if (JSON.stringify(pos[id]) == JSON.stringify(getSquarePos(move.dest.file, move.dest.rank, size))) {
								enPassant--;
							}
						}
						if (enPassant) {
							if (name == "white") {
								return getSquarePos(move.dest.file, move.dest.rank - 1, size);
							} else {
								return getSquarePos(move.dest.file, move.dest.rank + 1, size);
							}
						}
					}
					
					return getSquarePos(move.dest.file, move.dest.rank, size);
				}
				return true;
			}
	}
	return;
}
