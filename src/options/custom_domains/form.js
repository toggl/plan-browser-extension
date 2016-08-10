var View = require('ampersand-view');
var permissions = require('../../utils/permissions');
var services = require('./services.json');

var DOMAIN_RE = /((?:\w+\.)*\w+)/;

var FormView = View.extend({

  template: require('./form.hbs'),

  props: {
    error: 'string'
  },

  events: {
    'click [data-hook=create]': 'onCreate'
  },

  render: function() {
    this.renderWithTemplate({services: services});
    return this;
  },

  onCreate: function() {
    var self = this;

    var domain = this.queryByHook('domain').value;
    var service = this.queryByHook('service').value;

    if (Object.keys(services).indexOf(service) < 0) {
      this.error = 'Please select a service';
      return;
    }

    var matches = DOMAIN_RE.exec(domain);

    if (matches == null) {
      this.error = 'Please enter a valid domain, e.g. mydomain.com';
      return;
    }

    domain = matches[1];

    permissions.request(['tabs', 'webNavigation'], domain)
      .then(function() {
        return self.collection.create({
          domain: domain,
          service: service
        });
      })
      .then(function() {
        self.render();
      });

    this.error = null;
  }

});

module.exports = FormView;
