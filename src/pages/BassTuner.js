import { useEffect } from 'react';
import Tuner from '../components/Tuner'
import Template from './Template'

function BassTuner() {
    useEffect(() => {
        document.title = "Bass tuner - Web Tune It";
    })
    
    return (
        <Template name="Bass" child={<Tuner instrument="bassguitar"></Tuner>}></Template>
    );
}

export default BassTuner;
