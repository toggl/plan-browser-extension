export default {
  api: {
    host: 'https://api.plan.toggl.com',
  },
  googleAnalytics: {
    id: 'UA-133767571-6',
  },
  rudderStack: {
    dataPlaneUrl: 'https://toggl-dataplane.rudderstack.com',
    key: IS_PRODUCTION
      ? '1n43wlaD9MHBMXIWmXY5Am3ZpnI'
      : '1n3kyWOwIjSb314A7sXAA20LW6d',
  },
  popup: {
    width: 625,
    height: 525,
    buttonMargin: 20,
    buttonSize: 20,
  },
};
