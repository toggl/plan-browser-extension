var View = require('ampersand-view');
var api = require('../../api/api');

var TaskView = View.extend({

  template: require('./task_view.hbs'),

  render: function() {
    api.fetchAccounts()
      .then(function(accounts) {
        console.log(accounts);
      }, function(error) {
        console.error(error);
      });

    this.renderWithTemplate(this);
    return this;
  }

});

module.exports = TaskView;
