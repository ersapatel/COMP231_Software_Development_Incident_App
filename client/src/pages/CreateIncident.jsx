import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateIncident.css";
import API_BASE from "../apiBase";

const departmentEmployees = {
  "IT Dept": ["John Davis", "Emma Wilson", "Ryan Clark"],
  "Facility Dept": ["Olivia Brown", "Noah Taylor", "Liam Scott"],
  "Maintenance Dept": ["Ethan Walker", "Mason Hall", "Sophia Green"],
  "Purchase Dept": ["Ava Martin", "James White", "John Davis"],
  "Security Dept": ["Daniel Harris", "Chloe Young", "Lucas King"],
};

export function CreateIncident({ user }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [incidents, setIncidents] = useState([]);
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

  const employeeOptions = formData.assigneeDepartment
    ? departmentEmployees[formData.assigneeDepartment]
    : [];

  const noteWordCount = formData.note.trim().split(/\s+/).filter(Boolean).length;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "assigneeDepartment") {
      setFormData({
        ...formData,
        assigneeDepartment: value,
        assigneeName: "",
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.description ||
      !formData.dateOccured ||
      !formData.place ||
      !formData.severity ||
      !formData.assigneeDepartment ||
      !formData.assigneeName ||
      !formData.note
    ) {
      setError("All fields are required.");
      return;
    }

    if (noteWordCount > 50) {
      setError("Note must be max 50 words.");
      return;
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedReportedDate = `${yyyy}-${mm}-${dd}`;

    const payload = {
      description: formData.description,
      dateOccured: formData.dateOccured,
      dateReported: formattedReportedDate,
      place: formData.place,
      severity: formData.severity,
      reporterId: user.id,
      status: "TODO",
      assignee: `${formData.assigneeName} - ${formData.assigneeDepartment}`,
      note: formData.note.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}/api/incidents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error creating incident");
      }

      setIncidents([...incidents, data]);
      setSuccess("Congratulations! Incident Creation Success!");

      setFormData({
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
        <form
          onSubmit={handleSubmit}
          className="form create-incident-form"
          noValidate
        >
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

          <label>Status</label>
          <input
            type="text"
            name="status"
            value="TODO"
            disabled
            className="readonly-input"
          />

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

          <label>Incident Notes</label>
          <textarea
            name="note"
            placeholder="Enter up to 50 words for this incident note"
            value={formData.note}
            onChange={handleChange}
            rows="5"
            required
          />

          <p className="note-counter">{noteWordCount} / 50 words</p>

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