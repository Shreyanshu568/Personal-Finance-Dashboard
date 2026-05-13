// Initial Setup
document.getElementById("year").textContent = new Date().getFullYear();

// API URL (your backend server)
const API_URL = '/api/transactions';

// Get references to HTML elements
const form = document.getElementById('transaction-form');
const transactionsList = document.getElementById('transactions-list');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const balanceEl = document.getElementById('balance');

// Chart variable
let expenseChart = null;

// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// When page loads, fetch all transactions
window.addEventListener('load', () => {
  console.log('Finance Dashboard loaded!');
  fetchTransactions();
});

// When form is submitted, add new transaction
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  console.log('Adding new transaction...');
  
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;
  const amount = document.getElementById('amount').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;
  
  const transaction = {
    type,
    category,
    amount: Number(amount),
    description,
    date
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Transaction added!');
      form.reset();
      document.getElementById('date').valueAsDate = new Date();
      fetchTransactions();
    } else {
      console.error('Error:', data.message);
      alert('Error adding transaction: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error connecting to server. Make sure your backend is running!');
  }
});

// Fetch all transactions from backend
async function fetchTransactions() {
  console.log('Fetching transactions...');
  
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (data.success) {
      console.log(`Got ${data.count} transactions!`);
      displayTransactions(data.data);
      updateSummary(data.data);
      updateExpenseChart(data.data); // NEW: Update pie chart
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    transactionsList.innerHTML = '<p class="no-transactions"> Error loading transactions. Make sure your backend is running!</p>';
  }
}

// Display transactions in the list
function displayTransactions(transactions) {
  if (transactions.length === 0) {
    transactionsList.innerHTML = '<p class="no-transactions"> No transactions yet. Add your first transaction above!</p>';
    return;
  }
  
  let html = '';
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date).toLocaleDateString('en-IN');
    const typeClass = transaction.type;
    const sign = transaction.type === 'income' ? '+' : '-';
    
    html += `
      <div class="transaction-item ${typeClass}">
        <div class="transaction-info">
          <h4>${transaction.category}</h4>
          <p>${transaction.description || 'No description'} • ${date}</p>
        </div>
        <div style="display: flex; align-items: center;">
          <span class="transaction-amount ${typeClass}">
            ${sign} Rs ${transaction.amount.toLocaleString('en-IN')}
          </span>
          <button class="btn-delete" onclick="deleteTransaction('${transaction._id}')">
            Delete
          </button>
        </div>
      </div>
    `;
  });
  
  transactionsList.innerHTML = html;
}

// Update summary cards (totals)
function updateSummary(transactions) {
  let totalIncome = 0;
  let totalExpenses = 0;
  
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });
  
  const balance = totalIncome - totalExpenses;
  
  totalIncomeEl.textContent = 'Rs ' + totalIncome.toLocaleString('en-IN');
  totalExpensesEl.textContent = 'Rs ' + totalExpenses.toLocaleString('en-IN');
  balanceEl.textContent = 'Rs ' + balance.toLocaleString('en-IN');
  
  console.log(`Income: Rs${totalIncome}, Expenses: Rs${totalExpenses}, Balance: Rs${balance}`);
}

// NEW: Update expense pie chart
function updateExpenseChart(transactions) {
  // Filter only expenses
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const chartHint = document.getElementById('chart-hint');
  const chartContainer = document.querySelector('.chart-container');
  
  if (expenses.length === 0) {
    // No expenses to show
    if (expenseChart) {
      expenseChart.destroy();
      expenseChart = null;
    }
    if (chartHint) {
      chartHint.style.display = 'block';
      chartHint.textContent = 'Add expenses to see category breakdown';
      chartHint.style.color = '#2a4a2a';
      chartHint.style.textAlign = 'center';
      chartHint.style.padding = '20px';
      chartHint.style.fontFamily = 'monospace';
    }
    return;
  }
  
  // Hide hint when there are expenses
  if (chartHint) {
    chartHint.style.display = 'none';
  }
  
  // Group expenses by category
  const categoryTotals = {};
  expenses.forEach(exp => {
    const category = exp.category;
    categoryTotals[category] = (categoryTotals[category] || 0) + exp.amount;
  });
  
  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);
  
  // Cyberpunk neon colors
  const colors = [
    '#00ff88', '#ff4444', '#ffaa00', '#ff66cc', '#44aaff', 
    '#aa66ff', '#66ffaa', '#ff8844', '#44ffaa', '#ff44aa'
  ];
  
  const ctx = document.getElementById('expenseChart').getContext('2d');
  
  // Destroy existing chart if exists
  if (expenseChart) {
    expenseChart.destroy();
  }
  
  // Create new pie chart
  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: '#0a0f0a',
        borderWidth: 2,
        hoverOffset: 15
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#00ff88',
            font: {
              family: 'monospace',
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1000
      }
    }
  });
  
  console.log('Chart updated with categories:', categories);
}

// Delete a transaction
async function deleteTransaction(id) {
  if (!confirm('Are you sure you want to delete this transaction?')) {
    return;
  }
  
  console.log('Deleting transaction...');
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Transaction deleted!');
      fetchTransactions();
    } else {
      console.error('Error:', data.message);
      alert('Error deleting transaction: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error connecting to server!');
  }
}