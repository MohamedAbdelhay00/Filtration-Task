const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/transactions', (req, res) => {
  const filePath = path.join(__dirname, '..', 'data', 'transactions.json');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Failed to read file:", err);
      res.status(500).send('Error reading the transactions file.');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});