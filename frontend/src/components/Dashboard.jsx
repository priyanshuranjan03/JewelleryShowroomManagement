import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Dashboard() {
    return (
        <Box
            sx={{
                my: 8,
                mx: 'auto', // Center the content
                maxWidth: 600, // Set your desired max width
                width: '100%', // Take up full width
                p: 3, // Add padding for spacing
            }}
        >
            <Typography component="h1" variant="h5">
                Dashboard
            </Typography>
            {/* Add content for the dashboard here */}
        </Box>
    );
}

export default Dashboard;
