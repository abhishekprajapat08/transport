import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import DelayForm from './components/DelayForm';
import DelayList from './components/DelayList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🚌 Transport Analytics Admin Panel</h1>
        <p>Gold Layer View - Breakdowns & Busiest Routes</p>
      </header>
      
      <main className="app-main">
        <section className="dashboard-section">
          <Dashboard key={refreshKey} />
        </section>

        <section className="crud-section">
          <div className="crud-container">
            <div className="crud-panel">
              <h2>Report New Delay</h2>
              <DelayForm onSuccess={handleRefresh} />
            </div>
            
            <div className="crud-panel">
              <h2>Active Delays & Issues</h2>
              <DelayList onDelete={handleRefresh} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

