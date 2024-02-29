// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import TableTheme from '../components/TableTheme';

// Component function
const Occasion = () => {
    // State variables
    const [occasionData, setOccasionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [formData, setFormData] = useState({
        occasion_id: '',
        Name: '',
        discount_percent: 0,
    });

    // Fetch occasion data from the server
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8081/get_occasions');
            if (!response.ok) {
                throw new Error('Failed to fetch occasion details');
            }

            const data = await response.json();

            // Add a unique id to each row
            const occasionDataWithId = data.map((row, index) => ({ id: index + 1, ...row }));

            setOccasionData(occasionDataWithId);
        } catch (error) {
            console.error('Error fetching occasion details:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Function to handle opening the dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Function to handle closing the dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Function to handle closing the snackbar
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Function to handle adding an occasion
    const handleAddOccasion = async () => {
        try {
            const response = await fetch('http://localhost:8081/add_occasion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add occasion');
            }

            // Fetch updated data after adding the occasion
            fetchData();
            setOpen(false); // Close the dialog
            setSnackbarMessage(`Occasion ${formData.Name} added successfully`);
            setSnackbarOpen(true); // Show success message
        } catch (error) {
            console.error('Error adding occasion:', error.message);
        }
    };

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Function to handle row deletion
    const handleDeleteClick = async (occasion_id) => {
        try {
            const response = await fetch('http://localhost:8081/delete_occasion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ occasion_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete occasion');
            }

            // Fetch updated data after deleting the occasion
            fetchData();
            setSnackbarMessage(`Occasion ${occasion_id} deleted successfully`);
            setSnackbarOpen(true); // Show success message
        } catch (error) {
            console.error('Error deleting occasion:', error.message);
        }
    };

    // Define columns for the DataGrid
    const columns = [
        { field: 'occasion_id', headerName: 'Occasion ID', flex: 2 },
        { field: 'Name', headerName: 'Name', flex: 3 },
        { field: 'discount_percent', headerName: 'Discount Percent', flex: 2 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 2,
            renderCell: (params) => (
                <IconButton onClick={() => handleDeleteClick(params.row.occasion_id)} color="secondary">
                    <DeleteIcon style={{ color: 'grey' }} />
                </IconButton>
            ),
        },
    ];


    // Function to get row ID
    const getRowId = (row) => row.occasion_id;

    // Return the JSX for the component
    return (
        <ThemeProvider theme={TableTheme}>
            <div className="h-full w-full p-10">
                {/* Button to add an occasion */}
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Occasion
                </Button>

                {/* DataGrid to display occasions */}
                <DataGrid
                    rows={occasionData}
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
                    // Toolbar with export option
                    slots={{
                        Toolbar: GridToolbarContainer,
                    }}
                />

                {/* Dialog for adding occasions */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add Occasion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill in the details for the new occasion.
                        </DialogContentText>
                        {/* Form fields */}
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
                            label="Name"
                            name="Name"
                            fullWidth
                            value={formData.Name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Discount Percent"
                            name="discount_percent"
                            type="number"
                            fullWidth
                            value={formData.discount_percent}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        {/* Buttons for canceling or adding an occasion */}
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddOccasion} color="primary">
                            Add Occasion
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for displaying messages */}
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

// Export the component
export default Occasion;
