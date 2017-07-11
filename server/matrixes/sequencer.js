//is in group = index + 1

export const LinearSequenceMatrix = {
    values: {
        '0000': 0,
        '1000': 1,
        '0100': 2,
        '0010': 3,
        '0001': 4,
        '1100': 5,
        '1010': 6,
        '1001': 7,
        '0110': 8,
        '0101': 9,
        '0011': 10,
        '1110': 11,
        '1101': 12,
        '1011': 13,
        '0111': 14,
        '1111': 15
    },

    isGrouped: true,

    convertSequence(sequence) {
        return sequence.map((el) => el ? '1' : '0').join('')
    },

    get: function (sequence, index = 0) {
        const key = this.convertSequence(sequence)
        console.log('converted sequence', sequence, key)

        if (this.values[key] === undefined) {
            console.log('KEY', key, 'doesn\'t exits.sgldök.')
            return [-1, -1]
        }

        const slot = this.values[key];
        const indexOffset = this.isGrouped ? 1 : 0;

        return [index + indexOffset, slot];
    }
}
