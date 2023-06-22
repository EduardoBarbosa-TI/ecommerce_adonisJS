module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Guard
  |--------------------------------------------------------------------------
  |
  | The default guard to use for authentication.
  |
  */
  guard: 'api',

  /*
  |--------------------------------------------------------------------------
  | Guards
  |--------------------------------------------------------------------------
  |
  | List of available guards. A guard is a combination of a driver and
  | the actual authentication implementation.
  |
  */
  guards: {
    api: {
      driver: 'jwt',
      tokenProvider: {
        type: 'jwt',
        driver: 'jwt',
        secret: 'your_secret_key',
        expiresIn: '1d',
      },
      provider: {
        driver: 'lucid',
        model: 'App/Models/User',
      },
    },
  },
};
