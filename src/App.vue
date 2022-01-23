<template>
	<div id="main">
		<div id="main-grid">
			<Board/>
			<Moves/>
		</div>
	</div>
</template>

<script>
import Board from "@/components/Board.vue";
import Moves from "@/components/Moves.vue";

export default {
	name: "App",
	components: {
		Board,
		Moves
	}
}
</script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	background: rgb(24, 24, 26); /* TODO: themes */
	background-image: url("./assets/bg.png");
	background-size: 500px;
}

#main {
	display: flex;
	justify-content: center;
	width: 100%;
	margin: 60px 0px;
}

#main-grid {
	display: grid;
	grid-template-columns: 3fr 1fr;
	grid-template-rows: 1fr;
	grid-gap: 20px;
}

@media screen and (max-width: 640px) {
	#main-grid {
		height: calc(var(--board-size) * 1.5);
		grid-template-columns: 1fr;
		grid-template-rows: 3fr 1fr;
	}
}
</style>
