import React, { useState } from 'react';
import { createDelay } from '../services/api';
import './DelayForm.css';

const DelayForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    routeNumber: '',
    neighborhood: '',
    delayMinutes: '',
    reason: '',
    busId: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: '', text: '' }); // Clear message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await createDelay(formData);
      if (response.success) {
        setMessage({ type: 'success', text: 'Delay reported successfully!' });
        // Reset form
        setFormData({
          routeNumber: '',
          neighborhood: '',
          delayMinutes: '',
          reason: '',
          busId: '',
        });
        // Notify parent to refresh data
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error reporting delay. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="delay-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="routeNumber">Route Number *</label>
        <input
          type="text"
          id="routeNumber"
          name="routeNumber"
          value={formData.routeNumber}
          onChange={handleChange}
          required
          placeholder="e.g., Route 42"
        />
      </div>

      <div className="form-group">
        <label htmlFor="neighborhood">Neighborhood *</label>
        <input
          type="text"
          id="neighborhood"
          name="neighborhood"
          value={formData.neighborhood}
          onChange={handleChange}
          required
          placeholder="e.g., Downtown, Midtown, Uptown"
        />
      </div>

      <div className="form-group">
        <label htmlFor="delayMinutes">Delay (Minutes) *</label>
        <input
          type="number"
          id="delayMinutes"
          name="delayMinutes"
          value={formData.delayMinutes}
          onChange={handleChange}
          required
          min="0"
          placeholder="e.g., 15"
        />
      </div>

      <div className="form-group">
        <label htmlFor="reason">Reason *</label>
        <select
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
        >
          <option value="">Select a reason</option>
          <option value="Mechanical Breakdown">Mechanical Breakdown</option>
          <option value="Traffic Congestion">Traffic Congestion</option>
          <option value="Weather Conditions">Weather Conditions</option>
          <option value="Accident">Accident</option>
          <option value="Construction">Construction</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="busId">Bus ID *</label>
        <input
          type="text"
          id="busId"
          name="busId"
          value={formData.busId}
          onChange={handleChange}
          required
          placeholder="e.g., BUS-1234"
        />
      </div>

      {message.text && (
        <div className={`form-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Reporting...' : 'Report Delay'}
      </button>
    </form>
  );
};

export default DelayForm;

