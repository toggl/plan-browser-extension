const _ = require('lodash');
const View = require('ampersand-view');
const fuzzy = require('fuzzy');
const template = require('./dropdown.hbs');

const FUZZY_OPTIONS = {
  pre: '<strong>',
  post: '</strong>',
  extract(item) {
    return item.name;
  }
};

module.exports = View.extend({
  template,

  props: {
    visible: 'boolean',
    value: 'string',
    suggestions: 'array',
    items: 'array',
    selected: 'number',
    getItemTemplate: 'any'
  },

  bindings: {
    visible: {
      type: 'toggle'
    },
    isRemoveVisible: [
      {type: 'toggle', hook: 'remove'},
      {type: 'booleanAttribute', yes: 'data-visible', hook: 'remove'}
    ]
  },

  derived: {
    isExactMatch: {
      deps: ['value'],
      fn() {
        return !!_.find(
          this.items, {name: this.value}
        );
      }
    },
    isEmpty: {
      deps: ['value'],
      fn() {
        return _.isEmpty(this.value);
      }
    },
    isRemoveVisible: {
      deps: ['suggestions.length', 'value'],
      fn() {
        return this.suggestions && !this.suggestions.length;
      }
    }
  },

  events: {
    'mousedown': 'onMousedown',
    'click [data-value]': 'onSelect'
  },

  initialize() {
    this.listenTo(this, 'change:value change:suggestions', this.render);
    this.listenTo(this, 'change:selected', this.highlightSelectedRow);
  },

  render() {
    this.renderWithTemplate({
      suggestions: this.suggestions,
      value: this.value
    });
  },

  show() {
    this.visible = true;
    this.selected = null;
  },

  hide() {
    this.visible = false;
    this.selected = null;
  },

  update(value) {
    this.value = value;
    this.selected = null;
  },

  listAll() {
    this.suggestions = this.getAllItems();
    this.selected = null;
  },

  listMatching() {
    this.suggestions = this.getSuggestions();
    this.selected = null;
  },

  goUp() {
    if (!_.isNil(this.selected)) {
      if (this.selected > 0) {
        return this.selected--;
      }
    } else {
      return this.selected = this.getNumberOfRows() - 1;
    }
  },

  goDown() {
    if (!_.isNil(this.selected)) {
      if (this.selected < (this.getNumberOfRows() - 1)) {
        this.selected++;
      }
    } else {
      this.selected = 0;
    }
  },

  useSelected() {
    if (_.isNil(this.selected)) {
      return;
    }

    const rows = this.getSelectableRows();
    const { value } = rows[this.selected].dataset;
    this.trigger('select', value);
  },

  highlightSelectedRow() {
    let element;
    const iterable = this.getSelectableRows();
    for (let index = 0; index < iterable.length; index++) {
      const row = iterable[index];
      if (index === this.selected) {
        element = row;
        row.classList.add('row--bg-medium');
      } else {
        row.classList.remove('row--bg-medium');
      }
    }

    if (element) {
      this.scrollToRow(element);
    }
  },

  scrollToRow(element) {
    const { scrollTop } = this.el;
    const { scrollHeight } = this.el;
    const scrollBottom = scrollHeight - this.el.clientHeight - scrollTop;

    const elementTop = element.offsetTop;
    const elementHeight = element.clientHeight;
    const elementBottom = scrollHeight - elementHeight - elementTop;

    if (elementTop < scrollTop) {
      this.el.scrollTop = elementTop;
    } else if (elementBottom < scrollBottom) {
      this.el.scrollTop += scrollBottom - elementBottom;
    }
  },

  getSelectableRows() {
    return this.queryAll('[data-select-row][data-visible]');
  },

  getNumberOfRows() {
    let rows = this.suggestions.length;
    if (this.isRemoveVisible) {
      rows++;
    }
    return rows;
  },

  getAllItems() {
    return this
      .items.map(item => ({string: item.name, original: item}))
      .map(this.getItemTemplate);
  },

  getSuggestions() {
    if (this.value) {
      return fuzzy
        .filter(this.value, this.items, FUZZY_OPTIONS)
        .map(this.getItemTemplate);
    }
  },

  onMousedown(event) {
    event.preventDefault();
  },

  onSelect(event) {
    event.preventDefault();
    const { value } = event.delegateTarget.dataset;
    this.trigger('select', value);
  }
});
