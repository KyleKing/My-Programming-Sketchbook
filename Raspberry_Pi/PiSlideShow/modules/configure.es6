/* initialize debugger */
import { warn, init } from './debugger.es6';
const configDebug = init('config');

const fs = require('fs-extra');
const dbox = require('dbox');
const photoframe = require('./photoframe.es6');
// const util = require('./utilities.es6');

const link = 'https://www.dropbox.com/developers/apps';
const tempStr = `<copy_from ${link}>`;
const cmd = '\'node init\'';

const secret = fs.readJsonSync('secret.json');

const crontasks = require('./crontasks.es6');

module.exports = {

  /**
   * Make sure all necessary directories and files exist
   */
  init(dbCloudDir) {
    this.dbCloudDir = dbCloudDir;
    // Clear the entire directory and then make an empty one:
    configDebug('Delete then re-created "images/" directory');
    fs.removeSync('images');
    fs.ensureDirSync('images');
    // Flush both inventory files:
    fs.writeFileSync('history.json', '[]');
    fs.writeFileSync('images.json', '[]');
    this.checkSecret();
  },

  /**
   * Group all of the error messages for concision
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
      } else
        if (secret.appKey === tempStr)
          console.error(warn(this.step1_err));
        else if (!secret.accesstoken)
          this.getTokens();
        else {
          configDebug('Secret file configured, moving on!');
          this.fixDBoxFilenames();
        }
    });
  },

  /**
   * Get request token, then access token
   */
  getTokens() {
    configDebug('Checking tokens');
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
   * Make sure that no illegal characters are within the filenames
   */
  fixDBoxFilenames() {
    configDebug('Starting fixDBoxFilenames (Make sure dbox is linked and ' +
      ' not the version from npm!!!)');
    // Init
    const app = dbox.app({
      app_key: secret.app_key,
      app_secret: secret.app_secret,
    });
    const client = app.client(secret.accesstoken);
    const options = {
      list: true,
      root: 'dropbox',
    };

    client.metadata(this.dbCloudDir, options, (status, reply) => {
      this.contentslength = reply.contents.length;
      this.workaround = 0;
      for (let i = 0; i < this.contentslength; i++) {
        const path = reply.contents[i].path;
        // Only make a regexp replace call when necessary:
        // Remove all whitespace:
        if (/[*_\s-]/.test(path)) {
          const newPath = path.replace(/[*_\s-]/g, 'Y');
          client.mv(path, newPath, { root: 'dropbox' }, (stat, rep) => {
            this.workaround++;
            configDebug(`Completed step ${this.workaround} of ${this.contentslength}`);
            if (stat !== 200) {
              configDebug(`Name change stat: ${stat}`);
              configDebug(rep);
              configDebug(`Old_Path: ${path}`);
              configDebug(`newPath: ${newPath}`);
            }
            // Turn an async function into a synchronous callback:
            if (this.workaround === this.contentslength)
              this.finished();
          });
        } else
          this.workaround++;
        if (this.workaround === this.contentslength)
          this.finished();
      }
    });
  },

  /**
   * Once Dropbox API configured, start the app!
   */
  finished() {
    photoframe.downloadPhotos(this.dbCloudDir, this.cronCallback);
  },

  cronCallback() {
    if (process.env.LOCAL === 'false')
      crontasks.start();
  },
};