function calculatePoint(lat, lon) {
	lon -= 9.1;
	var phi = (lat)*Math.PI/180;
	var theta = (lon-180)*Math.PI/180;
 
    var x = - Math.cos(phi) * Math.cos(theta);
    var y =  Math.sin(phi);
    var z =  Math.cos(phi) * Math.sin(theta);
 

	answer = [x, y, z];
	console.log(answer);
	return answer;
}

function calculatePointM(lat, lon, offset) {
	lon -= 9.1;
	var phi = (lat)*Math.PI/180;
	var theta = (lon-180)*Math.PI/180;
 
    var x = -offset * Math.cos(phi) * Math.cos(theta);
    var y =  offset * Math.sin(phi);
    var z =  offset * Math.cos(phi) * Math.sin(theta);
 

	answer = [x, y, z];
	console.log(answer);
	return answer;
}

function calculateSpline(slat, slon, elat, elon, offset) {
	var lat = (slat + elat)/2;
	var lon = (elon + elon)/2;

	lon -= 9.1;

	var phi = (lat)*Math.PI/180;
	var theta = (lon-180)*Math.PI/180;

    var x = - offset * Math.cos(phi) * Math.cos(theta);
    var y =  offset * Math.sin(phi);
    var z =  offset * Math.cos(phi) * Math.sin(theta);
 

	answer = [x, y, z];
	//console.log(answer);
	return answer;
}

function Sphere() {
	this.children = [];

	this.addChild = function(child) {
		this.children.add(child);
	}
	return 
}

function addCurve(arr1, arr2, arr3, object) {
	var curve = new THREE.QuadraticBezierCurve3(
		new THREE.Vector3( arr1[0], arr1[1], arr1[2]),
		new THREE.Vector3( arr2[0], arr2[1], arr2[2]),
		new THREE.Vector3( arr3[0], arr3[1], arr3[2])
	);

	var geometry = new THREE.Geometry();
	geometry.vertices = curve.getPoints( 500 );

	var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
	material.linewidth = 3;
	material.opacity = 1;
	material.transparent = true;
	console.log(material);
	// Create the final Object3d to add to the scene
	var curveObject = new THREE.Line( geometry, material );

	object.add(curveObject);
}

window.onload = function() {

	//init
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//lights
	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 0, 0.5, 1 );
	scene.add( directionalLight );

	var geometry = new THREE.SphereGeometry( 1, 50, 50 );
	var material = new THREE.MeshPhongMaterial();
	
	material.map    = THREE.ImageUtils.loadTexture('images/map.png')
	material.map.minFilter = THREE.NearestFilter;
	
	var sphere1 = new THREE.Mesh( geometry, material );
	var material1 = new THREE.MeshPhongMaterial({color: 0xFF0000});
	var geometry1 = new THREE.SphereGeometry( 0.01, 32, 32 )
	var sphere2 = new THREE.Mesh( geometry1, material1 );
	
	scene.add( sphere1 );
	//sphere.translateX()
	
	//0, 0
	var translate1 = calculatePoint(0, 0);
	sphere2.translateX(translate1[0]);
	sphere2.translateY(translate1[1]);
	sphere2.translateZ(translate1[2]);

	sphere1.add( sphere2 );

	//180, 180
	var sphere3 = new THREE.Mesh( geometry1, material1 );
	var translate2 = calculatePoint(20, 0);
	sphere3.translateX(translate2[0]);
	sphere3.translateY(translate2[1]);
	sphere3.translateZ(translate2[2]);
	sphere1.add( sphere3 );
	
	//90, 0
	var sphere4 = new THREE.Mesh( geometry1, material1 );
	var translate3 = calculatePoint(-22.9, -43.1);
	sphere4.translateX(translate3[0]);
	sphere4.translateY(translate3[1]);
	sphere4.translateZ(translate3[2]);
	sphere1.add( sphere4 );

	var sphere5 = new THREE.Mesh( geometry1, material1 );
	var translate4 = calculatePoint(40.71, -74.01);
	sphere5.translateX(translate4[0]);
	sphere5.translateY(translate4[1]);
	sphere5.translateZ(translate4[2]);
	sphere1.add( sphere5 );
	
	var mid = calculateSpline(-22.9, -43.1, 40.71, -74.01, 1.5);
	//var mid1 = calculatePointM(-22.9, -43.1, 1.5);
	//var mid2 = calculatePointM(40.71, -74.01, 1.5);

	addCurve(translate3, mid, translate4, sphere1);

	// var curve = new THREE.QuadraticBezierCurve3(
	// 	new THREE.Vector3( translate3[0], translate3[1], translate3[2]),
	// 	new THREE.Vector3( mid[0], mid[1], mid[2]),
	// 	new THREE.Vector3( translate4[0], translate4[1], translate4[2])
	// );

	// var geometry = new THREE.Geometry();
	// geometry.vertices = curve.getPoints( 500 );

	// var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
	// material.linewidth = 3;
	// material.opacity = 1;
	// material.transparent = true;
	// console.log(material);
	// // Create the final Object3d to add to the scene
	// var curveObject = new THREE.Line( geometry, material );

	// sphere1.add(curveObject);

	var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	scene.add( camera )

	camera.position.z = 3;

	var lrAngle = 0;
    var udAngle = 0;
    var zoom = 1;
    var temp;
    var mutlMatrix;
	document.addEventListener('keydown', function(event) {
        //rotates world up; moves camera down
        if (event.keyCode == 40) {
            event.preventDefault();
            //this check prevents axis from flipping
            if (udAngle >= -123) {
                udAngle -= 2;
                sphere1.rotation.x += 0.5;
            }
        }
        //rotates the world down; moves camera up
        else if (event.keyCode == 38) {
            event.preventDefault();
            //this check prevents axis from flipping
            if (udAngle <= 54) {
                udAngle += 2;
                sphere1.rotation.x -= 0.5;
            }
        }
        //rotates the world right; moves camera left
        else if (event.keyCode == 37) {
            event.preventDefault();
            //this check makes realistic turns
            if (lrAngle >= -360) {
                lrAngle -= 5;
                console.log(1);
                sphere1.rotation.y += 0.5;
            }
        }
        //rotates the world left; moves camera right
        else if (event.keyCode == 39) {
            event.preventDefault();
            //this check makes realistics turns
            if (lrAngle <= 360) {
                lrAngle += 10;
                sphere1.rotation.y -= 0.5;
            }
        }
        //zoom in
        else if (event.keyCode == 90) {
            event.preventDefault();
            //prevent from zooming too much and not seeing anything
            if (zoom >= 0.1) {
                zoom *= 0.9;
                camera.position.z -= 0.1;
                console.log(1);
            }
        }
        //zoom out
        else if (event.keyCode == 88) {
            event.preventDefault();
            //prevents from zooming out too much and not seeing anything
            if (zoom <= 10) {   
                zoom *= 1.1;
                camera.position.z += 0.1;
                //zoomT.value = zoom;
            }
        }
    })

	var render = function () {
					requestAnimationFrame(render);


					renderer.render(scene, camera);
	};

	render();
}