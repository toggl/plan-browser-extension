var View = require('ampersand-view');

var StylesheetView = View.extend({

  props: {
    stylesheet: 'string'
  },

  render: function() {
    this.el = document.createElement('style');

    var stylesheetTextNode = document.createTextNode(this.stylesheet);
    this.el.appendChild(stylesheetTextNode);

    return this;
  }

});

module.exports = StylesheetView;
