
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
    let noteFrequencies = [];
    const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

    for (let octave = 0; octave < 9; octave++) {
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i];
            const freq = 440 * Math.pow(2, (octave - 4) + (i - 9) / 12);
            noteFrequencies.push({
                note: note,
                octave: octave,
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