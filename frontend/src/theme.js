import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#00796b', // Teal 700
            light: '#48a999',
            dark: '#004c40',
            contrastText: '#fff',
        },
        secondary: {
            main: '#0288d1', // Light Blue 700
            light: '#5eb8ff',
            dark: '#005b9f',
            contrastText: '#fff',
        },
        background: {
            default: '#f4f7f6',
            paper: '#ffffff',
        },
        text: {
            primary: '#1c2434', // Darker, sharper text
            secondary: '#64748b', // Modern gray
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.01em',
        },
    },
    shape: {
        borderRadius: 4, // Revert to default 4px base so sx={{ borderRadius: 4 }} results in 16px, not 48px
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px', // Explicit 12px
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #00796b 30%, #48a999 90%)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                },
                elevation1: {
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
                },
                elevation3: {
                    boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    overflow: 'hidden',
                },
            },
        },
    },
});

export default theme;
