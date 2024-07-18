const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config(); // Load environment variables from .env file

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://api.zephyrscale.smartbear.com/v2/folders?maxResults=1000&startAt=0&projectKey=M3QA&folderType=TEST_CASE`, {
            headers: {
                'Authorization': `Bearer ${process.env.ZEPHYR_BEARER_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching folder:', error.message); // Log the error
        res.status(500).json({ message: 'Error fetching folder' });
    }
});

module.exports = router;