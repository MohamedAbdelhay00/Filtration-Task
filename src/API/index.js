const express = require('express');
const path = require('path');
const fs = require('fs');

// Create an express application
const app = express();
const PORT = 3001; // Port number can be any

// Middleware to allow CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Route to serve the transactions.json file
app.get('/api/transactions', (req, res) => {
  // Corrected file path to 'src/data/transactions.json'
  const filePath = path.join(__dirname, '..', 'data', 'transactions.json');
  
  // Read the JSON file and send it as a response
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Failed to read file:", err); // Log the specific error
      res.status(500).send('Error reading the transactions file.');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});