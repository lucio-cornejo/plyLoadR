HTMLWidgets.widget({

  name: 'plyLoadR',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {
        init(x, el.id);
        animate(el.id);
      },
      
      resize: function(width, height) {
        
        // TODO: code to re-render the widget with a new size
      }

    };
  }
});