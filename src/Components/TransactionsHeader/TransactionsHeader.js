import React from "react";
import { Box, Typography } from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const TransactionsHeader = () => {
  return (
    <Box sx={{ backgroundColor: '#1976d2', color: 'white', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AccountBalanceIcon sx={{ marginRight: 1 }} />
      <Typography variant="h4">Transactions</Typography>
    </Box>
  );
};

export default TransactionsHeader;
