const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// Allow importing drizzle/*.sql migration files (inlined as strings by babel-plugin-inline-import).
config.resolver.sourceExts.push('sql');

module.exports = config;
