import * as THREE from "three";
//import { HDRLoader } from "three/addons/loaders/HDRLoader";
//import { DragControls } from "three/addons/controls/DragControls";
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { MapControls } from "three/addons/controls/MapControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    40,
    viewport.width / viewport.height,
    0.1,
    1000
);
//camera.position.z = 5
camera.position.y = 15
//camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.fog = new THREE.FogExp2( 0xcccccc, 0.020 );
				scene.background = new THREE.Color( 0x1e2528 );



const renderer = new THREE.WebGLRenderer();
renderer.setSize(viewport.width, viewport.height);
document.body.appendChild(renderer.domElement);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/v1/decoders/"
)

const materiel = new THREE.MeshNormalMaterial();

const imageloader = new THREE.TextureLoader();
const texture = imageloader.load("texture/Runeterra_Map.png");
texture.colorSpace = THREE.SRGBColorSpace;

const imagematerial = new THREE.MeshBasicMaterial({
    map: texture
});
const loader = new GLTFLoader();

loader.setDRACOLoader(dracoLoader);
loader.load("testmap.glb", (gltf) => {
    console.log(gltf)
    gltf.scene.traverse((child) => {
       if (child.isMesh) {
            child.material = imagematerial;
        }
    });
    console.log(gltf.scene.children[0])
    gltf.scene.children[0].scale.setScalar(25)
    gltf.scene.children[0].rotation.y = -Math.PI/2 ;

    scene.add(gltf.scene);
    renderer.render(scene, camera);
});

const mapControls = new MapControls( camera, renderer.domElement)
mapControls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
}
//console.log(scrollPos)

mapControls.minDistance = 2;
				mapControls.maxDistance = 30;
mapControls.maxPolarAngle = Math.PI / 2;
mapControls.zoomToCursor = true;
//mapControls.pan(1, 1)
mapControls.addEventListener('scroll', (event) => {
    //camera.position.y = 0
camera.position.z = 15
})
mapControls.enableRotate = false;

console.log({})
window.onresize = () =>{
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;

    camera.aspect = viewport.width / viewport.height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(viewport.width, viewport.height);
    renderer.render(scene, camera);
};

function animate(){
    mapControls.update();

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
renderer.render(scene, camera); 