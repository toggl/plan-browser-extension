var templates = {
  public: require('./button_public.dom'),
  shadow: require('./button_shadow.dom'),
  style: require('./button.css')
};

exports.render = function() {
  var publicEl = templates.public();
  var shadowRoot = publicEl.createShadowRoot();

  var shadowEl = templates.shadow();
  shadowRoot.appendChild(shadowEl);

  var styleEl = document.createElement('style');
  styleEl.appendChild(document.createTextNode(templates.style));
  shadowRoot.appendChild(styleEl);

  return publicEl;
};
