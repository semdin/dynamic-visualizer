import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

camera.position.z = 20;
camera.position.x = 5;

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

let startModel, middleModel, middle2Model, endModel;
let startWidth, middleWidth, middle2Width, endWidth;
let middleModels = [];

function calculateBoundingBox(model) {
    const box = new THREE.Box3().setFromObject(model);
    return box.max.x - box.min.x;
}

// define the middle model
loader.load('models/middle.glb', function (gltf) {
    middleModel = gltf.scene;
    middleWidth = calculateBoundingBox(middleModel);
}, undefined, function (error) {
    console.error(error);
});

// define the middle2 model
loader.load('models/middle2.glb', function (gltf) {
    middle2Model = gltf.scene;
    middle2Width = calculateBoundingBox(middle2Model);
}, undefined, function (error) {
    console.error(error);
});

function loadModels() {
    loader.load('models/start.glb', function (gltf) {
        startModel = gltf.scene;
        startWidth = calculateBoundingBox(startModel);
        scene.add(startModel);

        loader.load('models/end.glb', function (gltf) {
            endModel = gltf.scene;
            endWidth = calculateBoundingBox(endModel);
            endModel.position.x = startWidth; // Position next to startModel
            scene.add(endModel);

        }, undefined, function (error) {
            console.error(error);
        });

    }, undefined, function (error) {
        console.error(error);
    });
}

function updateModels(width) {
    let totalWidth = startWidth + endWidth;
    let currentX = startWidth;

    // Clear existing middle models
    middleModels.forEach(model => scene.remove(model));
    middleModels = [];

    while (totalWidth < width) {
        if (middleModels.length % 2 === 0) {
            let model = middle2Model.clone();
            model.position.x = currentX;
            scene.add(model);
            middleModels.push(model);
            currentX += middle2Width;
            totalWidth += middle2Width;
        } else {
            let model = middleModel.clone();
            model.position.x = currentX;
            scene.add(model);
            middleModels.push(model);
            currentX += middleWidth;
            totalWidth += middleWidth;
        }
    }

    // Adjust the position of the end model
    endModel.position.x = currentX;
}

loadModels();

const rangeInput = document.getElementById('widthRange');
rangeInput.addEventListener('input', (event) => {
    const width = parseInt(event.target.value, 10);
    updateModels(width);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update the controls
    renderer.render(scene, camera);
}

animate();
