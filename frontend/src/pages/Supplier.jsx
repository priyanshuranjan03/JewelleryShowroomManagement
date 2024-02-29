import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
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
    const [isEditing, setIsEditing] = useState(false);

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

    const handleAddSupplier = async () => {
        try {
            const url = isEditing ? 'http://localhost:8081/update_supplier' : 'http://localhost:8081/add_supplier';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Failed to update supplier' : 'Failed to add supplier');
            }

            // Fetch updated data after adding/updating the supplier
            fetchData();
            setOpen(false); // Close the dialog
            setSnackbarMessage(`${isEditing ? 'Supplier updated' : 'Supplier added'} successfully`);
            setSnackbarOpen(true); // Show success message
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} supplier:`, error.message);
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

    const handleEditButtonClick = (row) => {
        setSelectedRow(row);
        setFormData(row);
        setIsEditing(true);
        setOpen(true);
    };

    const columns = [
        { field: 'supplier_id', headerName: 'Supplier ID', flex: 1 },
        { field: 'FName', headerName: 'First Name', flex: 2 },
        { field: 'LName', headerName: 'Last Name', flex: 2 },
        { field: 'Contact_no', headerName: 'Contact No', flex: 3 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 3,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleDeleteSupplier(params.row.supplier_id)} color="secondary">
                        <DeleteIcon style={{ color: 'grey' }} />
                    </IconButton>
                    <IconButton onClick={() => handleEditButtonClick(params.row)}>
                        <EditIcon color="primary" />
                    </IconButton>
                </div>
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
                />
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{isEditing ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill in the details for the {isEditing ? 'edited' : 'new'} supplier.
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
                            {isEditing ? 'Save Changes' : 'Add Supplier'}
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
