const Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('is_selected', function(a, b) {
  return a === b ? 'selected' : '';
});
