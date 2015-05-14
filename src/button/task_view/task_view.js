var View = require('ampersand-view');

var TaskView = View.extend({

  template: require('./task_view.dom'),

  render: function() {
    this.renderWithTemplate(this);
    return this;
  }

});

module.exports = TaskView;
