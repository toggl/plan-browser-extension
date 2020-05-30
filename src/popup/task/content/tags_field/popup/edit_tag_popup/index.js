import View from 'ampersand-view';
import hub from 'core/hub';
import _ from 'lodash';
import Promise from 'bluebird';
import ColorPicker from 'src/popup/task/content/color_input/color_popup/color_picker';
import template from './template.dot';
import css from './style.module.scss';
import './style.scss';

export default View.extend({
  template,
  css,

  props: {
    tag: ['state', true],
    selectedColorId: 'number',
  },

  subviews: {
    colorPicker: {
      hook: 'color-picker',
      prepareView() {
        return new ColorPicker({
          selectedColorId: this.tag.color_id,
        });
      },
    },
  },

  events: {
    'input input': 'onInputTagName',
    'click [data-hook=delete]': 'onDeleteTag',
  },

  initialize() {
    this.onInputTagName = _.debounce(this.onInputTagName, 1000);
  },

  render() {
    this.renderWithTemplate();
    this.listenTo(this.colorPicker, 'select', this.onSelectTagColorId);
  },

  onSelectTagColorId() {
    this.saveTag({ color_id: this.colorPicker.selectedColorId });
  },

  onInputTagName(e) {
    this.saveTag({ name: (e.target.value || '').trim() });
  },

  async saveTag(props) {
    await new Promise((resolve, reject) => {
      hub.once('tag:edited', resolve);
      hub.once('tag:edit:failed', reject);
      hub.trigger('tag:edit', this.tag, props);
    });
    this.trigger('edit');
  },

  onDeleteTag(event) {
    hub.trigger('confirm:show', $(event.delegateTarget), {
      question: 'Are you sure?',
      positive: 'Yes',
      negative: 'No',
      // eslint-disable-next-line space-before-function-paren
      successCallback: async () => {
        await new Promise((resolve, reject) => {
          hub.once('tag:deleted', resolve);
          hub.once('tag:delete:failed', reject);
          hub.trigger('tag:delete', { tag: this.tag });
        });
        this.trigger('delete');
        this.close();
      },
      offsets: { top: 60 },
      position: 'down',
      direction: 'up',
      alignments: ['middle'],
    });
  },

  close() {
    this.trigger('close');
  },
});
