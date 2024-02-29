import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import TableTheme from '../components/TableTheme';

const RentDetails = () => {
    const [rentData, setRentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [formData, setFormData] = useState({
        rent_id: '',
        occasion_id: '',
        jewellery_id: '',
        customer_id: '',
        quantity: 0,
        rent_date: '',
        return_date: '',
    });

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8081/rentdetails');
            if (!response.ok) {
                throw new Error('Failed to fetch rent details');
            }

            const data = await response.json();

            // Add a unique id to each row
            const rentDataWithId = data.map((row, index) => ({ id: index + 1, ...row }));

            setRentData(rentDataWithId);
        } catch (error) {
            console.error('Error fetching rent details:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAddRent = async () => {
        try {
            const response = await fetch('http://localhost:8081/add_rent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add rent details');
            }

            // Fetch updated data after adding the item
            fetchData();
            setOpen(false); // Close the dialog
            setSnackbarMessage(`Rent details added successfully`);
            setSnackbarOpen(true); // Show success message
        } catch (error) {
            console.error('Error adding rent details:', error.message);
        }
    };

    const handleDeleteRent = async (rent_id) => {
        try {
            const response = await fetch('http://localhost:8081/delete_rent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rent_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete rent details');
            }

            // Fetch updated data after deleting the item
            fetchData();
            setSnackbarMessage(`Rent details deleted successfully`);
            setSnackbarOpen(true); // Show success message
        } catch (error) {
            console.error('Error deleting rent details:', error.message);
        }
    };

    const columns = [
        { field: 'rent_id', headerName: 'Rent ID', flex: 1 },
        { field: 'occasion_id', headerName: 'Occasion ID', flex: 2 },
        { field: 'jewellery_id', headerName: 'Jewellery ID', flex: 2 },
        { field: 'customer_id', headerName: 'Customer ID', flex: 2 },
        { field: 'quantity', headerName: 'Quantity', flex: 2 },
        {
            field: 'rent_date',
            headerName: 'Rent Date',
            flex: 2,
            valueGetter: (params) => {
                // Format date to 'yyyy-mm-dd' for display
                const date = params.row.rent_date;
                return date ? new Date(date).toLocaleDateString('en-GB') : null;
            },
        },
        {
            field: 'return_date',
            headerName: 'Return Date',
            flex: 2,
            valueGetter: (params) => {
                // Format date to 'yyyy-mm-dd' for display
                const date = params.row.return_date;
                return date ? new Date(date).toLocaleDateString('en-GB') : null;
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 2,
            renderCell: (params) => (
                <IconButton onClick={() => handleDeleteRent(params.row.rent_id)} color="secondary">
                    <DeleteIcon style={{ color: 'grey' }} />
                </IconButton>
            ),
        },
    ];

    const getRowId = (row) => row.rent_id;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <ThemeProvider theme={TableTheme}>
            <div style={{ height: 'calc(100vh - 100px)', width: '100%', padding: '20px', marginTop: '15px', marginRight: '15px' }}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Rent Details
                </Button>
                <DataGrid
                    rows={rentData}
                    columns={columns}
                    sort
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    loading={loading}
                    autoHeight
                    disableSelectionOnClick
                    disableColumnMenu
                    disableColumnFilter
                    disableColumnSelector
                    density="compact"
                    slotProps={{
                        loadingOverlay: { label: 'Loading...' },
                    }}
                    className="custom-data-grid"
                    getRowId={getRowId}
                    rowClassName={(params) =>
                        params.id === 1 ? 'custom-first-row' : 'custom-other-rows'
                    }
                    onRowClick={(params) => setSelectedRow(params.row)}
                    selectionModel={selectedRow ? [selectedRow.id] : []}
                />
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add Rent Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill in the details for the new rent.
                        </DialogContentText>
                        {/* Form fields */}
                        <TextField
                            margin="normal"
                            label="Rent ID"
                            name="rent_id"
                            type="number"
                            fullWidth
                            value={formData.rent_id}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Occasion ID"
                            name="occasion_id"
                            type="number"
                            fullWidth
                            value={formData.occasion_id}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Jewellery ID"
                            name="jewellery_id"
                            type="number"
                            fullWidth
                            value={formData.jewellery_id}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Customer ID"
                            name="customer_id"
                            type="number"
                            fullWidth
                            value={formData.customer_id}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Quantity"
                            name="quantity"
                            type="number"
                            fullWidth
                            value={formData.quantity}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Rent Date"
                            name="rent_date"
                            type="date"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.rent_date}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Return Date"
                            name="return_date"
                            type="date"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.return_date}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddRent} color="primary">
                            Add Rent
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    message={snackbarMessage}
                />
            </div>
        </ThemeProvider>
    );
};

export default RentDetails;
