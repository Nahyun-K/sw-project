import * as THREE from './node_modules/three/build/three.module.js';
import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];

let SCREEN_WIDTH = 640;
let SCREEN_HEIGHT = 480;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

let container, stats;
let camera, scene, renderer, mesh;
let cameraRig, activeCamera, activeHelper;
let cameraPerspective, cameraOrtho;
let cameraPerspectiveHelper, cameraOrthoHelper;
const frustumSize = 600;

init();
animateO();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    
	scene = new THREE.Scene(); 

				//

	camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );
	camera.position.z = 2500;

	cameraPerspective = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 150, 1000 );

	cameraPerspectiveHelper = new THREE.CameraHelper( cameraPerspective );
	scene.add( cameraPerspectiveHelper );

				//
	cameraOrtho = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000 );

	cameraOrthoHelper = new THREE.CameraHelper( cameraOrtho );
	scene.add( cameraOrthoHelper );

				//

	activeCamera = cameraPerspective;
	activeHelper = cameraPerspectiveHelper;


				// counteract different front orientation of cameras vs rig

	cameraOrtho.rotation.y = Math.PI;
	cameraPerspective.rotation.y = Math.PI;

	cameraRig = new THREE.Group();

	cameraRig.add( cameraPerspective );
	cameraRig.add( cameraOrtho );

	scene.add( cameraRig );

				//
    //const scene = new THREE.Scene();
    //const texture_bg = new THREE.VideoTexture( videoElement );
    //scene.background = texture_bg;
	mesh = new THREE.Mesh(
		//new THREE.SphereGeometry( 100, 16, 8 ),
		//new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
        
	);
	//scene.add( mesh ); // 여기에 사진 넣기

	const mesh2 = new THREE.Mesh(
		new THREE.SphereGeometry( 50, 16, 8 ),
		new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } )
    );

	mesh2.position.y = 150;
	mesh.add( mesh2 );

	const mesh3 = new THREE.Mesh(
		new THREE.SphereGeometry( 5, 16, 8 ),
		new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } )
	);
	mesh3.position.z = 150;
	cameraRig.add( mesh3 );

				//

	const geometry = new THREE.BufferGeometry();
	const vertices = [];


	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

	const particles = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888 } ) );
	scene.add( particles );

				//

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	container.appendChild( renderer.domElement );

	renderer.autoClear = false;

				//

	stats = new Stats();
	container.appendChild( stats.dom );

				//

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;
	aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	
	camera.aspect = 0.5 * aspect;
	camera.updateProjectionMatrix();

	cameraPerspective.aspect = 0.5 * aspect;
	cameraPerspective.updateProjectionMatrix();

	cameraOrtho.left = - 0.5 * frustumSize * aspect / 2;
	cameraOrtho.right = 0.5 * frustumSize * aspect / 2;
	cameraOrtho.top = frustumSize / 2;
	cameraOrtho.bottom = - frustumSize / 2;
	cameraOrtho.updateProjectionMatrix();

}

			//

function animateO() {

	requestAnimationFrame( animateO );

	renderO();
	stats.update();

}


function renderO() {

	const r = Date.now() * 0.0005;
    /* 움직이는 부분 */
	mesh.position.x = 700 * Math.cos( r );
	mesh.position.z = 700 * Math.sin( r );
	mesh.position.y = 700 * Math.sin( r );

	mesh.children[ 0 ].position.x = 70 * Math.cos( 2 * r );
	mesh.children[ 0 ].position.z = 70 * Math.sin( r );

	if ( activeCamera === cameraPerspective ) {

		cameraPerspective.fov = 35 + 30 * Math.sin( 0.5 * r );
		cameraPerspective.far = mesh.position.length();
		cameraPerspective.updateProjectionMatrix();

		cameraPerspectiveHelper.update();
		cameraPerspectiveHelper.visible = true;

		cameraOrthoHelper.visible = false;

	} else {

		cameraOrtho.far = mesh.position.length();
		cameraOrtho.updateProjectionMatrix();

		cameraOrthoHelper.update();
		cameraOrthoHelper.visible = true;

		cameraPerspectiveHelper.visible = false;

	}

	cameraRig.lookAt( mesh.position );

	renderer.clear();

	activeHelper.visible = false;

	//renderer.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
	//renderer.render( scene, activeCamera ); // 여기가 왼쪽부분

	activeHelper.visible = true;

	renderer.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
	//renderer.setViewport( SCREEN_WIDTH, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.render( scene, camera );

}
