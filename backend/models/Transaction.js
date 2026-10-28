// Import mongoose :- 
const mongoose = require('mongoose');

// Create Transaction Schema :- 
const transactionSchema = new mongoose.Schema({
    // Type : income and expense :- 
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    },

    // Category: Food, Salary, Transport, etc.
    category: {
        type: String,
        required: true
    },

    // Amount :- 
    amount: {
        type: Number,
        required: true,
        min: 0
    },

    // Description :- 
    description: {
        type: String,
        default: '' 
    },

    // Date :- 
    date: {
        type:Date,
        default: Date.now
    }
}, {
    timestamps: true

}); 

// Create and export the model :- 

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
