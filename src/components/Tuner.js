import { useState, useReducer, useEffect, useCallback } from "react";
import { Typography, Stack, Button, Container } from '@mui/material'
import { getNotesFrequencies, getFrequencyRange, getInputFromStorage } from "../utils/Utils";
import ModalAudioDevice from './ModalAudioDevice';
import EditIcon from '@mui/icons-material/Edit';
import MicIcon from '@mui/icons-material/Mic';
import AppContext from '../AppContext';
import { useContext } from 'react';

import "./Tuner.css";
import TuneEstimator from "./TuneEstimator";
import AudioVisualizations from "./AudioVisualizations";

function Tuner({instrument}) {
    const {nerdMode, xsScreen} = useContext(AppContext)

    const [notes] = useState(getNotesFrequencies(instrument));

    const [audioContext, setAudioContext] = useState(null);
    const [audioStatus, setAudioStatus] = useReducer((actual, newValue) => {
        if (["idle", "playing"].indexOf(newValue) !== -1) return newValue;
    }, "idle");
    const [sampleRate, setSampleRate] = useState(44100);

    const [requestAudioDevice, setRequestAudioDevice] = useState('');

    const [selectedInput, setSelectedInput] = useState(null);
    const [audioStream, setAudioStream] = useState(null);
    // const [filterNodes, setFilterNodes] = useState([]);
    const [postGainNode, setPostGainNode] = useState(null)
    
    
    
    // const [estimatedFrequency, setEstimatedFrequency] = useState(0);
    // useEffect(() => {
    //     // dynamic change filter gain depending on current estimated frequency
    //     if (!filterNodes.length || !estimatedFrequency) return;

    //     filterNodes.forEach((node) => {
    //         if (node.frequency.value > estimatedFrequency * 1.8) {
    //             node.gain.value = 5;
    //         } else if (node.frequency.value > estimatedFrequency * 1.5) {
    //             node.gain.value = 10;
    //         } else if (node.frequency.value > estimatedFrequency * 1.3) {
    //             node.gain.value = 12;
    //         } else if (node.frequency.value > estimatedFrequency * 1.1) {
    //             node.gain.value = 15;
    //         } else if (node.frequency.value < estimatedFrequency) {
    //             node.gain.value = 30;
    //         }
    //     })
    // }, [filterNodes, estimatedFrequency])

    const selectInput = (useSaved) => {
        console.log("select input", useSaved);
        setRequestAudioDevice(useSaved === true ? 'cached' : 'default');
    }

     const onStartBtnClick = (e) => {
        e.preventDefault();
        if (!selectedInput) return selectInput(true);
        else startMic(selectedInput)
    }

    const stopMic = (e) => {
        e.preventDefault();

        if (!audioContext) {
            console.error("No context found?");
            return;
        }

        audioContext.close().then(() => {
            // stop all the running audio tracks! this will remove "recording icon" from the brower's tab
            audioStream.getAudioTracks().forEach((track)=>track.stop());
            setAudioStatus("idle");
            setSelectedInput(null);
            setAudioContext(null);
            setPostGainNode(null);
        }).catch((err) => {
            console.error(err);
        })
    }

    const startMic =  useCallback((inputDevice) => {
        // console.log("called startMic", inputDevice)
        
        // A user interaction happened we can create the audioContext
        // because we call the stop method we need to create a new context each time
        // just ok, less resources
        const ctx = new AudioContext();
        setAudioContext(ctx);

        navigator.mediaDevices
            .getUserMedia(
                {
                    video: false,
                    audio: {
                        sampleRate: sampleRate,
                        deviceId: {
                            exact: inputDevice.deviceId
                        }
                    }
                })

            // @MediaStream
            .then((stream) => {
                return {
                    sourceNode: ctx.createMediaStreamSource(stream),
                    stream: stream
                }
            })

            // @MediaStreamAudioSourceNode
            .then(async ({ sourceNode, stream }) => {
                // save stream globally to stop it later
                // console.log("sample rate", ctx.sampleRate)
                setSampleRate(ctx.sampleRate);
                setAudioStream(stream);

                let filterNodes = [];

                const { min, max } = getFrequencyRange(instrument);

                const hiFilterNode = ctx.createBiquadFilter();
                hiFilterNode.type = "highshelf";
                hiFilterNode.frequency.value = max;
                hiFilterNode.gain.value = -30;

                const loFilterNode = ctx.createBiquadFilter();
                loFilterNode.type = "lowshelf";
                loFilterNode.frequency.value = min;
                loFilterNode.gain.value = -30;

                notes.forEach((tone) => {
                    if (tone.freq > max || tone.freq < min) return;

                    const node = ctx.createBiquadFilter();
                    node.type = "peaking";
                    node.frequency.value = tone.freq;
                    node.Q.value = 50;
                    node.gain.value = 30;
                    filterNodes.push(node);
                });

                // setFilterNodes(filterNodes);

                // // create Oscillator node
                // const oscillator = ctx.createOscillator();

                // oscillator.type = 'sine';
                // oscillator.frequency.value = 58.27; // value in hertz
                // oscillator.start();

                // basic pass filters
                sourceNode.connect(hiFilterNode);
                // oscillator.connect(hiFilterNode);

                hiFilterNode.connect(loFilterNode);

                for (let i = 0; i < filterNodes.length; i++) {
                    if (i === 0) loFilterNode.connect(filterNodes[i]);
                    else filterNodes[i - 1].connect(filterNodes[i]);
                }

                const gainNode = ctx.createGain();
                filterNodes[filterNodes.length - 1].connect(gainNode);
                gainNode.gain.value = 1;

                setPostGainNode(gainNode)

                // Play the audio
                setAudioStatus("playing");

            })
            .catch((err) => {
                console.error(`you got an error: ${err}`);
            });
    }, [notes, sampleRate, instrument])

    useEffect(() => {
        console.log("selected input", selectedInput)
        if (!selectedInput) return;

        localStorage.setItem("tuner_selectedInpt", JSON.stringify(selectedInput));
        console.log("nell'use effect");
        startMic(selectedInput);
    }, [selectedInput, startMic])

    // console.log("rendering");

    return (
        <>
            <Container maxWidth="sm">
                
                <Stack spacing={2} alignItems="center">
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                        <MicIcon color="primary"></MicIcon>
                        <Typography variant="h5">Audio device</Typography>
                    </Stack>
                    {getInputFromStorage() || selectedInput ? 
                        (
                    <Stack 
                        direction="row"
                        justifyContent="center"
                        spacing={2}
                        alignItems="center">
                            <Typography>{(getInputFromStorage() || selectedInput).label}</Typography>
                            <Button onClick={selectInput}><EditIcon fontSize="small" style={{margin:"-.2rem .3rem 0 0"}}></EditIcon> edit</Button> 
                        
                    </Stack>
                        ) :
                        (<Typography style={{lineHeight:"2.3rem"}}>No input device selected</Typography>)
                    }
                    <Stack minWidth="250px" justifyContent="center" style={{marginBottom: xsScreen ? "3vh" : "3rem"}}>
                        {audioStatus === "idle" ? (
                            <>
                                <Button variant="contained" onClick={onStartBtnClick}>{(getInputFromStorage() || selectedInput) ? "Start" : "Select and start"}</Button>
                            </>
                        ) : (
                            <Button variant="contained" color="secondary" onClick={stopMic}>Stop</Button>
                        )}
                    </Stack>
                    
                    <TuneEstimator
                        audioSourceNode={postGainNode}
                        sampleRate={sampleRate}
                        notesToCheckFor={notes}
                        nerdMode={nerdMode}
                        ></TuneEstimator>
                </Stack>
                
                {nerdMode && (
                    <AudioVisualizations
                        audioSourceNode={postGainNode}
                        ></AudioVisualizations>
                )}

            </Container>

            <ModalAudioDevice
                request={requestAudioDevice}
                onClose={() => setRequestAudioDevice('')}
                onInputDeviceSelected={(device) => {
                    setSelectedInput(device);
                    setRequestAudioDevice('');
                }}
                ></ModalAudioDevice>
        </>
    );
}

export default Tuner;
