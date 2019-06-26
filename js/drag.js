// draggedPiece holds the id of the piece being dragged, it corresponds
// to the index in the pieces[] array
var draggedPiece="none";
var endRemoteDrag = false;

function makeDraggable(mesh, pieceID){
	// alow pieces to be dragged along the x,z plane
	var dragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});
	mesh.addBehavior(dragBehavior);
	dragBehavior.useObjectOrienationForDragging = false;
	dragBehavior.onDragStartObservable.add(()=>{
		draggedPiece = pieceID;
		
		mesh.physicsImpostor.sleep();
		mesh.position.y+= 4;
		peerIsDragging = true;
	})
	dragBehavior.onDragObservable.add(()=>{
		mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,0,0))
	})
	
	dragBehavior.onDragEndObservable.add(()=>{
		if(mesh.physicsImpostor){
			mesh.physicsImpostor.wakeUp()
		}
		draggedPiece="none";
		endRemoteDrag = true;
		peerIsDragging = false;
	})
};