
const express = require('express');
const cors = require('cors');
// Node.js 18+ has native fetch. No need for node-fetch.

const app = express();
const PORT = 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- PROXY ENDPOINT FOR DEEPSEEK ---
app.post('/api/deepseek', async (req, res) => {
  const { apiKey, systemPrompt, userPrompt } = req.body;

  if (!apiKey) {
    console.warn('[Proxy] Missing API Key in request');
    return res.status(400).json({ error: 'Missing API Key' });
  }

  console.log(`[Proxy] Forwarding request to DeepSeek...`);

  try {
    // Use Node.js native fetch
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { 
            role: "system", 
            content: `${systemPrompt}\n\nIMPORTANT: You must respond with valid JSON.` 
          },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 1.0 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DeepSeek API Error] Status: ${response.status}`);
      console.error(`[DeepSeek API Response]: ${errorText}`);
      return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    console.log(`[Proxy] Success. Sending data back to client.`);
    res.json(data);

  } catch (error) {
    console.error('[Proxy Internal Error]:', error);
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`
  🚀 Deep Dissect Proxy Server running on http://localhost:${PORT}
  ----------------------------------------------------------
  > Node Version: ${process.version}
  > Using native fetch.
  `);
});
