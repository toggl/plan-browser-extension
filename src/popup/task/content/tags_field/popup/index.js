import AmpersandView from 'ampersand-view';

import css from './style.module.scss';
import template from './template.dot';
import Suggestions from 'src/models/suggestion_collection';
import SuggestionItemView from './suggestion';
import TagView from '../tag';
import keycode from 'keycode';
import FilteredCollection from 'ampersand-filtered-subcollection';
import { createTag } from 'src/popup/utils/helpers';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';
import _bindAll from 'lodash/bindAll';
import _isNil from 'lodash/isNil';
import fuzzy from 'fuzzy';

const FUZZY_OPTIONS = {
  pre: '<strong>',
  post: '</strong>',
  extract(item) {
    return item.name;
  },
};

export default AmpersandView.extend({
  template,
  css,

  props: {
    task: 'state',
    workspace: 'state',
    selected: 'any',
    options: 'any',
  },

  session: {
    available: 'any',
    randomColorId: 'number',
    searchTerm: 'string',
    isFocused: 'boolean',
    isCreatingTag: 'boolean',
    selectedSuggestionIndex: 'number',
  },

  derived: {
    isExactMatch: {
      deps: ['searchTerm', 'otherMembers.models'],
      fn() {
        return !!_find(
          this.available.models,
          model =>
            model.name.toUpperCase() === this.searchTerm.trim().toUpperCase()
        );
      },
    },
    isEmpty: {
      deps: ['searchTerm'],
      fn() {
        return _isEmpty(this.searchTerm);
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
        return !this.isAddVisible ? 'SELECT TAGS' : 'NO TAGS FOUND';
      },
    },
    addButtonlabel: {
      deps: ['searchTerm'],
      fn() {
        return `Create '${this.searchTerm}' tag`;
      },
    },
    addButtonColorClass: {
      deps: ['randomColorId'],
      fn() {
        return `color-${this.randomColorId}`;
      },
    },
  },

  collections: {
    suggestions: Suggestions,
  },

  events: {
    'click [data-hook=add]': 'onCreateTag',
    'focus input': 'onFocus',
    'input input': 'onInput',
    'click [data-hook="tag:remove"]': 'onRemoveTag',
    keydown: 'onContainerKeyPress',
  },

  bindings: {
    isAddVisible: {
      type: 'toggle',
      hook: 'add',
    },
    heading: {
      type: 'text',
      hook: 'heading',
    },
    addButtonlabel: {
      type: 'text',
      hook: 'add',
    },
    addButtonColorClass: {
      type: 'class',
      hook: 'add',
    },
    'suggestions.length': {
      type: 'toggle',
      hook: 'suggestions',
    },
  },

  initialize() {
    this.bindMethods();
    this.setSessionVariables();
    this.addEventListeners();
  },

  bindMethods() {
    _bindAll(this, 'highlightSelectedRow');
  },

  setSessionVariables() {
    this.available = new FilteredCollection(this.options, {
      filter: model => {
        return !this.task.tag_ids.includes(model.id);
      },
    });
    this.generateRandomColor();
    this.listAll();
  },

  addEventListeners() {
    this.listenToAndRun(this.task, 'change:tag_ids', () => {
      this.available?._runFilters();
      this.onUpdateCollection();
    });

    this.listenTo(
      this,
      'change:selectedSuggestionIndex',
      this.highlightSelectedRow
    );
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
    if (!_isNil(this.selectedSuggestionIndex)) {
      if (this.selectedSuggestionIndex > 0) {
        return this.selectedSuggestionIndex--;
      }
    } else {
      return (this.selectedSuggestionIndex = this.getNumberOfRows() - 1);
    }
  },

  goDown() {
    if (!_isNil(this.selectedSuggestionIndex)) {
      if (this.selectedSuggestionIndex < this.getNumberOfRows() - 1) {
        this.selectedSuggestionIndex++;
      }
    } else {
      this.selectedSuggestionIndex = 0;
    }
  },

  async useSelected() {
    if (!_isNil(this.selectedSuggestionIndex)) {
      const rows = this.getSelectableRows();
      const {
        dataset: { modelId },
      } = rows[this.selectedSuggestionIndex];
      this.onAddTag(this.getModel({ id: parseInt(modelId) }));
    } else if (this.isAddVisible) {
      this.onCreateTag();
    }
  },

  getSelectableRows() {
    return this.queryAll('[data-model-id]');
  },

  getNumberOfRows() {
    return this.suggestions.length;
  },

  getAllItems() {
    return this.available.models.map(item => ({
      string: item.name,
      original: item,
    }));
  },

  getModel(query) {
    return _find(this.options.models, query);
  },

  getSuggestions() {
    return fuzzy.filter(this.searchTerm, this.available.models, FUZZY_OPTIONS);
  },

  generateRandomColor() {
    this.randomColorId = this.workspace.colors.getRandomPresetColor()?.id ?? 30;
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

  onUpdateCollection() {
    this.searchTerm ? this.listMatching() : this.listAll();
    this.render();
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
      this.isEmpty &&
      -1 !== ['backspace', 'delete'].indexOf(keycode(event))
    ) {
      return this.onRemoveLastTag(event);
    }

    this.onInputKeyPress(event);
  },

  onInputKeyPress(event) {
    switch (event.keyCode || event.which) {
      case 9:
        event.preventDefault();
        this.close();

        if (event.shiftKey) {
          this.tabToPreviousElement();
        } else {
          this.tabToNextElement();
        }

        break;
      case 38:
        event.preventDefault();
        this.goUp();
        break;
      case 40:
        event.preventDefault();
        this.goDown();
        break;
      case 13:
        event.preventDefault();
        event.stopPropagation();
        this.useSelected();
        break;
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

  async onCreateTag() {
    const { plan_id } = this.task;
    const name = this.searchTerm;
    const color_id = this.randomColorId;

    if (!plan_id || !name?.length) {
      return;
    }

    this.isCreatingTag = true;

    try {
      const attributes = { name, color_id, plan_id };
      const plan = this.workspace.projects.findWhere({ id: plan_id });
      const model = await createTag(plan, attributes);

      if (model) {
        this.onAddTag(model);
      }

      this.generateRandomColor();
    } catch (error) {
      console.error(error);
    } finally {
      this.isCreatingTag = false;
    }
  },

  onAddTag(model) {
    const id = model.id;
    const tagIds = this.selected.models.map(o => o.id);

    if (!tagIds.includes(id)) {
      this.save([...tagIds, id]);
    }
  },

  onRemoveTag(event) {
    event.preventDefault();
    const id = +event.delegateTarget.dataset.id;
    const tagIds = this.selected.models.map(o => o.id);
    const index = tagIds.indexOf(id);

    if (~index) {
      tagIds.splice(index, 1);
      this.save(tagIds);
    }
  },

  onRemoveLastTag(event) {
    event.preventDefault();
    const tagIds = this.selected.models.map(o => o.id);
    tagIds.pop();
    this.save(tagIds);
  },

  render() {
    this.renderTags();
    this.renderWithTemplate();
    this.renderCollection(
      this.suggestions,
      SuggestionItemView,
      this.queryByHook('suggestions'),
      {
        viewOptions: {
          onSelect: model => this.onAddTag(model),
        },
      }
    );

    setTimeout(() => {
      const el = this.queryByHook('input');
      el.focus();
    }, 0);
  },

  renderTags() {
    this.tags = this.selected.models
      .map(model => {
        const view = new TagView({
          model,
          canRemove: true,
        });
        view.render();
        return view.el.outerHTML;
      })
      .join('');
  },

  save(tagIds = []) {
    this.resetInput();
    this.task.tag_ids = tagIds;
  },

  resetInput() {
    this.queryByHook('input').value = this.searchTerm = '';
  },

  close() {
    this.trigger('close');
  },
});
