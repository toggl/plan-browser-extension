import _ from 'lodash';

import xhr from './xhr';

export async function getIsPremium(workspace) {
  switch (workspace.pricing_system) {
    case 'goldshire': {
      const { current_subscription_state } = await xhr(
        'get',
        `/billing/v1/${workspace.id}/customer`
      );
      return 'expired' !== current_subscription_state;
    }

    default: {
      const plans = _.keyBy(await xhr('get', '/deadwood/v1/plans'), 'id');
      const { plan_id } = await xhr(
        'get',
        `/deadwood/v1/${workspace.id}/subscription`
      );
      const plan = plans[plan_id];
      return !!plan && plan.member_limit > 5;
    }
  }
}
