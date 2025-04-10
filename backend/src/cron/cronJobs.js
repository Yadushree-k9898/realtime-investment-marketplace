// In src/cron/cronJobs.js
const cron = require('node-cron');
const Investment = require("../models/Investment");

const updateInvestmentReturns = async (investmentId, growthRate) => {
    try {
        const investment = await Investment.findById(investmentId);
        if (!investment) {
            throw new Error("Investment not found");
        }

        const newReturns = investment.amount * (growthRate / 100);
        investment.returns += newReturns;
        const roi = ((investment.returns - investment.amount) / investment.amount) * 100;
        investment.roi = roi.toFixed(2);
        await investment.save();
        console.log(`Investment ${investmentId} updated: Returns: ${investment.returns}, ROI: ${investment.roi}%`);
    } catch (error) {
        console.error("❌ Error updating investment returns:", error);
    }
};

const cronJob = () => {
    cron.schedule('0 0 1 * *', async () => {
        try {
            const investments = await Investment.find({});
            investments.forEach(async (investment) => {
                await updateInvestmentReturns(investment._id, 5);
            });
            console.log("Investment returns updated for the month.");
        } catch (error) {
            console.error("Error updating returns on cron:", error);
        }
    });
};

module.exports = cronJob;
