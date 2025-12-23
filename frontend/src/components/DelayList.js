import React, { useState, useEffect } from 'react';
import { getAllDelays, deleteDelay, resolveDelay } from '../services/api';
import './DelayList.css';

const DelayList = ({ onDelete }) => {
  const [delays, setDelays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [statusFilter, setStatusFilter] = useState('active');

  useEffect(() => {
    fetchDelays();
  }, [pagination.currentPage, statusFilter]);

  const fetchDelays = async () => {
    try {
      setLoading(true);
      const response = await getAllDelays(pagination.currentPage, pagination.itemsPerPage, statusFilter);
      if (response.success) {
        setDelays(response.data);
        setPagination(response.pagination);
      } else {
        setError('Failed to fetch delays');
      }
    } catch (err) {
      setError(err.message || 'Error loading delays');
      console.error('DelayList error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resolved issue?')) {
      return;
    }

    try {
      const response = await deleteDelay(id);
      if (response.success) {
        if (onDelete) onDelete();
        fetchDelays(); // Refresh the list
      }
    } catch (err) {
      alert('Error deleting delay: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleResolve = async (id) => {
    try {
      const response = await resolveDelay(id);
      if (response.success) {
        fetchDelays(); // Refresh the list
        if (onDelete) onDelete(); // Refresh dashboard
      }
    } catch (err) {
      alert('Error resolving delay: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading && delays.length === 0) {
    return (
      <div className="delay-list-loading">
        <p>Loading delays...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="delay-list-error">
        <p>⚠️ {error}</p>
        <button onClick={fetchDelays} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="delay-list">
      <div className="list-controls">
        <div className="status-filter">
          <label>Filter: </label>
          <select value={statusFilter} onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination(prev => ({ ...prev, currentPage: 1 }));
          }}>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="list-count">
          Total: {pagination.totalItems} delays
        </div>
      </div>

      {delays.length === 0 ? (
        <div className="delay-list-empty">
          <p>No delays found.</p>
        </div>
      ) : (
        <>
          <div className="delays-table">
            <table>
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Neighborhood</th>
                  <th>Delay (min)</th>
                  <th>Reason</th>
                  <th>Bus ID</th>
                  <th>Reported</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {delays.map((delay) => (
                  <tr key={delay._id} className={delay.status === 'resolved' ? 'resolved' : ''}>
                    <td>{delay.routeNumber}</td>
                    <td>{delay.neighborhood}</td>
                    <td>{delay.delayMinutes}</td>
                    <td>{delay.reason}</td>
                    <td>{delay.busId}</td>
                    <td>{new Date(delay.reportedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${delay.status}`}>
                        {delay.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {delay.status === 'active' && (
                          <button
                            className="btn-resolve"
                            onClick={() => handleResolve(delay._id)}
                            title="Mark as Resolved"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(delay._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={!pagination.hasPrevPage}
                className="page-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={!pagination.hasNextPage}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DelayList;

