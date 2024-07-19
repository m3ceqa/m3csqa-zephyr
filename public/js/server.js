// const express = require('express');
// const axios = require('axios');
// const app = express();
// const port = 3000;

// app.use(express.static('public'));

// app.get('/api/testcases', async (req, res) => {
//     try {
//         const response = await axios.get('https://api.zephyrscale.smartbear.com/v2/testcases', {
//             headers: {
//                 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL2luZm9yd2lraS5hdGxhc3NpYW4ubmV0IiwidXNlciI6eyJhY2NvdW50SWQiOiI2MGRlYjQ0MjIyYzA5MjAwNzFjNzQzMTAifX0sImlzcyI6ImNvbS5rYW5vYWgudGVzdC1tYW5hZ2VyIiwic3ViIjoiYTBkN2UxYTctYzFkZi0zZDlmLTliZWEtZjg3OTIyN2UyMGNlIiwiZXhwIjoxNzM3NjI0NzEyLCJpYXQiOjE3MDYwODg3MTJ9.rKg3Dfzxu2Ev9iYxZTL_tig4alseh70w9GOIxzTb_0E'
//             },
//             params: {
//                 projectKey: 'M3QA',
//                 maxResults: 5000
//             }
//         });
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// app.get('/api/folders/:id', async (req, res) => {
//     try {
//         const response = await axios.get(`https://api.zephyrscale.smartbear.com/v2/folders/${req.params.id}`, {
//             headers: {
//                 Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL2luZm9yd2lraS5hdGxhc3NpYW4ubmV0IiwidXNlciI6eyJhY2NvdW50SWQiOiI2MGRlYjQ0MjIyYzA5MjAwNzFjNzQzMTAifX0sImlzcyI6ImNvbS5rYW5vYWgudGVzdC1tYW5hZ2VyIiwic3ViIjoiYTBkN2UxYTctYzFkZi0zZDlmLTliZWEtZjg3OTIyN2UyMGNlIiwiZXhwIjoxNzM3NjI0NzEyLCJpYXQiOjE3MDYwODg3MTJ9.rKg3Dfzxu2Ev9iYxZTL_tig4alseh70w9GOIxzTb_0E'
//             }
//         });
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching folder' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

const express = require('express');
const path = require('path'); // Import the path module
require('dotenv').config(); // Load environment variables from .env file
const port = process.env.PORT || 4000; // Use PORT environment variable if set, otherwise default to 3000

// Initialize Express app
const app = express();

// Middleware to serve static files from the root directory
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, '..')));
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname)));

// Import route modules (assuming these are correctly defined in their respective files)
const testcaseRoutes = require('../routes/testcase'); // Adjust the path as per your project structure
const folderRoutes = require('../routes/folders'); // Adjust the path as per your project structure
const foldersRoutes = require('../routes/folder');
const statusesRoutes = require('../routes/statuses');

// Routes
app.use('/api/testcases', testcaseRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/folder', foldersRoutes);
app.use('/api/statuses', statusesRoutes);

// Serve index.html from the root
app.get('*', (req, res) => {
    // res.sendFile(path.resolve(__dirname, 'index.html'));
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
    // res.sendFile(path.resolve(__dirname, '..', 'index.html'));
    res.sendFile(path.resolve('', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});