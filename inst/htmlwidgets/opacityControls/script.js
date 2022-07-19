function OpacityControls (identifier) {
  // Get this canvas's slider
  let slide = document.getElementById(identifier + "Slider");
  // Get this canvas's opacity buttons
  let opacityButtons = [...slide.nextElementSibling.children];

  // Trigger "input" event when a opacity button is clicked
  opacityButtons.forEach(item => {
    item.addEventListener('click', function () {
      slide.value = this.dataset.child;
      // Trigger input event for the slider
      slide.dispatchEvent(new Event('input', {bubbles:true}));
    })
  });

  // Update opacity in graphics when slider changes
  slide.addEventListener("input", function () {
    updateOpacity(identifier);

    let value = String(Math.round(slide.value));
    opacityButtons.forEach(el => el.classList.remove("selected"));
    opacityButtons[value - 1].classList.add('selected');
  });
};

// Update opacity values
function updateOpacity (identifier) {
  let opacityValue = Number(document.getElementById(identifier + "Slider").value);
  let plyIds = window[identifier].plyIds;

  plyIds.forEach( (plyMesh, index) => {
    if ( (index <= opacityValue) && (opacityValue <= index + 2) ) {
      plyMesh.material.opacity = Math.abs(Math.abs(opacityValue - index - 1) - 1);
    } else {
      plyMesh.material.opacity = 0;
    }
  })

  // Reorder which mesh gets rendered last
  plyIds.forEach(plyMesh => plyMesh.renderOrder = 2);
  plyIds[Math.floor(opacityValue) - 1].renderOrder = 1;
  plyIds[Math.ceil(opacityValue) - 1].renderOrder = 1;
  plyIds[Math.round(opacityValue) - 1].renderOrder = 0;
}
