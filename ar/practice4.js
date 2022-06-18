import * as THREE from './node_modules/three/build/three.module.js';

// first 5 lines are a template and should be pretty much the same always
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// end template here

// 생성하고자하는 구조체
var geom = new THREE.BoxGeometry(10, 10, 10); //  생성하고자 하는 구조체를 가리킴 사각형 삼각형 원
var mat = new THREE.MeshBasicMaterial({color: "red"}); // 생성하고자 하는 구조체의 재질을 가리킴
var cube = new THREE.Mesh(geom, mat); // 다각형 기반 객체를 나타내는 클래스 geometry와 material을 합쳐서 만듦

scene.add(cube);
// 카메라의 3차원상 z축 위치, 값이 클수록 더 높은 곳에서 봄
camera.position.x = 2;
camera.position.y = 1;
camera.position.z = 20;

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

// White directional light at 70% intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
scene.add( directionalLight );
var xSpeed = 0.0001;
var ySpeed = 0.0001;
var x_axis = new THREE.Vector3( 1, 0, 0 );


var quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI / 2);
const vector = new THREE.Vector3(1,0,0);
vector.applyQuaternion(quaternion);


var rotation_speed = 0.01;
camera.position.applyQuaternion(quaternion.setFromAxisAngle(x_axis, rotation_speed));
camera.up.applyQuaternion(quaternion.setFromAxisAngle(x_axis, rotation_speed));



// movement
/*
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // up
    if (keyCode == 87) {
        cube.position.y += 10;
        // down
    } else if (keyCode == 83) {
        cube.position.y -= 10;
        // left
    } else if (keyCode == 65) {
        cube.position.x -= 10;
        // right
    } else if (keyCode == 68) {
        cube.position.x += 10;
        // space
    } else if (keyCode == 32) {
        cube.position.set(0, 0, 0);
    }
    render();
}
*/
/*
document.addEventListener('keydown', keyPressed);
function keyPressed(e){
  var keyCode = e.which;
  switch(e.key) {
    case 'ArrowUp':
        cube.rotateX(3);
        break;
    case 'ArrowDown':
        cube.rotateX(-3);
        break;
    case 'ArrowLeft':
        cube.rotateY(3);
        break;
    case 'ArrowRight':
        cube.rotateY(-3);
        break;
  }
  e.preventDefault();
  render();
}*/
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
      camera.translateX(-10);
      break;
    case 'd':
      camera.translateX(10);
      break;
    case 'w':
      camera.translateY(10);
      break;
    case 's':
      camera.translateY(-10);
      break;
      
  }
  e.preventDefault();
  render();
}

var render = function() {
  requestAnimationFrame(render);
  // 회전 속도
  /*
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  */

  renderer.render(scene, camera);
};

render();


//https://velog.io/@jisubin12/three.js-1

/*

//const renderer = new THREE.WebGL1Renderer();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setViewport(0,0,window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100); // 카메라 만들기 camera도 object camera space
camera.lookAt(0, 0, 0); // 랜더링할 때 카메라 이용
camera.up.set(0, 1, 0);
const scene = new THREE.Scene();

//const points = [];
//points.push(new THREE.Vector3(-10, 0, 0));
//points.push(new THREE.Vector3(0, 10, 0));
//points.push(new THREE.Vector3(10, 0, 0));

//const geometry = new THREE.BufferGeometry().setFromPoints(points); // geometry 버퍼를 만든것
//const material = new THREE.LineBasicMaterial({color : 0xFFFFff});
//const line = new THREE.Line(geometry, material); // geometry 라인 만들어주기
// box geometry

const texture = new THREE.TextureLoader().load( './test3.jpg' );
const geo_box = new THREE.BoxGeometry(5, 5, 5);
//const material_box = new THREE.MeshBasicMaterial( {map: texture} );
// MeshBasic -> Phong으로 바꿀시 light이 필요
const material_box = new THREE.MeshPhongMaterial({map: texture, color: 0xFFFFff, emissive: 0x101000, specular: 0xFF0000, shininess: 1000}); // 0323일에 한 곳
// 빛이 정확하게 어느쪽에 있는지 알게 됨 ㅁㅊㅁㅊ texture도 반영 됐음!!!! 오오오오옹!
const boxObj = new THREE.Mesh(geo_box, material_box);

// 이건 디폴트 값으로 들어가 있는데 그냥 써줌
//line.position.set(0, 5, 0); // line의 object와 같음 여기 생각보다 찌그러짐 이유? 알면 보너스 점수 // 찌그러지는 이유 lookAt을 봐야함 object시점에서 바라보는 방향 00-1을 보고 있음
//line.up.set(0, 1, 0); // y축 1일때 -1일때 서로 뒤집어져서 보임
//line.lookAt(0, 5, -1); // -z축 방향
//line.matrixAutoUpdate = false;
//let mat_r = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(-70));
//line.matrix = new THREE.Matrix4().makeTranslation(0, 10, 0); // -z축 그대로 올라감

//let mat_r = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(-70));
//line.matrix = new THREE.Matrix4().makeTranslation(0, 10, 0).multiply(mat_r); // -z축 그대로 올라감


boxObj.position.set(0, 5, 0); // line의 object와 같음 여기 생각보다 찌그러짐 이유? 알면 보너스 점수 // 찌그러지는 이유 lookAt을 봐야함 object시점에서 바라보는 방향 00-1을 보고 있음
boxObj.up.set(0, 1, 0); // y축 1일때 -1일때 서로 뒤집어져서 보임
boxObj.lookAt(0, 5, -1); // -z축 방향
boxObj.matrixAutoUpdate = false;
let mat_r = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(-40));
boxObj.matrix = new THREE.Matrix4().makeTranslation(0, 0, 80).multiply(mat_r);

const light = new THREE.DirectionalLight(0xffffff, 0.5 ); // mesh phong 라이트 필요

scene.add(light); // 매우 잘 나옴^^

//scene.add(line);
scene.add(boxObj);
renderer.render(scene, camera);  //

// 이미지 계속해서 불러오기
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate(); // 이걸 해줘야 이미지 계속해서 불러와짐

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_cube.html


// https://gist.github.com/jeromeetienne/1106726


*/
