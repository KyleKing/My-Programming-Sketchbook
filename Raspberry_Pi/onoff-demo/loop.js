// Demo Script to test monitoring a Child Process:
console.log('STARTED!');

// Loop the string, RUNNING
function func() {
  console.log('RUNNING');
}
setInterval(func, 1000);

// At set time, throw a FAKE ERROR
function fakeError() {
  throw Error('FAKE ERROR');
}
setTimeout(fakeError, 3000);
