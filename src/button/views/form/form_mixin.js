var FormMixin = {

  clearErrors: function() {
    this.queryAll('[data-hook^=errors]').forEach(function(el) {
      el.innerText = null;
    });
  },

  addError: function(key, error) {
    var el = this.queryByHook('errors-' + key);
    el.innerText = error;
  }

};

module.exports = FormMixin;
