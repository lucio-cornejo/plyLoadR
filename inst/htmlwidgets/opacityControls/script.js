function OpacityControls(identifier) {
  // Get this canvas's opacity buttons
  let opacityButtons = document.querySelectorAll(
    "div:has(#" + identifier + ") .opacity-button"
  );

  // Get this canvas's slider (it may not exist)
  let slide = document.getElementById(identifier + "Slider");

  /* 
    Handle opacity depending on 'opacity slider' existence 
  */
  if (slide) {
    // Trigger "input" event when a opacity button is clicked
    opacityButtons.forEach(item => {
      item.addEventListener('click', function() {
        slide.value = this.dataset.child;
        // Trigger input event for the slider
        slide.dispatchEvent(new Event('input', { bubbles:true }));
      })
    });
  
    // Update opacity in graphics when slider changes
    slide.addEventListener("input", function () {
      updateOpacity(identifier);
  
      let value = String(Math.round(slide.value));
      opacityButtons.forEach(el => el.classList.remove("selected"));
      opacityButtons[value - 1].classList.add('selected');
    });
  } else {
    // Get meshes whose visibility will be altered
    let plyIds = window[identifier].plyIds;

    // Only color visibility buttons when clicked or hovered
    opacityButtons.forEach(el => el.classList.remove("selected"));

    // The 'opacityButtons' will only alter visibility, not opacity
    opacityButtons.forEach(
      item => item.addEventListener(
        "click", 
        function(event) {
          // Get selected mesh's relevant index
          const MeshChildPosition = Math.round(
            Number(event.target.dataset.child) - 1
          );

          // Toggle visibility of selected mesh
          plyIds[MeshChildPosition].material.visible = 
            !plyIds[MeshChildPosition].material.visible;
        }
      )
    );
  }

};

// Update opacity values
function updateOpacity(identifier) {
  try {
    let pseudoOpacity = Number(document.getElementById(identifier + "Slider").value);
    let plyIds = window[identifier].plyIds;
    
    plyIds.forEach( (plyMesh, index) => {
      if ( (index <= pseudoOpacity) && (pseudoOpacity <= index + 2) ) {
        plyMesh.material.opacity = Math.abs(Math.abs(pseudoOpacity - index - 1) - 1);
      } else {
        plyMesh.material.opacity = 0;
      }
    });

    // Reorder which mesh gets rendered last
    plyIds.forEach(plyMesh => plyMesh.renderOrder = 2);
    plyIds[Math.floor(pseudoOpacity) - 1].renderOrder = 1;
    plyIds[Math.ceil(pseudoOpacity) - 1].renderOrder = 1;
    plyIds[Math.round(pseudoOpacity) - 1].renderOrder = 0;
  } catch(error) {
    // Most likely, this error would only occur if the slider is not present,
    // but that's something that the user controls, so we don't need to do anything
  }
}
