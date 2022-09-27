function loadPLY(x, index, identifier) {
  if (index < x.paths.length) {
    const loader = new THREE.PLYLoader();
    loader.load(x.paths[index], function (geometry) {
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        wireframe: x.isWireframe[index],
        transparent: x.isTransparent[index],
        opacity: x.opacity[index],
        vertexColors: true
        // vertexColors: THREE.VertexColors
      });

      const mesh = new THREE.Mesh(geometry, material);
      // mesh.scale.multiplyScalar(0.035);
      window[identifier]["scene"].add(mesh);

      // Now that this ply file has finished
      // loading, load the next one.
      loadPLY(x, index + 1, identifier);
    });
  }
}

function init(x, identifier) {
  window[identifier] = {};
  const widgetDiv = document.getElementById(identifier);

  /*
    Delete possible HTML elements repetitions due to
    an issue when using plyLoadR() in a Shiny app
  */
  // Remove extra canvas elements
  while (widgetDiv.firstElementChild) {
    widgetDiv.removeChild(widgetDiv.firstElementChild);
  }
  // Remove extra inputs of type range or button
  const widgetDivContainer = widgetDiv.parentNode;
  while (widgetDivContainer.childElementCount > 1) {
    widgetDivContainer.removeChild(widgetDivContainer.lastElementChild);
  }

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
  controls = new THREE.TrackballControls(
    window[identifier]["camera"], widgetDiv.firstChild
  );
  window[identifier]["controls"] = controls;
  
  // Axes
  // window[identifier]["scene"].add( new THREE.AxesHelper( 20 ) );

  // Lights
  window[identifier]["scene"].add(
    new THREE.HemisphereLight("rgb(255, 255, 255)", "rgb(255, 255, 255)")
  );

  /* 
    Functions to access camera and/or controls settings 
  */
  function rKeys(obj, path = "") {
    if (
      obj !== null &&
      !Array.isArray(obj) &&
      typeof obj === 'object'
    ) { } else { return path; }
  
    return Object.keys(obj).map(
      key => rKeys(obj[key], path ? [path, key].join(".") : key)
    );
  }
  
  function objectPaths(obj) { 
    return rKeys(obj).toString().split(",");
  }

  /* 
    Update relevant settings for camera and/or controls
  */
  if (x.camera) {
    // Set new settings for camera
    for (const keyPath of objectPaths(x.camera)) {
      let oldSettings = camera;
      let newSettings = x.camera;
      
      const arr = keyPath.split(".");
      while (arr.length > 1) {
        oldSettings = oldSettings[arr[0]];
        newSettings = newSettings[arr[0]];
        arr.shift();
      }
      
      oldSettings[arr[0]] = newSettings[arr[0]];
    }
  }
  if (x.controls) {
    // Set new settings for TrackballControls
    for (const keyPath of objectPaths(x.controls)) {
      let oldSettings = controls;
      let newSettings = x.controls;
      
      const arr = keyPath.split(".");
      while (arr.length > 1) {
        oldSettings = oldSettings[arr[0]];
        newSettings = newSettings[arr[0]];
        arr.shift();
      }
      
      oldSettings[arr[0]] = newSettings[arr[0]];
    }
  }

  if (x.toggleMeshes) {
    /* 
      Set label of each mesh's opacity button 
    */
    let meshLabels;
    if (x.toggleMeshes.labels) {
      meshLabels = x.toggleMeshes.labels;
    } else {
      meshLabels = [...Array(x.paths.length).keys()];
    }
    
    /* 
      Insert slider for opacity control of mesh evolution 
    */
    if (
      x.toggleMeshes.showEvolution !== undefined && 
      x.toggleMeshes.showEvolution === true
    ) {
      let opacityControlsHTML = 
        '<input id="' + identifier + 'Slider'
        + '" class="opacity-slider plyLoadR" type="range"'
        + 'min="1" ' + `max=${x.paths.length}` 
        + ' step="0.05" value="1" >\n';
      
      // Insert div for opacity buttons
      opacityControlsHTML += 
        '<div class="opacity-buttons-section plyLoadR">\n'

      opacityControlsHTML +=
        '  <input type="button" class="opacity-button selected"'
        + ' data-child="1' + '" value="' 
        + meshLabels[0] + '" >\n';

      // Insert remaining buttons
      for (let i=1; i < x.paths.length; i++) {
        opacityControlsHTML += 
          '  <input type="button" class="opacity-button"'
          + 'data-child="' + String(i+1) + '" value="'
          + meshLabels[i] + '" >\n';
      }
    
      opacityControlsHTML += '</div>\n';

      widgetDiv.parentNode.insertAdjacentHTML(
        "beforeend", opacityControlsHTML
      );

      // Hide opacity slider if there is only one ply file
      if (x.paths.length === 1) {
        document.getElementById(identifier + "Slider")
          .style.display = "none";
      }
    } 
    
    /*
      Toggle meshes' opacity as 0 or 1, via buttons
    */
    if (
      x.toggleMeshes.showEvolution !== "undefined" &&
      x.toggleMeshes.showEvolution === false
    ) {
      // Insert div for opacity buttons
      let opacityControlsHTML = 
        '<div class="opacity-buttons-section plyLoadR">\n'

      opacityControlsHTML +=
        '  <input type="button" class="opacity-button selected"'
        + ' data-child="1' + '" value="' 
        + meshLabels[0] + '" >\n';

      // Insert remaining buttons
      for (let i=1; i < x.paths.length; i++) {
        opacityControlsHTML += 
          '  <input type="button" class="opacity-button"'
          + 'data-child="' + String(i+1) + '" value="'
          + meshLabels[i] + '" >\n';
      }
    
      opacityControlsHTML += '</div>\n';

      widgetDiv.parentNode.insertAdjacentHTML(
        "beforeend", opacityControlsHTML
      );
    }
  }

  // Load PLY files
  loadPLY(x, 0, identifier);
  
  let plyLoadComplete = setInterval(
    function () {
      // Get every mesth type object
      let plyIds = window[identifier].scene
        .children.filter(obj => obj.type === "Mesh");

      // Only show loading progress messages if 
      // the user has specified to show them.
      if (x.showLoadingProgress) {
        tempAlert(
          "Loading complete till " + 
          `${Math.round(100 * plyIds.length / x.paths.length)}%`,
          1500, identifier
        );
      }

      if (plyIds.length === x.paths.length) {
        window[identifier].plyIds = plyIds;
        updateOpacity(identifier);
        OpacityControls(identifier);
        clearInterval(plyLoadComplete);
      }
    }, 2000
  );
}

// Message 
function tempAlert(msg, duration, identifier) {
  const el = document.createElement("div");
  el.setAttribute(
    "style",
    "position: absolute; top: 0; right: 0; " + 
    "color: white; background-color: crimson;" +
    "margin: 0; padding: 15px;"
  );
  el.innerHTML = msg;
  setTimeout(() => el.remove(), duration);
  document.getElementById(identifier).appendChild(el);
}

// Resize every canvas created via plyLoadR, and their containers
window.addEventListener("resize", function () {
  const containers = [...document.querySelectorAll(".plyLoadR > canvas")];
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

/* Display basic json as an R list */ 
function objectToRList(obj) {
  let RList = JSON.stringify(obj);
  // Transform characters in order to
  // match the R list representation
  RList = RList.replaceAll("{", "list(");
  RList = RList.replaceAll("}", ")");
  RList = RList.replaceAll("\"", "");
  RList = RList.replaceAll(":", " = ");
  RList = RList.replaceAll(",", ", ");

  return RList;
}

/* 
  Get values necessary to replicate
  manually altered camera settings 
*/
function getCurrentPerspective(identifier) {
  const camera = window[identifier]["camera"];
  const controls = window[identifier]["controls"];

  let position = objectToRList(camera.position);
  let target = objectToRList(controls.target);
  let up = objectToRList(camera.up);
  
  console.log("%ccamera.position", "color: green;");
  console.log(position);
  console.log("%ccamera.up", "color: green;");
  console.log(up);
  console.log("%ccontrols.target", "color: green;");
  console.log(target);
}
