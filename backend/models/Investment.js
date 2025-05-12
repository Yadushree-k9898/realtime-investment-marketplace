InvestmentSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('amount')) {
        const baseReturns = {
            'seed': 0.30,
            'seriesA': 0.25, 
            'seriesB': 0.20,
            'IPO': 0.15
        };

        const typeMultiplier = {
            'equity': 1.5,
            'debt': 1.1,
            'convertible': 1.3
        };

        const baseReturn = baseReturns[this.investmentStage] || 0.20;
        const multiplier = typeMultiplier[this.investmentType] || 1.0;

        // Ensure returns are never negative
        this.returns = Math.max(0, this.amount * baseReturn * multiplier);

        // Calculate ROI only if amount is greater than 0
        if (this.amount > 0) {
            this.roi = ((this.returns - this.amount) / this.amount) * 100;
            // Ensure ROI is never less than -100%
            this.roi = Math.max(-100, this.roi);
        }
    }
    next();
});

// ...existing code...

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

    const baseGrowth = growthRates[this.investmentStage] || 0.15; // Default to IPO rate
    const multiplier = typeMultipliers[this.investmentType] || 1.1; // Default to debt multiplier
    
    // Ensure expectedReturn is never negative
    this.expectedReturn = Math.max(0, this.amount * (1 + baseGrowth) * multiplier);
    this.performanceMetrics.currentValue = Math.max(0, this.amount); // Ensure currentValue is never negative
    await this.save();
};

// ...existing code...

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

// ...existing code...
