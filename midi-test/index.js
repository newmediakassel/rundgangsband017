var midi = require('midi'),
    midiOut = new midi.output();

try {
  midiOut.openPort(0);
} catch(error) {
  midiOut.openVirtualPort('');
}

// 143 + 16 Midi Channels, note, anschlagstärke
//midiOut.sendMessage([144, 64, 50]);

setInterval(function() {
    midiOut.sendMessage([144, 64, 50]);
}, 500);

setTimeout(function(){
  midiOut.closePort();
}, 1000 * 60 * 60);
