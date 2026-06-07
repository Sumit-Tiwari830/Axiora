import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    Paper,
    Typography,
    Box,
} from "@mui/material";

import { StyledTableCell, StyledTableRow } from "./styles";

const TableViewTemplate = ({ columns = [], rows = [] }) => {
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
            <Box
                sx={{
                    p: 4,
                    textAlign: "center",
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    No Data Available
                </Typography>
            </Box>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <StyledTableRow>
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
                        </StyledTableRow>
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

export default TableViewTemplate;