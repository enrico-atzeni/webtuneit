import { useState, useCallback, useEffect, useRef } from "react";
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

import "./AudioVisualizations.css";

let bufferizedData = [];

function AudioVisualizations({audioSourceNode}) {
    const canvasWave = useRef(0)
    const canvasGraph = useRef(0)
    
    const [analyser, setAnalyser] = useState(null);
    const [drawGraphsNode, setDrawGraphsNode] = useState(null);
    const drawWave = useCallback((data) => {
        if (!canvasWave || !canvasWave.current) return;

        bufferizedData = [...bufferizedData, ...data];

        if (bufferizedData.length < canvasWave.current.width) {
            return;
        }

        const toDraw = bufferizedData.slice(0, canvasWave.current.width);
        bufferizedData = bufferizedData.slice(canvasWave.current.width);

        requestAnimationFrame(() => {
            if (!canvasWave || !canvasWave.current) return;
            // CANVAS LINE 
            // Get the canvas 2d context
            const canvasContext = canvasWave.current.getContext("2d");

            // Clear the canvas
            canvasContext.clearRect(
                0,
                0,
                canvasWave.current.width,
                canvasWave.current.height
            );

            let min = null;
            let max = null;
            toDraw.forEach((v) => {
                min = Math.min(min, v);
                max = Math.max(max, v);
            });

            // WAVE OSCILLATOR STYLE
            // draw bounds
            canvasContext.fillStyle = "#ffffee";
            canvasContext.fillText(Math.round(min * 10000) / 10000, canvasWave.current.width - 50, canvasWave.current.height - 20);
            canvasContext.fillText(Math.round(max * 10000) / 10000, canvasWave.current.width - 50, 20);

            const verticalPadding = 10;
            canvasContext.fillStyle = "#ff4400";

            // Draw the amplitude inside the canvas
            for (let i = 0; i < toDraw.length; i++) {
                // normalize current -1/1 to 0/canvas.current.height
                let value = ((toDraw[i] - min) / (max - min)) * (canvasWave.current.height - verticalPadding);
                // const pointValue = value / canvas.current.height;
                const y = canvasWave.current.height - (verticalPadding / 2) - value;
                canvasContext.fillRect(i, y, 2, 2);
            }
        });
    }, [])

    useEffect(() => {
        if (!canvasWave || !audioSourceNode) {
            if (audioSourceNode && typeof audioSourceNode.disconnet === "function" && drawGraphsNode) {
                console.log("Disconneting draw");
                audioSourceNode.disconnet(drawGraphsNode);
            }
            return;
        }
    }, [canvasWave, canvasGraph, drawGraphsNode, audioSourceNode])

    useEffect(() => {
        if (!audioSourceNode) return;
    
        const createWorklet = () => {
            let node = new AudioWorkletNode(
                audioSourceNode.context,
                "draw-graphs-processor"
            );

            // get data from processor
            node.port.onmessage = (e) => {
                // console.log(e.data);
                // buffer data until we have the canvas size
                drawWave(e.data);
            }

            audioSourceNode.connect(node);

            setDrawGraphsNode(node);
        }
        
        // check if module already exists
        try {
            createWorklet();
        } catch (err) {
            audioSourceNode.context.audioWorklet
                .addModule("/processors/draw-graphs-processor.js")
                .then(createWorklet)
                .catch(console.error)
                .finally(() => {
                    canvasWave.current.width = canvasWave.current.clientWidth;
                    canvasWave.current.height = canvasWave.current.clientHeight;
                })
        }
    }, [audioSourceNode, drawWave])

    useEffect(() => {
        if (audioSourceNode) {
            const node = audioSourceNode.context.createAnalyser();
            audioSourceNode.connect(node)
            setAnalyser(node);
        }
    }, [audioSourceNode])

    const nerdDrawGraph = useCallback(() => {
        if (!canvasGraph || !canvasGraph.current || !analyser) return;

        requestAnimationFrame(nerdDrawGraph);

        // BAR GRAPH
        // Get the canvas 2d context
        const canvasGraphContext = canvasGraph.current.getContext("2d");

        const bufferLength = analyser.frequencyBinCount / 5;
        const dataArray = new Uint8Array(bufferLength);

        // Clear the canvas
        canvasGraphContext.clearRect(
            0,
            0,
            canvasGraph.current.width,
            canvasGraph.current.height
        );

        // draw bounds
        canvasGraphContext.fillStyle = "#ffffee";
        canvasGraphContext.fillText("0 Hz", 5, 20);

        // manually measured.. yeah... sorry bro...
        canvasGraphContext.fillText("1500 Hz", canvasGraph.current.width - 43, 20);

        analyser.getByteFrequencyData(dataArray);

        const barWidth = (canvasGraph.current.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        const saturationV = 160;
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 1.15;
            canvasGraphContext.fillStyle = `rgb(${barHeight + saturationV}, ${68 + Math.max(0, saturationV - barHeight)}, ${0 + Math.max(0, saturationV - barHeight)})`;
            canvasGraphContext.fillRect(x, canvasGraph.current.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }, [analyser])

    useEffect(() => {
        if (analyser) {
            canvasGraph.current.width = canvasGraph.current.clientWidth;
            canvasGraph.current.height = canvasGraph.current.clientHeight;
            nerdDrawGraph();
        }
    }, [analyser, nerdDrawGraph])

    return (
        <Stack spacing={3} style={{ margin: "4rem 0" }}>
            <Typography>Wave visualization</Typography>
            <canvas className="canvas" ref={canvasWave}></canvas>

            <Typography>Graph</Typography>
            <canvas className="canvas" ref={canvasGraph}></canvas>
        </Stack>
    );
}

export default AudioVisualizations;
