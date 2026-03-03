const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { image } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY; // This pulls your secret key from Netlify

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const payload = {
        contents: [{
            parts: [
                { text: "You are a professional Palmist. Analyze this palm image. Tell the user if they will be rich, poor, their personality, and their future based on the lines. Be mystical and encouraging." },
                { inline_data: { mime_type: "image/jpeg", data: image } }
            ]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        const prediction = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            body: JSON.stringify({ prediction })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to reach the stars." }) };
    }
};
