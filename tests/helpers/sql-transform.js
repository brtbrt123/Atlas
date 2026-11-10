// Jest transformer: lets tests import `.sql` migration files as strings, like Metro will in the app.
module.exports = {
  process(sourceText) {
    return { code: `module.exports = ${JSON.stringify(sourceText)};` };
  },
};
