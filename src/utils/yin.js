const yin = () => {
    const DEFAULT_THRESHOLD = 0.07;
    const floor = Math.floor;

    const difference = (data) => {
        let n = data.length;
        let results = new Float32Array(n);
        let difference;
        let summation;
        for (let tau = 0, windowSize = floor(n * 0.5); tau <= windowSize; tau++) {
            summation = 0;
            for (let j = 0; j < windowSize; j++) {
                difference = data[j] - data[j + tau];
                summation += difference * difference;
            }
            results[tau] = summation;
        }
        return results;
    }

    const cumulativeMeanNormalizedDifference = (data) => {
        let n = data.length;
        let results = new Float32Array(n);
        let summation;

        for (let tau = 0; tau < n; tau++) {
            summation = 0;
            for (let j = 0; j <= tau; j++) {
                summation += data[j];
            }
            results[tau] = data[tau] / (summation / tau);
        }
        return results;
    }

    const absoluteThreshold = (data, threshold) => {
        let x;
        let k = Number.POSITIVE_INFINITY;
        let tau;

        for (let i = 0, n = data.length; i < n; i++) {
            x = data[i];
            if (x < threshold) {
                return i;
            }
            if (x < k) {
                k = x;
                tau = i;
            }
        }
        return tau;
    }

    const bestLocalEstimate = (data, tau) => {
        let i = tau + 1;
        let n = data.length;
        let k = data[tau];
        while (i < n && data[i] < k) {
            k = data[i];
            i++;
        }
        return i - 1;
    }

    return (data, sampleRate, aThreshold) => {
        const threshold = aThreshold || DEFAULT_THRESHOLD;
        const results = cumulativeMeanNormalizedDifference(difference(data));
        const tau = absoluteThreshold(results, threshold);
        return sampleRate / bestLocalEstimate(results, tau);
    }
};

export default yin();
