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

    if (!image_base64) {
        return res.status(400).json({ error: 'Image base64 is required.' });
    }

    const apiKey = '3d40b446bbf329a7e0b47ccf4921b28275511d45de362249a3d1c784a10ddc0b'; // Ensure it's valid
    const endpoint = `https://serpapi.com/search.json?engine=google_lens&image_base64=${encodeURIComponent(image_base64)}&api_key=${apiKey}`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // This can be optional for GET
            },
            
        });

        // Log the status and content type
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers.get('content-type'));

        const textData = await response.text(); // Get the response as text
        console.log('SerpAPI response:', textData);

        // Check if response is ok
        if (!response.ok) {
            return res.status(response.status).json({ error: textData });
        }

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





//3d40b446bbf329a7e0b47ccf4921b28275511d45de362249a3d1c784a10ddc0b