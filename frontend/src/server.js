// frontend/src/server.js
const express = require('express');
const multer = require('multer');
const formData = require('form-data');
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.send(`
    <h2>Upload Excel Sheet to display A1's contents</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="excelFile" accept=".xlsx" required>
      <button type="submit">Upload</button>
    </form>
  `);
});

app.post('/upload', upload.single('excelFile'), async (req, res) => {
  const file = req.file;
  const form = new formData();

  form.append('excelFile', file.buffer, file.originalname);

  // Dynamically import node-fetch
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

  try {
    const response = await fetch('http://localhost:5001/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    const result = await response.text();
    res.send(`File uploaded. Content of A1: ${result}`);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file to backend server.');
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Frontend server running on http://localhost:${PORT}`));
