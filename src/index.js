import express from 'express';
const app = express();
const port = 3000;

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, World! Ramesh Mraandi from backednodejs');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
