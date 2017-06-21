//is in group = index + 1

export const SequencerMatrix = {
    values: {
        '0000': 0,
        '1000': 1,
        '0100': 2,
        '0010': 3,
        '0001': 4,
        '1100': 5,
        '1010': 6,
        '1001': 7,
        '0101': 8,
        '0011': 9,
        '1110': 10,
        '1101': 11,
        '1011': 12,
        '0111': 13,
        '1111': 14,
    },

    isGrouped: true,

    convertSequence(sequence) {
        return sequence.map((el) => el ? '1' : '0').join('')
    },

    get: function (sequence, index = 0) {
        const key = this.convertSequence(sequence)
        console.log('converted sequence', sequence, key)

        if (this.values[key] === undefined) {
            return
        }

        const slot = this.values[key];
        const indexOffset = this.isGrouped ? 1 : 0;

        return [index + indexOffset, slot];
    }
}
