import { createTheme } from "@mui/material";
const TableTheme = createTheme({
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
export default TableTheme;