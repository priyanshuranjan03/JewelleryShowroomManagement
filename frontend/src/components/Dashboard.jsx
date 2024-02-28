import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Card, CardContent, CardActionArea, CardMedia } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate, useLocation } from 'react-router-dom';
import NavbarItem from './Navbar';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userName = location.state?.userName || 'DefaultUser';

    const handleNavigation = (path) => {
        navigate(path);
    };

    const cardData = [
        { title: 'Customers', description: 'View and manage customer details.', path: '/customers', imageUrl: './assets/customer.jpg' },
        { title: 'Suppliers', description: 'Explore and manage supplier information.', path: '/suppliers', imageUrl: './assets/Supplier (2).jpg' },
        { title: 'Jewellery Items', description: 'Browse and update jewellery inventory.', path: '/jewellery', imageUrl: './assets/jewellery.jpg' },
        { title: 'Occasions', description: 'Manage special occasions and events.', path: '/occasions', imageUrl: './assets/ocassion.gif' },
        { title: 'Rent Details', description: 'View details of rented jewellery.', path: '/rent', imageUrl: './assets/rent.jpg' },
        { title: 'Buy Details', description: 'Track details of purchased jewellery.', path: '/buy', imageUrl: './assets/buy.jpg' },
    ];

    return (
        <div>
            {/* Header */}
            <NavbarItem />

            {/* Main Content */}
            <Container style={{ marginTop: '14px', padding: '14px' }}>
                <Typography variant="h4" style={{ marginBottom: '20px' }}>
                    Welcome back, {userName}!
                </Typography>

                {/* Cards */}
                <Container>
                    <Grid container spacing={3}>
                        {cardData.map((card, index) => (
                            <Grid key={index} item xs={12} sm={6} md={4}>
                                <Card className="group hover:shadow-xl transition-transform transform duration-300 ease-in-out">
                                    <CardActionArea onClick={() => handleNavigation(card.path)}>
                                        <CardMedia
                                            component="img"
                                            alt={card.title}
                                            height="140"
                                            image={card.imageUrl}
                                            className="w-full h-41 object-cover"
                                        />
                                        <CardContent className="text-center">
                                            <Typography gutterBottom variant="h5" component="div" className="text-lg font-semibold">
                                                {card.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {card.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Container>
        </div>
    );
}

export default Dashboard;
