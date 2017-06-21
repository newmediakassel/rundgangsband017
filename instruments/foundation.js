export default {

    /*osc: undefined;

    constructor(osc) {
        this.osc = osc
    }*/
    // static backend configuration
    ableton: {
        //name: 'ableton',
        path: '/live/master/crossfader'
    }

    // returns the current value
    value() {
        return Math.random()
    }

    /*on(path, callback) {
        this.osc.on(path, callback)
    }*/
}
