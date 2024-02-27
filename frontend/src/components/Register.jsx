import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Register({ onSignIn }) {
    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation
        const nameError = validateName(formData.name);
        const employeeIdError = validateEmployeeId(formData.employeeId);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        if (nameError || employeeIdError || emailError || passwordError) {
            setErrors({
                name: nameError,
                employeeId: employeeIdError,
                email: emailError,
                password: passwordError,
            });
            return;
        }

        try {
            // Make a POST request to your server to insert the user into the database
            const response = await fetch('http://localhost:8081/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to register user');
            }

            // If registration is successful, proceed with sign-in
            console.log('User signed up:', formData);
            onSignIn();
        } catch (error) {
            console.error('Error registering user:', error.message);
            setErrors({
                name: 'Error registering user',
                employeeId: 'Error registering user',
                email: 'Error registering user',
                password: 'Error registering user',
            });
        }
    };

    const validateName = (name) => {
        if (!name.trim()) {
            return 'Name is required';
        }
        return null;
    };

    const validateEmployeeId = (employeeId) => {
        if (!employeeId.trim() || !employeeId.startsWith('JWS')) {
            return 'Employee ID is required and must start with JWS';
        }
        return null;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return null;
    };

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        return null;
    };

    return (
        <Box
            sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign Up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="employeeId"
                    label="Employee ID"
                    name="employeeId"
                    autoComplete="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    error={!!errors.employeeId}
                    helperText={errors.employeeId}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Sign Up
                </Button>
            </Box>
        </Box>
    );
}

export default Register;
