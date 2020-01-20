import _ from 'lodash';
import keycode from 'keycode';
import View from 'ampersand-view';
import fuzzy from 'fuzzy';
import template from './template.dot';
import css from './style.module.scss';
import { Suggestions } from './model';
import SuggestionItemView from './suggestion-item';

const FUZZY_OPTIONS = {
  pre: '<strong>',
  post: '</strong>',
  extract(item) {
    return item.name;
  },
};

export default View.extend({
  template,
  css,

  props: {
    searchTerm: 'string',
    isFocused: 'boolean',
    isEditing: 'boolean',
    selectedSuggestionIndex: 'number',
    parent: ['object', true],
  },

  collections: {
    suggestions: Suggestions,
  },

  bindings: {
    isAddVisible: [{ type: 'toggle', hook: 'add' }],
    isEditing: [
      { type: 'toggle', hook: 'tag', invert: true },
      { type: 'toggle', hook: 'input' },
    ],
    'parent.selectedModel.name': {
      type: 'text',
      hook: 'tag-label',
    },
    heading: {
      type: 'text',
      hook: 'heading',
    },
    'parent.addButtonlabel': {
      type: 'text',
      hook: 'add',
    },
    'suggestions.length': {
      type: 'toggle',
      hook: 'suggestions',
    },
    showRemove: {
      type: 'toggle',
      hook: 'tag-remove',
    },
  },

  derived: {
    isExactMatch: {
      deps: ['searchTerm'],
      fn() {
        return !!this.getModel(
          model =>
            model.name.toUpperCase() === this.searchTerm.trim().toUpperCase()
        );
      },
    },
    isEmpty: {
      deps: ['searchTerm'],
      fn() {
        return _.isEmpty(this.searchTerm);
      },
    },
    isAddVisible: {
      deps: ['isEmpty', 'isExactMatch'],
      fn() {
        return !this.isEmpty && !this.isExactMatch;
      },
    },
    heading: {
      deps: ['isAddVisible'],
      fn() {
        return (!this.isAddVisible
          ? `SELECT ${this.parent.labelName}`
          : `NO ${this.parent.labelName} FOUND`
        ).toUpperCase();
      },
    },
    showRemove: {
      deps: ['parent.canRemove', 'parent.selectedModel'],
      fn() {
        return this.parent.canRemove && this.parent.selectedModel;
      },
    },
  },

  events: {
    'mousedown [data-hook=bottom]': 'onMousedown',
    'click [data-hook=add]': 'onAdd',
    'click [data-hook=tag]': 'startEditing',
    'click [data-hook=tag-remove]': 'onRemove',
    'focus input': 'onFocus',
    'input input': 'onInput',
    keydown: 'onContainerKeyPress',
  },

  subviews: {
    icon: {
      hook: 'tag-icon',
      prepareView() {
        const {
          parent: { selectedModel: model },
        } = this;
        return new this.parent.iconView({ model });
      },
    },
  },

  initialize() {
    this.listAll();
    this.listenTo(
      this,
      'change:selectedSuggestionIndex',
      this.highlightSelectedRow
    );
    this.listenTo(
      this,
      'change:parent.selectedModel',
      () => (this.icon.model = this.parent.selectedModel)
    );
  },

  startEditing() {
    this.isEditing = true;
    setTimeout(() => {
      const el = this.queryByHook('input');
      el.focus();
      if (el.value && el.setSelectionRange) {
        // move cursor to end
        const len = el.value.length * 2;
        el.setSelectionRange(len, len);
      }
    }, 0);
  },

  render() {
    this.renderWithTemplate();
    this.renderCollection(
      this.suggestions,
      SuggestionItemView,
      this.queryByHook('suggestions'),
      {
        viewOptions: {
          onSelect: model => this.onSelect(model),
        },
      }
    );
    setTimeout(() => {
      if (!(this.parent.selectedModel && this.parent.selectedModel.name)) {
        this.queryByHook('tag').click();
      } else {
        this.el.focus();
      }
    }, 0);
  },

  update(value) {
    this.searchTerm = value;
    this.selectedSuggestionIndex = null;
  },

  listAll() {
    this.suggestions.reset(this.getAllItems());
    this.selectedSuggestionIndex = null;
  },

  listMatching() {
    this.suggestions.reset(this.getSuggestions());
    this.selectedSuggestionIndex = null;
  },

  goUp() {
    if (!_.isNil(this.selectedSuggestionIndex)) {
      if (this.selectedSuggestionIndex > 0) {
        return this.selectedSuggestionIndex--;
      }
    } else {
      return (this.selectedSuggestionIndex = this.getNumberOfRows() - 1);
    }
  },

  goDown() {
    if (!_.isNil(this.selectedSuggestionIndex)) {
      if (this.selectedSuggestionIndex < this.getNumberOfRows() - 1) {
        this.selectedSuggestionIndex++;
      }
    } else {
      this.selectedSuggestionIndex = 0;
    }
  },

  async useSelected() {
    if (!_.isNil(this.selectedSuggestionIndex)) {
      const rows = this.getSelectableRows();
      const {
        dataset: { modelId },
      } = rows[this.selectedSuggestionIndex];
      await this.parent.saveTask(this.getModel({ id: parseInt(modelId) }));
      this.close();
    } else if (this.isAddVisible) {
      this.onAdd();
    }
  },

  highlightSelectedRow() {
    let element;
    const iterable = this.getSelectableRows();
    for (let index = 0; index < iterable.length; index++) {
      const row = iterable[index];
      if (index === this.selectedSuggestionIndex) {
        element = row;
        row.classList.add('active');
      } else {
        row.classList.remove('active');
      }
    }

    if (element) {
      this.scrollToRow(element);
    }
  },

  scrollToRow(element) {
    const { scrollTop, scrollHeight, clientHeight } = this.el;
    const scrollBottom = scrollHeight - clientHeight - scrollTop;

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
    return this.queryAll('[data-model-id]');
  },

  getNumberOfRows() {
    return this.suggestions.length;
  },

  getAllItems() {
    return this.parent.getCollectionItems().map(item => ({
      string: item.name,
      original: item,
    }));
  },

  getSuggestions() {
    return fuzzy.filter(
      this.searchTerm,
      this.parent.getCollectionItems(),
      FUZZY_OPTIONS
    );
  },

  onMousedown(event) {
    event.preventDefault();
  },

  async onSelect(newAttrs) {
    await this.parent.saveTask(newAttrs);
    this.close();
  },

  onFocus() {
    if (!this.parent.isEditable) {
      return;
    }

    this.isFocused = true;
  },

  onInput(e) {
    this.update(e.target.value);
    this.listMatching(e.target.value);
  },

  onContainerKeyPress(event) {
    if (
      !this.isEditing &&
      -1 !== ['backspace', 'delete'].indexOf(keycode(event))
    ) {
      return this.onRemove(event);
    }

    this.onInputKeyPress(event);
  },

  onInputKeyPress(event) {
    switch (keycode(event)) {
      case 'tab':
        event.preventDefault();
        this.close();
        if (event.shiftKey) {
          this.tabToPreviousElement();
        } else {
          this.tabToNextElement();
        }
        break;

      case 'up':
        event.preventDefault();
        this.goUp();
        break;

      case 'down':
        event.preventDefault();
        this.goDown();
        break;

      case 'enter':
        event.preventDefault();
        event.stopPropagation();
        this.useSelected();
        break;

      default:
    }
  },

  tabToPreviousElement() {
    const tabIndex = this.queryByHook('input').getAttribute('tabindex');
    const previousElement = document.querySelector(
      `[tabindex='${+tabIndex - 1}']`
    );

    if (previousElement) {
      previousElement.focus();
    }
  },

  tabToNextElement() {
    const tabIndex = this.queryByHook('input').getAttribute('tabindex');
    const nextElement = document.querySelector(`[tabindex='${+tabIndex + 1}']`);

    if (nextElement) {
      nextElement.focus();
    }
  },

  getModel(query) {
    return _.find(this.parent.getCollectionItems(), query);
  },

  async onAdd() {
    await this.parent.addModel(this.searchTerm);
    this.close();
  },

  async onRemove(event) {
    event.preventDefault();
    if (this.showRemove) {
      await this.parent.saveTask(null);
      this.render(); // todo
    }
  },

  close() {
    this.trigger('close');
  },
});
