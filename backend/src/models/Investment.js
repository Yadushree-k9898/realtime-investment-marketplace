const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema(
    {
        investor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Investor ID
        amount: { type: Number, required: true },  // Amount invested by the investor
        industry: { type: String, required: true }, 
        proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal", required: true }, 
        equityOwnership: { type: Number, default: 0 }, // Percentage of ownership in the proposal/company
        investmentType: { type: String, enum: ['equity', 'debt', 'convertible'], required: true }, // Type of investment (e.g., equity, debt)
        investmentStage: { type: String, enum: ['seed', 'seriesA', 'seriesB', 'IPO'], required: true }, // Stage of investment
        status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' }, // Investment status
        returns: { type: Number, default: 0 }, // The actual returns from the investment
        roi: { type: Number, default: 0 }, // ROI calculated dynamically
        riskLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
        expectedReturn: { type: Number, default: 0 },
        maturityDate: { type: Date },
        performanceMetrics: {
            currentValue: { type: Number, default: 0 },
            growthRate: { type: Number, default: 0 },
            volatility: { type: Number, default: 0 }
        }
    },
    { timestamps: true }  // Automatically adds `createdAt` and `updatedAt`
);

// Modify the calculateExpectedReturn method
InvestmentSchema.methods.calculateExpectedReturn = async function() {
    const growthRates = {
        'seed': 0.5,
        'seriesA': 0.3,
        'seriesB': 0.2,
        'IPO': 0.15
    };

    const typeMultipliers = {
        'equity': 1.5,
        'debt': 1.1,
        'convertible': 1.3
    };

    const baseGrowth = growthRates[this.investmentStage] || 0.15;
    const multiplier = typeMultipliers[this.investmentType] || 1.1;
    
    // Ensure expectedReturn is never negative
    this.expectedReturn = Math.max(0, this.amount * (1 + baseGrowth) * multiplier);
    this.performanceMetrics.currentValue = Math.max(0, this.amount); // Ensure currentValue is never negative
    await this.save();
};

// Update ROI calculation
InvestmentSchema.methods.updateROI = async function() {
    if (this.amount > 0) {
        this.roi = ((this.returns - this.amount) / this.amount) * 100;
        await this.save();
    }
};

// Add method to calculate returns dynamically
InvestmentSchema.methods.calculateReturns = async function (proposalPerformance) {
    const performanceMultiplier = proposalPerformance || 1.2; // Example: 20% growth
    const typeMultipliers = {
        equity: 1.5,
        debt: 1.1,
        convertible: 1.3,
    };

    const stageMultipliers = {
        seed: 1.3,
        seriesA: 1.2,
        seriesB: 1.1,
        IPO: 1.05,
    };

    const typeMultiplier = typeMultipliers[this.investmentType] || 1.1;
    const stageMultiplier = stageMultipliers[this.investmentStage] || 1.05;

    this.returns = this.amount * performanceMultiplier * typeMultiplier * stageMultiplier;
    this.returns = Math.max(0, this.returns); // Ensure returns are never negative
    this.roi = ((this.returns - this.amount) / this.amount) * 100; // Update ROI
    await this.save();
};

// Add pre-save middleware to validate returns and ROI
InvestmentSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('amount')) {
        const baseReturns = {
            'seed': 1.3,     // 30% return
            'seriesA': 1.25, // 25% return
            'seriesB': 1.2,  // 20% return
            'IPO': 1.15     // 15% return
        };

        const typeMultiplier = {
            'equity': 1.5,
            'debt': 1.1,
            'convertible': 1.3
        };

        const baseReturn = baseReturns[this.investmentStage] || 1.2;
        const multiplier = typeMultiplier[this.investmentType] || 1.0;

        // Calculate returns
        this.returns = this.amount * baseReturn * multiplier;
        
        // Calculate ROI
        this.roi = ((this.returns - this.amount) / this.amount) * 100;
        
        // Update performance metrics
        this.performanceMetrics = {
            currentValue: this.amount,
            growthRate: (baseReturn - 1) * 100,
            volatility: 10
        };

        // Calculate expected return
        this.expectedReturn = this.amount * 1.5; // 50% expected return
    }
    next();
});

// Add validation middleware
InvestmentSchema.pre('validate', function(next) {
    // Ensure amount is positive
    if (this.amount <= 0) {
        next(new Error('Investment amount must be positive'));
    }
    // Ensure returns is not negative
    if (this.returns < 0) {
        this.returns = 0;
    }
    next();
});

const Investment = mongoose.model("Investment", InvestmentSchema);

module.exports = Investment;
