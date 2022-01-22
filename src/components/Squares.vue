<template>
	<div id="square-container">
	</div>
</template>

<script>
import {getValidMoves} from "@/scripts/game.js";
var attack;

export default {
	"name": "Squares",
	show_squares(square, squareSize) {
		var div = document.createElement("div");
		div.className = "square src";
		div.style.transform = `translate(${Math.floor(square[0])}px, ${Math.floor(square[1])}px)`;
		document.getElementById("square-container").appendChild(div);		
		for (const [x, y] of getValidMoves(square, squareSize)) {
			div = document.createElement("div");
			div.className = "square";
			div.style.transform = `translate(${Math.floor(x)}px, ${Math.floor(y)}px)`;
			document.getElementById("square-container").appendChild(div);
		}
	},
	hide_squares(hide_attack = false) {
		var container = document.getElementById("square-container");
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
		if (attack && !hide_attack) {
			var div = document.createElement("div");
			div.className = "square attack";
			div.style.transform = `translate(${Math.floor(attack[0])}px, ${Math.floor(attack[1])}px)`;
			document.getElementById("square-container").appendChild(div);
		} else {
			attack = null;
		}
	},
	showAttack(x, y) {
		var div = document.createElement("div");
		div.className = "square attack";
		div.style.transform = `translate(${Math.floor(x)}px, ${Math.floor(y)}px)`;
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
