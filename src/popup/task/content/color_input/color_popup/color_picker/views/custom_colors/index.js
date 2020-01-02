import './flexi-color-picker';
import _ from 'lodash';
import View from 'ampersand-view';
import TextInput from '../input';
import ColorCircle from '../color_circle';
import template from './template.dot';

export default View.extend({
  template,

  props: {
    selectedColorId: 'number',
    workspace: 'state',
  },

  bindings: {
    'workspace.isPremium': {
      type: 'toggle',
      yes: '[data-hook=picker-wrap]',
      no: '[data-hook=upsell-wrap]',
    },
  },

  subviews: {
    colorInputView: {
      hook: 'color-input',
      prepareView() {
        return new TextInput({
          name: 'color_input',
          placeholder: 'Type color...',
          value: '209133',
          modifiers: ['small'],
          validations: [
            {
              run: value => !!value,
              message: '*Invalid value',
            },
          ],
          normalise: value => {
            return value.charAt(0) === '#' ? value.substr(1) : value;
          },
        });
      },
    },
  },

  events: {
    'click [data-hook=save-button]': 'onSaveColor',
    'click [data-hook=upgrade-button]': 'onUpgrade',
  },

  initialize() {
    this.onInit();
  },

  async onInit() {
    _.bindAll(
      this,
      'onPickerSelect',
      'updatePreviewColor',
      'renderCustomColors',
      'onSelectCustomColor',
      'onSaveColor',
      'updatePickerHex'
    );
  },

  render() {
    this.renderWithTemplate();
    this.renderPicker();
    this.renderCustomColors();

    this.cacheElements({
      elemColorPreview: '[data-hook=color-preview]',
    });

    _.defer(() => this.attachEvents());
  },

  renderPicker() {
    this._picker = window.FlexiColorPicker(
      this.queryByHook('picker'),
      this.onPickerSelect
    );
  },

  renderCustomColors() {
    const { workspace, selectedColorId, onSelectCustomColor: onSelect } = this;
    const customColors = workspace.colors.getCustomColors();
    if (_.isEmpty(customColors)) {
      return;
    }

    const elemColorsList = this.queryByHook('colors-list');
    const fragment = document.createDocumentFragment();
    const layout = [[]];
    customColors.forEach(color => {
      const view = new ColorCircle({
        color,
        selectedColorId,
        onSelect,
        parentView: this,
      });
      view.render();

      const layoutLastRow = layout[layout.length - 1];
      if (layoutLastRow.length < 5) {
        layoutLastRow.push(view.el);
      } else {
        layout.push([view.el]);
      }
    });

    const layoutLastRow = layout[layout.length - 1];
    while (layoutLastRow.length < 5) {
      const dummyCircle = document.createElement('div');
      dummyCircle.classList.add('color-picker__color-circle');
      dummyCircle.classList.add('color-picker__color-circle--dummy');
      layoutLastRow.push(dummyCircle);
    }

    layout.forEach(row => {
      const rowElem = document.createElement('div');
      rowElem.classList.add(
        'row',
        'row--justify-space',
        'spacing-4--outer-top'
      );
      row.forEach(child => rowElem.appendChild(child));
      fragment.appendChild(rowElem);
    });

    while (elemColorsList.lastChild) {
      elemColorsList.removeChild(elemColorsList.lastChild);
    }
    elemColorsList.appendChild(fragment);
  },

  attachEvents() {
    const { colorInputView, workspace } = this;
    if (colorInputView) {
      this.listenTo(colorInputView, 'change:value', this.updatePreviewColor);
      this.listenTo(colorInputView, 'input', this.updatePickerHex);
      this.updatePreviewColor();
    }

    this.listenTo(
      workspace.colors,
      'add remove change',
      this.renderCustomColors
    );
  },

  onPickerSelect(hex) {
    if (hex) {
      hex = hex.toUpperCase();
      this.colorInputView.value = hex.substr(1);
    }
  },

  updatePreviewColor() {
    if (
      this.elemColorPreview &&
      this.colorInputView &&
      this.colorInputView.isValid
    ) {
      const hex = `#${this.colorInputView.value}`;
      this.elemColorPreview.style['background-color'] = hex;
    }
  },

  updatePickerHex() {
    if (this._picker && this.colorInputView) {
      const hex = `#${this.colorInputView.value}`;
      this._picker.setHex(hex);
    }
  },

  onSaveColor() {
    const { colorInputView, workspace } = this;

    if (colorInputView && colorInputView.isValid) {
      workspace.colors
        .addColor(`#${colorInputView.value.toLowerCase()}`)
        .then(color => {
          if (color.id) {
            this.onSelectCustomColor(color.id, false);
          }
        });
    }
  },

  onSelectCustomColor(colorId, shouldClose) {
    this.selectedColorId = colorId;
    this.trigger('select', colorId, shouldClose);
  },

  onUpgrade() {
    window.open('https://app.teamweek.com/#settings/billing', '_blank');
  },
});
