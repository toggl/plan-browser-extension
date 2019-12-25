import _ from 'lodash';
import View from 'ampersand-view';
import SegmentedControl from 'src/popup/utils/segmented_control';
import PresetColors from './views/preset_colors';
import CustomColors from './views/custom_colors';
import template from './template.hbs';
import './style.scss';

const SECTION_TYPES = [
  { name: 'presets', label: 'Presets' },
  { name: 'custom', label: 'Custom' },
];

export default View.extend({
  template,

  props: {
    selectedColorId: 'number',
    section: ['string', true, SECTION_TYPES[0].name],
    hideCustomColors: 'boolean',
    workspace: 'state',
  },

  bindings: {
    section: {
      type: 'switch',
      cases: {
        [SECTION_TYPES[0].name]: '[data-hook=preset-colors]',
        [SECTION_TYPES[1].name]: '[data-hook=custom-colors]',
      },
    },
    hideCustomColors: {
      type: 'toggle',
      hook: 'switch',
      invert: true,
    },
  },

  subviews: {
    sectionSwitchView: {
      hook: 'switch',
      prepareView() {
        return new SegmentedControl({
          activeSegment: this.section,
          segments: SECTION_TYPES,
          themeColor: 'blue',
          modifiers: ['width-84', '24', 'transparent'],
          isNew: true,
        });
      },
    },

    presetColorsView: {
      hook: 'preset-colors',
      prepareView() {
        return new PresetColors({
          selectedColorId: this.selectedColorId,
          workspace: this.workspace,
        });
      },
    },

    customColorsView: {
      hook: 'custom-colors',
      prepareView() {
        return new CustomColors({
          selectedColorId: this.selectedColorId,
          workspace: this.workspace,
        });
      },
    },
  },

  initialize() {
    _.bindAll(this, 'onColorSelect', 'setPickerValue');
    const { selectedColorId } = this;
    const selectedColor = this.workspace.colors.get(selectedColorId);
    if (selectedColor && selectedColor.isCustom) {
      this.section = SECTION_TYPES[1].name;
    }
  },

  render() {
    this.renderWithTemplate();
    _.defer(this.setPickerValue);

    this.listenTo(this.sectionSwitchView, 'select', () => {
      this.section = this.sectionSwitchView.activeSegment;
      _.defer(this.setPickerValue);
    });

    this.listenTo(this.presetColorsView, 'select', this.onColorSelect);
    this.listenTo(this.customColorsView, 'select', this.onColorSelect);
  },

  setPickerValue() {
    const { section, customColorsView } = this;

    if (
      section === SECTION_TYPES[1].name &&
      customColorsView &&
      customColorsView._picker
    ) {
      customColorsView._picker.setHex(
        `#${customColorsView.colorInputView.value}`
      );
    }
  },

  onColorSelect(colorId, shouldClose = true) {
    if (colorId) {
      this.selectedColorId = colorId;
      this.trigger('select', shouldClose);
    }
  },
});
