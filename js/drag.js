function makeDraggable(mesh){
	// alow pieces to be dragged along the x,z plane
	var dragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});
	mesh.addBehavior(dragBehavior);
	dragBehavior.useObjectOrienationForDragging = false;
	dragBehavior.onDragStartObservable.add(()=>{
		mesh.physicsImpostor.sleep();
		mesh.position.y+= 4;
		peerIsMaster = true;
	})
	dragBehavior.onDragObservable.add(()=>{
		mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,0,0))
	})
	
	dragBehavior.onDragEndObservable.add(()=>{
		if(mesh.physicsImpostor){
			mesh.physicsImpostor.wakeUp()
		}
		peerIsMaster = false;
	})
};