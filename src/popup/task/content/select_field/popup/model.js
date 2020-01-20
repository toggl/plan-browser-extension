import Model from 'ampersand-model';
import Collection from 'ampersand-collection';

export const Suggestion = Model.extend({
  props: {
    string: 'string',
    original: 'object',
  },
});

export const Suggestions = Collection.extend({
  model: Suggestion,
});
