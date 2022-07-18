function loadPLY(x, index, identifier) {
  let loader = new THREE.PLYLoader();
  loader.load(x.paths[index], function (geometry) {
    geometry.computeVertexNormals();
    
    let material = new THREE.MeshStandardMaterial({
        wireframe: false,
        opacity: 1,
        transparent: false,
        vertexColors: THREE.VertexColors
      });

    let mesh = new THREE.Mesh(geometry, material);
    // mesh.scale.multiplyScalar(0.035);
          
    window[identifier]["scene"].add(mesh);

    if (x.settings) {
      if ('isWireframe' in x.settings) {
        window[identifier].scene.children.at(-1)
          .material.wireframe = x.settings.isWireframe[index];
      }
      if ('opacity' in x.settings) {
        window[identifier].scene.children.at(-1)
          .material.opacity = x.settings.opacity[index];
      }
      if ('isTransparent' in x.settings) {
        window[identifier].scene.children.at(-1)
          .material.transparent = x.settings.isTransparent[index];
      }
    }
  });
}

function init(x, identifier) {
  window[identifier] = {};
  let widgetDiv = document.getElementById(identifier);
  
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.setSize(window.innerWidth / 1.715, window.innerHeight / 1.715);
  renderer.setSize(window.innerWidth / 1.776, window.innerHeight / 1.586);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  widgetDiv.appendChild( renderer.domElement );

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(10%, 10%, 10%)");
  window[identifier]["scene"] = scene;
  window[identifier]["renderer"] = renderer;
  
  // Camera
  camera = new THREE.PerspectiveCamera(
    35, window.innerWidth / window.innerHeight,
    1, 1000
  );
  camera.position.set(25, 25, 25);
  // cameraTarget = new THREE.Vector3(0, 0, 0);
  // camera.lookAt(cameraTarget);
  window[identifier]["camera"] = camera;

  // Camera controls
  controls = new THREE.TrackballControls(window[identifier]["camera"], widgetDiv.firstChild);
  window[identifier]["controls"] = controls;
  
  // Axes
  // window[identifier]["scene"].add( new THREE.AxesHelper( 20 ) );

  // Lights
  window[identifier]["scene"].add(
    new THREE.HemisphereLight("rgb(255, 255, 255)", "rgb(255, 255, 255)")
  );

  // Load PLY file
  for (let index = 0; index < x.paths.length; index++) {
    loadPLY(x, index, identifier);
  }

  // resize
  window.addEventListener("resize", onWindowResize(identifier), false);
}

function onWindowResize(identifier) {
  window[identifier]["camera"].aspect = window.innerWidth / window.innerHeight;
  window[identifier]["camera"].updateProjectionMatrix();
  window[identifier]["renderer"].setSize(window.innerWidth / 1.715, window.innerHeight / 1.715);
}

function animate(identifier) {
  requestAnimationFrame( function () { animate(identifier) } );  
  window[identifier]["controls"].update();
  window[identifier]["renderer"].render(
    window[identifier]["scene"], window[identifier]["camera"]
  );
}
