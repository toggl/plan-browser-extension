import Suggestion from './suggestion_model';
import Collection from 'ampersand-collection';

const Suggestions = Collection.extend({
  model: Suggestion,
});

export default Suggestions;
