import * as THREE from './node_modules/three/build/three.module.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setViewport(0,0,window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);
camera.up.set(0, 1, 0);
const scene = new THREE.Scene();

const texture = new THREE.TextureLoader().load( './test3.jpg' );
const geo_box = new THREE.BoxGeometry(5, 5, 5);
const material_box = new THREE.MeshPhongMaterial({map: texture, color: 0xFFFFff, emissive: 0x101000, specular: 0xFF0000, shininess: 1000}); // 0323일에 한 곳
const boxObj = new THREE.Mesh(geo_box, material_box);

boxObj.position.set(0, 5, 0);
boxObj.up.set(0, 1, 0);
boxObj.lookAt(0, 5, -1);
boxObj.matrixAutoUpdate = false;
let mat_r = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(-30));
boxObj.matrix = new THREE.Matrix4().makeTranslation(0, 0, 80).multiply(mat_r);
let mat_y = new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(-40));
boxObj.matrix = new THREE.Matrix4().makeTranslation(0, 0, 80).multiply(mat_y);

const light = new THREE.DirectionalLight(0xffffff, 0.5 );

scene.add(light);

scene.add(boxObj);
renderer.render(scene, camera);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

