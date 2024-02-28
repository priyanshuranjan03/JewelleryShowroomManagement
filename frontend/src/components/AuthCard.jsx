import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import SignInView from './SignInView';
import Register from './Register';
import Dashboard from './Dashboard';

export default function AuthCard() {
    const [view, setView] = useState('signin'); // 'signin', 'signup', 'dashboard'
    const navigate = useNavigate();
    const handleSignIn = (userName) => {
        setView('dashboard');
        navigate('/dashboard', { state: { userName: userName } });

    };

    const handleSignUpClick = () => {
        setView('signup');
    };

    return (
        <ThemeProvider theme={createTheme()}>
            <Grid container component="main" sx={{ height: '100vh' }} className={`back-grid ${view === 'dashboard' ? 'dashboard-view' : ''}`}>
                <CssBaseline />
                {view !== 'dashboard' && (
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
                            display: view === 'dashboard' ? 'none' : 'flex',
                        }}
                    />
                )}
                {view !== 'dashboard' && (
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={5}
                        component={Paper}
                        elevation={6}
                        square
                        sx={{
                            display: view === 'dashboard' ? 'none' : 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100vh',
                        }}
                    >
                        {view === 'signin' && <SignInView onSignIn={handleSignIn} onSignUpClick={handleSignUpClick} />}
                        {view === 'signup' && <Register onSignIn={handleSignIn} />}
                    </Grid>
                )}
            </Grid>
            {/* {view === 'dashboard' && <Dashboard userName={userName} />} */}
        </ThemeProvider>
    );
}
