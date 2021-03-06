function loadPLY(x, index, identifier) {
  if (index < x.paths.length) {
    const loader = new THREE.PLYLoader();
    loader.load(x.paths[index], function (geometry) {
      // geometry.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({
        wireframe: false,
        transparent: false,
        opacity: 1,
        roughness: 1,
        vertexColors: true
        // vertexColors: THREE.VertexColors
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      if (x.settings) {
        if ('isWireframe' in x.settings) {
          material.wireframe = x.settings.isWireframe[index];
        }
        if ('isTransparent' in x.settings) {
          material.transparent = x.settings.isTransparent[index];
        }
        if ('opacity' in x.settings) {
          material.opacity = x.settings.opacity[index];
        }
      }

      // mesh.scale.multiplyScalar(0.035);
      window[identifier]["scene"].add(mesh);
      loadPLY(x, index + 1, identifier);
    });
  }
}

function init(x, identifier) {
  window[identifier] = {};
  const widgetDiv = document.getElementById(identifier);
  
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(widgetDiv.clientWidth, widgetDiv.clientHeight);
  // renderer.setSize(window.innerWidth, window.innerHeight);
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
    // 35, window.innerWidth / window.innerHeight,
    35, widgetDiv.clientWidth / widgetDiv.clientHeight,
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

  // By default, do not insert controls for opacity
  activateOpacityControls = false;
  if (x.settings) {
    if ('camera' in x.settings) {
      if ('position' in x.settings.camera) {
        camera.position.x = x.settings.camera.position[0];
        camera.position.y = x.settings.camera.position[1];
        camera.position.z = x.settings.camera.position[2];
      }
    }
    if ('toggleWidgets' in x.settings) {
      if (x.settings.toggleWidgets === true) {
        // Insert slider for opacity
        let opacityControlsHTML = 
          '<input id="' + identifier + 'Slider'
          + '" class="opacity-slider" type="range"'
          + 'min="1" ' + `max=${x.paths.length}` 
          + ' step="0.05" value="1" >\n';
        
        // Insert div for opacity buttons
        opacityControlsHTML += 
          '<div class="opacity-buttons-section">\n'

        // Set labels for opacity buttons
        let toggleLabels = [...Array(x.paths.length).keys()];
        if ('toggleLabels' in x.settings) {
          toggleLabels = x.settings.toggleLabels;
        }
        opacityControlsHTML +=
          '  <input type="button" class="opacity-button selected"'
          + ' data-child="1' + '" value="' 
          + toggleLabels[0] + '" >\n';

        // Insert remaining buttons
        for (let i=1; i < x.paths.length; i++) {
          opacityControlsHTML += 
            '  <input type="button" class="opacity-button"'
            + 'data-child="' + String(i+1) + '" value="'
            + toggleLabels[i] + '" >\n';
        }
      
        opacityControlsHTML += '</div>\n';

        widgetDiv.insertAdjacentHTML(
          "beforeend",
          opacityControlsHTML
        );

        activateOpacityControls = true;
      }
    }
  }

  // Load PLY files
  loadPLY(x, 0, identifier);

  if (activateOpacityControls) {
    let plyLoadComplete = setInterval(
      function () {
        // Get every mesth type object
        let plyIds = window[identifier].scene
          .children.filter(obj => obj.type === "Mesh");
    
        if (plyIds.length === x.paths.length) {
          window[identifier].plyIds = plyIds;
          updateOpacity(identifier);
          OpacityControls(identifier);
          clearInterval(plyLoadComplete);
        }
      }, 2000
    );
  }
}

// Resize every canvas and their containers
window.addEventListener("resize", function () {
  const containers = [...document.querySelectorAll("canvas")];
  containers.forEach(canvas => {
    const container = canvas.parentNode;
    const identifier = container.id;
    window[identifier].camera.aspect = container.clientWidth / container.clientHeight;
    // window[identifier]["camera"].aspect = window.innerWidth / window.innerHeight;
    window[identifier].camera.updateProjectionMatrix();
    window[identifier].renderer.setSize(container.clientWidth, container.clientHeight);
    // window[identifier]["renderer"].setSize(window.innerWidth / 1.715, window.innerHeight / 1.715);
  });
}, false);

function animate(identifier) {
  requestAnimationFrame( function () { animate(identifier) } );  
  window[identifier]["controls"].update();
  window[identifier]["renderer"].render(
    window[identifier]["scene"], window[identifier]["camera"]
  );
}
