const redis = require('redis');
const client = redis.createClient();
const Investment = require('../models/Investment');  // Assuming you have an Investment model in your models directory

// Function to update cached investor stats
async function updateInvestorStatsCache(investorId) {
  try {
    // Fetch updated investment stats from the database using Mongoose model
    const investments = await db.collection('investments').find({ investor: investorId }).toArray();
    console.log('Fetched Investments:', investments);
    
    // Calculate the total amount and count of investments
    let totalAmount = 0;
    let count = 0;

    investments.forEach(investment => {
      totalAmount += investment.amount;
      count++;
    });

    // Prepare the data to be cached
    const investorStats = { totalAmount, count };

    // Set the cache in Redis
    await client.set(`investor_stats:${investorId}`, JSON.stringify(investorStats));

    console.log(`Updated cache for investor ${investorId}:`, investorStats);
  } catch (error) {
    console.error('Error updating cache:', error);
  }
}

module.exports = { updateInvestorStatsCache };
