import { useEffect } from 'react';
import Tuner from '../components/Tuner'
import Template from './Template'

function ElectricGuitarTuner() {
    useEffect(() => {
        document.title = "Electric guitar tuner - Web Tune It";
    })

    return (
        <Template name="Electric Guitar" child={<Tuner instrument="electricguitar"></Tuner>}></Template>
    );
}

export default ElectricGuitarTuner;
