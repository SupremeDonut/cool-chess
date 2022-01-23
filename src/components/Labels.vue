<template>
	<div id="label-container-top">
		<span>8</span>
		<span>7</span>
		<span>6</span>
		<span>5</span>
		<span>4</span>
		<span>3</span>
		<span>2</span>
		<span>1</span>
	</div>
	<div id="label-container-bottom">
		<span>A</span>
		<span>B</span>
		<span>C</span>
		<span>D</span>
		<span>E</span>
		<span>F</span>
		<span>G</span>
		<span>H</span>
	</div>
</template>

<script>
export default {
	"name": "Labels"
}
</script>

<style scoped>
#label-container-top {
	position: absolute;
	left: 3px;
	top: 0px;
	width: 12.5%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}

#label-container-bottom {
	position: absolute;
	left: 3px;
	bottom: 13px;
	width: 100%;
	height: 12.5%;
	display: flex;
	align-items: flex-end;
	justify-content: space-around;
}

span {
	width: 12.5%;
	height: 12.5%;
	user-select: none;
	color: rgb(0, 0, 70);
	font-family: "Poppins", sans-serif;
}
</style>