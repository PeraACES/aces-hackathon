import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three';

let mouseX = 0, mouseY = 0;
let model1;
let model2;
let mixer1;
let mixer2;
const clock = new THREE.Clock();

// Initialize scene, camera, and renderer
const container = document.getElementById('three-container');
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.setFocalLength(20);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(width, height);
renderer.setClearColor(0x000000, 0); // transparent
container.appendChild(renderer.domElement);

// Load the GLB model
const loader = new GLTFLoader();
loader.load('./assets/models/cube.glb', (gltf) => {
    model1 = gltf.scene;
    model1.scale.set(1, 1, 1); // optional: adjust scale
    model1.position.set(12, -2.5, 0); // optional: adjust position
    scene.add(model1);

    if (gltf.animations && gltf.animations.length > 0) {
        mixer1 = new THREE.AnimationMixer(model1);
        gltf.animations.forEach((clip) => {
        mixer1.clipAction(clip).play();
        });
    }

    model1.traverse((child) => {
      if(child.name == 'cube001') {
        child.material = new THREE.MeshPhysicalMaterial({
            color: 0x06ff0c,
            roughness: 0,
            transmission: 1,
            thickness: 0.01,
            ior: 1.5,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });
      }
    })
});

loader.load('./assets/models/cube.glb', (gltf) => {
    model2 = gltf.scene;
    model2.scale.set(1, 1, 1); // optional: adjust scale
    model2.position.set(-10, 2, 2); // optional: adjust position
    scene.add(model2);

    if (gltf.animations && gltf.animations.length > 0) {
        mixer2 = new THREE.AnimationMixer(model2);
        gltf.animations.forEach((clip) => {
        mixer2.clipAction(clip).play();
        });
    }

    model2.traverse((child) => {
      if(child.name == 'cube001') {
        child.material = new THREE.MeshPhysicalMaterial({
            color: 0x06ff0c,
            roughness: 0,
            transmission: 1,
            thickness: 0.01,
            ior: 1.5,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });
      }
    })
});

// Track mouse position
window.addEventListener('mousemove', (event) => {
  const rect = container.getBoundingClientRect();
  mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
});

function animate() {
    if (model1) {
        model1.rotation.x = -mouseY * Math.PI / 3 - 0.3; // Adjust rotation based on mouse position
        model1.rotation.y = Math.max(-Math.PI / 1.7, Math.min(mouseX * Math.PI / 3 - 1.5));
        model1.rotation.z = model1.rotation.x * 0.5
    }
    if (model2) {
        model2.rotation.x = -mouseY * Math.PI / 3 + 0.3; // Adjust rotation based on mouse position
        model2.rotation.y = Math.min(Math.PI / 2, Math.max(mouseX * Math.PI / 3 + 1.5));
        model2.rotation.z = -model2.rotation.x * 0.5
    }
    const delta = clock.getDelta();

    if (mixer1) {
        mixer1.update(delta); // advance animation time
    }
    if (mixer2) {
        mixer2.update(delta); // advance animation time
    }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Handle resize
window.addEventListener('resize', () => {
  const newWidth = container.clientWidth;
  const newHeight = container.clientHeight;
  renderer.setSize(newWidth, newHeight);
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
});

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader()
  .setPath('https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/examples/textures/equirectangular/')
  .load('royal_esplanade_1k.hdr', function(hdrTexture) {
    const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    scene.environment = envMap;
    scene.background = null; // keep background transparent
    hdrTexture.dispose();
    pmremGenerator.dispose();
  });