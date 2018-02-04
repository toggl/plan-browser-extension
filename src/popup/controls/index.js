import _ from 'lodash';
import Promise from 'bluebird';
import State from 'ampersand-state';

function getErrorText(error) {
  if (_.isArray(error)) {
    return error[0];
  } else if (_.isString(error)) {
    return error;
  } else {
    return '';
  }
}

export default State.extend({
  props: {
    name: 'string',
    canSubmit: 'boolean',
  },

  initialize() {
    this.inputMap = {};
  },

  addInput(input) {
    if (!input || !input.name) {
      return;
    }

    const { inputMap } = this;
    const { name: inputName } = input;

    if (inputMap[inputName]) {
      console.error("Cannot add multiple inputs with same name to form");
      return;
    }

    inputMap[input.name] = input;
  },

  removeInput(inputName) {
    const input = this.inputMap[inputName];

    if (input) {
      this.stopListening(input, 'change:value');
      delete this.inputMap[inputName];
    }
  },

  reset() {
    const { inputMap } = this;

    _.keys(inputMap).forEach((key) => {
      this.removeInput(key);
    });
  },

  save() {
    const { inputMap } = this;
    const inputNames = _.keys(inputMap);

    let canSubmit = true;
    let i = 0;
    while (i < inputNames.length) {
      const input = inputMap[inputNames[i++]];

      if (!input.isDirty) {
        input.isDirty = true;
        input.validate();
      }

      canSubmit = canSubmit && input.isValid;
    }

    return canSubmit ?
      Promise.resolve() :
      Promise.reject('Form validation failed');
  },

  getData() {
    const { inputMap } = this;
    return _.keys(inputMap).reduce((formData, key) => {
      return {
        ...formData,
        [inputMap[key].name]: inputMap[key].value,
      };
    }, {});
  },

  showErrors(errors = {}) {
    const { inputMap } = this;
    _.keys(errors).forEach((name) => {
      inputMap[name].trigger('error', `*${getErrorText(errors[name])}`);
    });
  },
});
