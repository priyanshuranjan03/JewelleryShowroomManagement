// PredictDiscount.js
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const PredictDiscount = () => {
    const [show, setShow] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [occasionId, setOccasionId] = useState('');
    const [predictedDiscount, setPredictedDiscount] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const fetchLoyaltyPoints = async (customerId) => {
        try {
            const response = await fetch(`http://localhost:8081/get_loyalty_points/${customerId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch loyalty points');
            }

            const data = await response.json();
            return data.loyalty_points;
        } catch (error) {
            console.error('Error fetching loyalty points:', error.message);
            return null;
        }
    };
    const fetchDiscountPer = async (occasionId) => {
        try {
            const response = await fetch(`http://localhost:8081/get_discount_per/${occasionId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch Discount %');
            }

            const data = await response.json();
            return data.discount;
        } catch (error) {
            console.error('Error fetching discount %:', error.message);
            return null;
        }
    };

    const predictDiscount = async () => {
        try {
            // Fetch loyalty points from customer.jsx
            const loyaltyPoints = await fetchLoyaltyPoints(customerId);

            // Fetch discount percent from occasion.jsx
            const discountPercent = await fetchDiscountPer(occasionId);

            // Send a request to Flask API with loyalty points and discount percent
            const response = await fetch('http://127.0.0.1:5000/predict_discount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ loyaltyPoints, discountPercent }),
            });

            if (!response.ok) {
                throw new Error('Failed to predict discount');
            }

            // Parse and return the predicted discount from the response
            const data = await response.json();

            setPredictedDiscount(Math.round(data.predicted_discount))
            return data.predicted_discount;
        } catch (error) {
            console.error('Error predicting discount:', error.message);
            throw error;
        }

    };

    return (
        <>
            <Button
                variant="outline-light"
                onClick={handleShow}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded shadow"
                style={{ marginLeft: '10px' }} // Adjust the margin as needed
            >
                Predict Discount
            </Button>

            <Modal show={show} onHide={handleClose} className="bg-gray-100">
                <Modal.Header closeButton className="bg-gray-200">
                    <Modal.Title className="text-xl font-semibold text-gray-800">
                        Predict Best Discount
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <Form.Group className="mb-3" controlId="customerId">
                            <Form.Label className="text-gray-800">Customer ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Customer ID"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                className="bg-gray-200 border-gray-300 text-gray-800 focus:ring-0 focus:border-blue-500 rounded-md shadow-sm"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="occasionId">
                            <Form.Label className="text-gray-800">Occasion ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Occasion ID"
                                value={occasionId}
                                onChange={(e) => setOccasionId(e.target.value)}
                                className="bg-gray-200 border-gray-300 text-gray-800 focus:ring-0 focus:border-blue-500 rounded-md shadow-sm"
                            />
                        </Form.Group>
                    </Form>
                    <Button
                        variant="primary"
                        onClick={predictDiscount}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded shadow"
                    >
                        Predict Discount
                    </Button>
                    {predictedDiscount !== null && (
                        <div className="3 flex items-center justify-center bg-gray-200 p-4 rounded-md shadow-md">
                            {predictedDiscount !== null && (
                                <div className="text-xl font-semibold text-green-600">
                                    Predicted Discount: {predictedDiscount}%
                                    <span className="text-base font-normal text-gray-700 ml-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 inline-block"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-gray-200">
                    <Button variant="secondary" onClick={handleClose} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PredictDiscount;
