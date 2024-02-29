import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TableTheme from '../components/TableTheme';

const BuyDetails = () => {
    const [buysData, setBuysData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [formData, setFormData] = useState({
        buy_id: '',
        occasion_id: '',
        jewellery_id: '',
        customer_id: '',
        quantity: 0,
        buy_date: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8081/get_buy_details');
            if (!response.ok) {
                throw new Error('Failed to fetch buy details');
            }

            const data = await response.json();

            // Add a unique id to each row
            const buysDataWithId = data.map((row, index) => ({ id: index + 1, ...row }));

            setBuysData(buysDataWithId);
        } catch (error) {
            console.error('Error fetching buy details:', error.message);
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
        setIsEditing(false); // Close editing mode when the dialog is closed
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAddBuy = async () => {
        try {
            // Add your validation logic here
            if (formData.jewellery_id < 101) {
                setSnackbarMessage('Jewellery ID should be greater than or equal to 101');
                setSnackbarOpen(true);
                return;
            }

            const url = isEditing ? 'http://localhost:8081/update_buy_details' : 'http://localhost:8081/add_buy_details';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Failed to update buy details' : 'Failed to add buy details');
            }

            // Fetch updated data after adding/updating the buy details
            fetchData();
            setOpen(false); // Close the dialog
            setSnackbarMessage(`Buy details ${isEditing ? 'updated' : 'added'} successfully`);
            setSnackbarOpen(true); // Show success message
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} buy details:`, error.message);
            setSnackbarMessage(`Error ${isEditing ? 'updating' : 'adding'} buy details. Please check your input and try again.`);
            setSnackbarOpen(true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeleteBuy = async (buy_id) => {
        try {
            const response = await fetch('http://localhost:8081/delete_buy_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ buy_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete buy details');
            }

            // Fetch updated data after deleting the buy details
            fetchData();
            setSnackbarMessage(`Buy details deleted successfully`);
            setSnackbarOpen(true); // Show success message
        } catch (error) {
            console.error('Error deleting buy details:', error.message);
            setSnackbarMessage('Error deleting buy details. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const handleEditButtonClick = (row) => {
        setSelectedRow(row);
        setFormData(row);
        setIsEditing(true);
        setOpen(true);
    };

    const columns = [
        { field: 'buy_id', headerName: 'Buy ID', flex: 2 },
        { field: 'occasion_id', headerName: 'Occasion ID', flex: 2 },
        { field: 'jewellery_id', headerName: 'Jewellery ID', flex: 2 },
        { field: 'customer_id', headerName: 'Customer ID', flex: 2 },
        { field: 'quantity', headerName: 'Quantity', flex: 2 },
        {
            field: 'buy_date',
            headerName: 'Buy Date',
            flex: 2,
            valueGetter: (params) => {
                // Format date to 'yyyy-mm-dd' for display
                const date = params.row.buy_date;
                return date ? new Date(date).toLocaleDateString('en-GB') : null;
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 3,
            renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton onClick={() => handleDeleteBuy(params.row.buy_id)} color="secondary">
                        <DeleteIcon style={{ color: 'grey' }} />
                    </IconButton>
                    <IconButton onClick={() => handleEditButtonClick(params.row)}>
                        <EditIcon color="primary" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const getRowId = (row) => row.buy_id;

    return (
        <ThemeProvider theme={TableTheme}>
            <div className="h-full w-full p-10">
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Buy Details
                </Button>
                <DataGrid
                    rows={buysData}
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
                    slots={{
                        Toolbar: GridToolbarContainer,
                    }}
                />
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{isEditing ? 'Edit Buy Details' : 'Add Buy Details'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill in the details for the {isEditing ? 'edited' : 'new'} buy details.
                        </DialogContentText>
                        <TextField
                            margin="normal"
                            label="Buy ID"
                            name="buy_id"
                            type="number"
                            fullWidth
                            value={formData.buy_id}
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
                            label="Buy Date"
                            name="buy_date"
                            type="date"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.buy_date}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddBuy} color="primary">
                            {isEditing ? 'Save Changes' : 'Add Buy'}
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

export default BuyDetails;
