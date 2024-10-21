const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const port = 3000;

// Allow all CORS requests
app.use(cors());

app.use(express.json());

app.post('/api/google-lens', async (req, res) => {
    const { image_base64 } = req.body;
    const apiKey = 'YOUR_SERPAPI_KEY';
    const endpoint = `https://serpapi.com/search?engine=google_lens&api_key=${apiKey}`;
    
    const formData = new URLSearchParams();
    formData.append('image_base64', image_base64);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
