/* initialize debugger */
import { init, existsSync } from './debugger.es6';
const dataDebug = init('data');
dataDebug('Debugger initialized!');

const Datastore = require('nedb');
const moment = require('moment');
const alarms = new Datastore({
  filename: './data/alarms',
  autoload: true,
});

function randCron() {
  const randVal = Math.floor(Math.random() * (20));
  const uniq = moment().format(`YYYY_DDDD_kk_mm_ss_${randVal}`);
  return uniq;
}

if (existsSync('./data/alarms')) {
  // Load all of the stored cron data and re-schedule
  console.log('Using existing cron DB');
  alarms.find({}, (err, docs) => {
    if (err) throw new Error(err);
    docs.forEach((doc) => {
      // console.log(`${doc.title} = doc.title`);
      console.log(`${doc.uniq} = doc.uniq`);
      // console.log(`${doc.schedule} = doc.schedule`);
      // Call function to schedule doc
    });
  });
} else {
  // create a fresh cron database
  console.log('Creating a fresh cron DB with fake data');
  const prefs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const schedule = '* * * * * *';
  prefs.forEach((pref, index) => {
    const stepIdx = index + 1;
    alarms.insert({
      uniq: randCron(),
      title: 'ALARM!',
      schedule,
      status: 'queue',
      saved: !!Math.floor(Math.random() * 2),
      started: Boolean(Math.floor(Math.random() * 2)),
      index: stepIdx,
    });
  });
}

module.exports = { alarms };
