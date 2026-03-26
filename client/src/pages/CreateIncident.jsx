import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./CreateIncident.css";
import API_BASE from "../apiBase";

export function CreateIncident({ user }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [incidents, setIncidents] = useState([]);
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    description: '',
    dateOccured: '',
    dateReported: '',
    place: '',
    severity: 'Medium',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.description ||
      !formData.dateOccured ||
      !formData.place ||
      !formData.severity
    ) {
      setError("All fields are required.");
      return;
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedReportedDate = `${yyyy}-${mm}-${dd}`;

    const payload = {
      ...formData,
      dateReported: formattedReportedDate,
      reporterId: user.id,
    };

    try {
      const res = await fetch(`${API_BASE}/api/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error creating incident');
      }

      setIncidents([...incidents, data]);
      setSuccess('Congratulations! Incident Creation Success!');

      setFormData({
        description: '',
        dateOccured: '',
        dateReported: '',
        place: '',
        severity: 'Medium',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-incident-page">
      <h3 className="create-incident-title">
        Welcome, {user?.firstName} {user?.lastName}
      </h3>

      <div className="create-incident-card">
        <form onSubmit={handleSubmit} className="form create-incident-form" noValidate>
          <h3 className="create-incident-form-title">Create Incident</h3>

          <label>Enter Incident Description</label>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label>Enter Incident Date</label>
          <input
            type="date"
            name="dateOccured"
            value={formData.dateOccured}
            onChange={handleChange}
            required
          />

          <label>Enter Incident Place</label>
          <input
            type="text"
            name="place"
            placeholder="Place"
            value={formData.place}
            onChange={handleChange}
            required
          />

          <label>Enter Incident Severity</label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="create-incident-actions">
            <button className="createIncidentBtn" type="submit">
              Create Incident
            </button>
            <button
              className="back-to-dashboardBtn"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Back To Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIncident;
