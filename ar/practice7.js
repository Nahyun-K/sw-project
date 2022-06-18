const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


// 57 min
// 1h 24min



import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TRIANGULATION } from './triangulation.js';
import { Line2 } from './node_modules/three/examples/jsm/lines/Line2.js';
import { LineGeometry } from './node_modules/three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from './node_modules/three/examples/jsm/lines/LineMaterial.js';

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

let line;
let matLine;

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
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      //console.log(landmarks);
      /*
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
        */
      // FACEMESH_FACE_OVAL landmarks

      if(oval_point_mesh == null) {
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
        const point_mat = new THREE.PointsMaterial( {color: 0xFF0000, size: 3} );
        //oval_point_geo.setAttribute('position', new THREE.BufferAttribute( oval_vertices, 3 ) );
        oval_point_geo.setAttribute('position', new THREE.Float32BufferAttribute( oval_vertices, 3 ) );
        //oval_point_geo.setAttribute('position', 
        //    new THREE.BufferAttribute( new Float32Array(num_oval_points * 3), 3 ) );
        let oval_line_geometry = new THREE.BufferGeometry();
        //oval_line_geometry.setAttribute('position', new THREE.Float32BufferAttribute( oval_vertices, 3 ) );
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
        
        //oval_vertices[i] = pos_ws;
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
        
        //oval_vertices[i] = pos_ws;
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