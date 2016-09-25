console.log('starting...');
console.log('<<<html This is <strong>very</strong> HTML! >>>');
console.log('<<<tr column 1 | column 2 | column 3 >>>');
console.log('<<<tr column 1b | column 2b | column 3b >>>');

console.log('doing some math now!');
var count = 0;
var timer = setInterval(function() {
  console.log('<<<bar ' + Math.random() + ' >>>');
  count++;
  if (count > 10) {
    clearInterval(timer);
    console.log('done!');
  } else {
    console.log('calculating ' + count + '...');
  }
}, 1000);
