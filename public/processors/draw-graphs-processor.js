class DrawGraphsProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        // receive messages from AudioWorkletNode
        this.port.onmessage = (event) => {
            // Handling data from the node.
            // console.log(event.data);
        };
    }

    // 128 bit lenght?
    // see @https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process#parameters
    process(inputList, outputs, parameters) {
        // input contains a list of devices
        // each device contains a list of channels
        // each channel has a list of frames
        if (!inputList.length || !inputList[0].length) {
            // alert("No input found");
            // console.log(inputList);
            return false;
        }

        
        // console.log(inputList);
        // average all channels
        let channel = new Array(inputList[0][0].length).fill(0);
        for (let k=0; k < inputList[0].length; k++) {
            let ch = inputList[0][k];
            for (let i=0; i < ch.length; i++) {
                channel[i] += ch[i];
            }
        }
        channel = channel.map((x) => x/inputList[0].length);
        
        this.port.postMessage(channel);

        

        // true: still using, call me again
        // false: finished, do not call me anymore
        return true;
    }
}

registerProcessor("draw-graphs-processor", DrawGraphsProcessor);
