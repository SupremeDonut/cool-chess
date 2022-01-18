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

:root {
	--board-size: 700px;
}

body {
	background: rgb(24, 24, 26);
	background-image: url("./assets/bg.png");
	background-size: 500px;
	background-repeat: repeat;
}

#main {
	display: flex;
	justify-content: center;
	width: 100%;
	margin: 60px 0px;
}

#main-grid {
	display: grid;
	grid-template-columns: var(--board-size) 200px;
	grid-template-rows: 1fr;
	grid-gap: 20px;
}
</style>
