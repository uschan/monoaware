import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 3001;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- PROXY ENDPOINT FOR DEEPSEEK ---
app.post("/api/deepseek", async (req, res) => {
  const { apiKey, systemPrompt, userPrompt } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: "Missing API Key" });
  }

  console.log("[Proxy] Forwarding request to DeepSeek...");

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
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
      console.error("[DeepSeek API Error]", response.status, errorText);
      return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("[Proxy Error]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`
🚀 Deep Dissect Proxy Server running on http://localhost:${PORT}
----------------------------------------------------------
> ESM mode enabled
> Node ${process.version}
> Proxying DeepSeek API
`);
});
