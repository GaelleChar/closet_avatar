// const express = require('express');
// const fetch = require('node-fetch');
// const cors = require('cors');

import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 5500;

// Allow all CORS requests
app.use(cors());

app.use(express.json());

app.post('/api/google-lens', async (req, res) => {
    const { image_base64 } = req.body;
    const apiKey = '3d40b446bbf329a7e0b47ccf4921b28275511d45de362249a3d1c784a10ddc0b';  // Ensure it's valid
    const endpoint = `https://serpapi.com/search?engine=google_lens&api_key=${apiKey}`;

    const formData = new URLSearchParams();
    formData.append('image_base64', image_base64);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
        });
        
        // Log the raw response for debugging
        const textData = await response.text();
        console.log('SerpAPI response:', textData);

        // Try parsing JSON if successful
        const data = JSON.parse(textData);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
