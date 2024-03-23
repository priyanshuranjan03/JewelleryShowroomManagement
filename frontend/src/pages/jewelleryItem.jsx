import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TableTheme from '../components/TableTheme';

const JewelleryItem = () => {
    const [jewelleryData, setJewelleryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null)
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [reportData, setReportData] = useState([]);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [formData, setFormData] = useState({
        jewellery_id: '',
        descr: '',
        item_name: '',
        stock: 0,
        buy_cost: 0,
        rent_cost: 0,
        weight: 0,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
        buyCostComparison: '=',
        buyCostValue: 0,
        buyCostLogicalOperator: 'and',
        stockComparison: '=',
        stockValue: 0,
    });

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8081/get_jewellery_items');
            if (!response.ok) {
                throw new Error('Failed to fetch jewellery items');
            }

            const data = await response.json();

            // Add a unique id to each row
            const jewelleryDataWithId = data.map((row, index) => ({ id: index + 1, ...row }));

            setJewelleryData(jewelleryDataWithId);
        } catch (error) {
            console.error('Error fetching jewellery items:', error.message);
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

    const handleAddItem = async () => {
        try {
            if (formData.jewellery_id < 101) {
                setSnackbarMessage('Jewellery ID should be greater than or equal to 101');
                setSnackbarOpen(true);
                return;
            }

            const url = isEditing ? 'http://localhost:8081/update_jewellery_item' : 'http://localhost:8081/add_jewellery_item';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Failed to update jewellery item' : 'Failed to add jewellery item');
            }

            // Fetch updated data after adding/updating the item
            fetchData();
            setOpen(false); // Close the dialog
            setSnackbarMessage(`${isEditing ? 'Jewellery item updated' : 'Jewellery item added'} successfully`);
            setSnackbarOpen(true); // Show success message
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} jewellery item:`, error.message);
            setSnackbarMessage(`Error ${isEditing ? 'updating' : 'adding'} jewellery item. Please check your input and try again.`);
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

    const handleDeleteClick = async (jewellery_id) => {
        try {
            const response = await fetch('http://localhost:8081/delete_jewellery_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jewellery_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete jewellery item');
            }

            // Fetch updated data after deleting the item
            fetchData();
            setSnackbarMessage(`Jewellery item ${jewellery_id} deleted successfully`);
            setSnackbarOpen(true); // Show success message
        } catch (error) {
            console.error('Error deleting jewellery item:', error.message);
        }
    };

    const handleEditButtonClick = (row) => {
        setSelectedRow(row);
        setFormData(row);
        setIsEditing(true);
        setOpen(true);
    };


    // New function to handle filter criteria changes
    const handleFilterCriteriaChange = (e) => {
        const { name, value } = e.target;
        setFilterCriteria((prevCriteria) => ({
            ...prevCriteria,
            [name]: value,
        }));
    };

    // New function to handle the report generation
    const generateReport = async () => {
        try {
            const response = await fetch('http://localhost:8081/generate_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filterCriteria),
            });

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
        { field: 'jewellery_id', headerName: 'Jewellery ID', flex: 2 },
        { field: 'item_name', headerName: 'Item Name', flex: 3 },
        { field: 'stock', headerName: 'Stock', flex: 2 },
        { field: 'buy_cost', headerName: 'Buy Cost', flex: 2 },
        { field: 'rent_cost', headerName: 'Rent Cost', flex: 2 },
        { field: 'weight', headerName: 'Weight', flex: 2 },
        { field: 'descr', headerName: 'Description', flex: 6 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 3,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleDeleteClick(params.row.jewellery_id)} color="secondary">
                        <DeleteIcon style={{ color: 'grey' }} />
                    </IconButton>
                    <IconButton onClick={() => handleEditButtonClick(params.row)}>
                        <EditIcon color="primary" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const getRowId = (row) => row.jewellery_id;

    return (
        <ThemeProvider theme={TableTheme}>
            <div className="h-full w-full p-10">
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Jewellery Item
                </Button>
                <DataGrid
                    rows={jewelleryData}
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
                    <DialogTitle>{isEditing ? 'Edit Jewellery Item' : 'Add Jewellery Item'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill in the details for the {isEditing ? 'edited' : 'new'} jewellery item.
                        </DialogContentText>
                        {/* Form fields */}
                        <TextField
                            margin="normal"
                            label="Jewellery ID"
                            name="jewellery_id"
                            type="number"
                            fullWidth
                            value={formData.jewellery_id}
                            onChange={handleInputChange}
                            disabled={isEditing} // Disable ID field in editing mode
                        />
                        <TextField
                            margin="normal"
                            label="Description"
                            name="descr"
                            fullWidth
                            value={formData.descr}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Item Name"
                            name="item_name"
                            fullWidth
                            value={formData.item_name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Stock"
                            name="stock"
                            type="number"
                            fullWidth
                            value={formData.stock}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Buy Cost"
                            name="buy_cost"
                            type="number"
                            fullWidth
                            value={formData.buy_cost}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Rent Cost"
                            name="rent_cost"
                            type="number"
                            fullWidth
                            value={formData.rent_cost}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            label="Weight"
                            name="weight"
                            type="number"
                            fullWidth
                            value={formData.weight}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddItem} color="primary">
                            {isEditing ? 'Save Changes' : 'Add Item'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <div className="mt-5 p-4 border rounded-md shadow-md bg-white">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Generate Report</h3>
                    <h2 className="text-l font-semibold mb-4 text-gray-600">Selecting Jewellery and Description for</h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <label className="mr-2 text-gray-700">Buy Cost</label>
                            <select
                                name="buyCostComparison"
                                value={filterCriteria.buyCostComparison}
                                onChange={handleFilterCriteriaChange}
                                className="p-2 border rounded-md bg-gray-100"
                            >
                                <option value="=">=</option>
                                <option value="<">&#60;</option>
                                <option value=">">&#62;</option>
                            </select>
                            <input
                                type="number"
                                name="buyCostValue"
                                value={filterCriteria.buyCostValue}
                                onChange={handleFilterCriteriaChange}
                                className="p-2 border rounded-md bg-gray-100 ml-2"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="mr-2">Logical Operator</label>
                            <select
                                name="buyCostLogicalOperator"
                                value={filterCriteria.buyCostLogicalOperator}
                                onChange={handleFilterCriteriaChange}
                                className="p-2 border rounded-md"
                            >
                                <option value="and">AND</option>
                                <option value="or">OR</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="mr-2">Stock</label>
                            <select
                                name="stockComparison"
                                value={filterCriteria.stockComparison}
                                onChange={handleFilterCriteriaChange}
                                className="p-2 border rounded-md"
                            >
                                <option value="=">=</option>
                                <option value="<">&#60;</option>
                                <option value=">">&#62;</option>
                            </select>
                            <input
                                type="number"
                                name="stockValue"
                                value={filterCriteria.stockValue}
                                onChange={handleFilterCriteriaChange}
                                className="p-2 border rounded-md ml-2"
                            />
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={generateReport}
                            className="ml-4 bg-gradient-to-r from-green-400 to-blue-500 text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-600"
                        >
                            Generate Report
                        </Button>
                    </div>
                </div>
                <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)}>
                    <DialogTitle>Your Requirements Summary:</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* Display the report data in a well-organized and appealing way */}
                            {reportData.map((item, index) => (
                                <div key={index}>
                                    {item.descr} - {item.item_name}
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

export default JewelleryItem;
