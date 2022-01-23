import Board from "@/components/Board.vue";
import Moves from "@/components/Moves.vue";
import Squares from "@/components/Squares.vue";

const chess = require("chess");

export const game = chess.create({"PGN": true});

export function getSquareName(transX, transY, size) { // transform -> piece name
	transX /= size;
	transY /= size;
	let xPos = "abcdefgh"[Math.round(transX)];
	return xPos + (8 - Math.round(transY));
}

export function getSquarePos(file, rank, size) { // piece name -> transform
	return ["abcdefgh".indexOf(file) * size, (8 - rank) * size]
}

export function getValidMoves(square, size) {
	square = getSquareName(...square, size);
	let moves = [];
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
	let moves = game.getStatus().notatedMoves;
	for (let [notation, move] of Object.entries(moves)) {
		if (move.src.piece.type == piece
			&& move.src.file == src[0]
			&& move.src.rank == src[1]
			&& move.dest.file == dest[0]
			&& move.dest.rank == dest[1]
			) {
				let
					pos = Board.positions,
					name = move.src.piece.side.name;
				if (notation.charAt(notation.length - 1).match(/[BNQR]/)) { // check if this is promotion
					let promotion = "Q"; // TODO: promotion options
					notation = notation.replace(/[BNQR]/, promotion);
					for (const div of document.getElementsByClassName("piece pawn " + name)) {
						if (pos[div.id][1] == 0 || pos[div.id][1] == size * 7) {
							let pieceName = {"B": "bishop", "N": "knight", "Q": "queen", "R": "rook"};
							div.className = "piece " + name + " " + pieceName[promotion];
							break;
						}
					}
				}
				let ret = game.move(notation);
				
				if (notation == "O-O") { // kingside castling
					for (const id in pos) {
						if (JSON.stringify(pos[id]) == `[${size * 7},${size * 7}]` && name == "white"
							|| JSON.stringify(pos[id]) == `[${size * 7},0]` && name == "black"
						) {
							pos[id][0] -= size * 2; // move the rook
							document.getElementById(id).style.transform = `translate(${pos[id][0]}px, ${pos[id][1]}px)`;
							break;
						}
					}
				} else if (notation == "O-O-O") { // queenside castling
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

				let status = game.getStatus().isCheckmate ? "#" : game.getStatus().isCheck ? "+" : ""; // check/mate label
				Moves.onMove(notation + status, name); // updates move list

				if (status) { // show king attack 
					for (const square of game.getStatus().board.squares) {
						if (square.piece?.type == "king" && square.piece.side.name != name) {
							Squares.showAttack(...getSquarePos(square.file, square.rank, size));
							break;
						}
					}
				} else {
					Squares.hide_squares(true);
				}
				
				let capture = ret.move.capturedPiece;
				if (capture) {
					if (piece == "pawn" && capture.type == "pawn") {
						let enPassant = 2;
						for (const id in pos) {
							if (JSON.stringify(pos[id]) == JSON.stringify(getSquarePos(move.dest.file, move.dest.rank, size))) {
								enPassant--; // checks en passant by seeing how many stacked pieces there are 
							}
						}
						if (enPassant) { // if 2 pieces are on the square its a normal capture
							if (name == "white") {
								return getSquarePos(move.dest.file, move.dest.rank - 1, size);
							} else {
								return getSquarePos(move.dest.file, move.dest.rank + 1, size);
							}
						}
					}
					// return position of piece to remove
					return getSquarePos(move.dest.file, move.dest.rank, size);
				}
				return true;
			}
	}
	return;
}
