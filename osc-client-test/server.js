const OSC = require('osc-js')

/**

Prerequisites

1. Install https://github.com/stufisher/LiveOSC2
2. set control surface to LiveOSC2 in ableton live preferences -> Link MIDI
*/

const opts = {
    type: 'udp4',         // @param {string} 'udp4' or 'udp6'

    // receiving
    open: {
        host: 'localhost',    // @param {string} Hostname of udp server to bind to
        port: 9001,          // @param {number} Port of udp server to bind to
        exclusive: false      // @param {boolean} Exclusive flag
    },

    // sending
    send: {
        host: 'localhost',    // @param {string} Hostname of udp client for messaging
        port: 9000           // @param {number} Port of udp client for messaging
    }
}

/*const config = { udpClient: { port: 9001 } }

const osc = new OSC({
    plugin: new OSC.BridgePlugin(config)
})*/

const osc = new OSC({
    plugin: new OSC.DatagramPlugin()
})

const send_it = (msg) => {
    osc.send(msg, { port: 9001 })
}

const log_it = (path) => {
    osc.on(path, (msg) => console.log(path, msg.args))
}

osc.on('open', () => {
    console.log('is open')
    send_it(new OSC.Message('/live/tempo'))
    //const message = new OSC.Message('/live/play/clip', 1, 1)
    const message = new OSC.Message('/live/master/crossfader', Math.random())
    send_it(message)
    console.log('sent messsage')

    /*const bundle = new OSC.Bundle(Date.now() + 5000)
    bundle.add(message)
    send_it(bundle)*/
})

log_it('/live/clip/loopjump')
log_it('/live/tempo')

//osc.on('message', log_it)

osc.on('close', () => {
    console.log('closed')
  // connection was closed
});

osc.on('error', (err) => {
    console.log('err', err)
  // an error occurred
});

console.log('opening the connection')
osc.open({ port: 9000 })
