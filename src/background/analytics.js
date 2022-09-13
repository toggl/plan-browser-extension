import * as storage from 'src/utils/storage';
import config from 'src/api/config';
import { toSnakeCase, toSnakeCaseObject } from '../utils/to-snake-case';

async function sendGoogleAnalyticsEvent(uid, category, action, fields = {}) {
  const params = new URLSearchParams({
    v: 1,
    tid: config.googleAnalytics.id,
    uid,
    t: 'event',
    ec: category,
    ea: action,
    cd1: fields.dimension1,
    cd2: fields.dimension2,
  });
  const url = `https://www.google-analytics.com/collect?${params.toString()}`;

  try {
    await fetch(url, {
      method: 'POST',
    });
  } catch (error) {
    console.warn('googleanalytics.track error:', error);
  }
}

async function sendRudderStackTrackEvent(uid, event, properties = {}) {
  const url = `${config.rudderStack.dataPlaneUrl}/v1/track`;
  const data = {
    userId: uid,
    event: toSnakeCase(event),
    properties: toSnakeCaseObject(properties),
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          config.rudderStack.key + ':'
        ).toString('base64')}`,
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn('rudderanalytics.track error:', error);
  }
}

chrome.runtime.onMessage.addListener(function(data) {
  if (data.type === 'track_event') {
    storage
      .get('me')
      .then(({ me: { id } }) =>
        sendGoogleAnalyticsEvent(
          id.toString(),
          data.category,
          data.action,
          data.fields
        )
      );
  }

  if (['task_created'].includes(data.type)) {
    storage.get('me').then(({ me: { id } }) => {
      sendRudderStackTrackEvent(id.toString(), data.type, data.properties);
    });
  }
});
