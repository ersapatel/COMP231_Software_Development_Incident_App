import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateIncident.css";
import API_BASE from "../apiBase";

const departmentEmployees = {
  "IT Dept": ["John Davis", "Emma Wilson", "Ryan Clark"],
  "Facility Dept": ["Olivia Brown", "Noah Taylor", "Liam Scott"],
  "Maintenance Dept": ["Ethan Walker", "Mason Hall", "Sophia Green"],
  "Purchase Dept": ["Ava Martin", "James White", "John Davis"],
  "Security Dept": ["Daniel Harris", "Chloe Young", "Lucas King"],
};

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
    status: "TODO",
    assigneeDepartment: "",
    assigneeName: "",
    note: "",
  });

  const [reporterId, setReporterId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const employeeOptions = formData.assigneeDepartment
    ? departmentEmployees[formData.assigneeDepartment]
    : [];

  const noteWordCount = formData.note.trim().split(/\s+/).filter(Boolean).length;

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

        const assigneeParts = data.assignee ? data.assignee.split(" - ") : ["", ""];
        const assigneeName = assigneeParts[0] || "";
        const assigneeDepartment = assigneeParts[1] || "";

        setFormData({
          description: data.description || "",
          dateOccured: data.dateOccured ? data.dateOccured.slice(0, 10) : "",
          dateReported: data.dateReported ? data.dateReported.slice(0, 10) : "",
          place: data.place || "",
          severity: data.severity || "Medium",
          status: data.status || "TODO",
          assigneeDepartment,
          assigneeName,
          note: data.note || "",
        });

        setReporterId(data.reporterId || null);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id && token) {
      fetchIncident();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "assigneeDepartment") {
      setFormData((prev) => ({
        ...prev,
        assigneeDepartment: value,
        assigneeName: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.description.trim() ||
      !formData.dateOccured ||
      !formData.place.trim() ||
      !formData.severity ||
      !formData.status ||
      !formData.assigneeDepartment ||
      !formData.assigneeName ||
      !formData.note.trim()
    ) {
      setError("Please fill in all required fields before updating.");
      return;
    }

    if (noteWordCount > 50) {
      setError("Note must be max 50 words.");
      return;
    }

    const payload = {
      description: formData.description.trim(),
      dateOccured: formData.dateOccured,
      dateReported: formData.dateReported,
      place: formData.place.trim(),
      severity: formData.severity,
      status: formData.status,
      assignee: `${formData.assigneeName} - ${formData.assigneeDepartment}`,
      note: formData.note.trim(),
      reporterId: reporterId || user?._id || user?.id,
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
      <h3 className="create-incident-title">Update Incident</h3>

      <div className="create-incident-card">
        <form onSubmit={handleSubmit} className="form create-incident-form" noValidate>
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

          <label>Update Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="TODO">TODO</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <label>Select Department</label>
          <select
            name="assigneeDepartment"
            value={formData.assigneeDepartment}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {Object.keys(departmentEmployees).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <label>Select Employee</label>
          <select
            name="assigneeName"
            value={formData.assigneeName}
            onChange={handleChange}
            required
            disabled={!formData.assigneeDepartment}
          >
            <option value="">Select Employee</option>
            {employeeOptions.map((employee) => (
              <option key={employee} value={employee}>
                {employee}
              </option>
            ))}
          </select>

          <label>Update Incident Notes</label>
          <textarea
            name="note"
            placeholder="Enter up to 50 words for this incident note"
            value={formData.note}
            onChange={handleChange}
            rows="5"
            required
          />

          <p
            className={`note-counter ${
              noteWordCount > 45 ? "danger" : noteWordCount > 30 ? "warning" : ""
            }`}
          >
            {noteWordCount} / 50 words
          </p>

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