export default async function handler(req, res) {
    if (req.method === "POST") {
      const { order } = req.body;
      const apiUrl = 'http://127.0.0.1:8080/orders';
  
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        });
  
        if (response.ok) {
          res.status(201).json({ message: "Order created successfully" });
        } else {
          res.status(response.status).json({ error: "Failed to create order" });
        }
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  