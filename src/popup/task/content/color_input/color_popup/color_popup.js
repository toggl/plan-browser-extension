import View from 'ampersand-view';
import ColorPicker from './color_picker';
import template from './color_popup.hbs';
import './color_popup.scss';

export default View.extend({
  template,

  props: {
    selected: 'number',
    colorPicker: 'state',
    hideCustomColors: 'boolean',
    workspace: 'state',
  },

  initialize() {
    this.colorPicker = new ColorPicker({
      selectedColorId: this.selected,
      hideCustomColors: this.hideCustomColors,
      workspace: this.workspace,
    });
    this.listenTo(this.colorPicker, 'select', this.onSelect);
  },

  render() {
    this.renderWithTemplate();
    this.renderSubview(
      this.colorPicker,
      this.queryByHook('container-colorpicker')
    );
  },

  onSelect(shouldClose) {
    this.selected = this.colorPicker.selectedColorId;
    this.trigger('select', this.selected);
    if (shouldClose) {
      this.close();
    }
  },

  close() {
    this.trigger('close');
  },
});
