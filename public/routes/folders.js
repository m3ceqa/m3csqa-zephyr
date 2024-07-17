const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config(); // Load environment variables from .env file

router.get('/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://api.zephyrscale.smartbear.com/v2/folders/${req.params.id}`, {
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