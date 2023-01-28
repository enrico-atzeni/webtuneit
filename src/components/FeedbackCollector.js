import { useState } from "react";
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import FeedbackIcon from '@mui/icons-material/Feedback';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FavoriteIcon from '@mui/icons-material/Favorite';

const FeedbackCollector = ({ style }) => {
    const [showInputModal, setShowInputModal] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const feedbacks = [
        {
            key: "like",
            value: "I love it!"
        },
        {
            key: "inaccurate",
            value: "Inaccurate"
        },
        {
            key: "missNotes",
            value: "Misses some notes"
        },
        {
            key: "missAudioDevice",
            value: "Does not detect one or more audio devices"
        },
        {
            key: "lacksCustomTunings",
            value: "Lacks custom tunings"
        }
    ]

    const closeModal = () => {
        setShowInputModal(false);
    }

    const flipStyle = {
        transform: "scale(-1, 1)"
    }

    const sendFeedback = (e) => {
        e.preventDefault();
        closeModal();

        fetch(process.env.PUBLIC_URL + '/feedback.json?k='+feedback);
    }

    return (
        <>
            <Button color="white" style={style} onClick={(e) => {
                e.preventDefault();
                setFeedback(null)
                setShowInputModal(true)
            }}>
                <FeedbackIcon style={flipStyle}></FeedbackIcon>
            </Button>
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
                    maxWidth: '90%',
                    boxSizing: 'border-box',
                    bgcolor: '#3c3d46',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    textAlign: "left"
                }}>
                    <Stack
                        alignItems="center"
                        spacing={3}>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <FeedbackIcon color="primary" style={flipStyle}></FeedbackIcon>
                            <Typography variant="h6">What's going on?</Typography>
                        </Stack>

                        <FormControl>
                            <FormLabel color="grey" id="rbfeedback">Leave us <b>anonymous</b> feedback</FormLabel>
                            <RadioGroup
                                aria-labelledby="rbfeedback"
                                name="radio-buttons-group"
                                onChange={(e) => setFeedback(e.target.value)}
                                value={feedback}
                            >
                                {feedbacks.map((feedback) => {
                                    return (<FormControlLabel key={feedback.key} value={feedback.key} label={
                                        <>
                                            {feedback.key === 'like' && <FavoriteIcon style={{fontSize:"1.2rem", verticalAlign:"sub", marginRight:".3em"}}></FavoriteIcon>}
                                            {feedback.value}
                                        </>
                                        } control={<Radio />}></FormControlLabel>)
                                })}
                            </RadioGroup>
                        </FormControl>

                        <Button variant="contained" onClick={sendFeedback} disabled={!feedback}>Send</Button>
                    </Stack>

                </Box>
            </Modal>
        </>
    )
}

export default FeedbackCollector;