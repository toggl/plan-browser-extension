import Promise from 'bluebird';
import State from 'ampersand-state';
import request from 'superagent';
import config from 'src/api/config';
import OAuthState from './oauth_state';
import TokensModel from './tokens_model';

const AuthenticationState = State.extend({
  props: {
    // Property for storing the promise during a token refresh
    refresh_promise: 'object',
  },

  children: {
    // State for storing client ID and secret
    oauth: OAuthState,
    // Model for storing access and refresh tokens
    tokens: TokensModel,
  },

  derived: {
    // Proxy for the tokens.has_auth_tokens property
    authenticated: {
      deps: ['tokens.has_auth_tokens'],
      fn() {
        return this.tokens.has_auth_tokens;
      },
    },
  },

  initialize() {
    // Initialize client ID and secret
    this.oauth.set({
      id: '9c782f95e771811bdedb77dc12e6be98ca286ea8',
      secret:
        '441a5bc3e3828910866ea5929fc0313e63a71a77934f3e248a4322f830253c2164e4cd33bead4e3397a27e2b9863ba4a',
    });
  },

  /**
   * Load all data that is needed for authentication. Should be called
   * when the application starts.
   *
   * @return Promise
   */
  load() {
    return this.tokens.fetch();
  },

  /**
   * Fetch tokens from the server using given credentials
   *
   * @param credentials Object with username and password keys
   * @return Promise
   */
  authenticate(credentials) {
    return this.fetchTokens(credentials);
  },

  /**
   * Remove tokens from storage
   *
   * @return Promise
   */
  revoke() {
    return this.tokens.clear().destroy();
  },

  /**
   * Fetch tokens from the server using given credentials
   *
   * @param credentials Object with username and password keys
   * @return Promise
   */
  fetchTokens(credentials) {
    return new Promise((resolve, reject) => {
      // Create a request that will return access and refresh tokens
      request
        .post(config.api.host + '/api/v5/authenticate/token')
        // Use base64'd client ID and secret for authorization
        .set('Authorization', 'Basic ' + this.oauth.token)
        // Send credentials in form data
        .type('form')
        .send({
          grant_type: 'password',
          username: credentials.username,
          password: credentials.password,
        })
        // Send the request
        .end((error, response) => {
          // If there is no response, we assume that the network is down
          if (!response) {
            reject({ message: 'network_error' });

            // If everything is fine, we save the tokens to local storage
          } else if (response.ok) {
            resolve(this.tokens.save(response.body));

            // If the credentials are invalid, return an error
          } else if (response.clientError) {
            reject({ message: 'invalid_credentials' });

            // If something weird happens, return an error
          } else {
            reject({ message: 'unknown_error' });
          }
        });
    });
  },

  /**
   * Fetch new access and refresh tokens using the current refresh token
   *
   * @return Promise
   */
  refreshTokens() {
    // Check if the tokens are not being refreshed already
    if (!this.refresh_promise) {
      this.refresh_promise = new Promise((resolve, reject) => {
        // Create a request that will fetch new tokens
        request
          .post(config.api.host + '/api/v4/authenticate/token')
          // Use base64'd client ID and secret for authorization
          .set('Authorization', 'Basic ' + this.oauth.token)
          // Send refresh token in form data
          .type('form')
          .send({
            refresh_token: this.tokens.refresh_token,
            grant_type: 'refresh_token',
          })
          .end((error, response) => {
            // Refresh is finished, another can start
            this.refresh_promise = null;

            // If there is no response, we assume that the network is down
            if (!response) {
              reject({ message: 'network_error' });

              // If everything is fine, we save the tokens to local storage
            } else if (response.ok) {
              const result = this.tokens.set(response.body).save();
              resolve(result);
              // If the refresh token is invalid, we clear tokens, remove them
              // from local storage and return an error
            } else if (response.clientError) {
              // tokens.destroy() will return a resolved promise, so we need to
              // reject it with the refresh denied error
              const result = this.tokens
                .clear()
                .destroy()
                .then(() => {
                  return Promise.reject({ message: 'refresh_denied' });
                });

              // if the result promise is rejected,
              // this promise will be rejected too
              resolve(result);

              // If something weird happens, return an error
            } else {
              reject({ message: 'unknown_error' });
            }
          });
      });
    }

    // Return a new or existing refresh promise
    return this.refresh_promise;
  },
});

export default AuthenticationState;
