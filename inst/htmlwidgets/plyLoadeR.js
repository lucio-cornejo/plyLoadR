HTMLWidgets.widget({

  name: 'plyLoadeR',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {

        // TODO: code to render the widget, e.g.

        el.innerText = x.message;
        
        // ['https://drive.google.com/uc?export=download&id=1ru8Ezy452cRoNhO8WRq4s-WU3PEz6l-3']

        init(el.id, x.paths);
        animate();

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});