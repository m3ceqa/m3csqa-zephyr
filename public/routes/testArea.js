const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config(); // Load environment variables from .env file

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://inforwiki.atlassian.net/rest/api/3/search?jql=project%20%3D%20M3QA%20AND%20type%20%3D%20Epic%20AND%20component%20%3D%20%22M3%20-%20Test%20Area%22&maxResults=60`, {
            headers: {
                'Authorization': `Basic ${process.env.JIRA_CLOUD_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching epic:', error.message); // Log the error
        res.status(400).json({ message: 'Error fetching epic' });
    }
});

module.exports = router;