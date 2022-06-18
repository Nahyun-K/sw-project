import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setViewport(0,0,window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100); // 밑에 OrbitControls를 쓰게되면 여기서부터는 카메라를 사용하지 않음
camera.up.set(0, 1, 0);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls( camera, renderer.domElement ); // 카메라 들어감
controls.update();

const scene = new THREE.Scene();

const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometry = new THREE.BufferGeometry().setFromPoints(points); // geometry 버퍼를 만든것
const material = new THREE.LineBasicMaterial({color : 0xFFFFff});
const line = new THREE.Line(geometry, material); // geometry 라인 만들어주기

const geo_box = new THREE.BoxGeometry( 5, 5, 5 );
const texture = new THREE.TextureLoader().load( './test3.jpg' );
const material_box = new THREE.MeshBasicMaterial( {map: texture, color:0xFFFFFF } );
const boxObj = new THREE.Mesh(geo_box, material_box);
boxObj.matrixAutoUpdate = false;


scene.add(line);
scene.add(boxObj);

function modifyText(e) {
    const t2 = document.getElementById("mytest");

    //boxObj.position.set( 0, 0, 80 );
    //boxObj.up.set( 0, -1, 0 );
    //boxObj.lookAt( 0, 100, 100 );

    console.log("dog : " + THREE.MathUtils.degToRad(180));

    let mat_rot = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad( 45 ));
    boxObj.matrix = new THREE.Matrix4().makeTranslation(0, 0, 80).multiply(mat_rot);
}
// 이미지 계속해서 불러오기
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate(); // 이걸 해줘야 이미지 계속해서 불러와짐
