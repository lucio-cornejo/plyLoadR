function loadPLY(paths, index) {
  let loader = new THREE.PLYLoader();
  loader.load(paths[index], function (geometry) {
    geometry.computeVertexNormals();
    
    let material = new THREE.MeshStandardMaterial({
        wireframe: false,
        opacity: 1,
        transparent: true,
        vertexColors: THREE.VertexColors
      });
    
    let mesh = new THREE.Mesh(geometry, material);
    // mesh.scale.multiplyScalar(0.035);
          
    scene.add(mesh);
  });
}

function init(identifier, paths) {
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth / 1.715, window.innerHeight / 1.715);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  document.querySelector("#"+identifier).appendChild( renderer.domElement );

  // Camera
  camera = new THREE.PerspectiveCamera(
    35, window.innerWidth / window.innerHeight,
    1, 1000
  );
  camera.position.set(25, 25, 25);

  cameraTarget = new THREE.Vector3(0, 0, 0);
  camera.lookAt(cameraTarget);

  // Camera controls
  controls = new THREE.TrackballControls( camera, renderer.domElement );

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(10%, 10%, 10%)");

  // Lights
  // scene.add( new THREE.AxesHelper( 20 ) );
  scene.add(new THREE.HemisphereLight("rgb(255, 255, 255)", "rgb(255, 255, 255)"));

  // Load PLY files
  for(let i=0; i < paths.length; i++) {
    loadPLY(paths, i);
  }

  // resize
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / 1.715, window.innerHeight / 1.715);
}

function animate() {
  requestAnimationFrame( animate );  
  controls.update();
  renderer.render(scene, camera);
}