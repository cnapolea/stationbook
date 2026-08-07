const { exit } = require('node:process');
const app = require('./app');
const CONSTANTS = require('./lib/constants');
const envVarList = ['JWT_SECRET', 'DB_CONNECTION_STRING', 'PORT'];

for (const [key, value] of Object.entries(CONSTANTS)) {
  if (envVarList.includes(key) && !value) {
    console.error(CONSTANTS.ERROR_MESSAGE.ENV_VARIABLES_NOT_LOADED(key));
    exit(1);
  }
}

app.listen(CONSTANTS.PORT, () => {
  console.log(`Server listening on port ${CONSTANTS.PORT}`);
});
