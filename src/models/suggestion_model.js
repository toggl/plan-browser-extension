import Model from 'ampersand-model';

const Suggestion = Model.extend({
  props: {
    string: 'string',
    original: 'object',
    index: 'number',
  },
});

export default Suggestion;
