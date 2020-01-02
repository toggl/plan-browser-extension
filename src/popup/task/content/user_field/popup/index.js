import _ from 'lodash';
import View from 'ampersand-view';
import fuzzy from 'fuzzy';
import hub from 'src/popup/utils/hub';
import { createUser } from 'src/popup/utils/helpers';
import { Suggestions, OtherMembers } from './models';
import SuggestionItemView from './suggestion_item';
import TagView from './tag_item';
import template from './template.dot';
import css from './style.module.scss';

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
    parent: ['state', true],
  },

  collections: {
    suggestions: Suggestions,
  },

  bindings: {
    isAddVisible: [{ type: 'toggle', hook: 'add' }],
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
  },

  derived: {
    isExactMatch: {
      deps: ['searchTerm', 'otherMembers.models'],
      fn() {
        return !!_.find(
          this.otherMembers.models,
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
  },

  events: {
    'mousedown [data-hook=bottom]': 'onMousedown',
    'click [data-hook=add]': 'onCreateTag',
    'focus input': 'onFocus',
    'input input': 'onInput',
    'keydown input': 'onKeyPress',
    'click [data-hook=tag-remove]': 'onRemoveTag',
  },

  initialize() {
    _.bindAll(this, 'onRemoveTag', 'highlightSelectedRow');

    this.otherMembers = new OtherMembers(
      this.parent.task,
      this.parent.workspace.users
    );

    this.listAll();
    this.listenTo(
      this,
      'change:selectedSuggestionIndex',
      this.highlightSelectedRow
    );
    this.listenTo(
      this.parent.membersCollectionSize,
      'change:length',
      this.onUpdateCollection
    );
    this.listenTo(this.parent.members, 'add remove', this.onUpdateCollection);
    this.listenTo(this.parent, 'change:canRemove', this.onUpdateCollection);
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
          onSelect: model => this.onSelect(model),
        },
      }
    );
    setTimeout(() => {
      const el = this.queryByHook('input');
      el.focus();
    }, 0);
  },

  renderTags() {
    this.members = this.parent.members.models
      .map(model => {
        const v = new TagView({
          model,
          parent: this,
        });
        v.render();
        return v.el.outerHTML;
      })
      .join('');
  },

  async onUpdateCollection() {
    this.searchTerm ? this.listMatching() : this.listAll();
    this.render();
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
      await this.onAddTag(this.getModel({ id: parseInt(modelId) }));
    } else if (this.isAddVisible) {
      this.onCreateTag();
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
    return this.otherMembers.models.map(item => ({
      string: item.name,
      original: item,
    }));
  },

  getSuggestions() {
    return fuzzy.filter(
      this.searchTerm,
      this.otherMembers.models,
      FUZZY_OPTIONS
    );
  },

  onMousedown(event) {
    event.preventDefault();
  },

  async onSelect(user) {
    await this.onAddTag(user);
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

  onKeyPress(event) {
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

  getModel(query) {
    return _.find(this.parent.workspace.users.models, query);
  },

  async onCreateTag() {
    const user = await createUser({ name: this.searchTerm });
    this.onAddTag(user);
  },

  async onAddTag(user) {
    // console.log('adding %s', user.membership_id);
    if (this.getIsPaying()) {
      const memberIds = this.parent.members.models.map(m => m.membership_id);
      if (-1 === memberIds.indexOf(user.membership_id)) {
        memberIds.push(user.membership_id);
        await this.saveTask(memberIds);
      }
    } else {
      await this.saveTask([user.membership_id]);
    }
    // this.close();
  },

  async onRemoveTag(event) {
    event.preventDefault();
    if (this.getIsPaying()) {
      const userId = parseInt(event.delegateTarget.dataset.id);
      // console.log('removing %s', userId);
      const memberIds = this.parent.members.models
        .filter(u => u.id !== userId)
        .map(m => m.membership_id);
      await this.saveTask(memberIds);
    } else {
      await this.saveTask([]);
    }
    // this.close();
  },

  async saveTask(workspace_members) {
    // console.log('saving %o', workspace_members);
    await this.parent.parent.task.set({ workspace_members });
    this.resetInput();
    await this.onUpdateCollection();
    hub.trigger('task:reassigned');
  },

  getIsPaying() {
    return this.parent.parent.workspace.isPremium;
  },

  resetInput() {
    this.queryByHook('input').value = this.searchTerm = '';
  },

  close() {
    this.trigger('close');
  },
});
