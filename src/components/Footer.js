import './Footer.css';
import theme from "../theme/default"
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AppContext from '../AppContext';
import { useContext } from 'react';
import { Link } from '@mui/material';

function Footer() {
    const {nerdMode, setNerdMode, xsScreen} = useContext(AppContext)

    return (
        <Stack id="footer" alignItems="center" justifyContent="space-around" style={{
            background: theme.palette.background.dark,
            minHeight: "3rem",
            position: xsScreen ? "static" : "fixed",
            padding: xsScreen ? "2rem 0 1rem" : "0",
            bottom: 0,
            left: 0,
            width: "100%"
        }}>
            <FormGroup onChange={(e) => setNerdMode(e.target.checked)}  sx={{display: { xs:"block", sm: "none" } }}>
                <FormControlLabel control={<Switch checked={nerdMode} />} label="Nerd Mode" />
            </FormGroup>
            
            <Stack direction="row" alignItems="center" spacing={2}>
                <img src={process.env.PUBLIC_URL + '/img/icon-32.png'} style={{opacity:.3}} alt="Web Tune It" />

                <Typography variant="caption" display="block" gutterBottom style={{
                    color: theme.palette.gray.main
                }}>
                    &copy;{new Date().getFullYear()} Web Tune It, all rights reserved
                </Typography>

                <Link variant="caption" href="https://github.com/enrico-atzeni/webtuneit/" target="_blank">GitHub</Link>
            </Stack>

            <Typography variant="caption" display="block" gutterBottom style={{
                    color: theme.palette.gray.main,
                    marginTop: xsScreen ? "1em" : 0
                }}>
                Cookie? Privacy? Hey there! Just wanted to let you know that this website doesn't collect any personal data from you. We also don't have any tracking or ads. And the best part? It's totally free to use. Enjoy!
            </Typography>
        </Stack>
    );
}

export default Footer;
