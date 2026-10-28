import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  X 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/transactions';

const COLORS = ['#ff4d00', '#00ff88', '#38bdf8', '#fbbf24', '#a855f7', '#ec4899', '#14b8a6'];

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchTransactions = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount)
        })
      });
      const data = await res.json();
      if (data.success) {
        setTransactions([data.data, ...transactions]);
        setFormData({
          type: 'expense',
          category: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Add error:', err);
      alert('Error connecting to backend!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(transactions.filter((tx) => tx._id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryTotals = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const chartData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat]
  }));

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <header className="top-header">
        <div className="brand-title">
          <h1>
            <Wallet size={24} color="#ff4d00" /> Personal Finance Dashboard
          </h1>
          <p>Real-time income, expense tracking & category analytics</p>
        </div>

        <button className="btn-accent" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Transaction
        </button>
      </header>

      {/* KPI Cards */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-title">
            <span>Total Balance</span>
            <Wallet size={18} color="#ff4d00" />
          </div>
          <div className="metric-amount" style={{ color: '#fff' }}>
            ₹{balance.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>Total Income</span>
            <TrendingUp size={18} color="#00ff88" />
          </div>
          <div className="metric-amount" style={{ color: '#00ff88' }}>
            +₹{totalIncome.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>Total Expense</span>
            <TrendingDown size={18} color="#ff3b30" />
          </div>
          <div className="metric-amount" style={{ color: '#ff3b30' }}>
            -₹{totalExpense.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Chart + Legends, Right Transactions */}
      <div className="dashboard-grid">
        <div className="glass-panel">
          <div className="panel-header">
            <h2>Expense Breakdown</h2>
            <span style={{ fontSize: '0.8rem', color: '#8492a6' }}>By Category</span>
          </div>

          {chartData.length === 0 ? (
            <div className="chart-box chart-empty">
              Add expense transactions to view category distribution
            </div>
          ) : (
            <>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111622', border: '1px solid #1e2638', borderRadius: '8px' }}
                      formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Color Labels */}
              <div className="chart-legends">
                {chartData.map((item, index) => {
                  const percentage = totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(0) : 0;
                  return (
                    <div key={item.name} className="legend-item">
                      <span 
                        className="legend-color-dot" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="legend-info">
                        <span className="legend-name">{item.name}</span>
                        <span className="legend-val">₹{item.value.toLocaleString('en-IN')} ({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Transactions */}
        <div className="glass-panel">
          <div className="panel-header">
            <h2>Recent Transactions</h2>
            <span style={{ fontSize: '0.8rem', color: '#8492a6' }}>
              {transactions.length} items
            </span>
          </div>

          <div className="tx-list">
            {loading ? (
              <p style={{ color: '#8492a6', textAlign: 'center', padding: '2rem' }}>Loading data...</p>
            ) : transactions.length === 0 ? (
              <p style={{ color: '#8492a6', textAlign: 'center', padding: '2rem' }}>No transactions recorded yet.</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx._id} className="tx-row">
                  <div className="tx-left">
                    <div 
                      className="tx-badge"
                      style={{ 
                        backgroundColor: tx.type === 'income' ? 'rgba(0, 255, 136, 0.12)' : 'rgba(255, 59, 48, 0.12)',
                        color: tx.type === 'income' ? '#00ff88' : '#ff3b30'
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                    </div>
                    <div className="tx-meta">
                      <h4>{tx.category}</h4>
                      <span>
                        {tx.description ? `${tx.description} • ` : ''}
                        {new Date(tx.date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="tx-right">
                    <span 
                      className="tx-amount"
                      style={{ color: tx.type === 'income' ? '#00ff88' : '#ff3b30' }}
                    >
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <button 
                      onClick={() => handleDelete(tx._id)} 
                      className="btn-delete"
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-head">
              <h3>Add Transaction</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  name="category" 
                  placeholder="e.g., Food, Salary, Travel"
                  value={formData.category} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Amount (₹)</label>
                <input 
                  type="number" 
                  name="amount" 
                  placeholder="e.g., 2500" 
                  min="1"
                  value={formData.amount} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <input 
                  type="text" 
                  name="description" 
                  placeholder="e.g., Weekend groceries"
                  value={formData.description} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-accent" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Entry
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;