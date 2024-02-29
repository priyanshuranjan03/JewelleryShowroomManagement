import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import TableTheme from '../components/TableTheme';

const Buys = () => {
    const [buysData, setBuysData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [formData, setFormData] = useState({
        buy_id: '',
        occasion_id: '',
        jewellery_id: '',
        customer_id: '',
        quantity: 0,
        buy_date: '',
    });

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8081/get_buy_details');
            if (!response.ok) {
                throw new Error('Failed to fetch buy details');
            }

            const data = await response.json();

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
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAddBuy = async () => {
        try {
            const response = await fetch('http://localhost:8081/add_buy_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add buy record');
            }

            fetchData();
            setOpen(false);
            setSnackbarMessage(`Buy record added successfully`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error adding buy record:', error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeleteClick = async (buy_id) => {
        try {
            const response = await fetch('http://localhost:8081/delete_buy_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ buy_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete buy record');
            }

            fetchData();
            setSnackbarMessage(`Buy record deleted successfully`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting buy record:', error.message);
        }
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
            flex: 2,
            renderCell: (params) => (
                <IconButton onClick={() => handleDeleteClick(params.row.buy_id)} color="secondary">
                    <DeleteIcon style={{ color: 'grey' }} />
                </IconButton>
            ),
        },
    ];

    const getRowId = (row) => row.buy_id;

    return (
        <ThemeProvider theme={TableTheme}>
            <div className="h-full w-full p-10">
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Buy Record
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
                    <DialogTitle>Add Buy Record</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill in the details for the new buy record.
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
                            value={formData.buy_date}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddBuy} color="primary">
                            Add Record
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

export default Buys;
