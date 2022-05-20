import _ from 'lodash';
import State from 'ampersand-state';
import Collection from 'ampersand-collection';
import tinycolor from 'tinycolor2';
import Promise from 'bluebird';
import xhr from 'src/api/xhr';

function addCSSRule(sheet, selector, rules, index) {
  if ('insertRule' in sheet) {
    sheet.insertRule(selector + '{' + rules + '}', index);
  } else if ('addRule' in sheet) {
    sheet.addRule(selector, rules, index);
  }
}

function clearCSSRules(sheet) {
  const rules = sheet.cssRules || sheet.rules;
  while (rules.length) {
    sheet.deleteRule(0);
  }
}

function rgba(hex, alpha) {
  return tinycolor(hex)
    .setAlpha(alpha)
    .toString();
}

function addColorRules(sheet, color) {
  const {
    id,
    hex,
    darkHex,
    lightHex,
    alpha25,
    alpha75,
    isLight,
    // darkHexIsLight,
  } = color;
  // const darkHexTextColor = darkHexIsLight ? '#201a32' : '#ffffff';

  const rules = [
    {
      selector: `
      .bg.color-${id},
      .bg.color-${id} .task__labels__label,
      .grid__cell.milestone.color-${id}:after,
      .button--color.color-${id},
      [data-hook='project-symbol'][data-color='${id}'],
      .profile-picture.color-${id} .profile-picture__star,
      .row--bg-color.color-${id}
    `,
      rule: `background-color: ${hex}`,
    },
    {
      selector: `.fg.color-${id}`,
      rule: `color: ${isLight ? 'black' : 'white'}`,
    },
    {
      selector: `.task.color-${id}`,
      rule: `border-color: ${darkHex}`,
    },
    {
      selector: `.task.color-${id} .fade`,
      // ease-in gradient here, creates more smooth transition compared to linear one
      rule: `background-image: linear-gradient(270deg,
      ${hex} 0%,
      ${rgba(hex, 0.98)} 9%,
      ${rgba(hex, 0.95)} 19%,
      ${rgba(hex, 0.88)} 28%,
      ${rgba(hex, 0.8)} 38%,
      ${rgba(hex, 0.71)} 48%,
      ${rgba(hex, 0.61)} 57%,
      ${rgba(hex, 0.5)} 66%,
      ${rgba(hex, 0.39)} 74%,
      ${rgba(hex, 0.29)} 81%,
      ${rgba(hex, 0.2)} 87%,
      ${rgba(hex, 0.12)} 93%,
      ${rgba(hex, 0.05)} 97%,
      ${rgba(hex, 0.02)} 99%,
      ${rgba(hex, 0.0)} 100%);`,
    },
    {
      selector: `.task.task--done.color-${id}`,
      rule: `background-color: white; border-color: ${lightHex}`,
    },
    {
      selector: `.milestone__inner.color-${id}`,
      rule: `color: ${hex}`,
    },
    {
      selector: `.timeline-task--on-timeline.color-${id}:hover`,
      rule: `box-shadow: 0 2px 7px 0 ${alpha75}`,
    },
    {
      selector: `.timeline-task--on-timeline.color-${id}.task--done:hover`,
      rule: `box-shadow: 0 2px 7px 0 ${alpha25}`,
    },
    {
      selector: `.grid--projects .timeline-task--on-timeline.color-${id}:hover`,
      rule: 'box-shadow: 0 2px 7px 0 rgba(0,0,0,.25);',
    },
  ];

  rules.forEach(({ selector, rule }) => addCSSRule(sheet, selector, rule));
}

export const presetColors = [
  { id: 1, hex: '#311b92' },
  { id: 2, hex: '#673ab7' },
  { id: 3, hex: '#b39ddb' },
  { id: 4, hex: '#d1c4e9' },
  { id: 5, hex: '#ff3cae' },
  { id: 6, hex: '#9b1818' },
  { id: 7, hex: '#cd3633' },
  { id: 8, hex: '#f44336' },
  { id: 9, hex: '#ef9a9a' },
  { id: 10, hex: '#ff9800' },
  { id: 11, hex: '#d9480f' },
  { id: 12, hex: '#ffc672' },
  { id: 13, hex: '#e37403' },
  { id: 14, hex: '#ffcdd2' },
  { id: 15, hex: '#9ccf9e' },
  { id: 16, hex: '#006064' },
  { id: 17, hex: '#64b5f6' },
  { id: 18, hex: '#00acc1' },
  { id: 19, hex: '#4dd0e1' },
  { id: 20, hex: '#338636' },
  { id: 21, hex: '#96fc2c' },
  { id: 22, hex: '#fdd835' },
  { id: 23, hex: '#e9c424' },
  { id: 24, hex: '#fff9c4' },
  { id: 25, hex: '#038391' },
  { id: 26, hex: '#0d47a1' },
  { id: 27, hex: '#00fffe' },
  { id: 28, hex: '#1770c9' },
  { id: 29, hex: '#2196f3' },
  { id: 30, hex: '#9575cd' },
  { id: 31, hex: '#1b5e20' },
  { id: 32, hex: '#66bb6a' },
  { id: 33, hex: '#c8e6c9' },
  { id: 34, hex: '#b2ebf2' },
  { id: 35, hex: '#90a4ae' },
  { id: 36, hex: '#be950c' },
  { id: 37, hex: '#fffe50' },
  { id: 38, hex: '#fff176' },
  { id: 39, hex: '#ffe0b2' },
  { id: 40, hex: '#bbdefb' },
  { id: 41, hex: '#ff0000' },
  { id: 42, hex: '#cfd8dc' },
  { id: 43, hex: '#607d8b' },
  { id: 44, hex: '#455a64' },
  { id: 45, hex: '#263238' },
];

const WorkspaceColor = State.extend({
  props: {
    id: ['number', true],
    hex: ['string', true],
  },

  derived: {
    isLight: {
      deps: ['hex'],
      fn() {
        return tinycolor(this.hex).getLuminance() > 0.5;
      },
    },
    darkHex: {
      deps: ['hex'],
      fn() {
        return tinycolor(this.hex)
          .darken(20)
          .toString();
      },
    },
    darkHexIsLight: {
      deps: ['darkHex'],
      fn() {
        return tinycolor(this.darkHex).getLuminance() > 0.5;
      },
    },
    lightHex: {
      deps: ['hex'],
      fn() {
        return tinycolor(this.hex)
          .setAlpha(0.6)
          .toString();
      },
    },
    alpha25: {
      deps: ['hex'],
      fn() {
        return tinycolor(this.hex)
          .setAlpha(0.25)
          .toRgbString();
      },
    },
    alpha75: {
      deps: ['hex'],
      fn() {
        return tinycolor(this.hex)
          .setAlpha(0.75)
          .toRgbString();
      },
    },
    isCustom: {
      deps: ['id'],
      fn() {
        return this.id > 1000;
      },
    },
  },
});

export default Collection.extend({
  model: WorkspaceColor,
  workspaceColorsStyleSheet: null,
  colorCache: {},

  initialize() {
    this.listenTo(this, 'add remove reset refresh', () => this.updateRules());
    this.addColorsStyleSheet();
    this.reset(presetColors);
  },

  addColorsStyleSheet() {
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.type = 'text/css';
    style.id = 'workspace-colors';
    style.appendChild(document.createTextNode(''));

    head.appendChild(style);
    this.workspaceColorsStyleSheet = style.sheet;
  },

  updateRules() {
    const { workspaceColorsStyleSheet: styleSheet } = this;
    clearCSSRules(styleSheet);
    this.models.forEach(model => addColorRules(styleSheet, model));
  },

  addColor(hex) {
    const color = this.get(this.getIdFromHex(hex));
    return color && color.isCustom
      ? Promise.resolve(color)
      : xhr('post', `/api/v6-rc1/${this.parent.id}/custom_colors`, {
          hex,
        }).then(data => {
          this.add(data, { merge: true });
          return this.get(this.getIdFromHex(hex));
        });
  },

  getCustomColors() {
    // TODO(Dhruv): Better check for custom color
    return this.models.filter(m => m.isCustom);
  },

  getPresetColors() {
    // TODO(Dhruv): Better check for presets color
    return this.models.filter(m => !m.isCustom);
  },

  getHexFromId(id) {
    return _.get(this.get(id), 'hex', '#96fc2c');
  },

  getIdFromHex(hex) {
    // since preset color hexes are also allowed as custom colors
    // there might be cases when the filter operation gives
    // > 1 results. defaulting to custom color id for now
    return _.get(_.findLast(this.models, { hex }), 'id');
  },

  getRandomPresetColor() {
    const presets = this.getPresetColors();
    return presets[Math.ceil(Math.random() * presets.length)];
  },

  isLight(id) {
    return _.get(this.get(id), 'isLight', false);
  },
});
