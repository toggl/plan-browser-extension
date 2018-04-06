const View = require('ampersand-view');
const permissions = require('../../utils/permissions');
const services = require('./services.json');

const FormView = View.extend({

  template: require('./form.hbs'),

  props: {
    error: 'string'
  },

  events: {
    'click [data-hook=create]': 'onCreate'
  },

  render() {
    this.renderWithTemplate({services});
    return this;
  },

  onCreate() {
    const domain = this.queryByHook('domain').value;
    const service = this.queryByHook('service').value;

    if (Object.keys(services).indexOf(service) < 0) {
      this.error = 'Please select a service';
      return;
    }

    permissions.request(['tabs', 'webNavigation'], domain)
      .then(() => this.collection.create({
        domain,
        service
      }))
      .then(() => this.render());

    this.error = null;
  }

});

module.exports = FormView;
