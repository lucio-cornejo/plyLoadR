HTMLWidgets.widget({

  name: 'plyLoadeR',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {

        // TODO: code to render the widget, e.g.

        var renderer, camera, cameraTarget, controls, scene;

        if (x.new === false) {
          // Load PLY file
          loadPLY(x.paths, el.id);
        } else {
          init(x.paths, el.id);
          animate();
        }
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});