export default async function handler(req, res) {
    if (req.method === "POST") {
      const { user_id, signature, accepted_at } = req.body; // Destructure the required fields
      const apiUrl = 'https://api.zohal.xyz/accept-risk';   // External API URL
  
      // Prepare the body payload for forwarding
      const payload = {
        user_id,
        signature,
        accepted_at
      };
  
      try {
        // Forward the request to the external API
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),  // Send the payload as JSON
        });
  
        // Check if the response from the external API is successful
        if (response.ok) {
          const data = await response.json();  // Get the response body from the API
          res.status(201).json({ message: "Risk accepted successfully", data });
        } else {
          // Handle error based on the response status
          const errorData = await response.json();
          res.status(response.status).json({ error: "Failed to accept risk", details: errorData });
        }
      } catch (error) {
        // Handle any network or server errors
        res.status(500).json({ error: "Internal server error", details: error.message });
      }
    } else {
      // Return 405 Method Not Allowed for non-POST requests
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  