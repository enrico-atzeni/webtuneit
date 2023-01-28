import { useEffect, useReducer, useState, useCallback } from "react";
import { Modal, Box, Typography, Stack, Button, CircularProgress } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic';
import {getInputFromStorage} from '../utils/Utils';

const ModalAudioDevice = ({request, onInputDeviceSelected, onClose}) => {
    const [showInputModal, setShowInputModal] = useState(false);
    const [audioDevices, setAudioDevices] = useState([]);
    const [error, setError] = useState("");
    const [showFakeRetryLoading, setShowFakeRetryLoading] = useReducer((actual, newValue) => {
        if (newValue) {
            setTimeout(() => {
                setShowFakeRetryLoading(false);
            }, 1000);
        }
        return newValue;
    }, false)

    // console.log("ModalAudioDevice rendering", request)

    const checkForAudioDevices = useCallback(() => {
        navigator.mediaDevices
            .getUserMedia({
                video: false,
                audio: true
            }).then(() => {
                // List cameras and microphones.
                navigator.mediaDevices.enumerateDevices()
                    .then((devices) => {
                        setError("");
                        setAudioDevices(devices.filter((device) => device.kind === "audioinput"));
                    })
                    .catch(catchAudioPromise);
            }).catch(catchAudioPromise);
    }, [])

    useEffect(() => {
        // console.log("in use Ueffect modal", request, audioDevices)

        if (request === '') return setShowInputModal(false);

        if (!audioDevices.length) return checkForAudioDevices();
        

        switch (request) {
            case 'cached':
                // prefer cached value if any
            
                const savedInput = getInputFromStorage() ?? {};

                // skip asking for input if we already have it saved
                for (let i = 0; i < audioDevices.length; i++) {
                    // input saved
                    if (audioDevices[i].deviceId === savedInput.deviceId) {
                        onInputDeviceSelected(savedInput);
                        return;
                    }
                }
                setShowInputModal(true);

            break;
            case 'default':
            default:
                setShowInputModal(true);
            break;    
        }
    }, [request, audioDevices, checkForAudioDevices, onInputDeviceSelected])

    const closeModal = () => {
        setShowInputModal(false);
        if (typeof onClose === "function") onClose();
    }

    const catchAudioPromise = (err) => {
        setAudioDevices([]);
        if (err.name === "NotAllowedError") {
            setError("Access denied, please check permissions in browser's settings.")
        } else if (typeof err === "object" && err.name && err.message) {
            setError(`${err.name}: ${err.message}`);
        } else {
            setError("No audio device found, please check permission in browser's settings.")
        }
    }

    // only on start
    // useEffect(() => {
    //     if (showInputModal && !audioDevices.length) checkForAudioDevices();
    // }, [showInputModal, audioDevices]);

    return (
        <Modal
            open={showInputModal}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: '#3c3d46',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                textAlign: "center"
            }}>
                <Stack
                    alignItems="center"
                    spacing={3}>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <MicIcon color="primary"></MicIcon>
                        <Typography variant="h5">choose audio device</Typography>
                    </Stack>

                    {!audioDevices.length ?
                        (
                            <>
                                <Typography>{error}</Typography>
                                {showFakeRetryLoading ? (
                                    <CircularProgress size="2.3rem" />
                                ) : (
                                    <Button variant="contained" onClick={() => {
                                        setShowFakeRetryLoading(true);
                                        checkForAudioDevices();
                                    }}>Retry</Button>
                                )}
                            </>
                        )
                        :
                        (
                            <Stack
                                spacing={1}>
                                {audioDevices.map((device) => {
                                    return (
                                        <Button
                                            key={device.deviceId}
                                            color="white"
                                            variant={device.deviceId === (getInputFromStorage() || {}).deviceId ? 'contained' : 'outlined'}
                                            onClick={() => {
                                                onInputDeviceSelected(device);
                                                closeModal();
                                            }}
                                            data-value={device.deviceId}>{device.label}</Button>
                                    )
                                })}
                            </Stack>
                        )}
                </Stack>

            </Box>
        </Modal>
    )
}

export default ModalAudioDevice;