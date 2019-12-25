import _ from 'lodash';
import View from 'src/popup/utils/view';
import './style.scss';

const Overlay = View.extend({
  className: 'overlay',

  defaults: {
    transparent: false,
    content: '',
    parentElement: $('body'),
  },

  initialize(options) {
    this.options = _.extend({}, this.defaults, options);
  },

  render() {
    if (this.options.transparent) {
      this.$el.addClass('transparent');
    }
    if (_.get(this, 'options.animate', true)) {
      this.$el.addClass('animate');
    }
    if (!_.isNil(this.options.level)) {
      this.$el.css({ 'z-index': this.options.level });
    }
    this.$el.html(this.options.content);

    if (this.options.configure) {
      this.options.configure(this.$el);
    }

    if (this.options.onClick) {
      this.$el.on('click', this.options.onClick);
    }

    this.options.parentElement.append(this.$el);
    _.defer(() => this.$el.css({ opacity: 1 }));
    return this.$el;
  },

  close() {
    this.remove();
  },

  remove() {
    this.$el.css({ opacity: 0 });

    setTimeout(() => {
      return View.prototype.remove.call(this);
    }, 300);
  },
});

export default Overlay;
