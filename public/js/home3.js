document.addEventListener('DOMContentLoaded', () => {
    fetchTestCases();
});

// require('dotenv').config(); // Load environment variables from .env file
// const http = require('http');
// const fetch = require('node-fetch');

async function fetchTestCases() {
    const url = 'https://api.zephyrscale.smartbear.com/v2/testcases';
    const headers = {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL2luZm9yd2lraS5hdGxhc3NpYW4ubmV0IiwidXNlciI6eyJhY2NvdW50SWQiOiI2MGRlYjQ0MjIyYzA5MjAwNzFjNzQzMTAifX0sImlzcyI6ImNvbS5rYW5vYWgudGVzdC1tYW5hZ2VyIiwic3ViIjoiYTBkN2UxYTctYzFkZi0zZDlmLTliZWEtZjg3OTIyN2UyMGNlIiwiZXhwIjoxNzM3NjI0NzEyLCJpYXQiOjE3MDYwODg3MTJ9.rKg3Dfzxu2Ev9iYxZTL_tig4alseh70w9GOIxzTb_0E',
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8000'
    };

    try {
        const response = await fetch(url, { 
            mode: 'no-cors',
            method: 'GET',
            headers: headers
        });
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