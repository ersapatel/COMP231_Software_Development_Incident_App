import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateIncident.css";
import API_BASE from "../apiBase";

export function UpdateIncident({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    description: "",
    dateOccured: "",
    dateReported: "",
    place: "",
    severity: "Medium",
  });

  const [reporterId, setReporterId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing incident by ID
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/incidents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error fetching incident");
        }

        setFormData({
          description: data.description || "",
          dateOccured: data.dateOccured
            ? data.dateOccured.slice(0, 10)
            : "",
          dateReported: data.dateReported
            ? data.dateReported.slice(0, 10)
            : "",
          place: data.place || "",
          severity: data.severity || "Medium",
        });

        setReporterId(data.reporterId || null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchIncident();
  }, [id, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.description.trim() ||
      !formData.dateOccured ||
      !formData.place.trim() ||
      !formData.severity
    ) {
      setError("Please fill in all required fields before updating.");
      return;
    }

    const payload = {
      ...formData,
      reporterId: reporterId || user.id,
    };

    try {
      const res = await fetch(`${API_BASE}/api/incidents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error updating incident");
      }

      setSuccess("Incident updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-incident-page">
      <h3 className="create-incident-title">
        Update Incident
      </h3>

      <div className="create-incident-card">
        <form onSubmit={handleSubmit} className="form create-incident-form">
          <h3 className="create-incident-form-title">Update Incident</h3>

          <label>Update Incident Description</label>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label>Update Incident Date</label>
          <input
            type="date"
            name="dateOccured"
            value={formData.dateOccured}
            onChange={handleChange}
            required
          />

          <label>Update Incident Place</label>
          <input
            type="text"
            name="place"
            placeholder="Place"
            value={formData.place}
            onChange={handleChange}
            required
          />

          <label>Update Incident Severity</label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <label>Reported Date</label>
          <input
            type="date"
            name="dateReported"
            value={formData.dateReported}
            onChange={handleChange}
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="create-incident-actions">
            <button className="createIncidentBtn" type="submit">
              Update Incident
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

export default UpdateIncident;
