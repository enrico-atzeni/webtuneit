import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import './Header.css';
import theme from "../theme/default"
import AppContext from '../AppContext';
import { useContext } from 'react';

function Header({name}) {  

    const {nerdMode, setNerdMode} = useContext(AppContext)

    return (
        <header className="App-header" style={{
            background: theme.palette.background.dark
        }}>
            <Stack 
                direction={{ xs: 'column', sm: 'row' }}
                alignItems="center" justifyContent="space-between">
                <Typography component="h1" variant="h1">Web Tune It {name && ` - ${name}`}</Typography>
                <FormGroup onChange={(e) => setNerdMode(e.target.checked)} sx={{display: { xs:"none", sm: "block" } }}>
                    <FormControlLabel control={<Switch checked={nerdMode} />} label="Nerd Mode" />
                </FormGroup>
            </Stack>
        </header>
    );
}

export default Header;
