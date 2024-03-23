import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TableTheme from '../components/TableTheme';

// ... (imports remain unchanged)

const RentDetails = () => {
    const [rentData, setRentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [formData, setFormData] = useState({
        rent_id: '',
        occasion_id: '',
        jewellery_id: '',
        customer_id: '',
        quantity: 0,
        rent_date: null,
        return_date: null,
    });
    const [isEditing, setIsEditing] = useState(false);

    const [showReportDialog, setShowReportDialog] = useState(false);
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
        setIsEditing(false); // Close editing mode when the dialog is closed
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAddRent = async () => {
        try {
            // Add your validation logic here
            if (formData.jewellery_id < 101) {
                setSnackbarMessage('Jewellery ID should be greater than or equal to 101');
                setSnackbarOpen(true);
                return;
            }

            const url = isEditing ? 'http://localhost:8081/update_rent' : 'http://localhost:8081/add_rent';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Failed to update rent details' : 'Failed to add rent details');
            }

            // Fetch updated data after adding/updating the rent details
            fetchData();
            setOpen(false); // Close the dialog
            setSnackbarMessage(`Rent details ${isEditing ? 'updated' : 'added'} successfully`);
            setSnackbarOpen(true); // Show success message
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} rent details:`, error.message);
            setSnackbarMessage(`Error ${isEditing ? 'updating' : 'adding'} rent details. Please check your input and try again.`);
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

            // Fetch updated data after deleting the rent details
            fetchData();
            setSnackbarMessage(`Rent details deleted successfully`);
            setSnackbarOpen(true); // Show success message
        } catch (error) {
            console.error('Error deleting rent details:', error.message);
            setSnackbarMessage('Error deleting rent details. Please try again.');
            setSnackbarOpen(true);
        }
    };

    const handleEditButtonClick = (row) => {
        setSelectedRow(row);
        setFormData(row);
        setIsEditing(true);
        setOpen(true);
    };

    const [selectedMonth, setSelectedMonth] = useState(1); // Default to January

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };
    // New function to handle the report generation
    const generateReport = async () => {
        try {
            const response = await fetch('http://localhost:8081/total_rent_by_month');

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            // Handle the report data as needed
            const reportData = await response.json();
            console.log('Generated Report:', reportData);
            setReportData(reportData)
            setShowReportDialog(true)
        } catch (error) {
            console.error('Error generating report:', error.message);
        }
    };
    const columns = [
        { field: 'rent_id', headerName: 'Rent ID', flex: 2 },
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
            flex: 3,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleDeleteRent(params.row.rent_id)} color="secondary">
                        <DeleteIcon style={{ color: 'grey' }} />
                    </IconButton>
                    <IconButton onClick={() => handleEditButtonClick(params.row)}>
                        <EditIcon color="primary" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const getRowId = (row) => row.rent_id;
    const [reportData, setReportData] = useState([]);
    const selectedMonthData = reportData.find((item) => item.Month === selectedMonth);
    // console.log("selected month data=", selectedMonthData)
    return (
        <ThemeProvider theme={TableTheme}>
            <div className="h-full w-full p-10">
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
                    slots={{
                        Toolbar: GridToolbarContainer,
                    }}
                />
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{isEditing ? 'Edit Rent Details' : 'Add Rent Details'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill in the details for the {isEditing ? 'edited' : 'new'} rent details.
                        </DialogContentText>
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
                            {isEditing ? 'Save Changes' : 'Add Rent'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <div className="mt-5 p-4 border rounded-md shadow-md bg-white">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Get the Sales for Month</h3>
                    <div className="flex items-center space-x-4">
                        <FormControl variant="outlined" style={{ width: '50%' }}>
                            <Select
                                labelId="month-label"
                                id="month-select"
                                value={selectedMonth}
                                onChange={handleMonthChange}
                            >
                                <MenuItem value={1}>January</MenuItem>
                                <MenuItem value={2}>February</MenuItem>
                                <MenuItem value={3}>March</MenuItem>
                                <MenuItem value={4}>April</MenuItem>
                                <MenuItem value={5}>May</MenuItem>
                                <MenuItem value={6}>June</MenuItem>
                                <MenuItem value={7}>July</MenuItem>
                                <MenuItem value={8}>August</MenuItem>
                                <MenuItem value={9}>September</MenuItem>
                                <MenuItem value={10}>October</MenuItem>
                                <MenuItem value={11}>November</MenuItem>
                                <MenuItem value={12}>December</MenuItem>
                                {/* Add more months as needed */}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => generateReport(selectedMonth)}
                            className="ml-4 bg-gradient-to-r from-green-400 to-blue-500 text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600"
                        >
                            Generate Report
                        </Button>
                    </div>

                    <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)}>
                        <DialogTitle>Generated Report</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {/* Display the report data in a well-organized and appealing way */}
                                {selectedMonthData ? console.log(selectedMonthData) : `No data available for ${getMonthName(selectedMonth)}.`}
                                {reportData
                                    .filter((item) => item.Month === selectedMonth)
                                    .map((item, index) => (

                                        <div>
                                            Total Sales for Renting in {getMonthName(selectedMonth)}: Rs. {selectedMonthData.Total_Rent}
                                        </div>

                                    ))}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowReportDialog(false)} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
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

const getMonthName = (monthNumber) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1];
};
export default RentDetails;
