import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    Paper,
    TableRow,
    Box,
    Typography,
} from "@mui/material";

import {
    StyledTableCell,
    StyledTableRow,
} from "./styles";

const TableTemplate = ({
    buttonHaver: ButtonHaver,
    columns = [],
    rows = [],
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    if (!rows.length) {
        return (
            <Paper
                sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    No Data Found
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
        >
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                    sx={{
                                        minWidth: column.minWidth,
                                    }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}

                            <StyledTableCell align="center">
                                Actions
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => (
                                <StyledTableRow
                                    hover
                                    key={row.id}
                                >
                                    {columns.map((column) => {
                                        const value = row[column.id];

                                        return (
                                            <StyledTableCell
                                                key={column.id}
                                                align={column.align}
                                            >
                                                {column.format &&
                                                    typeof value === "number"
                                                    ? column.format(value)
                                                    : value}
                                            </StyledTableCell>
                                        );
                                    })}

                                    <StyledTableCell align="center">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                justifyContent: "center",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <ButtonHaver row={row} />
                                        </Box>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={rows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Paper>
    );
};

export default TableTemplate;