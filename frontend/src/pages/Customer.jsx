import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TableTheme from '../components/TableTheme';

const Customer = () => {
    const [customerData, setCustomerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [formData, setFormData] = useState({
        cust_id: '',
        FName: '',
        LName: '',
        Contact: '',
        loyalty_points: 0,
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8081/get_customers');
            if (!response.ok) {
                throw new Error('Failed to fetch customer details');
            }

            const data = await response.json();

            // Add a unique id to each row
            const customerDataWithId = data.map((row, index) => ({ id: index + 1, ...row }));

            setCustomerData(customerDataWithId);
        } catch (error) {
            console.error('Error fetching customer details:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
        setIsEditing(false); // Set editing mode to false when opening the dialog
    };

    const handleClose = () => {
        setOpen(false);
        setIsEditing(false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAddCustomer = async () => {
        try {
            const url = isEditing ? 'http://localhost:8081/update_customer' : 'http://localhost:8081/add_customer';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Failed to update customer' : 'Failed to add customer');
            }

            // Fetch updated data after adding/updating the customer
            fetchData();
            setOpen(false); // Close the dialog
            setSnackbarMessage(`${isEditing ? 'Customer updated' : 'Customer added'} successfully`);
            setSnackbarOpen(true); // Show success message
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} customer:`, error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeleteClick = async (cust_id) => {
        try {
            const response = await fetch('http://localhost:8081/delete_customer', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cust_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete customer');
            }

            // Fetch updated data after deleting the customer
            fetchData();
            setSnackbarMessage(`Customer ${cust_id} deleted successfully`);
            setSnackbarOpen(true); // Show success message
        } catch (error) {
            console.error('Error deleting customer:', error.message);
        }
    };

    const handleEditButtonClick = (row) => {
        setSelectedRow(row);
        setFormData(row);
        setIsEditing(true);
        setOpen(true);
    };

    const columns = [
        { field: 'cust_id', headerName: 'Customer ID', flex: 2 },
        { field: 'FName', headerName: 'First Name', flex: 3 },
        { field: 'LName', headerName: 'Last Name', flex: 3 },
        { field: 'Contact', headerName: 'Contact', flex: 3 },
        { field: 'loyalty_points', headerName: 'Loyalty Points', flex: 3 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 3,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleDeleteClick(params.row.cust_id)} color="secondary">
                        <DeleteIcon style={{ color: 'grey' }} />
                    </IconButton>
                    <IconButton onClick={() => handleEditButtonClick(params.row)}>
                        <EditIcon color="primary" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const getRowId = (row) => row.cust_id;

    return (
        <ThemeProvider theme={TableTheme}>
            <div className="h-full w-full p-10">
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Customer
                </Button>
                <DataGrid
                    rows={customerData}
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
                />
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{isEditing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill in the details for the {isEditing ? 'edited' : 'new'} customer.
                        </DialogContentText>
                        {/* Form fields */}
                        <TextField
                            margin="normal"
                            label="Customer ID"
                            name="cust_id"
                            type="number"
                            fullWidth
                            value={formData.cust_id}
                            onChange={handleInputChange}
                            disabled={isEditing} // Disable editing of ID when in edit mode
                        />
                        <TextField
                            margin="normal"
                            label="First Name"
                            name="FName"
                            fullWidth
                            value={formData.FName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Last Name"
                            name="LName"
                            fullWidth
                            value={formData.LName}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Contact"
                            name="Contact"
                            fullWidth
                            value={formData.Contact}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Loyalty Points"
                            name="loyalty_points"
                            type="number"
                            fullWidth
                            value={formData.loyalty_points}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddCustomer} color="primary">
                            {isEditing ? 'Save Changes' : 'Add Customer'}
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

export default Customer;
