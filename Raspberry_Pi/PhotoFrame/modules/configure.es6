/* initialize debugger */
import { warn, init } from './debugger.es6';
const configDebug = init('config');

const fs = require('fs-extra');
const util = require('./utilities.es6');
const dbox = require('dbox');
const _ = require('underscore');

const link = 'https://www.dropbox.com/developers/apps';
const tempStr = `<copy_from ${link}>`;
const cmd = '\'node init\'';

const photoframe = require('./photoframe.es6');
const crontasks = require('./crontasks.es6');

module.exports = {

  /**
   * Make sure all necessary directories and files exist
   */
  init(dbCloudDir) {
    this.dbCloudDir = dbCloudDir;
    util.checkFS('images/', () => {
      configDebug('Making dir images/');
      fs.mkdirSync('images');
    });
    // Need to make a synchronous check for images.json
    _.each(['history.json', 'images.json'], (file) => {
      try {
        fs.accessSync(file, fs.F_OK);
      } catch (e) {
        configDebug(`Writing file: ${file}`);
        fs.writeFileSync(file, '[]');
      }
    });
    this.checkSecret();
  },

  /**
   * Group all of the messages for concision
   */
  errorMess() {
    this.step1 = `
Step 1: A secret.json file was created:
- At the link below, create a new Dropbox App
${link}
- Copy the appropriate keys to the secret.json file
- Then rerun with ${cmd}`;
    this.step1_err = `
Step 1 error - make sure to visit ${link} and
to update secret.json appropriately`;
    this.step2 = `
Step 2: Visit the below link and
once approved, rerun this app with: ${cmd}`;
  },

  /**
   * Determine state of the secret credentials
   */
  checkSecret() {
    configDebug('Checking secret configuration');
    fs.ensureFile('secret.json', (err) => {
      if (err) {
        fs.writeJsonSync('secret.json', {
          app_key: tempStr,
          app_secret: tempStr,
        });
        console.error(warn(this.step1));
      } else {
        const secret = fs.readJsonSync('secret.json');
        if (secret.appKey === tempStr)
          console.error(warn(this.step1_err));
        else if (!secret.accesstoken)
          this.getTokens();
        else {
          configDebug('Secret file configured, moving on!');
          this.finished();
        }
      }
    });
  },

  /**
   * Get request token, then access token
   */
  getTokens() {
    configDebug('Checking tokens');
    const secret = fs.readJsonSync('secret.json');
    const app = dbox.app({
      app_key: secret.app_key,
      app_secret: secret.app_secret,
    });
    if (!secret.requesttoken)
      app.requesttoken((status, requesttoken) => {
        this.parseTokenError(status, requesttoken);
        console.error(warn(`${this.step3}\n${requesttoken.authorize_url}`));
        secret.requesttoken = requesttoken;
        fs.writeJsonSync('secret.json', secret);
      });
    else if (!secret.accesstoken)
      app.accesstoken(secret.requesttoken, (status, accesstoken) => {
        this.parseTokenError(status, accesstoken);
        if (status === 401) delete secret.requesttoken;
        else secret.accesstoken = accesstoken;
        fs.writeJsonSync('secret.json', secret);
      });
  },

  /**
   * Weird API response, but made a workaround
   */
  parseTokenError(status, tokenError) {
    if (status === 200)
      return 1;
    else if (status === 401) {
      console.error(`Please run ${cmd} again`);
      console.error(JSON.parse(Object.keys(tokenError)[0]).error);
    } else {
      console.error(`Unknown error, status code = ${status}`);
      console.error(tokenError);
    }
    return 0;
  },

  /**
   * Once Dropbox API configured, start the app!
   */
  finished() {
    photoframe.init(this.dbCloudDir);
    crontasks.start();
  },
};
