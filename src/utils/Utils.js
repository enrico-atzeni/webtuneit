
const getFrequencyRange = (instrument) => {
    switch (instrument) {
        case "bassguitar":
            return {
                min: 50,
                max: 300
            };
        default:
            return {
                min: 14,
                max: 8000
            }
    }
}

const getNotesFrequencies = (instrument) => {
    let noteFrequencies = [
        {
            note: "B",
            octave: 8,
            freq: 7902.13
        },
        {
            note: "A",
            octave: 8,
            freq: 7040
        },
        {
            note: "G",
            octave: 8,
            freq: 6271.93
        },
        {
            note: "F",
            octave: 8,
            freq: 5587.65
        },
        {
            note: "E",
            octave: 8,
            freq: 5274.04
        },
        {
            note: "D",
            octave: 8,
            freq: 4698.63
        },
        {
            note: "C",
            octave: 8,
            freq: 4186.01
        }
    ];

    // calculate all frequencies from 8^ to 0
    for (let i = 0; i < noteFrequencies.length; i++) {
        const tune = noteFrequencies[i];

        // avoid loops
        if (tune.octave !== 8) continue;

        let freq = tune.freq;
        for (let o = tune.octave - 1; o >= 0; o--) {
            freq = Math.ceil(freq / 2 * 100) / 100;
            noteFrequencies.push({
                note: tune.note,
                octave: o,
                freq: freq
            });
        }
    }

    // sort by freq
    noteFrequencies.sort((a,b) => a.freq < b.freq);

    switch (instrument) {
        case "bassguitar":
            noteFrequencies = noteFrequencies.filter((tune) => {
                return ["B1", "E2", "A2", "D3", "G3", "C4"].indexOf(tune.note + tune.octave) !== -1;
            });
        break;
        default:
        break;
    }

    return noteFrequencies;
}

const getNoteStandardName = (note) => {
    switch (note) {
        case 'A': return 'LA';
        case 'B': return 'SI';
        case 'C': return 'DO';
        case 'D': return 'RE';
        case 'E': return 'MI';
        case 'F': return 'FA';
        case 'G': return 'SOL';
        default: return '-';
    }
}

const getInputFromStorage = () => {
    return JSON.parse(localStorage.getItem("tuner_selectedInpt"));
}

export {
    getNotesFrequencies,
    getFrequencyRange,
    getNoteStandardName,
    getInputFromStorage
};