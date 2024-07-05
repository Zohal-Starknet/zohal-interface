// pages/api/fetch-candlestick.js

export default async function handler(req, res) {
    const { pair } = req.query;
    const apiUrl = `https://api.dev.pragma.build/node/v1/aggregation/candlestick/${pair}?interval=2h`;
  
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "x-api-key": 'atrkbD57o64tXQPbBnAjxa1BWV5sk0W85npAIxq8',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        res.status(200).json(data);
      } else {
        res.status(response.status).json({ error: "Failed to fetch data from external API" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  