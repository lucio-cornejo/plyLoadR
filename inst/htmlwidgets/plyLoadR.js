HTMLWidgets.widget({

  name: 'plyLoadR',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function (x) {

        // TODO: code to render the widget, e.g.
        init(x, el.id);
        // init(x.paths, el.id);
        animate(el.id);
      },

      resize: function (width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});