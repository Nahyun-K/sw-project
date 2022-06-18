import * as THREE from './node_modules/three/build/three.module.js';

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );
camera.up.set(0,1,0);
var scene = new THREE.Scene();

const texture = new THREE.TextureLoader().load( './test3.jpg' );
var geom = new THREE.BoxGeometry(10, 10, 10);
var mat = new THREE.MeshBasicMaterial({ map: texture, color: 0x4743ba ,emissive: 0x571bff, specular: 0xFF0000, shininess: 10000 }); // 생성하고자 하는 구조체의 재질을 가리킴
var cube = new THREE.Mesh(geom, mat);

scene.add(cube);

var light = new THREE.AmbientLight( 0x404040 );
scene.add( light );


var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
scene.add( directionalLight );
var xSpeed = 0.0001;
var ySpeed = 0.0001;

document.addEventListener('keydown', keyPressed);

function keyPressed(e){
  var keyCode = e.which;
  switch(e.key) {
    case 'r':
      cube.rotateX(3);
      break;
    case 'f':
      cube.rotateX(-3);
      break;
    case 't':
      cube.rotateY(3);
      break;
    case 'g':
      cube.rotateY(-3);
      break;
    case 'y':
      cube.rotateZ(3);
      break;
    case 'h':
      cube.rotateZ(-3);
      break;
    case 'a':
      camera.translateX(10);
      break;
    case 'd':
      camera.translateX(-10);
      break;
    case 'w':
      camera.translateY(-10);
      break;
    case 's':
      camera.translateY(10);
      break;
      
  }
  e.preventDefault();
  render();
}

var render = function() {
  requestAnimationFrame(render);

  renderer.render(scene, camera);
};

render();

