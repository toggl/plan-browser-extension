import View from 'ampersand-view';

export default View.extend({
  template: '<div class=\'color-picker__color-circle\'></div>',

  props: {
    color: 'state',
    parentView: 'state',
    onSelect: 'any',
  },

  derived: {
    iconClass: {
      deps: ['parentView.selectedColorId', 'color.id', 'color.isLight'],
      fn() {
        const {
          color: { id, isLight },
          parentView: { selectedColorId },
        } = this;

        return id === selectedColorId
          ? isLight
            ? 'icon-checkmark'
            : 'icon-checkmark-action'
          : null;
      },
    },
  },

  bindings: {
    'color.hex': {
      type(el, value) {
        el.style['background-color'] = value;
      },
    },

    'color.id': {
      type: 'attribute',
      name: 'data-color-id',
    },

    iconClass: {
      type: 'class',
    },
  },

  events: {
    click: 'chooseColor',
  },

  chooseColor() {
    this.onSelect(this.color.id);
  },
});
