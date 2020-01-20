import _ from 'lodash';
import View from 'ampersand-view';
import ColorCircle from '../color_circle';
import template from './template.dot';

const COLOR_LAYOUT = [
  [45, 44, 43, 35, 42],
  [1, 2, 30, 3, 4],
  [26, 28, 29, 17, 40],
  [16, 25, 18, 19, 34],
  [31, 20, 32, 15, 33],
  [36, 23, 22, 38, 24],
  [11, 13, 10, 12, 39],
  [6, 7, 8, 9, 14],
  [41, 5, 37, 21, 27],
];

export default View.extend({
  template,

  props: {
    selectedColorId: 'number',
    workspace: 'state',
  },

  render() {
    this.renderWithTemplate();
    this.renderPresetColors();
  },

  renderPresetColors() {
    const { el } = this;
    COLOR_LAYOUT.forEach((row, index) =>
      el.appendChild(this.renderColorRow(row, index))
    );
  },

  renderColorRow(row, index) {
    const rowElem = document.createElement('div');
    rowElem.classList.add('row', 'row--justify-space');

    if (index < 8) {
      rowElem.classList.add('spacing-3--outer-bottom');
    }

    const presetColors = this.workspace.colors.getPresetColors();
    row
      .map(colorId => _.find(presetColors, { id: colorId }))
      .forEach(color => {
        const view = new ColorCircle({
          color,
          selectedColorId: this.selectedColorId,
          onSelect: colorId => this.onSelectColor(colorId),
          parentView: this,
        });
        view.render();
        rowElem.appendChild(view.el);
      });

    return rowElem;
  },

  onSelectColor(colorId) {
    this.selectedColorId = colorId;
    this.trigger('select', colorId);
  },
});
