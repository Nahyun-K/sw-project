const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TRIANGULATION } from './triangulation.js';
import { Line2 } from './node_modules/three/examples/jsm/lines/Line2.js';
import { LineGeometry } from './node_modules/three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from './node_modules/three/examples/jsm/lines/LineMaterial.js';
import Stats from './node_modules/three/examples/jsm/libs/stats.module.js';

const renderer = new THREE.WebGLRenderer();
const render_w = 640;
const render_h = 480;
renderer.setSize(render_w, render_h);
renderer.setViewport(0, 0, render_w, render_h);
document.body.appendChild(renderer.domElement);

const camera_ar = new THREE.PerspectiveCamera(45,render_w / render_h, 1, 500);
camera_ar.position.set(0, 0, 100); // 밑에 OrbitControls를 쓰게되면 여기서부터는 카메라를 사용하지 않음
camera_ar.up.set(-1000, 1, 0);
camera_ar.lookAt(0, 0, 0);

const scene = new THREE.Scene();
const texture_bg = new THREE.VideoTexture( videoElement );
scene.background = texture_bg;

const light = new THREE.DirectionalLight( 0xffffff, 1.0 );
const amb_light = new THREE.AmbientLight( 0xffffff, 0.5 );
light.position.set(0, 0, 100);
scene.add(light);
scene.add(amb_light);

var mouseMesh;
let line;
let matLine;
var mouse = {
    x: 0,
    y: 0
};

let SCREEN_WIDTH = 640;
let SCREEN_HEIGHT = 480;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

let container, stats;
let camera, sceneO, rendererO, mesh;
let cameraRig, activeCamera, activeHelper;
let cameraPerspective, cameraOrtho;
let cameraPerspectiveHelper, cameraOrthoHelper;
const frustumSize = 600;

init();
animate();

animateO();

const geometry = new LineGeometry();
geometry.setPositions(0 /*positions*/ );
geometry.setColors(0xFFFFFF /*colors*/ );

matLine = new LineMaterial( {

  color: 0xffffff,
  linewidth: 5, // in world units with size attenuation, pixels otherwise
  vertexColors: true,

  //resolution:  // to be set by renderer, eventually
  dashed: false,
  alphaToCoverage: true,

} );
line = new Line2( geometry, matLine );
line.computeLineDistances();
line.scale.set( 1, 1, 1 );
scene.add( line );

let oval_point_mesh = null;
let oval_line = null;
let face_mesh = null;



function ProjScale(p_ms, cam_pos, src_d, dst_d) {
  let vec_cam2p = new THREE.Vector3().subVectors(p_ms, cam_pos);
  return new THREE.Vector3().addVectors(cam_pos, vec_cam2p.multiplyScalar(dst_d/src_d));
}
function onResults2(results) {
      // Create a circle around the mouse and move it
  // The sphere has opacity 0
  var mouseGeometry = new THREE.SphereGeometry(1, 100, 100);
  var mouseMaterial = new THREE.MeshLambertMaterial({});
  mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);

  mouseMesh.position.set(0, 0, 0);
  scene.add(mouseMesh);

  // When the mouse moves, call the given function
  document.addEventListener('mousemove', onMouseMove, false);
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      //console.log(landmarks);
      // FACEMESH_FACE_OVAL landmarks

      if(oval_point_mesh == null) {
        let oval_point_geo = new THREE.BufferGeometry();
        const num_oval_points = FACEMESH_FACE_OVAL.length;
        const oval_vertices = [];
        for(let i = 0; i < num_oval_points; i++){
          const index = FACEMESH_FACE_OVAL[i][0];
          const pos_ns = landmarks[index];
          const pos_ps = new THREE.Vector3((pos_ns.x - 0.5) * 2, -(pos_ns.y - 0.5) * 2, pos_ns.z);
          let pos_ws = new THREE.Vector3(pos_ps.x, pos_ps.y, pos_ps.z).unproject(camera_ar);
          //oval_vertices[i] = pos_ws;
          oval_vertices.push(pos_ws.x, pos_ws.y, pos_ws.z);
        }
        const point_mat = new THREE.PointsMaterial( {color: 0xFF0000, size: 3} );
        oval_point_geo.setAttribute('position', new THREE.Float32BufferAttribute( oval_vertices, 3 ) );
        let oval_line_geometry = new THREE.BufferGeometry();
        oval_line_geometry.setAttribute('position',
          new THREE.BufferAttribute( new Float32Array(num_oval_points*3), 3 ) );
        console.log(landmarks);

        let face_geometry = new THREE.BufferGeometry();
        face_geometry.setAttribute('position', new THREE.Float32BufferAttribute( landmarks.length * 3, 3));
        face_geometry.setAttribute('normal', new THREE.Float32BufferAttribute( landmarks.length * 3, 3));
        face_geometry.setAttribute('uv', new THREE.Float32BufferAttribute( landmarks.length * 2, 2));
        
        let face_material = new THREE.MeshPhongMaterial({color:0xFFFFFF,
          specular: new THREE.Color(0,0,0), shininess: 1});
        face_mesh = new THREE.Mesh(face_geometry, face_material);
        face_mesh.geometry.setIndex(TRIANGULATION);

        oval_line = new THREE.Line(oval_line_geometry, new THREE.LineBasicMaterial({color:0x00FF00}));
        oval_point_mesh = new THREE.Points(oval_point_geo, point_mat);
        scene.add(oval_point_mesh);
        scene.add(oval_line);
        scene.add(face_mesh);
      }

      const p_c = new THREE.Vector3(0, 0, 0).unproject(camera_ar);
      const vec_cam2center = new THREE.Vector3().subVectors(p_c, camera_ar.position);
      const center_dist = vec_cam2center.length();

      const num_oval_points = FACEMESH_FACE_OVAL.length;
      let positions = oval_point_mesh.geometry.attributes.position.array;
      
      for(let i = 0; i < num_oval_points; i++){
        const index = FACEMESH_FACE_OVAL[i][0];
        const pos_ns = landmarks[index];
        const pos_ps = new THREE.Vector3((pos_ns.x - 0.5) * 2, -(pos_ns.y - 0.5) * 2, pos_ns.z);
        let pos_ws = new THREE.Vector3(pos_ps.x, pos_ps.y, pos_ps.z).unproject(camera_ar);
        
        pos_ws = ProjScale(pos_ws, camera_ar.position, center_dist, 100.0 );

        positions[3 * i + 0] = pos_ws.x;
        positions[3 * i + 1] = pos_ws.y;
        positions[3 * i + 2] = pos_ws.z;
      }
      oval_line.geometry.attributes.position.array = positions;
      oval_line.geometry.attributes.position.needsUpdate = true;
      oval_point_mesh.geometry.attributes.position.needsUpdate = true;

      const num_points = landmarks.length;
      for(let i = 0; i < num_points; i++){
        const pos_ns = landmarks[i];
        const pos_ps = new THREE.Vector3((pos_ns.x - 0.5) * 2, -(pos_ns.y - 0.5) * 2, pos_ns.z);
        let pos_ws = new THREE.Vector3(pos_ps.x, pos_ps.y, pos_ps.z).unproject(camera_ar);
        pos_ws = ProjScale(pos_ws, camera_ar.position, center_dist, 100.0 );
        
        face_mesh.geometry.attributes.position.array[3 * i + 0] = pos_ws.x;
        face_mesh.geometry.attributes.position.array[3 * i + 1] = pos_ws.y;
        face_mesh.geometry.attributes.position.array[3 * i + 2] = pos_ws.z;
        face_mesh.geometry.attributes.uv.array[2 * i + 0] = pos_ns.x;
        face_mesh.geometry.attributes.uv.array[2 * i + 1] = 1.0 - pos_ns.y;
      }
      face_mesh.geometry.attributes.position.needsUpdate = true;
      face_mesh.geometry.attributes.uv.needsUpdate = true;
      face_mesh.geometry.computeVertexNormals();

      let texture_frame = new THREE.CanvasTexture(results.image);
      face_mesh.material.map = texture_frame;

      light.target = face_mesh;
      
  
    }

  }



  renderer.render( scene, camera_ar );
  canvasCtx.restore();
}

const faceMesh = new FaceMesh({locateFile: (file) => {
  return `./node_modules/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults2);

videoElement.play();

async function detectFrame() {
  await faceMesh.send({image: videoElement});
  videoElement.requestVideoFrameCallback(detectFrame);
}
// Follows the mouse event
function onMouseMove(event) {

    // Update the mouse variable
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    // Make the sphere follow the mouse
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera_ar);
    var dir = vector.sub(camera_ar.position).normalize();
    var distance = -camera_ar.position.z / dir.z;
    var pos = camera_ar.position.clone().add(dir.multiplyScalar(distance));
    //mouseMesh.position.copy(pos);
  
    light.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z + 2));
  }
function animate() {
    requestAnimationFrame(animate);
    render();
  }
  
  // Rendering function
  function render() {
  
    // For rendering
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera_ar);
  }

detectFrame();



function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    
	sceneO = new THREE.Scene(); 

				//

	camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );
	camera.position.z = 2500;

	cameraPerspective = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 150, 1000 );

	cameraPerspectiveHelper = new THREE.CameraHelper( cameraPerspective );
	sceneO.add( cameraPerspectiveHelper );

				//
	cameraOrtho = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000 );

	cameraOrthoHelper = new THREE.CameraHelper( cameraOrtho );
	sceneO.add( cameraOrthoHelper );

				//

	activeCamera = cameraPerspective;
	activeHelper = cameraPerspectiveHelper;


				// counteract different front orientation of cameras vs rig

	cameraOrtho.rotation.y = Math.PI;
	cameraPerspective.rotation.y = Math.PI;

	cameraRig = new THREE.Group();

	cameraRig.add( cameraPerspective );
	cameraRig.add( cameraOrtho );

	sceneO.add( cameraRig );

				//
    //const sceneO = new THREE.sceneO();
    //const texture_bg = new THREE.VideoTexture( videoElement );
    //sceneO.background = texture_bg;
	mesh = new THREE.Mesh(
		//new THREE.SphereGeometry( 100, 16, 8 ),
		//new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
        
	);
	//sceneO.add( mesh ); // 여기에 사진 넣기

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
	sceneO.add( particles );

				//



	rendererO = new THREE.WebGLRenderer( { antialias: true } );
	rendererO.setPixelRatio( window.devicePixelRatio );
	rendererO.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	container.appendChild( rendererO.domElement );

	rendererO.autoClear = false;

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

	rendererO.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	
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


  renderer.autoClear = false;
  renderer.clear();
  renderer.render(scene, camera_ar);

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

	rendererO.clear();

	activeHelper.visible = false;

	//rendererO.setViewport( 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
	//rendererO.render( sceneO, activeCamera ); // 여기가 왼쪽부분

	activeHelper.visible = true;

	rendererO.setViewport( SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT );
	//rendererO.setViewport( SCREEN_WIDTH, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	rendererO.render( sceneO, camera );

}
