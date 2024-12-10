export default async function handler(req, res) {
    const { address } = req.query;
    const apiUrl = 'http://api.mainnet.zohal.xyz/orders';
  
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });
  
      if (response.ok) {
        const data = await response.json();
        
        // Filter orders by address, map to only required fields, and sort by timestamp
        const filteredOrders = data
          .filter(order => formatAccountAddress(order.account) === address)
          .map(order => ({
            order_type: order.order_type,
            size_delta_usd: order.size_delta_usd,
            initial_collateral_delta_amount: order.initial_collateral_delta_amount,
            trigger_price: order.trigger_price,
            market: order.market,
            account: formatAccountAddress(order.account),
            timestamp: order.timestamp
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.status(200).json(filteredOrders);
      } else {
        res.status(response.status).json({ error: "Failed to fetch data from local API" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
}

function formatAccountAddress(account) {
  // Remove all leading zeros and add '0x' at the beginning
  return `0x${account.replace(/^0+/, '')}`;
}
