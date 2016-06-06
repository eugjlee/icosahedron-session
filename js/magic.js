var camera, scene, renderer;
var geometry, geometry2, geometry3, mesh2, mesh3, material, mesh;

var speedX = 0.01;
var speedY = 0.01;

var orVertices = [];

var light2, light3;

var materials = [];
var currMaterial = 0;

var meshes = [];
var currMesh = 0;

var init = function() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;

    scene = new THREE.Scene();

    geometry = new THREE.IcosahedronGeometry(100, 1);
    geometry3 = new THREE.OctahedronGeometry(100, 1);
    geometry2 = new THREE.BoxGeometry(100, 100, 100, 2, 2, 2);
    material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading,
        wireframe: false
    });

    materials.push(material);
    materials.push(new THREE.MeshLambertMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading,
        wireframe: true
    }));

    for (var i = 0; i < geometry.vertices.length; i++) {
        orVertices.push(geometry.vertices[i].clone());
    }

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    meshes.push(mesh);
    meshes.push(new THREE.Mesh(geometry2, material));
    meshes.push(new THREE.Mesh(geometry3, material));
    //meshes.push(new THREE.Mesh(new THREE.TorusKnotGeometry( 100, 10, 4, 4 ),material));

    var light = new THREE.HemisphereLight(0xffffff, 0x010101, 1);
    scene.add(light);

    light2 = new THREE.PointLight(0xff0000, 1);
    light2.position.x = -1000;
    light2.position.y = -1000;
    scene.add(light2);

    light3 = new THREE.PointLight(0x00ff00, 1);
    light3.position.x = -1000;
    light3.position.y = -1000;
    scene.add(light3);

}

var animate = function() {

    requestAnimationFrame(animate);

    meshes[currMesh].rotation.x += parent.volume * 0.0003;
    meshes[currMesh].rotation.y += parent.volume * 0.0001;

    if (parent.volume > 100 && Math.random() > 0.99) {
        scene.remove(meshes[currMesh]);
        currMesh++;
        if (currMesh >= meshes.length) {
            currMesh = 0;
        }

        scene.add(meshes[currMesh]);
    }

    var geom = meshes[currMesh].geometry;

    if (parent.streamData.length > geom.vertices.length) {
        for (var i = 0; i < parent.streamData.length; i += Math.floor(parent.streamData.length / geom.vertices.length)) {
            //geometry.vertices[i].x = orVertices[i].x;
            if (geom.vertices[i] && parent.streamData[i]) {
                geom.vertices[i].x = orVertices[i].x * (parent.streamData[i] / 200 + 1);
                geom.vertices[i].y = orVertices[i].y * (parent.streamData[i] / 200 + 1);
                geom.vertices[i].z = orVertices[i].z * (parent.streamData[i] / 200 + 1);
            }
        }
    } else {
        for (var i = 0; i < geom.vertices.length; i += Math.floor(geom.vertices.length / parent.streamData.length)) {
            //geometry.vertices[i].x = orVertices[i].x;
            if (geom.vertices[i] && parent.streamData[i]) {
                geom.vertices[i].x = orVertices[i].x * (parent.streamData[i] / 100 + 1);
                geom.vertices[i].y = orVertices[i].y * (parent.streamData[i] / 100 + 1);
                geom.vertices[i].z = orVertices[i].z * (parent.streamData[i] / 100 + 1);
            }
        }
    }

    geom.verticesNeedUpdate = true;

    if (parent.volume > 100 && Math.random() > 0.8) {
        currMaterial++;
        if (currMaterial >= materials.length) {
            currMaterial = 0;
        }

        meshes[currMesh].material = materials[currMaterial];
    }

    light2.position.x = Math.sin(Date.now() * 0.001) * 1000;
    light2.position.y = Math.sin(Date.now() * 0.001) * 1000;
    light2.position.z = Math.sin(Date.now() * 0.001) * 1000;

    light3.position.x = Math.sin(Date.now() * 0.002 + 2.2) * 1000;
    light3.position.y = Math.sin(Date.now() * 0.002 + 2.2) * 1000;
    light3.position.z = Math.sin(Date.now() * 0.002 + 2.2) * 1000;

    var scale = (parent.volume / 255) + 1;
    meshes[currMesh].scale.set(scale, scale, scale);

    renderer.render(scene, camera);
}

init();
animate();
