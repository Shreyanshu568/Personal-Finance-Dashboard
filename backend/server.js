// Import packages :- 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Create our app :- 
const app = express();

// Add middleware :- 
app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static('public'));

// Import and Use Routes :- 
const transactionRoutes = require('./routes/transaction');
app.use('/api/transactions', transactionRoutes);

// Create first route :- 
app.get('/', (req,res) =>{
    res.json({
        message: 'Finance Dashboard API is working',
        status: 'Server is running',
        project: 'Finance Dashboard',
        developer: 'Shreyanshu Mishra'
    });
});

// Connect to database :- 

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log('Connected to MongoDB Atlas');
    console.log('Database : financeDashboard');

})

.catch((error)=>{
    console.log('MongoDB Error:' , error.message);
});

// Start the server :- 

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server started successfully');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Server running on port ${PORT}`);
});  

