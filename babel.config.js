module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Bundle drizzle/*.sql migration files as strings (FND-11).
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
