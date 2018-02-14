const View = require('ampersand-view');
const Dropdown = require('./dropdown');
const template = require('./field.hbs');

module.exports = View.extend({
  template,

  props: {
    value: 'string',
    isFocused: 'boolean',
    isEditable: ['boolean', true, true],
    items: 'array',
    label: 'string',
    getItemTemplate: 'any'
  },

  derived: {
    placeholder: {
      deps: ['isFocused', 'isEditable'],
      fn() {
        if (this.isFocused) {
          return 'Search...';
        } else if (this.isEditable) {
          return 'Choose...';
        } else {
          return '--';
        }
      }
    }
  },

  events: {
    'click .searchable-select-field--controls': 'startEditing',
    'focus input': 'onFocus',
    'blur input': 'onBlur',
    'input input': 'onChange',
    'keydown input': 'onKeyPress',
  },

  bindings: {
    isFocused: {
      type: 'booleanClass',
      name: 'searchable-select-field--focus'
    },
    placeholder: {
      type: 'attribute',
      name: 'placeholder',
      selector: 'input'
    },
    isEditable: [
      {
        type: 'booleanClass',
        selector: 'input',
        name: 'icon-chevron'
      },
      {
        type: 'booleanAttribute',
        name: 'disabled',
        selector: 'input',
        invert: true
      },
      {
        type: 'booleanClass',
        selector: '.searchable-select-field--controls',
        yes: 'row--bordered',
      },
    ]
  },

  render() {
    this.renderWithTemplate(this);
    this.dropdown = new Dropdown({
      items: this.items,
      getItemTemplate: this.getItemTemplate,
    });
    this.listenTo(this.dropdown, 'select', this.onSelect);
    this.renderSubview(this.dropdown);
  },

  onFocus() {
    this.isFocused = true;

    this.dropdown.update(this.getInputValue());
    this.dropdown.listAll();
    this.dropdown.show();
  },

  onBlur() {
    this.isFocused = false;
    this.dropdown.hide();
  },

  onChange() {
    this.dropdown.update(this.getInputValue());
    this.dropdown.listMatching();
    this.dropdown.show();
  },

  onKeyPress(event) {
    switch (event.keyCode) {
      case 38:
        event.preventDefault();
        this.dropdown.goUp();
        break;
      case 40:
        event.preventDefault();
        this.dropdown.goDown();
        break;
      case 13:
        event.preventDefault();
        event.stopPropagation();
        this.dropdown.useSelected();
        break;
    }
  },

  onSelect(value) {
    this.dropdown.hide();
    this.setInputValue(value);
    this.trigger('select');
    this.query('input').blur();
  },

  getInputValue() {
    return this.query('input').value;
  },

  setInputValue(value) {
    this.query('input').value = value;
    this.value = value;
  },

  startEditing() {
    this.query('input').focus();
  },
});
