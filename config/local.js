/**
 * config/local.js
 * exports an object with configuration params
 */

module.exports = {
  APP_PORT: "27017",
  DB_HOST: "0.0.0.0",
  DB_USER: "MONGO_USER",
  DB_PASS: "MONGO_PASS",
  JWT_KEY: "thisIsMyJwtKeyUsedToEncodeTheTokens"
};
