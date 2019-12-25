import _ from 'lodash';
import View from 'src/popup/utils/view';
import './style.scss';

const Popup = View.extend({
  className: 'xpopup',

  defaults: {
    content: {
      render() {
        return '';
      },
    },
    position: '',
    shadow: false,
  },

  initialize(options) {
    this.options = _.extend({}, this.defaults, options);
    if (this.options.shadow) {
      this.$el.addClass('shadow');
    }

    // this.listenTo(hub, 'shortcut:close', () => {
    //   this.options.onEscape();
    // });
  },

  render() {
    if (!_.isNil(this.options.level)) {
      this.$el.css({ 'z-index': this.options.level });
    }

    this.options.content.render();
    const content = $('<div class="content"></div>').html(
      this.options.content.el
    );
    this.$el
      .html(content)
      .addClass(this.options.name)
      .addClass(this.options.direction);

    if (this.options.configure) {
      this.options.configure(this.$el);
    }

    if (this.options.modifiers) {
      const modifiers = this.options.modifiers.map(mod => `xpopup--${mod}`);
      this.$el.addClass(modifiers.join(' '));
    }

    this.$el.append("<div class='xpopup__arrow'></div>");
    $('body').append(this.$el);
    this.$tooltip = this.$el.find('.xpopup__arrow');

    if (this.options.hideArrow) {
      this.$tooltip.css({ display: 'none' });
    }

    // hub.trigger('scroll:disable', this.cid);

    this.listenTo(this.options.content, 'close', this.remove);
    return this.$el;
  },

  remove() {
    this.$tooltip = null;
    // hub.trigger('scroll:enable', this.cid);
    View.prototype.remove.call(this);
  },
});

export default Popup;
