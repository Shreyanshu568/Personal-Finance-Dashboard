// Import express and Transaction model :- 
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// REOUTE 1 : GET all transactions :- 

router.get('/', async (req,res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1});

        res.json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting transactions',
            error: error.message
        });
    }
});

// ROUTE 2 : POST - Add new transaction :- 

router.post('/', async (req,res)=> {
    try {
      const { type, category, amount,  description, date } = req.body;

      const transaction = await Transaction.create({
        type,
        category,
        amount,
        description,
        date
      });

      res.status(201).json({
        success: true,
        message: 'Transaction added successfully',
        data: transaction
      });
    } catch (error){
        res.status(400).json({
            success: false,
            message: 'Error adding transaction',
            error: error.message
        });
    }
});

// DELETE a transaction :- 

router.delete('/:id', async (req,res)=> {
    try{
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            message: 'Transaction deleted successfully',
            data: transaction
    });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting transaction',
            error: error.message
        });
    }
});

// Export router :- 

module.exports = router; 



