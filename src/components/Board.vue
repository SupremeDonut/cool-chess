<template>
	<div id="board">
		<svg viewBox="0 0 8 8" shape-rendering="crispEdges">
				<g id="a">
					<g id="b">
						<g id="c">
							<g id="d">
								<rect width="1" height="1" fill="#dee3e6" id="e"/>
								<use x="1" y="1" href="#e"/>
								<rect y="1" width="1" height="1" fill="#8ca2ad" id="f"/>
								<use x="1" y="-1" href="#f"/>
							</g>
						<use x="2" href="#d"/>
					</g>
					<use x="4" href="#c"/>
				</g>
				<use y="2" href="#b"/>
			</g>
			<use y="4" href="#a"/>
		</svg>
	</div>
</template>

<script>
export default {
	name: "Board",
	mounted() {
		console.log("E");
		var positions = {};
		const pieces = {
			"p": "black pawn",
			"P": "white pawn",
			"n": "black knight",
			"N": "white knight",
			"b": "black bishop",
			"B": "white bishop",
			"r": "black rook",
			"R": "white rook",
			"q": "black queen",
			"Q": "white queen",
			"k": "black king",
			"K": "white king",
		}
		const FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
		const size = getComputedStyle(document.body).getPropertyValue("--board-size").slice(0, -2) / 8;
		var col = 0;
		var row = 0;

		for (var i = 0; i < FEN.length; i++) {
			var char = FEN.charAt(i);
			if (char == "/") {
				col = -1;
				row++;
			} else if (pieces[char] != undefined) {
				var div = document.createElement("div");
				div.className = "piece " + pieces[char];
				div.id = "piece" + i;
				var transform = [col * size, row * size];
				div.style.transform = `translate(${transform[0]}px, ${transform[1]}px)`;
				positions[div.id] = transform;
				document.getElementById("board").appendChild(div);
			} else {
				col += parseInt(char) - 1;
			}
			col++;
		}
		var held = null;

		window.onmousedown = e => {
			var target = e.target;
			if (target.className.startsWith?.("piece")) {
				held = target.id;
				target.style.zIndex = 1;
			}
		}
		window.onmouseup = e => {
			if (held) {
				var posX = Math.round((abs(e.clientX, true) - size / 2) / size);
				var posY = Math.round((abs(e.clientY, false) - size / 2) / size);
				if (0 <= posX && posX < 8 && 0 <= posY && posY < 8) {				
					posX *= size;
					posY *= size;
					positions[held] = [posX, posY];
				} else {
					posX = positions[held][0];
					posY = positions[held][1];
				}
				document.getElementById(held).style.transform = `translate(${posX}px, ${posY}px)`;
				document.getElementById(held).style.zIndex = 0;
				held = null;
			}
		}
		window.onmousemove = e => {
			if (held) {
				var diffX = abs(e.clientX, true) - size / 2;
				var diffY = abs(e.clientY, false) - size / 2;
				document.getElementById(held).style.transform = `translate(${diffX}px, ${diffY}px)`;
			}
		}

		var abs = function(pos, left) { // gets the position of the piece relative to its top left
			var board = document.getElementById("board").getBoundingClientRect();
			if (left) {
				return pos - board.left;
			} else {
				return pos - board.top;
			}
		}
	}
}
</script>


<style>
@import "../styles/pieces.css";
#board {
	position: relative;
	margin: 5rem;
	width: var(--board-size);
	height: var(--board-size);
}

svg {
	outline: 4px solid rgb(6, 92, 141);
}

.piece {
	position: absolute;
	left: 0px;
	top: 0px;
	width: 12.5%;
	aspect-ratio: 1;
	user-select: none;
	background-size: cover;
}

.piece:hover {
	cursor: pointer;
}
</style>
