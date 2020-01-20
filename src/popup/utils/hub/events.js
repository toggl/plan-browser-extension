import _ from 'lodash';
import eventFilters from './event_filters';
import Events from 'ampersand-events';

export default _.assign({}, Events, eventFilters);
