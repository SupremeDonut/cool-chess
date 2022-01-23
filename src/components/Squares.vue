<template>
	<div id="square-container">
	</div>
</template>

<script>
import {getValidMoves} from "@/scripts/game.js";
let attack = null;

export default {
	"name": "Squares",
	show_squares(square, squareSize) {
		let div = document.createElement("div");
		div.className = "square src";
		div.style.transform = `translate(${square[0]}px, ${square[1]}px)`;
		document.getElementById("square-container").appendChild(div);		
		for (const [x, y] of getValidMoves(square, squareSize)) {
			div = document.createElement("div");
			div.className = "square";
			div.style.transform = `translate(${x}px, ${y}px)`;
			document.getElementById("square-container").appendChild(div);
		}
	},
	hide_squares(hide_attack = false) {
		let container = document.getElementById("square-container");
		while (container.firstChild) { // remove all children
			container.removeChild(container.firstChild);
		}
		if (attack && !hide_attack) { // king attack
			let div = document.createElement("div");
			div.className = "square attack";
			div.style.transform = `translate(${attack[0]}px, ${attack[1]}px)`;
			document.getElementById("square-container").appendChild(div);
		} else {
			attack = null;
		}
	},
	showAttack(x, y) {
		let div = document.createElement("div");
		div.className = "square attack";
		div.style.transform = `translate(${x}px, ${y}px)`;
		document.getElementById("square-container").appendChild(div);
		attack = [x, y];
	}
}
</script>

<style>
#square-container {
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
}

.square {
	position: absolute;
	left: 0px;
	top: 0px;
	width: 12.5%;
	height: 12.5%;
	opacity: 0.7;
	background-color: rgb(57, 109, 168);
}

.src {
	background-color: rgb(32, 42, 60);
}

.attack {
	background: radial-gradient(circle at center, red 10%, transparent 75%);
}
</style>
