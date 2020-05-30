import _ from 'lodash';
import VirtualizedList from 'virtualized-list';
import View from 'ampersand-view';
import fuzzy from 'fuzzy';
import keycode from 'keycode';
import hub from 'src/popup/utils/hub';
import CollectionSize from 'core/collection_size';
import { createTag } from 'modules/task_helpers';
import preventDefault from 'core/modules/prevent_default';
// import showPremiumView from 'modules/multi_assign/premium_popup';
import { Suggestions } from 'core/models/suggestion';
import { TaskOtherTags as OtherTags } from 'core/models/tag';
import EditTagPopup from './edit_tag_popup';
import SuggestionItemView from './suggestion_item';
import TagView from './tag_item';
import template from './template.dot';
import css from './style.module.scss';
import itemCss from './suggestion_item/style.module.scss';

const FUZZY_OPTIONS = {
  pre: '<strong>',
  post: '</strong>',
  extract(item) {
    return item.name;
  },
};

const SUGGESTION_ROW_HEIGHT = 28;
const MAX_NUMBER_OF_SUGGESTIONS_IN_VIEW = 6;
const MAX_SUGGESTIONS_CONTAINER_HEIGHT =
  SUGGESTION_ROW_HEIGHT * MAX_NUMBER_OF_SUGGESTIONS_IN_VIEW +
  SUGGESTION_ROW_HEIGHT / 2;

export default View.extend({
  template,
  css,

  props: {
    searchTerm: ['string', true, ''],
    isFocused: 'boolean',
    selectedSuggestionIndex: 'number',
    isScrolling: 'boolean',
    parent: ['object', true],
    newTagColorId: ['number'],
    otherTags: ['any', true],
    suggestionsSize: ['state', true],
  },

  collections: {
    suggestions: Suggestions,
  },

  derived: {
    isExactMatch: {
      deps: ['searchTerm', 'otherTags.models', 'parent.task.tags.models'],
      fn() {
        const searchTerm = this.searchTerm.toUpperCase();
        return (
          !!_.find(
            this.otherTags.models,
            model => model.name.toUpperCase() === searchTerm
          ) ||
          !!_.find(
            this.parent.task.tags.models,
            model => model.name.toUpperCase() === searchTerm
          )
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
      deps: ['isAddVisible', 'suggestionsSize.length'],
      fn() {
        let msg;
        if (
          this.isAddVisible ||
          (!this.suggestionsSize?.length && this.searchTerm)
        ) {
          msg = `NO ${this.parent.labelName} FOUND`;
        } else if (!this.searchTerm) {
          msg = `SEARCH ${this.parent.labelName}`;
        } else {
          msg = `SELECT ${this.parent.labelName}`;
        }
        return msg.toUpperCase();
      },
    },
    newTagColorClass: {
      deps: ['newTagColorId'],
      fn() {
        return `color-${this.newTagColorId}`;
      },
    },
    newTagTextColor: {
      deps: ['newTagColorId'],
      fn() {
        return this.parent.workspace.colors.isLight(this.newTagColorId)
          ? 'black'
          : 'white';
      },
    },
  },

  bindings: {
    isAddVisible: [{ type: 'toggle', hook: 'add' }],
    heading: {
      type: 'text',
      hook: 'heading',
    },
    searchTerm: {
      type: 'text',
      hook: 'new-tag',
    },
    newTagColorClass: {
      type: 'class',
      hook: 'new-tag',
    },
    newTagTextColor: {
      hook: 'new-tag',
      type(el, color) {
        el.style.color = color;
      },
    },
  },

  events: {
    'mousedown [data-hook=bottom]': 'onMousedown',
    mouseleave: 'onMouseLeave',
    'click [data-hook=add]': 'onCreateTag',
    'focus input': 'onFocus',
    'input input': 'onInput',
    'click [data-hook=tag-remove]': 'onRemoveTag',
    keydown: 'onContainerKeyPress',
    'click [data-index]': 'onClickSuggestion',
    'mouseover [data-index]': 'onHoverSuggestion',
    'click [data-tag-edit]': 'startEditingTag',
  },

  initialize() {
    _.bindAll(this, 'onRemoveTag', 'highlightSelectedRow', 'renderSuggestions');
    this.otherTags = new OtherTags(this.parent.task);
    this.suggestionsSize = new CollectionSize(this.suggestions);
    this.handleScrollNavigation();
    this.listenTo(this.parent, 'change:canRemove', this.renderSuggestions);
    this.regenerateNewTagColorId();
  },

  render() {
    this.renderWithTemplate();

    this.tagsEl = this.queryByHook('tags');
    this.inputEl = this.queryByHook('input');
    this.suggestionsEl = this.queryByHook('suggestions-list');
    this.suggestionsEl.style.maxHeight = `${MAX_SUGGESTIONS_CONTAINER_HEIGHT}px`;

    setTimeout(() => {
      this.renderTags();
      this.listAll();
      this.inputEl.focus();
    }, 0);
  },

  renderTags() {
    this.parent.task.tags.models.forEach(tag => {
      this.renderTag(tag);
    });
  },

  renderTag(tag) {
    const v = new TagView({
      model: tag,
      parent: this,
    });
    v.render();
    this.tagsEl.insertBefore(v.el, this.inputEl);
  },

  listAll() {
    this.suggestions.reset(this.getAllItems());
    this.renderSuggestions();
  },

  listMatching() {
    this.suggestions.reset(this.getSuggestions());
    this.renderSuggestions();
  },

  onMousedown(event) {
    event.preventDefault();
  },

  onMouseLeave() {
    this.selectedSuggestionIndex = null;
    this.highlightSelectedRow();
  },

  getNumberOfRows() {
    return this.suggestions.length;
  },

  getAllItems() {
    return this.otherTags.models.map(item => ({
      string: item.name,
      original: item,
    }));
  },

  getSuggestions() {
    return fuzzy.filter(this.searchTerm, this.otherTags.models, FUZZY_OPTIONS);
  },

  onFocus() {
    if (!this.parent.isEditable) {
      return;
    }

    this.isFocused = true;
  },

  onInput(e) {
    this.searchTerm = (e.target.value || '').trim();
    this.selectedSuggestionIndex = null;
    this.listMatching();
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
    switch (keycode(event)) {
      case 'tab':
        event.preventDefault();
        this.close();
        if (event.shiftKey) {
          this.tabToPreviousElement();
        } else {
          this.tabToNextElement();
          // this.cycleThruSuggestions();
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
    const previousElement = this.el.querySelector(
      `[tabindex='${+tabIndex - 1}']`
    );

    if (previousElement) {
      previousElement.focus();
    }
  },

  tabToNextElement() {
    const tabIndex = this.queryByHook('input').getAttribute('tabindex');
    const nextElement = this.el.querySelector(`[tabindex='${+tabIndex + 1}']`);

    if (nextElement) {
      nextElement.focus();
    }
  },

  getModel(query) {
    return _.find(this.parent.task.computedProject.tags.models, query);
  },

  async onCreateTag() {
    if (this.showUpgradePrompt()) {
      return;
    }

    const tag = await createTag({
      name: this.searchTerm,
      color_id: this.newTagColorId,
      project_id: this.parent.task.computedProject.id,
    });
    this.onAddTag(tag);
  },

  async onAddTag(tag) {
    if (this.showUpgradePrompt()) {
      return;
    }

    const tag_ids = this.parent.task.tag_ids.concat([]);
    if (-1 === tag_ids.indexOf(tag.id)) {
      tag_ids.push(tag.id);
      await this.saveTask(tag_ids);
      this.renderTag(tag);
      this.listMatching();
      this.regenerateNewTagColorId();
    }
  },

  async onRemoveTag(event) {
    event.preventDefault();

    if (!this.parent.canRemove) {
      return;
    }

    const tagId = parseInt(event.delegateTarget.dataset.id);
    this.tagsEl.removeChild(
      this.query(`[data-hook="tag"][data-id="${tagId}"]`)
    );

    const tag_ids = [];
    const tags = this.parent.task.tags.models;
    for (let i = 0; i < tags.length; i++) {
      const u = tags[i];
      if (u.id !== tagId) {
        tag_ids.push(u.id);
      }
    }
    await this.saveTask(tag_ids);
    this.listMatching();
  },

  async onRemoveLastTag(event) {
    event.preventDefault();
    if (this.parent.canRemove) {
      const tags = this.parent.task.tags.models;
      const { id: tagId } = _.last(tags);
      this.tagsEl.removeChild(
        this.query(`[data-hook="tag"][data-id="${tagId}"]`)
      );

      const tag_ids = tags.map(m => m.id);
      tag_ids.pop();
      await this.saveTask(tag_ids);
      this.listMatching();
    }
  },

  async saveTask(tag_ids) {
    // todo
    this.parent.parent.task.tag_ids = tag_ids;
    hub.trigger('task:reassigned');
    await this.parent.parent.saveTask({ tag_ids });
    this.resetInput();
    hub.trigger('task:reassigned');
  },

  showUpgradePrompt() {
    // if (
    //   this.parent.task.tags.models.length &&
    //   showPremiumView(this.queryByHook('input'))
    // ) {
    //   return true;
    // }
    return false;
  },

  resetInput() {
    this.queryByHook('input').value = this.searchTerm = '';
  },

  close() {
    this.trigger('close');
  },

  //

  renderSuggestions() {
    const self = this;

    if (this.suggestionsVirtualizedList) {
      this.suggestionsVirtualizedList.destroy();
      this.suggestionsVirtualizedList = null;
    }

    if (!this.suggestionsEl) {
      return;
    }

    const rows = this.suggestions.models;
    const len = rows.length;

    if (!len) {
      return;
    }

    const rowHeight = SUGGESTION_ROW_HEIGHT;
    const height = Math.min(MAX_SUGGESTIONS_CONTAINER_HEIGHT, rowHeight * len);
    this.suggestionsVirtualizedList = new VirtualizedList(this.suggestionsEl, {
      height,
      rowCount: rows.length,
      renderRow: index => {
        const row = rows[index];
        const view = new SuggestionItemView({
          model: row,
          parent: self,
          index,
        });
        view.render();
        return view.el;
      },
      rowHeight,
      onScroll() {
        self.isScrolling = true;
        setTimeout(() => (self.isScrolling = false), 500);
      },
      onMount() {
        if (_.isNil(self.selectedSuggestionIndex)) {
          return;
        }
        self.scrollToIndex(self.selectedSuggestionIndex, 'center');
        self.highlightSelectedRow();
      },
      onRowsRendered() {
        if (_.isNil(self.selectedSuggestionIndex)) {
          return;
        }

        const els = self.el.getElementsByClassName(itemCss.container);
        for (let j = 0; j < els.length; j++) {
          const row = els[j];
          const { index } = row.dataset;
          if (Number(index) === self.selectedSuggestionIndex) {
            row.classList.add('active');
          }
        }
      },
    });
  },

  // scroll

  scrollToIndex(index, alignment) {
    index = Math.min(index, this.suggestionsSize.length - 1);
    this.suggestionsVirtualizedList.scrollToIndex(index, alignment);
  },

  handleScrollNavigation() {
    this.listenTo(this, 'scroll-to-current', (dir = 'center') => {
      if (
        this.suggestionsVirtualizedList &&
        _.isNumber(this.selectedSuggestionIndex)
      ) {
        this.scrollToIndex(this.selectedSuggestionIndex, dir);
      }
    });
    this.listenTo(this, 'scroll-to-bottom', () => {
      if (
        this.suggestionsVirtualizedList &&
        _.isNumber(this.selectedSuggestionIndex)
      ) {
        const diff =
          (this.selectedSuggestionIndex + 1) * SUGGESTION_ROW_HEIGHT -
          (this.suggestionsEl.scrollTop + this.suggestionsEl.clientHeight);
        if (diff > 0) {
          this.suggestionsEl.scrollTop += diff;
        }
      }
    });
    this.listenTo(this, 'scroll-to-top', () => {
      if (
        this.suggestionsVirtualizedList &&
        _.isNumber(this.selectedSuggestionIndex)
      ) {
        this.suggestionsEl.scrollTop =
          this.selectedSuggestionIndex * SUGGESTION_ROW_HEIGHT;
      }
    });
  },

  goUp() {
    if (!_.isNil(this.selectedSuggestionIndex)) {
      if (this.selectedSuggestionIndex > 0) {
        this.selectedSuggestionIndex--;
      }
    } else {
      this.selectedSuggestionIndex = this.suggestions.models.length - 1;
    }
    this.highlightSelectedRow('start');
  },

  goDown(cycle) {
    if (!_.isNil(this.selectedSuggestionIndex)) {
      const maxIndex = this.suggestions.models.length - 1;
      if (cycle && this.selectedSuggestionIndex >= maxIndex) {
        this.selectedSuggestionIndex = 0;
      } else if (this.selectedSuggestionIndex < maxIndex) {
        this.selectedSuggestionIndex++;
      }
    } else {
      this.selectedSuggestionIndex = 0;
    }
    this.highlightSelectedRow('end');
  },

  cycleThruSuggestions() {
    this.goDown(true);
  },

  async onClickSuggestion(event) {
    if (
      event.target.classList.contains('js-disable-add-click') ||
      event.delegateTarget.classList.contains('js-disable-add-click')
    ) {
      return;
    }

    const index = parseInt(event.delegateTarget.dataset.index);
    const { original: model } = this.suggestions.models[index];
    await this.onAddTag(model);
  },

  onHoverSuggestion(e) {
    if (!this.parent.isScrolling) {
      const index = parseInt(e.delegateTarget.dataset.index);
      this.selectedSuggestionIndex = index;
      this.highlightSelectedRow();
    }
  },

  async useSelected() {
    if (!_.isNil(this.selectedSuggestionIndex)) {
      const {
        original: { id: modelId },
      } = this.suggestions.models[this.selectedSuggestionIndex];
      await this.onAddTag(this.getModel({ id: parseInt(modelId) }));
    } else if (this.isAddVisible) {
      this.onCreateTag();
    }
  },

  highlightSelectedRow(dir) {
    let selectedElement;
    let selectedElementIndex;
    const els = this.el.getElementsByClassName(itemCss.container);
    for (let i = 0; i < els.length; i++) {
      const row = els[i];
      const { index } = row.dataset;
      if (Number(index) === this.selectedSuggestionIndex) {
        selectedElement = true;
        selectedElementIndex = i;
        row.classList.add('active');
      } else {
        row.classList.remove('active');
      }
    }

    const showTopElement = selectedElementIndex === 0 && dir === 'start';
    const showBottomElement =
      selectedElementIndex === MAX_NUMBER_OF_SUGGESTIONS_IN_VIEW &&
      dir === 'end';

    if (showTopElement) {
      this.trigger('scroll-to-top');
    } else if (showBottomElement) {
      this.trigger('scroll-to-bottom');
    } else if (!selectedElement) {
      this.trigger('scroll-to-current', dir);
    }
  },

  //

  startEditingTag(event) {
    preventDefault(event);

    if (!this.parent.isEditable) {
      return;
    }

    if (
      event.target.classList.contains('js-disable-edit-click') ||
      event.delegateTarget.classList.contains('js-disable-edit-click')
    ) {
      return;
    }

    const tagId = parseInt(event.delegateTarget.dataset.id);
    const tag = this.parent.task.computedProject.tags.findWhere({ id: tagId });
    const popup = new EditTagPopup({ parent: this, tag });
    const isEditingSuggestionTag =
      event.delegateTarget.dataset.hook === 'edit-icon';

    if (isEditingSuggestionTag) {
      popup.on('edit', () => this.renderSuggestions());
    }
    // eslint-disable-next-line space-before-function-paren
    popup.on('delete', async () => {
      if (isEditingSuggestionTag) {
        this.renderSuggestions();
      } else {
        const tags = this.parent.task.tags.models;
        this.tagsEl.removeChild(
          this.query(`[data-hook="tag"][data-id="${tagId}"]`)
        );
        const tag_ids = tags.map(m => m.id);
        tag_ids.pop();
        await this.saveTask(tag_ids);
        this.listMatching();
      }
    });

    hub.trigger('popups:show', {
      name: 'tags-edit-popup',
      content: popup,
      direction: 'up',
      modifiers: ['rounded'],
      hideArrow: true,
      overlay: {
        closeOnClick: true,
        transparent: true,
      },
      positioning: {
        anchor: $(event.delegateTarget),
        position: 'down',
        distance: 15,
      },
    });
  },

  regenerateNewTagColorId() {
    this.newTagColorId =
      this.parent.workspace.colors.getRandomPresetColor()?.id ?? 21;
  },

  remove() {
    if (this.suggestionsVirtualizedList) {
      this.suggestionsVirtualizedList.destroy();
    }
    View.prototype.remove.call(this);
  },
});
