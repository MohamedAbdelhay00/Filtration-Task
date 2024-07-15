import { Box } from "@mui/material";
import CustomersTable from "./Components/CustomersTable/CustomersTable";
import TransactionsHeader from "./Components/TransactionsHeader/TransactionsHeader";

function App() {
  return (
    <Box sx={{margin: -1, padding: 0}}>
    <TransactionsHeader />
    <CustomersTable />
    </Box>
  );
}

export default App;
