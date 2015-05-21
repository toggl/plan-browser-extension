var View = require('ampersand-view');
var State = require('ampersand-state');
var api = require('../../api/api');
var ButtonView = require('../button/button_view');
var PopupView = require('../popup/popup_view');

var ContainerView = View.extend({

  template: require('./container_view.hbs'),

  props: {
    hub: 'state'
  },

  initialize: function() {
    var Hub = State.extend({});
    this.hub = new Hub();
    
    this.listenTo(this.hub, 'popup:open', this.showPopup);
  },

  render: function() {
    this.renderWithTemplate();

    var button = new ButtonView({ hub: this.hub });
    this.renderSubview(button);

    this.showPopup();

    return this;
  },

  showPopup: function() {
    var popup = new PopupView({ hub: this.hub });
    this.renderSubview(popup);
  }

});

module.exports = ContainerView;
