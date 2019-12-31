import _ from 'lodash';
import xhr from './xhr';

const billing = {
  isLoaded: false,
  isPremium: false,
};

export async function getIsPremium(workspace) {
  if (billing.isLoaded) {
    return billing.isPremium;
  }

  switch (workspace.pricing_system) {
    case 'goldshire': {
      const { current_subscription_state } = await xhr(
        'get',
        `/billing/v1/${workspace.id}/customer`
      );
      billing.isPremium = 'expired' !== current_subscription_state;
      break;
    }

    default: {
      const plans = _.keyBy(await xhr('get', '/deadwood/v1/plans'), 'id');
      const { plan_id } = await xhr(
        'get',
        `/deadwood/v1/${workspace.id}/subscription`
      );
      const plan = plans[plan_id];
      billing.isPremium = plan.member_limit > 5;
    }
  }

  billing.isLoaded = true;

  return billing.isPremium;
}
