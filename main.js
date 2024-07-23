import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Add lights
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 ); // soft white light
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
directionalLight.position.set( 10, 10, 10 ).normalize();
scene.add( directionalLight );

camera.position.z = 20;
camera.position.x = 5;

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();

let startModel, middleModel, endModel;
let startWidth, middleWidth, endWidth;

function calculateBoundingBox(model) {
    const box = new THREE.Box3().setFromObject(model);
    return box.max.x - box.min.x;
}

loader.load('models/ball.glb', function (gltf) {
    startModel = gltf.scene;
    startWidth = calculateBoundingBox(startModel);
    scene.add(startModel);

    loader.load('models/ball.glb', function (gltf) {
        middleModel = gltf.scene;
        middleWidth = calculateBoundingBox(middleModel);
        middleModel.position.x = startWidth; // Position next to startModel
        scene.add(middleModel);

        loader.load('models/ball.glb', function (gltf) {
            endModel = gltf.scene;
            endWidth = calculateBoundingBox(endModel);
            endModel.position.x = startWidth + middleWidth; // Position next to middleModel
            scene.add(endModel);
        }, undefined, function (error) {
            console.error(error);
        });

    }, undefined, function (error) {
        console.error(error);
    });

}, undefined, function (error) {
    console.error(error);
});

function animate() {
    requestAnimationFrame(animate);
	controls.update(); // Update the controls
    renderer.render(scene, camera);
}

animate();
