document.addEventListener('DOMContentLoaded', () => {
    fetchTestCases();
});

require('dotenv').config(); // Load environment variables from .env file

async function fetchTestCases() {
    const url = 'https://api.zephyrscale.smartbear.com/v2/testcases';
    const headers = {
        'Authorization': 'Bearer ${process.env.ZEPHYR_BEARER_TOKEN}',
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayTestCases(data.values);
    } catch (error) {
        console.error('Error fetching test cases:', error);
    }
}

function displayTestCases(testCases) {
    const tableBody = document.querySelector('#data-table tbody');
    testCases.forEach(testCase => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = testCase.id;
        row.appendChild(idCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = testCase.name;
        row.appendChild(nameCell);

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = testCase.description || 'No description';
        row.appendChild(descriptionCell);

        tableBody.appendChild(row);
    });
}