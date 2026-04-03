import * as THREE from "three";
//import { HDRLoader } from "three/addons/loaders/HDRLoader";
//import { DragControls } from "three/addons/controls/DragControls";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { createLimitPan } from "@ocio/three-camera-utils";
import { OrbitControls } from "three/examples/jsm/Addons.js";

let scrollProgress = 1;
let OFFSET = 100;
let MIN = 80;
let MAX = 550;
let panOffsetZ = 0;
let prevTargetZ = 0;
const viewport = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40,
  viewport.width / viewport.height,
  0.1,
  10000,
);

//camera.position.z = 5
camera.position.set(0, 350, -200);
//camera.position.y = 15;
//camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.fog = new THREE.FogExp2(0xcccccc, 0.02);
scene.background = new THREE.Color(0x1e2528);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(viewport.width, viewport.height);
document.body.appendChild(renderer.domElement);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

const materiel = new THREE.MeshNormalMaterial();
const imageloader = new THREE.TextureLoader();
const texture = imageloader.load("texture/color.png");
texture.colorSpace = THREE.SRGBColorSpace;

const imagematerial = new THREE.MeshPhysicalMaterial({
  map: texture,
  wireframe: true,
});

const loader = new GLTFLoader();

loader.setDRACOLoader(dracoLoader);
loader.load("testmap2.glb", (gltf) => {
  //console.log(gltf);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = imagematerial; //new THREE.MeshNormalMaterial();
    }
  });

  console.log(gltf.scene.children[0]);
  gltf.scene.children[0].scale.setScalar(350);
  gltf.scene.children[0].rotation.y = -Math.PI / 2;

  scene.add(gltf.scene);
  renderer.render(scene, camera);
});

const gridHelper = new THREE.GridHelper(10, 20);
const axesHelper = new THREE.AxesHelper(5);
gridHelper.position.y = -0.5;
scene.add(gridHelper, axesHelper);

const mapControls = new MapControls(camera, renderer.domElement);
mapControls.mouseButtons = {
  LEFT: THREE.MOUSE.PAN,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.ROTATE,
};
//console.log(scrollPos)

mapControls.minDistance = 50;
mapControls.maxDistance = 600;
mapControls.maxPolarAngle = Math.PI / 2;
mapControls.screenSpacePanning = false;
mapControls.enableRotate = false;
mapControls.enableZoom = false;

//mapControls.pan(1, 1)
window.addEventListener("wheel", (event) => {
  scrollProgress += event.deltaY * 0.0001;
  scrollProgress = Math.max(0, Math.min(1, scrollProgress));
});
//const limitPan = createLimitPan({camera, mapControls, THREE})
//mapControls.addEventListener('change', e => {
//limitPan({maxX:2, maxZ: 2})
//})

window.onresize = () => {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;

  camera.aspect = viewport.width / viewport.height;
  camera.updateProjectionMatrix();

  renderer.setSize(viewport.width, viewport.height);
  renderer.render(scene, camera);
};

function animate() {
  mapControls.update();
  panOffsetZ += mapControls.target.z - prevTargetZ;
  //mapControls.target.z = panOffsetZ + scrollProgress * -200 + OFFSET;
  prevTargetZ = mapControls.target.z;

  //const distance = MIN + scrollProgress * (MAX - MIN);
  //const direction = camera.position.clone().sub(mapControls.target).normalize();
  //camera.position.copy(mapControls.target).addScaledVector(direction, distance);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
renderer.render(scene, camera);
