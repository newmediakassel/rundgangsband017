import OSC from 'osc-js'

class Ableton {

    constructor(remote = { host: 'localhost', port: 9001 }, port = 9000) {
        this.remote = remote
        this.port = port

        this.prefix = '/live/'

        this.osc = new OSC({
            plugin: new OSC.DatagramPlugin()
        })

        this.osc.open({ port: this.port })
    }

    /**
        Constructs a osc message and sends it to the given ableton live path
     */
    set() {
        // converts arguments into a list
        const args = [].slice.call(arguments)
        // extracts the path from the arguments
        const path = args.shift()
        //console.log(arguments)
        /*if (value === undefined) {
            console.warn('Ableton.set called without a valid value', path)
            return;
        }*/

        console.log('setting ableton live -->', path, ...args)

        const message = new OSC.Message(this.prefix + path, ...args)
        const { host, port } = this.remote

        this.osc.send(message, { host, port })
    }

    /**
    @example

    // subscribe to '/foo/bar'
    const fooSubscription = ableton.subscribeTo('/foo/bar', callback)

    // unsubscribe
    fooSubscription.end()
    */
    subscribeTo(path, callback) {
        const cb = (msg) => {
            callback.call(msg, ...msg.args)
        }

        this.osc.on(this.prefix + path, cb)

        // send a get message to the remote to make sure you're always getting
        // a reponse with the current state as soon as you subscribe to a channel.
        const message = new OSC.Message(this.prefix + path)
        const { host, port } = this.remote

        console.log('setting ableton live ', path)

        this.osc.send(message, { host, port })

        // TODO return the unsubscribe function right away
        return { end: () => { /*this.osc.off(path, cb)*/ console.warn('implement me') } }
    }
}

export default Ableton
