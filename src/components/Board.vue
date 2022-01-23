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
		<Squares/>
		<Labels/>
		<div id="pieces">
		</div>
	</div>
</template>

<script>
import Squares from "@/components/Squares.vue";
import Labels from "@/components/Labels.vue";
import {makeMove} from "@/scripts/game.js";

let
	positions = {},
	size = Math.max(57, Math.min(80, Math.round((window.innerWidth / 2) / 8)));

export default {
	name: "Board",
	components: {Squares, Labels},
	positions: positions,
	size: size,
	mounted() {
		document.documentElement.style.setProperty("--board-size", size * 8 + "px");
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
		let held = null;
		window.onmousedown = e => {
			let target = e.target;
			if (target.className.startsWith?.("piece")) {
				held = target.id;
				target.style.zIndex = 1;
				Squares.show_squares(positions[held], size);
			}
		}

		window.onmouseup = e => {
			if (held) {
				let
					posX = Math.round((abs(e.clientX, true) - size / 2) / size),
					posY = Math.round((abs(e.clientY, false) - size / 2) / size);
				if (0 <= posX && posX < 8 && 0 <= posY && posY < 8) { // checks	if its on the board
					posX *= size;
					posY *= size;
					let src = positions[held];
					positions[held] = [posX, posY];
					if (JSON.stringify(src) != JSON.stringify(positions[held])) {
						let ret = makeMove(src, 
							positions[held], 
							size,
							document.getElementById(held).className.split(" ")[2]
							);
						if (ret == null) { // bad move, reset pos
							[posX, posY] = src;
							positions[held] = src;
						} else if (typeof(ret) == "object") { // remove piece if captured
							for (const id in positions) {
								if (id != held && JSON.stringify(ret) == JSON.stringify(positions[id])) {
									document.getElementById(id).remove();
									delete positions[id];
								}
							}
						}
					}
				} else { // reset position if it is invalid
					posX = positions[held][0];
					posY = positions[held][1];
				}
				document.getElementById(held).style.transform = `translate(${posX}px, ${posY}px)`;
				document.getElementById(held).style.zIndex = 0;
				Squares.hide_squares();
				held = null;
			}
		}
		let prevX, prevY = 0;
		window.onmousemove = e => {
			if (held) {
				let [diffX, diffY] = [prevX, prevY];
				if (size / 2 < e.clientX && e.clientX < window.innerWidth - size / 2) { // dont drag offscreen
					diffX = abs(e.clientX, true) - size / 2; // change in pos from original position
				}
				if (size / 2 < e.clientY && e.clientY < window.innerHeight - size / 2) {
					diffY = abs(e.clientY, false) - size / 2;
				}
				document.getElementById(held).style.transform = `translate(${diffX}px, ${diffY}px)`;
				[prevX, prevY] = [diffX, diffY];
			}
		}

		window.onresize = () => {
			let before = document.documentElement.style.getPropertyValue("--board-size").slice(0, -2) / 8;
			size = Math.max(57, Math.min(80, Math.round((window.innerWidth / 2) / 8)));
			let scale = size / before;
			if (scale == 1) {return;}
			document.documentElement.style.setProperty("--board-size", size * 8 + "px");
			for (const id in positions) {
				positions[id][0] *= scale;
				positions[id][1] *= scale;
				document.getElementById(id).style.transform = `translate(${positions[id][0]}px, ${positions[id][1]}px)`;
			}

			let attack = document.getElementsByClassName("square attack")[0];
			if (attack) { // scales attack square
				let pos = [];
				for (const match of attack.style.transform.matchAll(/([0-9]+)px/g)) {
					pos.push(match[1] * scale);
				}
				attack.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`;
			}
		}

		let setBoard = function() {
			const FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
			
			let
				col = 0,
				row = 0;

			for (let i = 0; i < FEN.length; i++) {
				let char = FEN.charAt(i);
				if (char == "/") {
					col = -1;
					row++;
				} else if (pieces[char] != undefined) {
					let div = document.createElement("div");
					div.className = "piece " + pieces[char];
					div.id = "piece" + i;
					let transform = [col * size, row * size];
					div.style.transform = `translate(${transform[0]}px, ${transform[1]}px)`;
					positions[div.id] = transform;
					document.getElementById("pieces").appendChild(div);
				} else {
					col += parseInt(char) - 1;
				}
				col++;
			}	
		}
		setBoard();	

		let abs = function(pos, left) { // gets the position of the piece relative to its top left
			let board = document.getElementById("board").getBoundingClientRect();
			return left ? pos - board.left : pos - board.top;
		}
	}
}
</script>


<style>
@import "../styles/pieces.css";
#board {
	position: relative;
	width: var(--board-size);
	height: var(--board-size);
	outline: 4px solid rgb(6, 92, 141);
	border-radius: 2px;
	box-shadow: 0px 0px 20px black;
}

.piece {
	position: absolute;
	left: 0px;
	top: 0px;
	width: 12.5%;
	height: 12.5%;
	user-select: none;
	background-size: cover;
}

.piece:hover {
	cursor: pointer;
}
</style>
