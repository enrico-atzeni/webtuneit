import { useState, useCallback, useEffect } from "react";
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { getNoteStandardName } from "../utils/Utils";
import { useContext } from 'react';
import AppContext from '../AppContext';
import yin from '../utils/yin';

import "./TuneEstimator.css";
import bassimg from '../assets/bassbg-low.jpg'
import stringA from '../assets/string-a.png'
import stringB from '../assets/string-b.png'
import stringC from '../assets/string-c.png'
import stringD from '../assets/string-d.png'
import stringE from '../assets/string-e.png'
import stringG from '../assets/string-g.png'
import FeedbackCollector from "./FeedbackCollector";

let bufferizedData = [];

function TuneEstimator({sampleRate, nerdMode, notesToCheckFor, audioSourceNode}) {
    const [estimatedNote, setEstimatedNote] = useState({});
    const [estimatedFrequency, setEstimatedFrequency] = useState(0);
    const {xsScreen} = useContext(AppContext)

    // lower equals a faster analysys, but it may miss low freq notes
    let checkTuneEveryXFrames = sampleRate / 6;
    const bufferizedCheckTune = useCallback((data) => {
        // console.log("called buffchecktune", bufferizedData.length);
        bufferizedData = [...bufferizedData, ...data];
        if (bufferizedData.length < checkTuneEveryXFrames) return;

        let channel = bufferizedData.slice(0, checkTuneEveryXFrames);

        bufferizedData = bufferizedData.slice(checkTuneEveryXFrames);

        const estimatedFrequencyFromYin = yin(channel, sampleRate);

        let nearestDistance = null;
        let nearestTone = null;

        for (let i = 0; i < notesToCheckFor.length; i++) {
            const tone = notesToCheckFor[i];
            let distance = Math.abs(tone.freq - estimatedFrequencyFromYin) / tone.freq;
            if (nearestTone === null || distance < nearestDistance) {
                nearestDistance = distance;
                nearestTone = tone;
            }
        }

        setEstimatedFrequency(isNaN(estimatedFrequencyFromYin) ? 0 : estimatedFrequencyFromYin);
        setEstimatedNote(nearestTone);
    }, [notesToCheckFor, checkTuneEveryXFrames, sampleRate])
    
    useEffect(() => {
        if (!audioSourceNode) return;
    
        // console.log("creating worklet")
        let tunerNode;

        audioSourceNode.context.audioWorklet.addModule("/processors/tuner-processor.js").then(() => {
            tunerNode = new AudioWorkletNode(
                audioSourceNode.context,
                "tuner-processor"
            );
    
            // get data from processor
            tunerNode.port.onmessage = (e) => {
                // console.log("on worklet message");
                // buffer data until we have the canvas size
                bufferizedCheckTune(e.data);
            }
    
            audioSourceNode.connect(tunerNode);
        }).catch((err) => {
            console.error(err);
        })

        return () => {
            console.log("tuneEstimator unmounting")
            audioSourceNode.disconnect(tunerNode);
        }
    }, [audioSourceNode, bufferizedCheckTune])

    // console.log("tuner estimator", estimatedNote, audioSourceNode);

    // if (!audioSourceNode) return (<></>);

    return (
        <>
            {estimatedNote.note && (
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                    <Typography>Note:</Typography>
                    <Stack direction="row" alignItems="flex-end">
                        <Typography variant="h2">{estimatedNote.note}</Typography>
                        {nerdMode && <Typography variant="h3">{estimatedNote.octave}</Typography>}
                    </Stack>
                    <Typography variant="h5">/ {getNoteStandardName(estimatedNote.note)}</Typography>
                </Stack>
            )}

            {estimatedNote.note && nerdMode ? (<Typography style={{
                height: 0,
                margin: "-1em 0 1em"
            }}>{estimatedNote.freq} Hz</Typography>) : <></>}

            {(estimatedNote.note && estimatedFrequency) ? (
                <span className="tuner-wrap" style={{ margin: "1rem 0" }}>
                    <FeedbackCollector style={{
                        position: "absolute",
                        left: xsScreen ? "-3.5rem" : "-4rem",
                        top: "-0.1rem"
                    }}></FeedbackCollector>
                    <i className="tune" style={{
                        left: Math.min(95, Math.max(5, (50 * Math.pow(estimatedFrequency / estimatedNote.freq, 8)))) + "%"
                    }}></i>
                    {(nerdMode) ? (
                        <Typography className="tune-text tune" variant="h6" style={{
                            left: Math.min(95, Math.max(5, (50 * Math.pow(estimatedFrequency / estimatedNote.freq, 8)))) + "%"
                        }}>{estimatedFrequency} Hz</Typography>
                    ) : <></>}
                </span>
            ) : <></>}

            <div id="imgtune" className={estimatedNote.note ? 'side' : ''}>
                <img id="baseimg" src={bassimg} alt="Bass Strings tune hint" />
                <img className="string" src={stringB} alt="B String stroke" style={{opacity: estimatedNote && estimatedNote.note === 'B' && estimatedNote.octave === 1 ? 1 : 0}} />
                <img className="string" src={stringE} alt="E String stroke" style={{opacity: estimatedNote && estimatedNote.note === 'E' && estimatedNote.octave === 2 ? 1 : 0}} />
                <img className="string" src={stringA} alt="A String stroke" style={{opacity: estimatedNote && estimatedNote.note === 'A' && estimatedNote.octave === 2 ? 1 : 0}} />
                <img className="string" src={stringD} alt="D String stroke" style={{opacity: estimatedNote && estimatedNote.note === 'D' && estimatedNote.octave === 3 ? 1 : 0}} />
                <img className="string" src={stringG} alt="G String stroke" style={{opacity: estimatedNote && estimatedNote.note === 'G' && estimatedNote.octave === 3 ? 1 : 0}} />
                <img className="string" src={stringC} alt="C String stroke" style={{opacity: estimatedNote && estimatedNote.note === 'C' && estimatedNote.octave === 4 ? 1 : 0}} />
            </div>

        </>
    );
}

export default TuneEstimator;
