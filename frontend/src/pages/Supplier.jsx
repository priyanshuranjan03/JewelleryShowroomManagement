import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import TableTheme from '../components/TableTheme';

const Supplier = () => {
    const [supplierData, setSupplierData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [formData, setFormData] = useState({
        supplier_id: '',
        FName: '',
        LName: '',
        Contact_no: '',
    });

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8081/get_suppliers');
            if (!response.ok) {
                throw new Error('Failed to fetch supplier details');
            }

            const data = await response.json();

            // Add a unique id to each row
            const supplierDataWithId = data.map((row, index) => ({ id: index + 1, ...row }));

            setSupplierData(supplierDataWithId);
        } catch (error) {
            console.error('Error fetching supplier details:', error.message);
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

    const handleAddSupplier = async () => {
        try {
            const response = await fetch('http://localhost:8081/add_supplier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add supplier');
            }

            // Fetch updated data after adding the supplier
            fetchData();
            setOpen(false); // Close the dialog
            setSnackbarMessage(`Supplier ${formData.FName} ${formData.LName} added successfully`);
            setSnackbarOpen(true); // Show success message
        } catch (error) {
            console.error('Error adding supplier:', error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeleteSupplier = async (supplier_id) => {
        try {
            const response = await fetch('http://localhost:8081/delete_supplier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ supplier_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete supplier');
            }

            // Fetch updated data after deleting the supplier
            fetchData();
            setSnackbarMessage(`Supplier ${supplier_id} deleted successfully`);
            setSnackbarOpen(true); // Show success message
        } catch (error) {
            console.error('Error deleting supplier:', error.message);
        }
    };

    const columns = [
        { field: 'supplier_id', headerName: 'Supplier ID', flex: 1 },
        { field: 'FName', headerName: 'First Name', flex: 2 },
        { field: 'LName', headerName: 'Last Name', flex: 2 },
        { field: 'Contact_no', headerName: 'Contact No', flex: 3 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 2,
            renderCell: (params) => (
                <IconButton onClick={() => handleDeleteSupplier(params.row.supplier_id)} color="secondary">
                    <DeleteIcon style={{ color: 'grey' }} />
                </IconButton>
            ),
        },
    ];


    const getRowId = (row) => row.supplier_id;

    return (
        <ThemeProvider theme={TableTheme}>
            <div className="h-full w-full p-10">
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Supplier
                </Button>
                <DataGrid
                    rows={supplierData}
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
                    <DialogTitle>Add Supplier</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill in the details for the new supplier.
                        </DialogContentText>
                        {/* Form fields */}
                        <TextField
                            margin="normal"
                            label="Supplier ID"
                            name="supplier_id"
                            type="number"
                            fullWidth
                            value={formData.supplier_id}
                            onChange={handleInputChange}
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
                            label="Contact No"
                            name="Contact_no"
                            fullWidth
                            value={formData.Contact_no}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddSupplier} color="primary">
                            Add Supplier
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

export default Supplier;
