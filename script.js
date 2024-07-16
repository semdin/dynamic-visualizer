// Sahneyi, kamerayı ve renderlayıcıyı oluşturun
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); // Arka plan rengini beyaz yap
document.body.appendChild(renderer.domElement);

// OrbitControls ekleyin
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Yumuşak hareket
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Işık ekleyin
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

let model;

// Dosya girişi olayını dinleyin
document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target.result;
            const loader = new THREE.GLTFLoader();
            loader.parse(contents, '', (gltf) => {
                if (model) {
                    scene.remove(model);
                }
                model = gltf.scene;
                scene.add(model);

                // Model boyutlarını alın
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3()).length();
                const center = box.getCenter(new THREE.Vector3());

                // Modeli merkeze yerleştirin
                model.position.x += (model.position.x - center.x);
                model.position.y += (model.position.y - center.y);
                model.position.z += (model.position.z - center.z);

                // Kamerayı modele göre ayarlayın
                camera.position.copy(center);
                camera.position.x += size / 2.0;
                camera.position.y += size / 5.0;
                camera.position.z += size / 2.0;
                camera.lookAt(center);

                controls.update();
                render();
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

// Ölçekleme butonuna tıklama işlevi
document.getElementById('scaleButton').addEventListener('click', () => {
    if (model) {
        model.scale.x *= 2;
        model.scale.y *= 2;
        model.scale.z *= 2;
    }
});

// Pencere boyutu değiştiğinde yeniden boyutlandırma işlevi
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Render işlevi
function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}

render();
