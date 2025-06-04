// app.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, DevOps! This is version 1.0.0');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});