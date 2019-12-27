import View from 'ampersand-view';
import template from './template.hbs';
import css from './style.module.scss';

export default View.extend({
  template,
  css,

  bindings: {
    'css.container': {
      type: 'class',
    },
  },

  events: {
    blur: 'onBlur',
    keypress: 'onKeypress',
  },

  onBlur() {
    this.saveTaskName();
  },

  onKeypress(event) {
    if (event.keyCode === 13 || event.which === 13) {
      event.preventDefault();
    }
    this.saveTaskName();
  },

  onKeyDown(event) {
    if (event.keyCode === 13 || event.which === 13) {
      event.preventDefault();
    }
  },

  saveTaskName() {
    const name = this.getElText(this.el);
    this.parent.task.set({ name });
  },

  getElText(el) {
    if (!el.firstChild) {
      return '';
    }
    const firstTag = el.firstChild.nodeName;
    const keyTag = new RegExp(
      firstTag === '#text' ? '<br' : '</' + firstTag,
      'i'
    );
    const tmp = document.createElement('p');
    tmp.innerHTML = el.innerHTML
      .replace(/<[^>]+>/g, m => (keyTag.test(m) ? '{ß®}' : ''))
      .replace(/{ß®}$/, '');
    return tmp.innerText.replace(/{ß®}/g, '\n');
  },
});
