<template>
	<div id="move-sidebar">
		<h2 id="move-header">
			Moves:
		</h2>
		<div id="move-list">
		</div>
	</div>
</template>

<script>
var moves = [];
var cur_move = 0;
export default {
	"name": "Moves",
	onMove(move, side) {
		var list = document.getElementById("move-list");
		moves.push(move);
		if (side == "white") {
			cur_move++;
			var div = document.createElement("div");
			div.className = "move num";
			div.innerHTML = cur_move + ".";
			list.style.gridTemplateRows = `repeat(${cur_move}, 25px)`
			list.appendChild(div);
		}
		div = document.createElement("div");
		div.className = "move " + side;
		div.innerHTML = move;
		list.appendChild(div);
		list.scrollTop = list.scrollHeight;
	}
}
</script>

<style>
#move-sidebar {
	width: 100%;
	height: 100%;
	background: whitesmoke;
	border-radius: 7px;
	overflow: hidden;
}

#move-header {
	height: 50px;
	background-color: rgb(130, 138, 255);
	padding: 10px;
	text-align: center;
}

#move-list {
	display: grid;
	height: calc(var(--board-size) - 50px);
	grid-template-columns: 2fr 5fr 5fr;
	overflow-y: auto;
}

.move {
	font-family: "Poppins", sans-serif;
}

.move.num {
	text-align: center;
	background-color: burlywood;
}

.move.white {
	padding-left: 8px;
	background-color: rgb(240, 240, 240);
}

.move.black {
	padding-left: 8px;
	background-color: rgb(230, 230, 230);
}
</style>