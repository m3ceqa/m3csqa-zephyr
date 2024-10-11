const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config(); // Load environment variables from .env file

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.zephyrscale.smartbear.com/v2/testcases', {
            headers: {
                'Authorization': `Bearer ${process.env.ZEPHYR_BEARER_TOKEN}`
            },
            params: {
                projectKey: 'M3QA',
                maxResults: 2500
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching test cases:', error.message); // Log the error
        res.status(500).send(error.message);
    }
});

module.exports = router;