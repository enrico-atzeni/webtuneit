import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#ff4400',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#294cab',
            main: '#233a78',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ececec',
        },
        // Provide every color token (light, main, dark, and contrastText) when using
        // custom colors for props in Material UI's components.
        // Then you will be able to use it like this: `<Button color="custom">`
        // (For TypeScript, you need to add module augmentation for the `custom` value)
        gray: {
            light: '#7f8181',
            main: '#686a6a',
            dark: '#555656',
            contrastText: 'rgba(255, 255, 255, 0.5)',
        },
        white: {
            light: '#ffffee',
            main: '#ffeedd',
            dark: '#ffdddd',
            contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        background: {
            main: '#151b26',
            dark: '#131820'
        },

        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2
    },
    components: {
        MuiTypography: {
            variants: [
                {
                    props: { variant: "h1" },
                    style: {
                        fontSize: "2rem",
                        textTransform: "uppercase",
                    }
                },
                {
                    props: { variant: "h2" },
                    style: {
                        fontWeight: 700,
                        fontSize: "7rem",
                        textTransform: "uppercase",
                        color: "#ff4400"
                    }
                },
                {
                    props: { variant: "h3" },
                    style: {
                        fontWeight: 700,
                        fontSize: "2.7rem",
                        lineHeight: 2,
                        textTransform: "uppercase",
                        color: "#ff4400"
                    }
                },
                {
                    props: { variant: "h5" },
                    style: {
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#ff4400"
                    }
                },
                {
                    props: { variant: "h6" },
                    style: {
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#ff4400"
                    }
                }
            ]
        }
    }
});

export default theme