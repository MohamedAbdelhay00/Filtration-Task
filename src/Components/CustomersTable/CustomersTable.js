import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
  Box,
  OutlinedInput,
  MenuItem,
  Select,
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";
import TransactionsHeader from '../TransactionsHeader/TransactionsHeader';
import TransactionGraph from '../Charts/TransactionGraph';

export default function CustomersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("customerName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Start pagination from 5
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    console.log(`Searching for ${searchQuery} by ${searchType}`);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/transactions"
      );
      console.log("API Response:", response.data);
      setCustomers(response.data.customers);
      setTransactions(response.data.transactions);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rows = transactions.map((transaction) => {
    const customer = customers.find(
      (customer) => customer.id === transaction.customer_id
    );
    return {
      ...transaction,
      customerName: customer ? customer.name : "Unknown",
    };
  });

  const filteredRows = rows.filter((row) => {
    if (searchType === "customerName") {
      return row.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === "transactionAmount") {
      return row.amount.toString().includes(searchQuery);
    }
    return true;
  });

  const handleCustomerIdChange = (event) => {
    setSelectedCustomerId(event.target.value);
  };

  const filteredAndAggregatedRows = rows
    .filter((row) => {
      return row.customer_id.toString() === selectedCustomerId;
    })
    .reduce((acc, row) => {
      const date = row.date;
      if (!acc[date]) {
        acc[date] = { date, totalAmount: 0 };
      }
      acc[date].totalAmount += parseFloat(row.amount);
      return acc;
    }, {});

  const dataForChart = Object.values(filteredAndAggregatedRows);

  return (
    <Stack spacing={2} sx={{ padding: 2, margin: 0 }}>
      <Box>
        <TextField
          label="Enter Customer ID for Graph"
          variant="outlined"
          value={selectedCustomerId}
          onChange={handleCustomerIdChange}
          fullWidth
          margin="normal"
        />
      </Box>
      <TransactionGraph data={dataForChart} />
      <Box component="form" noValidate onSubmit={handleSearch}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            displayEmpty
          >
            <MenuItem value="customerName">Customer Name</MenuItem>
            <MenuItem value="transactionAmount">Transaction Amount</MenuItem>
          </Select>
          <OutlinedInput
            placeholder={`Search by ${searchType}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Stack>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Customer ID</StyledTableCell>
              <StyledTableCell>Customer Name</StyledTableCell>
              <StyledTableCell>Transaction ID</StyledTableCell>
              <StyledTableCell>Transaction Amount</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow key={row.id}>
                  <TableCell>{row.customer_id}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.date}</TableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Transactions per page"
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Stack>
  );
}
