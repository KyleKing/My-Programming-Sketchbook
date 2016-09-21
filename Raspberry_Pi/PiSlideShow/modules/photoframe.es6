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

// // require gulp plugins
// const gulp = require('gulp');
// const imageresize = require('gulp-image-resize');

module.exports = {
  downloadPhotos(dbCloudDir, cb) {
    photoDebug('Starting downloadPhotos()');
    const client = app.client(secret.accesstoken);
    const options = { root: 'dropbox' };

    // Get list of available images
    client.metadata(dbCloudDir, options, (status, imgList) => {
      photoDebug(`Dropbox metadata status = ${status}`);
      const desiredImgs = [];
      this.syncCount = imgList.contents.length;
      this.syncCounter = 0;
      for (let i = 0; i < this.syncCount; i++) {
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
              this.syncCounter++;
              this.syncWorkaround(desiredImgs, cb);
            });
          else {
            console.log(ignore(`** ${localpath} exists`));
            this.syncCounter++;
            this.syncWorkaround(desiredImgs, cb);
          }
        });
      }
    });
  },
  syncWorkaround(desiredImgs, cb) {
    // // Once the list of images is updated, start the next steps
    // photoDebug(`Completed step ${this.syncCounter} of ${this.syncCount}`);
    if (this.syncCounter === this.syncCount) {
      photoDebug('Writing image.json with syncWorkaround');
      fs.writeJSONSync('images.json', desiredImgs);
      this.deleteExcessFiles();
      this.imageDownSize('images/*', 'images/');
      if (cb) cb();
    }
  },

  /**
   * Make sure images are the correct resolution for the screen
   */
  imageDownSize(imgPath, imgDest, cb) {
    const resizeSet = {
      width: 800,
      height: 400,
      crop: false,
      upscale: false,
    };
    photoDebug('Running imageDownSize');
    photoDebug(resizeSet);
    photoDebug('FIXME: POSSIBLY CAUSING CRASH - deactivated for now');
    // gulp.src(imgPath).pipe(imageresize(resizeSet)).pipe(gulp.dest(imgDest));
    photoDebug('Finished imageDownSize');
    if (cb) cb();
  },

  deleteExcessFiles() {
    photoDebug('Starting deleteExcessFiles()');
    glob('images/*.*', (err, existingImgs) => {
      this.deleteFiles(err, existingImgs);
    });
  },
  deleteFiles(err, existingImgs) {
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
  },

  /**
   * Create Slide Show by scheduling images for FBI
   */
  runFBI() {
    if (process.env.LOCAL === 'false') {
      const imgPath = '/home/pi/PiSlideShow/images/*';
      const opt = '--blend 2 -noverbose --random --noonce';
      const command = `sudo fbi -T 1 -a -u -t 2 ${opt} ${imgPath}`;
      exec(command, (err, stdout, stderr) => {
        fbiDebug(`Running FBI Task: ${command}`);
        if (stdout) {
          fbiDebug(warn('stdout:'));
          fbiDebug(stdout);
        }
        if (stderr) fbiDebug(`FBI stderr: ${stderr}`);
        if (err) fbiDebug(`FBI err: ${err}`);
      });
    } else
      console.log('Not on Raspberry Pi - not running FBI Task');
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
