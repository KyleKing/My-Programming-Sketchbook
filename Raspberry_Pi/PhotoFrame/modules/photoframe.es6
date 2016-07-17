/* initialize debugger */
import { error, warn, ignore, init } from './debugger.es6';
const fbiDebug = init('fbi');
const photoDebug = init('photoframe');

const fs = require('fs-extra');
const path = require('path');
const dbox = require('dbox');
const secret = fs.readJsonSync('./secret.json');
const app = dbox.app({
  app_key: secret.app_key,
  app_secret: secret.app_secret,
});
const glob = require('glob');
const exec = require('child_process').exec;

module.exports = {

  /**
   * Configure setup and scoped variables
   */
  init(dbCloudDir) {
    this.downloadPhotos(dbCloudDir);
  },

  /**
   * Configure setup and scoped variables
   */
  downloadPhotos(dbCloudDir) {
    // client.mv("foo", "bar", function(status, reply){
    //   console.log(reply)
    // })

    photoDebug('Starting downloadPhotos()');
    const client = app.client(secret.accesstoken);
    const options = { root: 'dropbox' };
    // Get list of available images
    client.metadata(dbCloudDir, options, (status, imgList) => {
      photoDebug(`Dropbox metadata status = ${status}`);
      const desiredImgs = [];
      for (let i = 0; i < imgList.contents.length; i++) {
        const filepath = imgList.contents[i].path;
        const localpath = `images/${path.basename(filepath)}`;
        desiredImgs.push(localpath);
        // Check if image is stored locally and download those not found
        fs.access(localpath, fs.R_OK | fs.W_OK, (notFound) => {
          if (notFound)
            client.get(filepath, options, (stat, reply) => {
              // const localpath = `images/${path.basename(metadata.path)}`;
              const wstream = fs.createWriteStream(localpath);
              wstream.write(reply);
              console.log(warn(`>> Downloaded: ${localpath}`));
            });
          else
            console.log(ignore(`** ${localpath} exists`));
        });
      }
      // Once the list of images is updated, start the next steps
      fs.writeJSONSync('images.json', desiredImgs);
      this.deleteExcessFiles();
    });
  },

  /**
   * Clean up excess images
   */
  deleteExcessFiles() {
    photoDebug('Starting deleteExcessFiles()');
    glob('images/*.*', (err, existingImgs) => {
      if (err) console.error(error(err));
      const desiredImgs = fs.readJsonSync('images.json');
      photoDebug('List of desired images:');
      photoDebug(desiredImgs);
      if ((existingImgs.length - desiredImgs.length) === 0)
        photoDebug('All images accounted for');
      else
        for (let i = 0; i < existingImgs.length; i++) {
          const localImg = existingImgs[i];
          if (desiredImgs.indexOf(localImg) === -1) {
            console.log(warn(`Deleting: ${localImg}`));
            fs.unlink(localImg);
          }
        }
    });
  },

  /**
   * Create slideshow by scheduling images for FBI
   */
  runFBI() {
    if (!process.env.LOCAL) {
      fbiDebug('Starting runFBI()');
      const newImagePath = this.newImage();

      // The -T option makes sure the command is run on the pi and not on my
      // device when connected over SSH
      const completepath = `"/home/pi/PhotoFrame/${newImagePath}"`;
      const command = `sudo fbi -a -noverbose -T 10 ${completepath}`;
      exec(command, (err, stdout, stderr) => {
        if (err) fbiDebug(error(err));
        fbiDebug(`Switching image displayed: ${command}`);
        if (stdout) fbiDebug(warn(`stdout: ${stdout}`));
        if (stderr) fbiDebug(error(`stderr: ${stderr}`));
      });
    } else
      console.log('No FBI was run');
  },

  /* Randomly selects a random index of a given array */
  ranIndex: (files) => Math.round((files.length - 1) * Math.random()),

  /**
   * Remove redundancy in slide show and select a new image
   */
  newImage() {
    const files = fs.readJsonSync('images.json');
    const prevImages = fs.readJsonSync('history.json');
    if (prevImages.length >= 20 || prevImages.length + 5 === files.length)
      // Remove first entry (i.e. oldest image already shown)
      prevImages.shift();
    // Keep selecting a random file to find a new file
    let newImagePath = files[this.ranIndex(files)];
    fbiDebug(ignore(`Lengths { prevImages: ${prevImages.length} & files: ${files.length} }
              indexOf: ${prevImages.indexOf(newImagePath)}`));
    while (prevImages.indexOf(newImagePath) !== -1)
      newImagePath = files[this.ranIndex(files)];
    fbiDebug(ignore(`newImagePath: ${newImagePath}`));
    prevImages.push(newImagePath);
    fs.writeJSONSync('history.json', prevImages);
    return newImagePath;
  },
};
