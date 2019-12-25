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

  getTaskName() {
    const { el } = this;
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
