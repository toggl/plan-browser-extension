var View = require('ampersand-view');
var State = require('ampersand-state');
var api = require('../../api/api');
var StyleView = require('../style/style_view');
var ButtonView = require('../button/button_view');
var PopupView = require('../popup/popup_view');

var ContainerView = View.extend({

  template: require('./container_view.hbs'),

  props: {
    hub: 'state',
    task: 'state'
  },

  initialize: function() {
    var Hub = State.extend({});
    this.hub = new Hub();
    
    this.listenTo(this.hub, 'popup:open', this.showPopup);
  },

  render: function() {
    this.renderWithTemplate();
    this.shadow = this.el.createShadowRoot();

    var style = new StyleView();
    this.renderSubview(style, this.shadow);

    var button = new ButtonView({ hub: this.hub });
    this.renderSubview(button, this.shadow);

    return this;
  },

  showPopup: function() {
    var popup = new PopupView({ hub: this.hub, task: this.task });
    this.renderSubview(popup, this.shadow);
  }

});

module.exports = ContainerView;
