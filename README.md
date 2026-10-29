# Personal Finance Dashboard

A modern, responsive full-stack personal finance application built to monitor daily cash flow, analyze expense distributions, and log monetary records in real-time. Migrated from a monolithic Vanilla JS setup into an enterprise-ready, decoupled MERN architecture with a responsive dark fintech theme.

**Live Demo:** [Live App Link](https://personalfinancedashboardapp.netlify.app/)


## Screenshot

<img width="1897" height="892" alt="Image" src="https://github.com/user-attachments/assets/c5a74d00-61f3-457c-9acf-92f7caf581e4" />
<img width="1896" height="897" alt="Image" src="https://github.com/user-attachments/assets/cd657f6e-8171-4c41-8c10-4619aed1692d" />
<img width="1398" height="595" alt="Image" src="https://github.com/user-attachments/assets/0f7f730f-6667-49fb-b3f1-b8b40dea97da" />
<img width="1412" height="742" alt="Image" src="https://github.com/user-attachments/assets/7f9229ec-16df-47a9-922b-9da993ff59ef" />


## Overview

This dashboard helps users manage their personal finances by tracking daily income, expenses, and cash flow in real-time. The application was re-architected from a traditional monolithic HTML/CSS/JavaScript setup into an enterprise-grade, decoupled client-server model. 

The client interface is built as a single-page application using React 18 and Vite, deployed on a global Edge CDN for near-instant load times. The backend is powered by Node.js and Express, exposing RESTful endpoints to process incoming transactions with input validation. All financial logs are stored securely in a multi-cloud MongoDB Atlas cluster via Mongoose ODM, ensuring strict data persistence and schema consistency across sessions without requiring full-page browser refreshes.


## Features

- **Real-Time Financial Metrics:** Dynamic aggregation engine calculating Total Balance, Net Inflow, and Total Expenses instantaneously.
- **Visual Expense Analytics:** Interactive category breakdown powered by Recharts (SVG Pie Chart) with localized expense categorization and customized tooltip telemetry.
- **Transactional CRUD Engine:** Frictionless modal-based state injection to record credits/debits, paired with optimistic UI updates and instant asynchronous deletion.
- **Decoupled Architecture:** Clean boundary separation between presentation state (Vite/React client) and persistence services (Express REST API).
- **Fintech Dark Mode UI:** High-contrast, minimalist matte dark palette built using vanilla CSS layout variables and Lucide-react iconography.


## Tech Stack

- **Frontend:** React 18, Vite, Recharts, Lucide React, Modern CSS3
- **Backend:** Node.js, Express.js, CORS, Dotenv
- **Database:** MongoDB Atlas, Mongoose ODM
- **Deployment:** Netlify (Frontend CDN), Render (Backend Web Service)


## How It Works

1. **Transaction Entry:** User inputs the transaction details (Title, Amount, Type: Income/Expense, Category) through a controlled modal interface.
2. **REST API Dispatch:** React issues an asynchronous HTTP request (`POST /api/transactions`) to the Express backend carrying the sanitized payload.
3. **Database Mutation:** The Express API validates incoming records against the Mongoose schema and persists the document into MongoDB Atlas.
4. **Reactive State Reconciliation:** The frontend updates state dynamically, instantly adjusting balance cards and re-rendering category distributions on the Recharts canvas without a page refresh.


## Author

Shreyanshu Mishra