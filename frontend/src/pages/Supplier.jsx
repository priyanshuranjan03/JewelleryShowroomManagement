import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

const Supplier = () => {
    const [supplierData, setSupplierData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from your backend API
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8081/suppliers');
                if (!response.ok) {
                    throw new Error('Failed to fetch supplier details');
                }

                const data = await response.json();

                // Add a unique id to each row
                const supplierDataWithId = data.map((row, index) => ({ id: index + 1, ...row }));

                setSupplierData(supplierDataWithId)
            } catch (error) {
                console.error('Error fetching supplier details:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const columns = [
        { field: 'supplier_id', headerName: 'Supplier ID', flex: 1 },
        { field: 'FName', headerName: 'First Name', flex: 2 },
        { field: 'LName', headerName: 'Last Name', flex: 2 },
        { field: 'Contact_no', headerName: 'Contact No', flex: 3 },
    ];


    const theme = createTheme({
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#BBDBE3',
                        color: '#0B2D36', // White text color for other rows
                    },
                    sortIcon: {
                        opacity: 2,
                        color: 'white', // Change this to your desired color
                    },
                    header: {
                        backgroundColor: '#101D66 ', // Dark purple color for column headers
                        borderBottom: '2px solid #BFC4CE', // Border at the bottom of headers
                        '& .MuiDataGrid-sortIcon': {
                            color: 'white', // Arrow color for sorting columns
                        },
                    },
                    columnHeader: {
                        backgroundColor: '#2788A0',
                        color: 'white', // White text color for column headers
                    },
                    cell: {
                        borderBottom: '1px solid #2B2121', // Border at the bottom of each cell
                        '&.Mui-selected': {
                            backgroundColor: '#B3B458', // Custom selected row highlight color
                            color: '#101D66', // Text color for selected row
                        },
                    },
                },
            },
        },
    });

    const getRowId = (row) => row.supplier_id;

    return (
        <ThemeProvider theme={theme}>
            <div style={{ height: 'calc(100vh - 100px)', width: '100%', padding: '20px', marginTop: '15px', marginRight: '15px' }}>
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
                />
            </div>
        </ThemeProvider>
    );
};

export default Supplier;