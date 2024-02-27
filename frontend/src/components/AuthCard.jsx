import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Register from './Register';
import SignInView from './SignInView';
import Dashboard from './Dashboard';

export default function AuthCard() {
    const [view, setView] = useState('signin'); // 'signin', 'signup', 'dashboard'

    const handleSignIn = () => {
        const backgroundGrid = document.querySelector('.back-grid');
        if (backgroundGrid) {
            backgroundGrid.remove();
        }
        setView('dashboard');
    };

    const handleSignUpClick = () => {
        setView('signup');
    };

    return (
        <ThemeProvider theme={createTheme()}>
            <Grid container component="main" sx={{ height: '100vh' }} className='back-grid'>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    className="background-grid"
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: view === 'dashboard' ? 'none' : 'url(https://th.bing.com/th/id/OIG2.SfExwh.rkiSLUhJyAaZF?w=1024&h=1024&rs=1&pid=ImgDetMain)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    {view === 'signin' && <SignInView onSignIn={handleSignIn} onSignUpClick={handleSignUpClick} />}
                    {view === 'signup' && <Register onSignIn={handleSignIn} />}

                </Grid>
            </Grid>
            {view === 'dashboard' && <Dashboard />}
        </ThemeProvider>
    );
}
