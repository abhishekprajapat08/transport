import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getDelaysByNeighborhood } from '../services/api';
import './Dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getDelaysByNeighborhood();
      if (response.success) {
        setData(response.data);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError(err.message || 'Error loading dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>⚠️ {error}</p>
        <button onClick={fetchData} className="retry-btn">Retry</button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="dashboard-empty">
        <p>No delay data available. Report a delay to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Bus Delays by Neighborhood</h2>
        <div className="chart-toggle">
          <button
            className={chartType === 'bar' ? 'active' : ''}
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </button>
          <button
            className={chartType === 'pie' ? 'active' : ''}
            onClick={() => setChartType('pie')}
          >
            Pie Chart
          </button>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="neighborhood"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis label={{ value: 'Number of Delays', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                formatter={(value, name) => [value, 'Delay Count']}
              />
              <Legend />
              <Bar dataKey="count" fill="#667eea" name="Number of Delays" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ neighborhood, count, percent }) =>
                  `${neighborhood}: ${count} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
                nameKey="neighborhood"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} delays (${((value / data.reduce((sum, d) => sum + d.count, 0)) * 100).toFixed(1)}%)`,
                  props.payload.neighborhood,
                ]}
              />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Neighborhoods</h3>
          <p className="stat-value">{data.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Active Delays</h3>
          <p className="stat-value">{data.reduce((sum, item) => sum + item.count, 0)}</p>
        </div>
        <div className="stat-card">
          <h3>Most Affected</h3>
          <p className="stat-value">{data[0]?.neighborhood || 'N/A'}</p>
          <p className="stat-sub">{data[0]?.count || 0} delays</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

