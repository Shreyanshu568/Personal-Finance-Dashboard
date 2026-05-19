# Personal Finance Dashboard

A full-stack web app to track income and expenses, calculate remaining balance, and visualize spending with an interactive pie chart.

**Live Demo:** https://personal-finance-dashboard-sbzw.onrender.com


## Screenshot
<img width="1898" height="905" alt="Screenshot 2026-05-20 021844" src="https://github.com/user-attachments/assets/fe1c496d-fe47-47c1-b664-90b11e7a0e88" />
<img width="1896" height="901" alt="Screenshot 2026-05-20 021956" src="https://github.com/user-attachments/assets/aa810dca-4dce-48e1-92d2-bf5bb0456eae" />
<img width="1893" height="840" alt="Screenshot 2026-05-20 022403" src="https://github.com/user-attachments/assets/9f149d44-07b9-4dee-a1b4-28d284ea173f" />
<img width="1890" height="761" alt="Screenshot 2026-05-20 022447" src="https://github.com/user-attachments/assets/fea5c138-0044-499f-91b9-2f48f2247118" />
<img width="1893" height="368" alt="Screenshot 2026-05-20 022517" src="https://github.com/user-attachments/assets/06ff3ae6-7f5e-4ada-9e68-8ba2531c14a2" />


## Overview

This dashboard helps users manage their personal finances by tracking income and expenses in real-time. All data is stored in MongoDB Atlas, so transactions persist even after closing the browser.


## Features

- Add Income & Expenses
- Real-time Balance Calculation
- Expense Pie Chart (Category-wise)
- Delete Transactions
- Data Persistence (MongoDB)
- Responsive Dark Theme


## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Frontend:** HTML, CSS, JavaScript
- **Charts:** Chart.js
- **Deployment:** Render


## How It Works

1. User adds a transaction (Income/Expense, Category, Amount)
2. Data is sent to backend API and saved in MongoDB
3. Dashboard fetches updated data and recalculates balance
4. Expenses are grouped by category and shown in pie chart


## Author
Shreyanshu Mishra  
