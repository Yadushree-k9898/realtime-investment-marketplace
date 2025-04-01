const cron = require('node-cron');
const mongoose = require("mongoose");
const Investment = require("../models/Investment");

// Simulate returns update logic (5% growth per month)
const updateInvestmentReturns = async (investmentId, growthRate) => {
    try {
        const investment = await Investment.findById(investmentId);
        if (!investment) {
            throw new Error("Investment not found");
        }

        // // Simulate returns: Assuming a fixed growth rate for simplicity
        // const newReturns = investment.amount * (growthRate / 100);
        // investment.returns += newReturns;  // Add the simulated returns to existing ones

        // // Recalculate the ROI
        // const roi = ((investment.returns - investment.amount) / investment.amount) * 100;
        // investment.roi = roi.toFixed(2);  // Store ROI as a percentage (rounded to two decimal places)

        // // Save the updated investment record
        // await investment.save();
        // console.log(`Investment ${investmentId} updated: Returns: ${investment.returns}, ROI: ${investment.roi}%`);
        
    } catch (error) {
        console.error("❌ Error updating investment returns:", error);
    }
};

// Update returns for all investments at the start of every month
cron.schedule('0 0 1 * *', async () => {
    try {
        const investments = await Investment.find({});
        investments.forEach(async (investment) => {
            // Assuming a 5% growth per month for simulation
            await updateInvestmentReturns(investment._id, 5);
        });
        console.log("Investment returns updated for the month.");
    } catch (error) {
        console.error("Error updating returns on cron:", error);
    }
});
