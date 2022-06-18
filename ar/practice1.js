import * as THREE from './node_modules/three/build/three.module.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setViewport(0,0,window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);
camera.up.set(0, 1, 0);
const scene = new THREE.Scene();

const texture = new THREE.TextureLoader().load( './test3.jpg' );
const geo_box = new THREE.BoxGeometry(5, 5, 5);
const material_box = new THREE.MeshPhongMaterial({map: texture, color: "yellow", emissive: 0x101000, specular: 0xFF0000, shininess: 1000});
const boxObj = new THREE.Mesh(geo_box, material_box);
boxObj.matrix = new THREE.Matrix4().makeTranslation(0,0,0);

boxObj.position.set(0, 5, 0);
boxObj.up.set(0, -1, 0);
boxObj.lookAt(0, 5, -1);
boxObj.matrixAutoUpdate = false;

let mat_r = new THREE.Matrix4();
boxObj.matrix = new THREE.Matrix4().makeTranslation(0,0,0);

document.addEventListener('keydown', keyPressed);

function keyPressed(e){
  var keyCode = e.which;
  switch(e.key) {
    case 'r':
        mat_r.makeRotationX(THREE.MathUtils.degToRad(3));
        boxObj.matrix.multiply(mat_r);
        break;
    case 'f':
        mat_r.makeRotationX(THREE.MathUtils.degToRad(-3));
        boxObj.matrix.multiply(mat_r);
        break;
    case 't':
        mat_r.makeRotationY(THREE.MathUtils.degToRad(3));
        boxObj.matrix.multiply(mat_r);
        break;
    case 'g':
        mat_r.makeRotationY(THREE.MathUtils.degToRad(-3));
        boxObj.matrix.multiply(mat_r);
        break;
    case 'y':
        mat_r.makeRotationZ(THREE.MathUtils.degToRad(3));
        boxObj.matrix.multiply(mat_r);
        break;
    case 'h':
        mat_r.makeRotationZ(THREE.MathUtils.degToRad(-3));
        boxObj.matrix.multiply(mat_r);
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

const light = new THREE.DirectionalLight(0xffffff, 0.7 );
light.position.set(1, 0.25, 0);
scene.add(light);
scene.add(boxObj);

renderer.render(scene, camera); 

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

var render = function() {
    requestAnimationFrame(render);
  
    renderer.render(scene, camera);
  };
  
  render();
  
  