function startEngine(){
	//create canvas
	$("body").html('<canvas id="renderCanvas"></canvas>');
	canvas = document.getElementById("renderCanvas");

	//Custom Key Detection
	keys = {};
	window.onkeyup = function(e) { keys[e.keyCode] = false; }
	window.onkeydown = function(e) { keys[e.keyCode] = true; }
			
	// Initialize engine and start scene from external file js/scene.js
	engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
	scene = createScene();

	engine.runRenderLoop(function () {
		if (scene) {
			scene.render();
		}
	});

	// Resize
	window.addEventListener("resize", function () {
		engine.resize();
	});
}