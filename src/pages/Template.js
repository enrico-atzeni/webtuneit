import './Template.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container } from '@mui/material'
import { useReducer } from "react";
import AppContext from '../AppContext';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function Template({ child, name }) {
    const useLocalStorage = false;
    
    const [nerdMode, setNerdMode] = useReducer((actual, newValue) => {
        if (useLocalStorage) localStorage.setItem("tun_nerdMode", newValue);
        return newValue;
    }, useLocalStorage && !!localStorage.getItem("tun_nerdMode"));

    const theme = useTheme();
    const xsScreen = !useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <Container className="App" style={{
            padding: 0
        }}>
            <AppContext.Provider value={{nerdMode, setNerdMode, xsScreen}}>
                <Header name={name}></Header>
                <Container className="PageContent" style={{
                    padding: xsScreen ? "3vh 0" : "3rem 0"
                }}>
                    {child}
                </Container>
                <Footer></Footer>
            </AppContext.Provider>
        </Container>
    );
}

export default Template;
