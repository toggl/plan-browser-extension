const accounts = require('../models/account_collection');

module.exports = updateColorsStyleSheet;

let WORKSPACE_COLORS_STYLESHEET;

function addCSSRule(selector, rules, index) {
	if ('insertRule' in WORKSPACE_COLORS_STYLESHEET) {
		WORKSPACE_COLORS_STYLESHEET.insertRule(`${selector} {${rules}}`, index);
	} else if ('addRule' in WORKSPACE_COLORS_STYLESHEET) {
		WORKSPACE_COLORS_STYLESHEET.addRule(selector, rules, index);
	}
}

function clearCSSRules() {
  const rules = WORKSPACE_COLORS_STYLESHEET.cssRules ||
		WORKSPACE_COLORS_STYLESHEET.rules;
  while (rules.length) {
    WORKSPACE_COLORS_STYLESHEET.deleteRule(0);
  }
}

function addColorRules(color) {
  const {
    id,
    hex,
  } = color;

	const selector = `.circle-color--${id}`;
	const rule = `background-color: ${hex}`;

  addCSSRule(selector, rule);
}

function addColorsStyleSheet() {
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');

  style.type = 'text/css';
  style.id = 'workspace-colors';
  style.appendChild(document.createTextNode(''));

  head.appendChild(style);

  WORKSPACE_COLORS_STYLESHEET = style.sheet;
}

function updateColorsStyleSheet(workspaceId) {
	if (!WORKSPACE_COLORS_STYLESHEET) {
		addColorsStyleSheet();
	} else {
		clearCSSRules();
	}

	const {customColors} = accounts.get(workspaceId);
  customColors.forEach(model => addColorRules(model));
}
