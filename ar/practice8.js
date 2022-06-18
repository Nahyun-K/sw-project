const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer();
const render_w = 640;
const render_h = 480;
renderer.setSize(render_w, render_h);
renderer.setViewport(0, 0, render_w, render_h);
document.body.appendChild(renderer.domElement);

const camera_ar = new THREE.PerspectiveCamera(45,render_w / render_h, 1, 500);
camera_ar.position.set(0, 0, 100); // 밑에 OrbitControls를 쓰게되면 여기서부터는 카메라를 사용하지 않음
camera_ar.up.set(0, 1, 0);
camera_ar.lookAt(0, 0, 0);

const scene = new THREE.Scene();
const texture_bg = new THREE.VideoTexture( videoElement );
scene.background = texture_bg;

let point_mesh = null;
let oval_line = null;
let face_mesh = null; // facemesh



function onResults2(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      //console.log(landmarks);
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                     {color: '#C0C0C070', lineWidth: 1});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});
        
      // FACEMESH_FACE_OVAL landmarks

      if(point_mesh == null) {
        let oval_point_geo = new THREE.BufferGeometry();
        const num_oval_points = FACEMESH_FACE_OVAL.length;
        //const oval_vertices = new Float32Array(num_oval_points);
        const oval_vertices = [];
        for(let i = 0; i < num_oval_points; i++){
          const index = FACEMESH_FACE_OVAL[i][0];
          const pos_ns = landmarks[index];
          const pos_ps = new THREE.Vector3((pos_ns.x - 0.5) * 2, -(pos_ns.y - 0.5) * 2, pos_ns.z);
          let pos_ws = new THREE.Vector3(pos_ps.x, pos_ps.y, pos_ps.z).unproject(camera_ar);
          //oval_vertices[i] = pos_ws;
          oval_vertices.push(pos_ws.x, pos_ws.y, pos_ws.z);
        }
        const point_mat = new THREE.PointsMaterial( {color: 0xFF0000, size: 0.07} );
        //oval_point_geo.setAttribute('position', new THREE.BufferAttribute( oval_vertices, 3 ) );
        oval_point_geo.setAttribute('position', new THREE.Float32BufferAttribute( oval_vertices, 3 ) );
        let oval_point_geometry = new THREE.BufferGeometry();
        //oval_point_geometry.setAttribute('position', new THREE.Float32BufferAttribute( oval_vertices, 3 ) );
        oval_point_geometry.setAttribute('position', 
          new THREE.BufferAttribute( new Float32Array(num_oval_points * 3) , 3 ) );


        let face_geometry = new THREE.BufferGeometry();
        face_geometry.setAttribute('position', new THREE.Float32BufferAttribute(landmarks.length * 3), 3);
        face_geometry.setAttribute('normal', new THREE.Float32BufferAttribute(landmarks.length * 3), 3);
        face_geometry.setAttribute('uv', new THREE.Float32BufferAttribute(landmarks.length * 3), 3);

        let face_material = new THREE.MeshBasicMaterial({color:0xFFFF00});
        face_mesh = THREE.Mesh(face_geometry, face_material);


        oval_line = new THREE.Line(oval_point_geometry, new TRHEE.LineBasicMaterail({color:0x00FF00}));
        point_mesh = new THREE.Points(oval_point_geo, point_mat);
        scene.add(point_mesh);
        scene.add(oval_line);
        scene.add(face_mesh);


      }
      const num_oval_points = FACEMESH_FACE_OVAL.length;
      let position = point_mesh.geometry.attributes.position.array;

      for(let i = 0; i < num_oval_points; i++){
        const index = FACEMESH_FACE_OVAL[i][0];
        const pos_ns = landmarks[index];
        const pos_ps = new THREE.Vector3((pos_ns.x - 0.5) * 2, -(pos_ns.y - 0.5) * 2, pos_ns.z);
        let pos_ws = new THREE.Vector3(pos_ps.x, pos_ps.y, pos_ps.z).unproject(camera_ar);
        //oval_vertices[i] = pos_ws;
        position[3 * i + 0] = pos_ws.x;
        position[3 * i + 1] = pos_ws.y;
        position[3 * i + 2] = pos_ws.z;
      }
      oval_line.geometry.attributes.position.array = positions;
      oval_line.geometry.attributes.position.needsUpdate = true;
      point_mesh.geometry.attributes.position.needsUpdate = true;

      const num_points = landmarks.length;
      for(let i = 0; i < num_points; i++){
        
        const pos_ns = landmarks[i];
        const pos_ps = new THREE.Vector3((pos_ns.x - 0.5) * 2, -(pos_ns.y - 0.5) * 2, pos_ns.z);
        let pos_ws = new THREE.Vector3(pos_ps.x, pos_ps.y, pos_ps.z).unproject(camera_ar);
        //oval_vertices[i] = pos_ws;
        face_mesh.geometry.attributes.position.array[3 * i + 1] = pos_ws.y;
        face_mesh.geometry.attributes.position.array[3 * i + 0] = pos_ws.x;
        face_mesh.geometry.attributes.position.array[3 * i + 2] = pos_ws.z;
      }
      
      face_mesh.geometry.setIndex();
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

//const camera = new Camera(videoElement, {
//  onFrame: async () => {
//    await faceMesh.send({image: videoElement});
//  },
//  width: 1280,
//  height: 720
//});
//camera.start();

videoElement.play();

async function detectFrame() {
  await faceMesh.send({image: videoElement});
  videoElement.requestVideoFrameCallback(detectFrame);
}


detectFrame();