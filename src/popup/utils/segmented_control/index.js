import _ from 'lodash';
import View from 'ampersand-view';
import template from './template.dot';
import './style.scss';

const SegmentedControlView = View.extend({
  template,

  props: {
    activeSegment: 'string',
    modifiers: ['array', true, () => []],
    segments: 'array',
    themeColor: ['string', true, 'green'],
    isInline: ['boolean', true, false],
    isNew: ['boolean', true, false],
    isRounded: ['boolean', true, false],
  },

  derived: {
    modifierClasses: {
      deps: ['modifiers'],
      fn() {
        return this.modifiers
          .reduce((modClass, modifier) => {
            return `${modClass} switcher-tabs__tab--${modifier}`;
          }, '')
          .trim();
      },
    },
  },

  bindings: {
    activeSegment: {
      hook: 'segment',
      type(el, value) {
        const name = el.dataset.name;
        el.classList.toggle('switcher-tabs__tab--active', value === name);
      },
    },
    themeColor: {
      type: 'attribute',
      name: 'data-theme-color',
      hook: 'segment',
    },
    isInline: {
      type: 'booleanClass',
      yes: 'switcher-tabs--inline',
      no: '',
    },
    isNew: {
      type: 'booleanClass',
      yes: 'switcher-tabs--new',
      no: '',
    },
    isRounded: {
      type: 'booleanClass',
      yes: 'switcher-tabs--rounded',
      no: '',
    },
  },

  events: {
    'click [data-hook=segment]': 'onSegmentClick',
  },

  initialize() {
    if (!this.activeSegment) {
      this.activeSegment = _.first(this.segments).name;
    }
  },

  render() {
    this.renderWithTemplate();
  },

  onSegmentClick(event) {
    const name = event.delegateTarget.dataset.name;
    this.setSegement(name);
    this.trigger('click');
  },

  setSegement(name) {
    this.activeSegment = name;
    this.trigger('select');
  },
});

export default SegmentedControlView;
