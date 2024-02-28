// JewelleryItem.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JewelleryItem = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/dashboard'); // Go back to the previous page
    };

    return (
        <div>
            {/* Header */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Jewellery Item</Typography>
                    <Button color="inherit" onClick={handleGoBack}>Back</Button>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container style={{ marginTop: '20px' }}>
                <Typography variant="h4" style={{ marginBottom: '20px' }}>Jewellery Item Details</Typography>
                {/* Add your content here */}
            </Container>
        </div>
    );
}

export default JewelleryItem;
