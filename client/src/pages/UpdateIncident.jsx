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

    // ✅ US11 fields
    status: "Open",
    notes: "",
    assignedTo: "",
  });

  const [reporterId, setReporterId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load incident
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
          dateOccured: data.dateOccured ? data.dateOccured.slice(0, 10) : "",
          dateReported: data.dateReported ? data.dateReported.slice(0, 10) : "",
          place: data.place || "",
          severity: data.severity || "Medium",

          // US11
          status: data.status || "Open",
          notes: data.notes || "",
          assignedTo: data.assignedTo || "",
        });

        setReporterId(data.reporterId || null);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchIncident();
  }, [id, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      reporterId: reporterId || user?.id,
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

      setSuccess("Incident updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-incident-page">
      <h3>Update Incident</h3>

      <form onSubmit={handleSubmit} className="form">

        {/* Description */}
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />

        {/* Date Occurred */}
        <input
          type="date"
          name="dateOccured"
          value={formData.dateOccured}
          onChange={handleChange}
        />

        {/* Place */}
        <input
          name="place"
          value={formData.place}
          onChange={handleChange}
          placeholder="Place"
        />

        {/* Severity */}
        <select name="severity" value={formData.severity} onChange={handleChange}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* STATUS (US11) */}
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        {/* NOTES (US11) */}
        <input
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
        />

        {/* ASSIGNED TO (US11) */}
        <input
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          placeholder="Assign To"
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Update Incident</button>

        <button type="button" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </form>
    </div>
  );
}

export default UpdateIncident;