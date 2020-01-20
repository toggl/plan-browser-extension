import View from 'ampersand-view';
import jqueryEvents from 'ampersand-view-jquery-events';
import eventFilters from './event_filters';
import * as promiseMixin from './promise_mixin';

export default View.extend(
  {
    props: {
      rendered: 'boolean',
    },

    derived: {
      $el: {
        deps: ['el'],
        fn() {
          return $(this.el);
        },
      },
    },

    extraProperties: 'allow',

    tagName: 'div',

    constructor(attrs = {}, ...args) {
      if (attrs.el) {
        if (attrs.el instanceof $) {
          attrs.el = attrs.el[0];
        }
      } else {
        attrs.el = this._createElement();
      }

      return View.call(this, attrs, ...args);
    },

    $(selector) {
      return this.$el.find(selector);
    },

    render() {
      return this;
    },

    _createElement() {
      const element = document.createElement(this.tagName);
      if (this.className) {
        $(element).addClass(this.className);
      }
      if (this.id) {
        $(element).attr({ id: this.id });
      }
      return element;
    },
  },
  jqueryEvents($),
  eventFilters,
  promiseMixin
);
