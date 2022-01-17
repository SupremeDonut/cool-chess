<template>
	<div id="square-container">
	</div>
</template>

<script>
import {getValidMoves} from "@/scripts/game.js";
export default {
	"name": "Squares",
	show_squares(square, squareSize) {
		for (const [x, y] of getValidMoves(square, squareSize)) {
			var div = document.createElement("div");
			div.className = "square";
			div.style.transform = `translate(${x}px, ${y}px)`;
			document.getElementById("square-container").appendChild(div);
		}
	},
	hide_squares() {
		var container = document.getElementById("square-container");
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
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
	opacity: 0.5;
	background-color: cyan;
}
</style>
